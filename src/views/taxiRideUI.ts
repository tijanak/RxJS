import { ITaxiRide } from "../models/ITaxiRide";

export function drawTaxiRides(container: HTMLDivElement, rides: ITaxiRide[]) {
  container.innerHTML = "";
  rides.forEach((ride) => {
    drawTaxiRide(container, ride);
  });
}
export function drawTaxiRide(container: HTMLDivElement, ride: ITaxiRide) {
  container.innerText +=
    ride.request.id + " " + ride.duration + ride.status.toString();
}
