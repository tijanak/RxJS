import { differenceInMinutes } from "date-fns";
import { ITaxiRide, RideStatus } from "../models/ITaxiRide";
import {
  BehaviorSubject,
  Observable,
  take,
  interval,
  timer,
  from,
  combineLatest,
  concatMap,
  of,
  delay,
} from "rxjs";
import {
  ResponseRoute,
  ResponseRoutePart,
  RoutesResponse,
} from "traveltime-api";
import { getRouteInformation } from "../api/apiCalls";
import { ICustomerRequest } from "../models/ICustomerRequest";
import { getDistanceInKm, ILocation } from "../models/ILocation";

export class TaxiRide implements ITaxiRide {
  private rideUpdatesSubject: BehaviorSubject<ITaxiRide>;

  public rideUpdate$: Observable<ITaxiRide>;
  public status: RideStatus;
  public duration: number;

  private lengthOfRide: number;
  private avgSpeedKMH: number = 40;

  constructor(
    public currentLocation: ILocation,
    public taxi: string,
    public request: ICustomerRequest
  ) {
    this.status = RideStatus.Pending;

    this.duration = 0;
    this.rideUpdatesSubject = new BehaviorSubject<ITaxiRide>(this);
    this.rideUpdate$ = this.rideUpdatesSubject.asObservable();

    this.getToOrigin();
    /*getRouteInformation(request.origin, request.destination)
      .then((data: RoutesResponse) => {
        let route: ResponseRoute =
          data.results[0].locations[0].properties[0].route;

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
            },
          });
      })
      .catch((err) => console.error(err));*/
  }
  private getToOrigin() {
    let distanceToOrigin = getDistanceInKm(
      this.currentLocation,
      this.request.origin
    );
    let minToGetToOrigin = (distanceToOrigin / this.avgSpeedKMH) * 60;
    let driveToOrigin = timer(1000 * minToGetToOrigin);
    let getRouteInfo = from(
      getRouteInformation(this.request.origin, this.request.destination)
    );
    let arriveAtOrigin = combineLatest([driveToOrigin, getRouteInfo]).pipe(
      take(1)
    );
    arriveAtOrigin.subscribe((startInfo) => {
      let routeInfo: RoutesResponse = startInfo[1];
      let route: ResponseRoute =
        routeInfo.results[0].locations[0].properties[0].route;
      this.lengthOfRide = this.getRideDurationInMin(
        new Date(route.arrival_time),
        new Date(route.departure_time)
      );
      let parts: ResponseRoutePart[] = route.parts;
      this.driveFromOriginToDestination(parts);
      console.log(minToGetToOrigin);
      console.log(routeInfo);
    });
  }
  private driveFromOriginToDestination(parts: ResponseRoutePart[]): void {
    this.status = RideStatus.OnRoute;
    this.currentLocation = this.request.origin;
    this.update();
    let drivingTimer = interval(1000).subscribe(() => {
      this.duration += 1;

      this.update();
    });
    from(parts)
      .pipe(
        concatMap((part: ResponseRoutePart) =>
          of(part).pipe(delay((part.travel_time / 60) * 1000))
        )
      )
      .subscribe({
        next: (part) => {
          this.currentLocation = {
            longitude: part.coords[0].lng,
            latitude: part.coords[0].lat,
          };
        },
        complete: () => {
          this.status = RideStatus.Completed;
          this.currentLocation = this.request.destination;
          drivingTimer.unsubscribe();
          this.update();
        },
      });
  }
  private update() {
    this.rideUpdatesSubject.next(this);
  }
  private getRideDurationInMin(arrival_time: Date, departure_time: Date) {
    return Math.abs(differenceInMinutes(arrival_time, departure_time));
  }
}
