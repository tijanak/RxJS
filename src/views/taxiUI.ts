import { ITaxi } from "../models/ITaxi";
import { showLocation } from "./locationUI";
export function createTaxisContainer(): HTMLDivElement {
  const taxisContainer = document.createElement("div");
  taxisContainer.classList.add("taxisContainer");
  return taxisContainer;
}
export function drawTaxiContainer(taxisContainer: HTMLDivElement) {
  const taxiDiv = document.createElement("div");
  taxiDiv.classList.add("taxiDiv");
  const title = document.createElement("p");
  title.innerText = "Taksi vozila";
  taxiDiv.appendChild(title);
  taxiDiv.appendChild(taxisContainer);
  document.body.appendChild(taxiDiv);
}
export function drawTaxis(container: HTMLDivElement, taxis: ITaxi[]) {
  container.innerHTML = "";
  taxis.forEach((taxi) => {
    drawTaxi(container, taxi);
  });
}
function drawTaxi(container: HTMLDivElement, taxi: ITaxi) {
  const taxiRideContainer = document.createElement("div");
  taxiRideContainer.classList.add("taxi");
  const plate = document.createElement("p");
  plate.innerText = "Registracija: " + taxi.plate;
  const available = document.createElement("p");
  available.innerText = taxi.available ? "Slobodan" : "Nije slobodan";
  const location = document.createElement("p");
  location.innerText = "Trenutna lokacija: " + showLocation(taxi.location);
  taxiRideContainer.appendChild(plate);
  taxiRideContainer.appendChild(available);
  taxiRideContainer.appendChild(location);
  container.appendChild(taxiRideContainer);
}
