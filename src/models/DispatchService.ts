import { ITaxi, Taxi } from "../models/ITaxi";
import { ITaxiRide, RideStatus, TaxiRide } from "../models/ITaxiRide";
import { ICustomerRequest } from "../models/ICustomerRequest";
import {
  buffer,
  bufferToggle,
  combineLatest,
  defaultIfEmpty,
  filter,
  from,
  iif,
  interval,
  lastValueFrom,
  map,
  mergeAll,
  min,
  Observable,
  of,
  repeat,
  ReplaySubject,
  skip,
  skipUntil,
  Subject,
  switchMap,
  take,
  takeLast,
  takeUntil,
  toArray,
  windowToggle,
  withLatestFrom,
  zip,
} from "rxjs";
import { getDistanceInKm, ILocation } from "./ILocation";
import {
  bufferStream,
  createAvailableTaxiObs,
  makeStreamOfStreams,
} from "../controllers/observables";
import { ResponseRoute, RoutesResponse } from "traveltime-api";
import { getRouteInformation, getTaxis } from "../api/apiCalls";
import { differenceInMinutes } from "date-fns";
import { IRideUpdate } from "./IRideUpdate";
export class DispatchService {
  private taxiRidesSubject: ReplaySubject<Observable<ITaxiRide[]>>;
  public ride$: Observable<ITaxiRide[]>;
  private taxiRides: ITaxiRide[] = [];
  private availableTaxi$: Observable<Taxi[]>;
  private unprocessedRequestsSubject: Subject<ICustomerRequest[]> =
    new Subject();
  public unprocessedRequest$: Observable<ICustomerRequest[]> =
    this.unprocessedRequestsSubject.asObservable();
  private taxisSubject: ReplaySubject<Observable<Taxi>>;
  public taxi$: Observable<Taxi[]>;
  constructor(private request$: Observable<ICustomerRequest>) {
    this.taxisSubject = new ReplaySubject<Observable<Taxi>>();
    this.taxi$ = makeStreamOfStreams(this.taxisSubject);
    this.taxiRidesSubject = new ReplaySubject<Observable<ITaxiRide[]>>();
    this.ride$ = makeStreamOfStreams(this.taxiRidesSubject).pipe(
      map((rides: ITaxiRide[][]) => {
        return rides.reduce((acc, rides) => {
          acc.push(...rides);
          return acc;
        }, []);
      })
    );
    getTaxis().then((d) => {
      d.forEach((taxiInfo: ITaxi) => {
        let newTaxi = new Taxi(
          taxiInfo.plate,
          taxiInfo.available,
          taxiInfo.location
        );
        this.taxisSubject.next(newTaxi.taxiUpdate$);
        this.addTaxiRideStream(newTaxi.ride$);
      });
      this.availableTaxi$ = createAvailableTaxiObs(this.taxi$);
      let taxisAndRequest$ = zip(this.availableTaxi$, request$);
      taxisAndRequest$.subscribe((taxisAndRequest) => {
        console.log("taxi ride combo");
        let taxis = taxisAndRequest[0];
        let request = taxisAndRequest[1];
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
            //console.log(getDistanceInKm(taxi.location, request.origin));
          });
      });
      this.ride$.subscribe(() => {
        console.log("jel radi ovo");
      });
      this.request$.subscribe((r) => {
        console.log("new req " + r.customerName);
      });
      this.taxi$.subscribe((t) => {
        console.log("taxis");
        console.log(t);
      });
      combineLatest([request$, this.taxi$, this.ride$]).subscribe(() => {
        console.log("combo");
        let end = new Subject();
        request$
          .pipe(skip(this.taxiRides.length), takeUntil(end), toArray())
          .subscribe((unprocessed) => {
            this.unprocessedRequestsSubject.next(unprocessed);
          });
        end.next(1);
        end.complete();
      });
    });
  }
  private addTaxiRideStream(stream: Observable<ITaxiRide[]>) {
    const buffered = bufferStream(stream);
    buffered.pipe(take(1)).subscribe(() => {
      this.taxiRidesSubject.next(stream);
    });
  }
  private addTaxiRide(taxi: Taxi, request: ICustomerRequest): void {
    console.log("new");
    taxi.takeRequest(request);
  }
}
