import { LayerGroup, Map } from "leaflet";
import { getTaxis } from "./api/apiCalls";
import { DispatchService } from "./controllers/DispatchService";
import { makeRequestObs } from "./controllers/observables";
import {
  createDrawingLayer,
  createMap,
  createMapDiv,
  drawUI,
} from "./views/dispatchServiceUI";
import { createElements } from "./views/requestFormUI";
import { createRidesContainer, drawTaxiRides } from "./views/taxiRideUI";
import { createTaxisContainer, drawTaxis } from "./views/taxiUI";
import {
  createUnprocessedReqDiv,
  drawRequests,
} from "./views/unprocessedRequestsUI";
import { combineLatest } from "rxjs";

let locationInputs: HTMLInputElement[] = [];
let errorTextDivs: HTMLSpanElement[] = [];
let formBtn: HTMLButtonElement = document.createElement("button");
let taxisContainer: HTMLDivElement = createTaxisContainer();
let unprocessedRequestsContainer: HTMLDivElement = createUnprocessedReqDiv();
let ridesContainer: HTMLDivElement = createRidesContainer();
let mapContainer: HTMLDivElement = createMapDiv();
createElements(locationInputs, errorTextDivs);

drawUI(
  taxisContainer,
  unprocessedRequestsContainer,
  ridesContainer,
  locationInputs,
  errorTextDivs,
  formBtn,
  mapContainer
);
let map: Map = createMap(mapContainer);
let requestsDrawingLayer = createDrawingLayer(map);
let taxisDrawingLayer = createDrawingLayer(map);

let request$ = makeRequestObs(errorTextDivs, locationInputs, formBtn);

getTaxis().then((taxis) => {
  let dispatchService: DispatchService = new DispatchService(request$, taxis);

  dispatchService.taxi$.subscribe((taxis) => {
    drawTaxis(taxisDrawingLayer, taxisContainer, taxis);
  });
  dispatchService.ride$.subscribe((rides) => {
    drawTaxiRides(ridesContainer, rides);
  });
  dispatchService.unprocessedRequest$.subscribe((requests) => {
    drawRequests(requestsDrawingLayer, unprocessedRequestsContainer, requests);
  });
});
