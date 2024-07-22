import {
  BehaviorSubject,
  combineLatest,
  Observable,
  ReplaySubject,
  scan,
  Subject,
  switchMap,
  take,
} from "rxjs";
import { ILocation } from "./ILocation";
import { ITaxiRide, RideStatus, TaxiRide } from "./ITaxiRide";
import { ICustomerRequest } from "./ICustomerRequest";
import { bufferStream, makeStreamOfStreams } from "../controllers/observables";

export interface ITaxi {
  plate: string;
  available: boolean;
  location: ILocation;
}

export class Taxi implements ITaxi {
  private taxiRidesSubject: ReplaySubject<Observable<ITaxiRide>>;
  public ride$: Observable<ITaxiRide[]>;
  private taxiUpdateSubject: Subject<Taxi>;
  public taxiUpdate$: Observable<Taxi>;
  constructor(
    public plate: string,
    public available: boolean,
    public location: ILocation
  ) {
    this.taxiUpdateSubject = new BehaviorSubject<Taxi>(this);
    this.taxiUpdate$ = this.taxiUpdateSubject.asObservable();
    this.taxiRidesSubject = new ReplaySubject();
    this.ride$ = makeStreamOfStreams(this.taxiRidesSubject);
  }
  private update() {
    this.taxiUpdateSubject.next(this);
  }
  public takeRequest(request: ICustomerRequest) {
    let taxiRide: TaxiRide = new TaxiRide(this.plate, request);
    this.addTaxiRideStream(taxiRide.rideUpdate$);
    this.available = false;
    this.update();
    taxiRide.rideUpdate$.subscribe((taxiRide) => {
      if (taxiRide.status == RideStatus.Completed) {
        this.available = true;
        this.update();
      }
    });
  }
  private addTaxiRideStream(stream: Observable<ITaxiRide>) {
    const buffered = bufferStream(stream);
    buffered.pipe(take(1)).subscribe(() => {
      this.taxiRidesSubject.next(stream);
    });
  }
}
