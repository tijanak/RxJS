import { ITaxi } from "../models/ITaxi";
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
import { getDistanceInKm } from "./ILocation";
import {
  createAvailableTaxiObs,
  createEmptyGarageObs,
} from "../controllers/observables";
import { Garage } from "./Garage";
import { ResponseRoute, RoutesResponse } from "traveltime-api";
import { getRouteInformation } from "../api/apiCalls";
import { differenceInMinutes } from "date-fns";
export class DispatchService {
  private taxiRidesSubject: Subject<ITaxiRide[]> = new Subject();
  public ride$: Observable<ITaxiRide[]> = this.taxiRidesSubject.asObservable();
  private taxiRides: ITaxiRide[] = [];
  private availableTaxi$: Observable<ITaxi[]>;
  private unprocessedRequestsSubject: Subject<ICustomerRequest[]> =
    new Subject();
  public unprocessedRequest$: Observable<ICustomerRequest[]> =
    this.unprocessedRequestsSubject.asObservable();

  constructor(
    private garage: Garage,
    private request$: Observable<ICustomerRequest>
  ) {
    this.availableTaxi$ = createAvailableTaxiObs(garage.taxi$);
    let taxisAndRequest$ = zip(this.availableTaxi$, request$);
    taxisAndRequest$.subscribe((taxisAndRequest) => {
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

    combineLatest([request$, garage.taxi$, this.ride$]).subscribe(() => {
      let end = new Subject();
      request$
        .pipe(skip(this.taxiRides.length), takeUntil(end), toArray())
        .subscribe((unprocessed) => {
          this.unprocessedRequestsSubject.next(unprocessed);
        });
      end.next(1);
      end.complete();
    });
  }
  private notify(): void {
    this.taxiRidesSubject.next(this.taxiRides);
  }
  private addTaxiRide(taxi: ITaxi, request: ICustomerRequest): void {
    let rideId = this.taxiRides.length;
    getRouteInformation(request.origin, request.destination)
      .then((data: RoutesResponse) => {
        let route: ResponseRoute =
          data.results[0].locations[0].properties[0].route;
        let duration: number = this.getRideDurationInMin(
          new Date(route.arrival_time),
          new Date(route.departure_time)
        );

        let newTaxiRide: TaxiRide = new TaxiRide(
          duration,
          rideId,
          taxi,
          request
        );
        this.garage.changeAvailability(taxi.plate, false);
        this.taxiRides.push(newTaxiRide);
        this.notify();
      })
      .catch((err) => console.error(err));
  }

  private getRideDurationInMin(arrival_time: Date, departure_time: Date) {
    return Math.abs(differenceInMinutes(arrival_time, departure_time));
  }
}
