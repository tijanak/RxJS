import {
  icon,
  latLng,
  latLngBounds,
  map,
  MapOptions,
  marker,
  tileLayer,
} from "leaflet";
import { drawNewRequestForm } from "./requestFormUI";
import { drawTaxiRideContainer } from "./taxiRideUI";
import { drawTaxiContainer } from "./taxiUI";
import { drawUnprocessedReqDiv } from "./unprocessedRequestsUI";
import drving from "../assets/driving.png";
export function drawUI(
  taxisContainer: HTMLDivElement,
  unprocessedRequestsContainer: HTMLDivElement,
  ridesContainer: HTMLDivElement,
  locationInputs: HTMLInputElement[],
  errorTextDivs: HTMLSpanElement[],
  formBtn: HTMLButtonElement
) {
  drawTaxiContainer(document.body, taxisContainer);
  const row = document.createElement("div");

  drawNewRequestForm(row, locationInputs, errorTextDivs, formBtn);
  drawUnprocessedReqDiv(row, unprocessedRequestsContainer);
  document.body.appendChild(row);
  row.classList.add("row");
  drawTaxiRideContainer(document.body, ridesContainer);
  const mapDiv = document.createElement("div");
  mapDiv.id = "map";
  document.body.appendChild(mapDiv);
  var center = latLng(43.320752, 21.897498);
  const options: MapOptions = {
    center: center,
    zoom: 13,
    maxBounds: latLngBounds([
      [
        parseFloat(process.env.SE_BOUND_LAT),
        parseFloat(process.env.NW_BOUND_LONG),
      ],
      [
        parseFloat(process.env.NW_BOUND_LAT),
        parseFloat(process.env.SE_BOUND_LONG),
      ],
    ]),
    zoomControl: false,
    minZoom: 12,
  };
  const mymap = map("map", options);
  tileLayer
    .wms("http://ows.mundialis.de/services/service?", { layers: "OSM-WMS" })
    .addTo(mymap);
  let taxiIcon = icon({
    iconUrl: drving,
    iconSize: [50, 64],
  });
  marker([43.32144, 21.901122], { icon: taxiIcon }).addTo(mymap);
  const img = document.createElement("img");
  img.src = drving;
  document.body.appendChild(img);
}
