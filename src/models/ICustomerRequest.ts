import { ILocation } from "./ILocation";

export interface ICustomerRequest {
  id: number;
  customerName: string;
  origin: ILocation;
  destination: ILocation;
}
