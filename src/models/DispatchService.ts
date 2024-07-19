import { ITaxi } from "../models/ITaxi";
import { ITaxiRide, RideStatus, TaxiRide } from "../models/ITaxiRide";
import { ICustomerRequest } from "../models/ICustomerRequest";
import {
  buffer,
  combineLatest,
  defaultIfEmpty,
  filter,
  from,
  iif,
  map,
  min,
  Observable,
  of,
  Subject,
  takeLast,
  toArray,
  withLatestFrom,
  zip,
} from "rxjs";
import { getDistanceInKm } from "./ILocation";
import { createAvailableTaxiObs } from "../controllers/observables";
import { Garage } from "./Garage";
export class DispatchService {
  private subject: Subject<ITaxiRide[]> = new Subject();
  public ride$: Observable<ITaxiRide[]> = this.subject.asObservable();
  private taxiRides: ITaxiRide[] = [];
  private availableTaxi$: Observable<ITaxi[]>;
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
  }
  private notify(): void {
    this.subject.next(this.taxiRides);
  }
  private addTaxiRide(taxi: ITaxi, request: ICustomerRequest): void {
    let taxiId = this.taxiRides.length;
    let newTaxiRide: TaxiRide = new TaxiRide(taxiId, taxi, request);
    this.garage.changeAvailability(taxi.plate, false);
    this.taxiRides.push(newTaxiRide);
    this.notify();
  }
}
