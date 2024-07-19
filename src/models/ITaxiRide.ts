import { getRideDuration as getRouteInformation } from "../api/apiCalls";
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
  request: ICustomerRequest;
}

export class TaxiRide implements ITaxiRide {
  id: number;
  duration: number;
  status: RideStatus;
  taxi: string;
  request: ICustomerRequest;
  constructor(taxiId: number, taxi: ITaxi, request: ICustomerRequest) {
    (this.id = taxiId), (this.status = RideStatus.Pending);
    this.taxi = taxi.plate;
    this.request = request;
    getRouteInformation(request.origin, request.destination).then((data) => {
      console.log(data);
    });
  }
}
