export enum RideStatus {
  Pending,
  OnRoute,
  Completed,
}
export interface ITaxiRide {
  duration: number;
  status: RideStatus;
  taxi: string;
  destination: string;
}
