import { ITaxi, Taxi } from "../models/ITaxi";
import { ITaxiRide, RideStatus, TaxiRide } from "../models/ITaxiRide";
import { ICustomerRequest } from "../models/ICustomerRequest";
import {
  buffer,
  bufferToggle,
  combineLatest,
  defaultIfEmpty,
  filter,
  first,
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
  private taxiRidesSubject: Subject<Observable<ITaxiRide[]>>;
  public ride$: Observable<ITaxiRide[]>;
  private availableTaxi$: Observable<Taxi[]>;
  private unprocessedRequestsSubject: Subject<ICustomerRequest[]> =
    new Subject();
  public unprocessedRequest$: Observable<ICustomerRequest[]> =
    this.unprocessedRequestsSubject.asObservable();
  private taxiStreams: Subject<Observable<Taxi>>;
  public taxi$: Observable<Taxi[]>;
  constructor(private request$: Observable<ICustomerRequest>) {
    this.taxiStreams = new Subject<Observable<Taxi>>();
    this.taxi$ = makeStreamOfStreams(this.taxiStreams);
    this.taxiRidesSubject = new Subject<Observable<ITaxiRide[]>>();
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

        let buffered = bufferStream(newTaxi.taxiUpdate$);
        buffered.pipe(first()).subscribe(() => {
          this.taxiStreams.next(newTaxi.taxiUpdate$);
        });
        this.addTaxiRideStream(newTaxi.ride$);
      });
    });
    this.availableTaxi$ = createAvailableTaxiObs(this.taxi$);
    let taxisAndRequest$ = zip(this.availableTaxi$, request$);
    taxisAndRequest$.subscribe((taxisAndRequest) => {
      console.log("taxi ride combo in dispatch service");
      console.log(taxisAndRequest);
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
    /*combineLatest([request$, this.taxi$, this.ride$]).subscribe((v) => {
      console.log("dispatch service got combo of req, taxis, rides");
      console.log(v);
      let end = new Subject();
      request$
        .pipe(skip(this.taxiRides.length), takeUntil(end), toArray())
        .subscribe((unprocessed) => {
          this.unprocessedRequestsSubject.next(unprocessed);
        });
      end.next(1);
      end.complete();
    });*/
    this.ride$.subscribe((r) => {
      console.log("dispatch service got ride update");
      console.log(r);
    });
    this.request$.subscribe((r) => {
      console.log("dispatch service got request " + r.customerName);
    });
    this.taxi$.subscribe((t) => {
      // console.log("dispatch service got taxi update");
    });

    this.availableTaxi$.subscribe((t) => {
      console.log("available");
      console.log(t);
    });
  }
  private addTaxiRideStream(stream: Observable<ITaxiRide[]>) {
    const buffered = bufferStream(stream);
    buffered.pipe(first()).subscribe(() => {
      this.taxiRidesSubject.next(stream);
    });
  }
  private addTaxiRide(taxi: Taxi, request: ICustomerRequest): void {
    taxi.takeRequest(request);
  }
}
