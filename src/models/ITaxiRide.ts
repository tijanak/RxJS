import { ICustomerRequest } from "./ICustomerRequest";
import { ITaxi } from "./ITaxi";

export enum RideStatus {
  Pending,
  OnRoute,
  Completed,
}
export interface ITaxiRide {
  id: number;
  duration: number;
  status: RideStatus;
  taxi: string;
  destination: string;
}

export class TaxiRide {
  constructor(taxi: ITaxi, request: ICustomerRequest) {}
}
