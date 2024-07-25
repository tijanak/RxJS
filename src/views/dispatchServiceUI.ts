import {
  latLng,
  latLngBounds,
  LayerGroup,
  layerGroup,
  Map,
  map,
  MapOptions,
  tileLayer,
} from "leaflet";
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
  formBtn: HTMLButtonElement,
  mapContainer: HTMLDivElement
) {
  drawTaxiContainer(document.body, taxisContainer);
  const row = document.createElement("div");

  drawNewRequestForm(row, locationInputs, errorTextDivs, formBtn);
  drawUnprocessedReqDiv(row, unprocessedRequestsContainer);
  document.body.appendChild(row);
  row.classList.add("row");
  drawTaxiRideContainer(document.body, ridesContainer);
  document.body.appendChild(mapContainer);
}
export function createMapDiv(): HTMLDivElement {
  const mapDiv = document.createElement("div");
  mapDiv.id = "map";
  return mapDiv;
}
export function createMap(mapDiv: HTMLDivElement): Map {
  let centerLat: number =
    (parseFloat(process.env.SE_BOUND_LAT) +
      parseFloat(process.env.NW_BOUND_LAT)) /
    2;
  let centerLong =
    (parseFloat(process.env.NW_BOUND_LONG) +
      parseFloat(process.env.SE_BOUND_LONG)) /
    2;
  var centerPoint = latLng(centerLat, centerLong);
  const options: MapOptions = {
    center: centerPoint,
    zoom: 12,
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
  return mymap;
}
export function createDrawingLayer(map: Map): LayerGroup {
  let layer: LayerGroup = layerGroup().addTo(map);
  return layer;
}
