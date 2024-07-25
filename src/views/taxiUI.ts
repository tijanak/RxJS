import { DivIcon, divIcon, Icon, icon, LayerGroup, marker } from "leaflet";
import { ITaxi } from "../models/ITaxi";
import { showLocation } from "./locationUI";

import drivingImg from "../assets/driving.png";
import requestImg from "../assets/request.png";
import waitingImg from "../assets/stationary.png";

const drivingIcon: Icon = icon({
  iconUrl: drivingImg,
  iconSize: [20, 20],
});
const waitingIcon: Icon = icon({
  iconUrl: waitingImg,
  iconSize: [20, 20],
});
const requestIcon: Icon = icon({
  iconUrl: requestImg,
  iconSize: [20, 20],
});

export function createTaxisContainer(): HTMLDivElement {
  const taxisContainer = document.createElement("div");
  taxisContainer.classList.add("taxisContainer");
  return taxisContainer;
}
export function drawTaxiContainer(
  container: HTMLElement,
  taxisContainer: HTMLDivElement
) {
  const taxiDiv = document.createElement("div");
  taxiDiv.classList.add("taxiDiv");
  const title = document.createElement("p");
  title.classList.add("title");
  title.innerText = "Taksi vozila";
  taxiDiv.appendChild(title);
  taxiDiv.appendChild(taxisContainer);
  container.appendChild(taxiDiv);
}
export function drawTaxis(
  mapLayer: LayerGroup,
  container: HTMLDivElement,
  taxis: ITaxi[]
) {
  container.innerHTML = "";
  mapLayer.clearLayers();
  taxis.forEach((taxi) => {
    drawTaxi(container, taxi);
    drawTaxiOnMap(mapLayer, taxi);
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
function drawTaxiOnMap(mapLayer: LayerGroup, taxi: ITaxi) {
  let plateText: HTMLParagraphElement = document.createElement("p");
  plateText.innerText = taxi.plate;
  let textIcon: DivIcon = divIcon({ html: plateText, className: "map-text" });
  let taxiIcon: Icon;
  if (taxi.available) {
    taxiIcon = waitingIcon;
  } else {
    taxiIcon = drivingIcon;
  }
  marker([taxi.location.latitude, taxi.location.longitude], {
    icon: textIcon,
  }).addTo(mapLayer);
  marker([taxi.location.latitude, taxi.location.longitude], {
    icon: taxiIcon,
  }).addTo(mapLayer);
}
