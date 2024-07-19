import { Garage, ITaxi } from "../models/ITaxi";
import { ITaxiRide } from "../models/ITaxiRide";
import { ICustomerRequest } from "../models/ICustomerRequest";
import {
  buffer,
  combineLatest,
  defaultIfEmpty,
  filter,
  from,
  map,
  Observable,
  of,
  Subject,
  takeLast,
  toArray,
  withLatestFrom,
} from "rxjs";
export class DispatchService {
  private subject: Subject<ITaxiRide> = new Subject();
  public ride$: Observable<ITaxiRide> = this.subject.asObservable();
  private availableTaxi$: Observable<ITaxi[]>;
  constructor(
    private garage: Garage,
    private request$: Observable<ICustomerRequest>
  ) {
    this.availableTaxi$ = garage.taxi$.pipe(
      map((t: ITaxi[]) => t.filter((taxi) => taxi.available))
    );
    request$.pipe(withLatestFrom(this.availableTaxi$)).subscribe((e) => {
      console.log("buffer", e);
    });
    /*garage.taxi$.subscribe((t) => {
      // console.log(t);
      this.availableTaxi$ = from(t).pipe(
        filter((t) => t.available),
        toArray()
      );

      this.availableTaxi$.subscribe((tx) => console.log(tx));
      request$.pipe(buffer(this.availableTaxi$)).subscribe((e) => {
        console.log("buffer", e);
      });
    });*/
  }
}
