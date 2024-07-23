import { ResponseRoute, RoutesResponse } from "traveltime-api";
import { ICustomerRequest } from "./ICustomerRequest";
import { ILocation } from "./ILocation";
import { ITaxi } from "./ITaxi";
import { differenceInMinutes } from "date-fns";
import {
  BehaviorSubject,
  interval,
  Observable,
  Subject,
  take,
  timer,
} from "rxjs";
import { IRideUpdate } from "./IRideUpdate";
import { getRouteInformation } from "../api/apiCalls";

export enum RideStatus {
  Pending = "Taksi na putu do klijenta",
  OnRoute = "Na putu ka destinaciji",
  Completed = "Voznja zavrsena",
}
export interface ITaxiRide {
  duration: number;
  status: RideStatus;
  taxi: string;
  request: ICustomerRequest;
}

export class TaxiRide implements ITaxiRide {
  private rideUpdatesSubject: BehaviorSubject<ITaxiRide>;
  public rideUpdate$: Observable<ITaxiRide>;
  status: RideStatus;
  duration: number;

  private lengthOfRide: number;
  constructor(public taxi: string, public request: ICustomerRequest) {
    this.status = RideStatus.Pending;

    this.duration = 0;
    //console.log(this.duration);
    getRouteInformation(request.origin, request.destination)
      .then((data: RoutesResponse) => {
        let route: ResponseRoute =
          data.results[0].locations[0].properties[0].route;

        this.lengthOfRide = this.getRideDurationInMin(
          new Date(route.arrival_time),
          new Date(route.departure_time)
        );
        interval(1000)
          .pipe(take(this.lengthOfRide))
          .subscribe((d) => {
            this.duration = d;
            this.update();
          });
        timer(this.lengthOfRide * 1000, 1)
          .pipe(take(1))
          .subscribe(() => {
            this.status = RideStatus.Completed;
            this.update();
            // console.log("arrived at " + this.request.destination);
          });
      })
      .catch((err) => console.error(err));
    this.rideUpdatesSubject = new BehaviorSubject<ITaxiRide>(this);
    this.rideUpdate$ = this.rideUpdatesSubject.asObservable();
  }
  private update() {
    console.log("taxi ride update");
    this.rideUpdatesSubject.next(this);
  }
  private getRideDurationInMin(arrival_time: Date, departure_time: Date) {
    return Math.abs(differenceInMinutes(arrival_time, departure_time));
  }
}
