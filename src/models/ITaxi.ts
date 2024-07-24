import { ICustomerRequest } from "./ICustomerRequest";
import { ILocation } from "./ILocation";

export interface ITaxi {
  plate: string;
  available: boolean;
  location: ILocation;
  takeRequest: (request: ICustomerRequest) => void;
}
