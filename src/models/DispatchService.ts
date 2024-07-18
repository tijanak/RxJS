import { ITaxi } from "../models/ITaxi";
import { ITaxiRide } from "../models/ITaxiRide";
import { ICustomerRequest } from "../models/ICustomerRequest";
import { Observable } from "rxjs";
export class DispatchService {
  private taxi$: Observable<ITaxi>;
  private ride$: Observable<ITaxiRide>;
  private request$: Observable<ICustomerRequest>;

  constructor() {}
}
