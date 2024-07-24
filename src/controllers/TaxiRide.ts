import { differenceInMinutes } from "date-fns";
import { ITaxiRide, RideStatus } from "../models/ITaxiRide";
import { BehaviorSubject, Observable, take, interval } from "rxjs";
import { ResponseRoute, RoutesResponse } from "traveltime-api";
import { getRouteInformation } from "../api/apiCalls";
import { ICustomerRequest } from "../models/ICustomerRequest";
import { ILocation } from "../models/ILocation";

export class TaxiRide implements ITaxiRide {
  private rideUpdatesSubject: BehaviorSubject<ITaxiRide>;
  public rideUpdate$: Observable<ITaxiRide>;
  status: RideStatus;
  duration: number;

  private lengthOfRide: number;
  constructor(
    public currentLocation: ILocation,
    public taxi: string,
    public request: ICustomerRequest
  ) {
    this.status = RideStatus.Pending;

    this.duration = 0;
    this.rideUpdatesSubject = new BehaviorSubject<ITaxiRide>(this);
    this.rideUpdate$ = this.rideUpdatesSubject.asObservable();

    getRouteInformation(request.origin, request.destination)
      .then((data: RoutesResponse) => {
        let route: ResponseRoute =
          data.results[0].locations[0].properties[0].route;

        this.lengthOfRide = this.getRideDurationInMin(
          new Date(route.arrival_time),
          new Date(route.departure_time)
        );
        this.status = RideStatus.OnRoute;
        interval(1000)
          .pipe(take(this.lengthOfRide))
          .subscribe({
            next: (d) => {
              this.duration = d;
              this.update();
            },
            error: () => {},
            complete: () => {
              this.status = RideStatus.Completed;
              this.currentLocation = request.destination;
              this.update();
              this.rideUpdatesSubject.complete();
            },
          });
      })
      .catch((err) => console.error(err));
  }
  private update() {
    //console.log("taxi ride update");
    this.rideUpdatesSubject.next(this);
  }
  private getRideDurationInMin(arrival_time: Date, departure_time: Date) {
    return Math.abs(differenceInMinutes(arrival_time, departure_time));
  }
}
