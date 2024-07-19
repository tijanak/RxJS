import { ResponseRoute } from "traveltime-api";
import { ICustomerRequest } from "./ICustomerRequest";
import { ILocation } from "./ILocation";
import { ITaxi } from "./ITaxi";
import { differenceInMinutes } from "date-fns";

export enum RideStatus {
  Pending = "Taksi na putu do klijenta",
  OnRoute = "Na putu ka destinaciji",
  Completed = "Voznja zavrsena",
}
export interface ITaxiRide {
  id: number;
  duration: number;
  status: RideStatus;
  taxi: string;
  request: ICustomerRequest;
}

export class TaxiRide implements ITaxiRide {
  status: RideStatus;
  taxi: string;
  constructor(
    public duration: number,
    public id: number,
    taxi: ITaxi,
    public request: ICustomerRequest
  ) {
    this.status = RideStatus.Pending;
    this.taxi = taxi.plate;
  }
}
