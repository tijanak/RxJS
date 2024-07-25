import { icon, LayerGroup, marker } from "leaflet";
import requestImg from "../assets/request.png";
import { ICustomerRequest } from "../models/ICustomerRequest";
import { showLocation } from "./locationUI";
let requestIcon = icon({
  iconUrl: requestImg,
  iconSize: [20, 20],
});
export function createUnprocessedReqDiv(): HTMLDivElement {
  const reqContainer = document.createElement("div");
  reqContainer.classList.add("reqContainer");
  return reqContainer;
}
export function drawUnprocessedReqDiv(
  container: HTMLElement,
  reqContainer: HTMLDivElement
) {
  const unprocessedReqDiv = document.createElement("div");
  unprocessedReqDiv.classList.add("reqDiv");
  const title = document.createElement("p");
  title.classList.add("title");
  title.innerText = "Neobradjeni zahtevi:";
  unprocessedReqDiv.appendChild(title);
  unprocessedReqDiv.appendChild(reqContainer);
  container.appendChild(unprocessedReqDiv);
}
export function drawRequests(
  mapLayer: LayerGroup,
  container: HTMLDivElement,
  requests: ICustomerRequest[]
) {
  container.innerHTML = "";
  mapLayer.clearLayers();
  requests.forEach((req) => {
    drawRequest(container, req);
    drawRequestOnMap(mapLayer, req);
  });
}
export function drawRequestsOnMap(requests: ICustomerRequest[]) {
  requests.forEach((req) => {});
}
function drawRequest(container: HTMLDivElement, req: ICustomerRequest) {
  const reqContainer = document.createElement("div");
  reqContainer.classList.add("request");
  const id = document.createElement("p");
  id.innerText =
    "id: " +
    req.id +
    " Putanja: " +
    showLocation(req.origin) +
    "->" +
    showLocation(req.destination);
  reqContainer.appendChild(id);
  container.appendChild(reqContainer);
}
function drawRequestOnMap(mapLayer: LayerGroup, req: ICustomerRequest) {
  marker([req.origin.latitude, req.origin.longitude], {
    icon: requestIcon,
  }).addTo(mapLayer);
}
