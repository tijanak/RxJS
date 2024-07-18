import { ITaxi } from "../models/ITaxi";
import { ITaxiRide } from "../models/ITaxiRide";
import { ICustomerRequest } from "../models/ICustomerRequest";
import { Observable, Subject } from "rxjs";
export class DispatchService {
  private ride$: Subject<ITaxiRide>;
  constructor(
    private taxi$: Observable<ITaxi[]>,
    private request$: Observable<ICustomerRequest>
  ) {
    this.ride$ = new Subject();
  }
}
