import { latLng, latLngBounds, map, MapOptions, tileLayer } from "leaflet";
import { drawNewRequestForm } from "./requestFormUI";
import { drawTaxiRideContainer } from "./taxiRideUI";
import { drawTaxiContainer } from "./taxiUI";
import { drawUnprocessedReqDiv } from "./unprocessedRequestsUI";
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
  console.log(process.env.SE_BOUND_LAT);
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
}
