import {
  BehaviorSubject,
  combineLatest,
  first,
  Observable,
  of,
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
    this.ride$.subscribe(() => {
      //console.log(plate + " rides emitted");
    });
  }
  private update() {
    //  console.log(this.plate + "update");
    this.taxiUpdateSubject.next(this);
  }
  public takeRequest(request: ICustomerRequest) {
    this.available = false;
    this.update();
    let taxiRide: TaxiRide = new TaxiRide(this.plate, request);
    this.addTaxiRideStream(taxiRide.rideUpdate$);
    let sub = taxiRide.rideUpdate$.subscribe({
      next: (taxiRide) => {
        //console.log("taxi got ride update");
        //console.log(taxiRide);
        if (taxiRide.status == RideStatus.Completed) {
          sub.unsubscribe();
          this.available = true;
          this.update();
        }
      },
      error: () => {},
      complete: () => {
        // this.available = true;
        // this.update();
      },
    });
  }
  private addTaxiRideStream(stream: Observable<ITaxiRide>) {
    const buffered = bufferStream(stream);
    buffered.pipe(first()).subscribe(() => {
      this.taxiRidesStreams.next(stream);
    });
  }
}
