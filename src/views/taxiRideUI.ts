import { ITaxiRide } from "../models/ITaxiRide";

export function createTaxiRideDiv(): HTMLDivElement {
  const taxiRideDiv = document.createElement("div");
  taxiRideDiv.classList.add("taxiRideDiv");
  const title = document.createElement("p");
  title.innerText = "Istorija vožnji";
  taxiRideDiv.appendChild(title);
  const ridesContainer = document.createElement("div");
  ridesContainer.classList.add("ridesContainer");
  taxiRideDiv.appendChild(ridesContainer);
  document.body.appendChild(taxiRideDiv);
  return ridesContainer;
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
export function drawTaxiRide(container: HTMLDivElement, ride: ITaxiRide): void {
  const taxiRideContainer = document.createElement("div");
  taxiRideContainer.classList.add("ride");
  const id = document.createElement("p");
  id.innerText = "id: " + ride.request.id.toString();
  const duration = document.createElement("p");
  duration.innerText = "proslo: " + ride.duration;
  const status = document.createElement("p");
  status.innerText = ride.status.toString();
  const taxi = document.createElement("p");
  taxi.innerText = "taksi: " + ride.taxi;
  const upperRow = document.createElement("div");
  upperRow.appendChild(id);
  upperRow.appendChild(taxi);
  taxiRideContainer.appendChild(upperRow);
  taxiRideContainer.appendChild(duration);
  taxiRideContainer.appendChild(status);
  container.appendChild(taxiRideContainer);
}
