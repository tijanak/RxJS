import {
  combineLatest,
  first,
  min,
  Observable,
  of,
  ReplaySubject,
  scan,
  Subject,
  withLatestFrom,
} from "rxjs";
import { ICustomerRequest } from "../models/ICustomerRequest";
import { getDistanceInKm } from "../models/ILocation";
import { ITaxi } from "../models/ITaxi";
import { ITaxiRide } from "../models/ITaxiRide";
import {
  bufferStream,
  createAvailableTaxiObs,
  createTaxiRideObs,
  createUnprocessedRequestsObs,
  makeStreamOfStreams,
} from "./observables";
import { Taxi } from "./Taxi";
export class DispatchService {
  private addTaxiRideStreamSubject: Subject<Observable<ITaxiRide[]>> =
    new Subject<Observable<ITaxiRide[]>>();

  private taxiStreams: Observable<ITaxi>[];

  public ride$: Observable<ITaxiRide[]>;
  public taxi$: Observable<ITaxi[]>;
  public unprocessedRequest$: Observable<ICustomerRequest[]>;

  constructor(
    private request$: Observable<ICustomerRequest>,
    initialTaxis: ITaxi[]
  ) {
    this.taxiStreams = [];

    initialTaxis.forEach((taxiInfo: ITaxi) => {
      this.addTaxi(taxiInfo);
    });

    this.taxi$ = combineLatest(this.taxiStreams);

    let availableTaxi$: Observable<ITaxi[]> = createAvailableTaxiObs(
      this.taxi$
    );

    let allTaxiRideStream$: Observable<ITaxiRide[][]> = makeStreamOfStreams(
      this.addTaxiRideStreamSubject
    );

    this.ride$ = createTaxiRideObs(allTaxiRideStream$);

    let allRequest$: Observable<ICustomerRequest[]> = this.request$.pipe(
      scan((acc: ICustomerRequest[], request: ICustomerRequest) => {
        return [...acc, request];
      }, [])
    );
    this.unprocessedRequest$ = createUnprocessedRequestsObs(
      allRequest$,
      this.ride$
    );

    let requestProces$: Observable<[ICustomerRequest[], ITaxi[]]> =
      this.unprocessedRequest$.pipe(withLatestFrom(availableTaxi$));
    requestProces$.subscribe(
      (requestsAndTaxis: [ICustomerRequest[], ITaxi[]]) => {
        let taxis: ITaxi[] = requestsAndTaxis[1];
        let requests: ICustomerRequest[] = requestsAndTaxis[0];
        if (taxis.length == 0 || requests.length == 0) return;
        let request: ICustomerRequest = requests[0];
        this.processRequest(taxis, request);
      }
    );
    this.startService();
  }
  private addTaxi(taxiInfo: ITaxi): void {
    let newTaxi = new Taxi(taxiInfo.plate, true, taxiInfo.location);

    this.taxiStreams.push(newTaxi.taxiUpdate$);
    this.addTaxiRideStream(newTaxi.ride$);
  }
  private addTaxiRideStream(stream: Observable<ITaxiRide[]>): void {
    const buffered = bufferStream(stream);
    buffered.pipe(first()).subscribe((t) => {
      this.addTaxiRideStreamSubject.next(stream);
    });
  }
  private addTaxiRide(taxi: ITaxi, request: ICustomerRequest): void {
    taxi.takeRequest(request);
  }
  private processRequest(taxis: ITaxi[], request: ICustomerRequest) {
    of(...taxis)
      .pipe(
        min((taxi1, taxi2) => {
          return (
            getDistanceInKm(taxi1.location, request.origin) -
            getDistanceInKm(taxi2.location, request.origin)
          );
        })
      )
      .subscribe((taxi) => {
        this.addTaxiRide(taxi, request);
      });
  }
  private startService(): void {
    let startRequests: Subject<ITaxiRide[]> = new ReplaySubject();
    this.addTaxiRideStream(startRequests.asObservable());
    startRequests.next(new Array<ITaxiRide>());
  }
}
