import { BehaviorSubject, first, Observable, ReplaySubject } from "rxjs";
import { ICustomerRequest } from "../models/ICustomerRequest";
import { ILocation } from "../models/ILocation";
import { ITaxi } from "../models/ITaxi";
import { ITaxiRide, RideStatus } from "../models/ITaxiRide";
import { bufferStream, makeStreamOfStreams } from "./observables";
import { TaxiRide } from "./TaxiRide";

export class Taxi implements ITaxi {
  private taxiRidesStreams: ReplaySubject<Observable<ITaxiRide>>;
  public ride$: Observable<ITaxiRide[]>;
  private taxiUpdateSubject: BehaviorSubject<Taxi>;
  public taxiUpdate$: Observable<Taxi>;
  constructor(
    public plate: string,
    public available: boolean,
    public location: ILocation
  ) {
    this.taxiUpdateSubject = new BehaviorSubject<Taxi>(this);
    this.taxiUpdate$ = this.taxiUpdateSubject.asObservable();
    this.taxiRidesStreams = new ReplaySubject();
    this.ride$ = makeStreamOfStreams(this.taxiRidesStreams);
  }
  private update() {
    this.taxiUpdateSubject.next(this);
  }
  public takeRequest(request: ICustomerRequest) {
    this.available = false;
    this.update();
    let taxiRide: TaxiRide = new TaxiRide(this.location, this.plate, request);
    this.addTaxiRideStream(taxiRide.rideUpdate$);
    this.drive(taxiRide);
  }
  private addTaxiRideStream(stream: Observable<ITaxiRide>) {
    const buffered = bufferStream(stream);
    buffered.pipe(first()).subscribe(() => {
      this.taxiRidesStreams.next(stream);
    });
  }
  private drive(taxiRide: TaxiRide) {
    let sub = taxiRide.rideUpdate$.subscribe((taxiRide) => {
      this.location = taxiRide.currentLocation;
      if (
        taxiRide.status == RideStatus.Completed ||
        taxiRide.status == RideStatus.Canceled
      ) {
        sub.unsubscribe();
        this.location.address = taxiRide.request.destination.address;
        this.available = true;
      }

      this.update();
    });
  }
}
