import { RideStatus } from "./ITaxiRide";

export interface IRideUpdate {
  newRideStatus?: RideStatus;
  newDuration?: number;
  rideId: number;
}
