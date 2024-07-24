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
  scan,
  skip,
  skipUntil,
  Subject,
  switchMap,
  take,
  takeLast,
  takeUntil,
  tap,
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
export class DispatchService {
  private taxiRidesSubject: Subject<Observable<ITaxiRide[]>>;
  public ride$: Observable<ITaxiRide[]>;
  private availableTaxi$: Observable<Taxi[]>;
  public unprocessedRequest$: Observable<ICustomerRequest[]>;
  private taxiStreams: Observable<Taxi>[] = [];
  public taxi$: Observable<Taxi[]>;
  private startRequests: Subject<ITaxiRide[]> = new ReplaySubject();
  constructor(
    private request$: Observable<ICustomerRequest>,
    initialTaxis: ITaxi[]
  ) {
    this.taxiRidesSubject = new Subject<Observable<ITaxiRide[]>>();
    this.ride$ = makeStreamOfStreams(this.taxiRidesSubject).pipe(
      map((rides: ITaxiRide[][]) => {
        return rides.reduce((acc, rides) => {
          acc.push(...rides);
          acc.sort((a, b) => b.request.id - a.request.id);
          return acc;
        }, []);
      })
    );
    initialTaxis.forEach((taxiInfo: ITaxi) => {
      let newTaxi = new Taxi(
        taxiInfo.plate,
        taxiInfo.available,
        taxiInfo.location
      );

      this.taxiStreams.push(newTaxi.taxiUpdate$);
      this.addTaxiRideStream(newTaxi.ride$);
    });

    this.taxi$ = combineLatest(this.taxiStreams);
    this.availableTaxi$ = createAvailableTaxiObs(this.taxi$);
    let allRequest$ = this.request$.pipe(
      scan((acc: ICustomerRequest[], v: ICustomerRequest) => {
        return [...acc, v];
      }, [])
    );
    allRequest$.subscribe(() => {
      console.log("all req");
    });
    this.unprocessedRequest$ = combineLatest([allRequest$, this.ride$]).pipe(
      tap((r) => console.log(r)),
      map((v) => {
        let unprocessed: ICustomerRequest[] = [];
        v[0].forEach((req) => {
          if (v[1].find((ride) => ride.request.id == req.id) == undefined) {
            unprocessed.push(req);
          }
        });
        return unprocessed;
      }),

      tap((r) => console.log(r))
    );
    this.unprocessedRequest$.subscribe((r) => {
      console.log(r);
    });
    let taxisAndRequest$ = this.unprocessedRequest$.pipe(
      withLatestFrom(this.availableTaxi$)
    );
    taxisAndRequest$.subscribe((taxisAndRequest) => {
      // console.log("taxi ride combo in dispatch service");
      console.log(taxisAndRequest[0], taxisAndRequest[1]);
      let taxis = taxisAndRequest[1];
      let requests = taxisAndRequest[0];
      if (taxis.length == 0 || requests.length == 0) return;
      let request = requests[0];
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
    this.ride$.subscribe((r) => {
      //console.log("dispatch service got ride update");
      console.log(r);
    });
    this.request$.subscribe((r) => {
      //console.log("dispatch service got request " + r.customerName);
      console.log("request " + r.id);
    });
    this.taxi$.subscribe((t) => {
      //  console.log("dispatch service got taxi update");
    });

    this.availableTaxi$.subscribe((t) => {
      // console.log("available");
      // console.log(t);
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
    this.addTaxiRideStream(this.startRequests.asObservable());
    this.startRequests.next(new Array<ITaxiRide>());
  }
  private addTaxiRideStream(stream: Observable<ITaxiRide[]>) {
    const buffered = bufferStream(stream);
    buffered.pipe(first()).subscribe((t) => {
      this.taxiRidesSubject.next(stream);
    });
  }
  private addTaxiRide(taxi: Taxi, request: ICustomerRequest): void {
    taxi.takeRequest(request);
  }
}
