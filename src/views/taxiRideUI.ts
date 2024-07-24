import { ITaxiRide, RideStatus } from "../models/ITaxiRide";
import { showLocation } from "./locationUI";

export function createRidesContainer(): HTMLDivElement {
  const ridesContainer = document.createElement("div");
  ridesContainer.classList.add("ridesContainer");
  return ridesContainer;
}
export function drawTaxiRideContainer(ridesContainer: HTMLDivElement) {
  const taxiRideDiv = document.createElement("div");
  taxiRideDiv.classList.add("taxiRideDiv");
  const title = document.createElement("p");
  title.innerText = "Istorija vožnji";
  taxiRideDiv.appendChild(title);
  taxiRideDiv.appendChild(ridesContainer);
  document.body.appendChild(taxiRideDiv);
}
export function drawTaxiRides(
  container: HTMLDivElement,
  rides: ITaxiRide[]
): void {
  container.innerHTML = "";
  rides.forEach((ride) => {
    drawTaxiRide(container, ride);
  });
}
function drawTaxiRide(container: HTMLDivElement, ride: ITaxiRide): void {
  const taxiRideContainer = document.createElement("div");
  taxiRideContainer.classList.add("ride");
  const id = document.createElement("p");
  id.innerText =
    "id: " +
    ride.request.id.toString() +
    " " +
    showLocation(ride.request.origin) +
    " -> " +
    showLocation(ride.request.destination);
  const duration = document.createElement("p");
  if (ride.status == RideStatus.OnRoute)
    duration.innerText = "Vreme od početka vožnje: " + ride.duration + "min";
  if (ride.status == RideStatus.Completed)
    duration.innerText = "Vožnja trajala: " + ride.duration + "min";
  const status = document.createElement("p");
  status.innerText = "Status: " + ride.status.toString();
  const taxi = document.createElement("p");
  taxi.innerText = "Taksi: " + ride.taxi;
  const upperRow = document.createElement("div");
  upperRow.appendChild(id);
  upperRow.appendChild(taxi);
  taxiRideContainer.appendChild(upperRow);

  taxiRideContainer.appendChild(duration);
  taxiRideContainer.appendChild(status);
  container.appendChild(taxiRideContainer);
}
