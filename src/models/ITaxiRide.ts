import { ICustomerRequest } from "./ICustomerRequest";
import { ILocation } from "./ILocation";
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
  destination: ILocation;
  origin: ILocation;
  customerName: string;
}

export class TaxiRide implements ITaxiRide {
  id: number;
  duration: number;
  status: RideStatus;
  taxi: string;
  destination: ILocation;
  origin: ILocation;
  customerName: string;
  constructor(taxiId: number, taxi: ITaxi, request: ICustomerRequest) {
    (this.id = taxiId), (this.status = RideStatus.Pending);
    this.taxi = taxi.plate;
    this.destination = request.destination;
    this.origin = request.origin;
    this.customerName = request.customerName;
  }
}
