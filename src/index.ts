import { getTaxis } from "./api/apiCalls";
import { DispatchService } from "./controllers/DispatchService";
import { makeRequestObs } from "./controllers/observables";
import { drawUI } from "./views/dispatchServiceUI";
import { createElements } from "./views/requestFormUI";
import { createRidesContainer, drawTaxiRides } from "./views/taxiRideUI";
import { createTaxisContainer, drawTaxis } from "./views/taxiUI";
import {
  createUnprocessedReqDiv,
  drawRequests,
} from "./views/unprocessedRequestsUI";

let locationInputs: HTMLInputElement[] = [];
let errorTextDivs: HTMLSpanElement[] = [];
let formBtn: HTMLButtonElement = document.createElement("button");
let taxisContainer: HTMLDivElement = createTaxisContainer();
let unprocessedRequestsContainer: HTMLDivElement = createUnprocessedReqDiv();
let ridesContainer: HTMLDivElement = createRidesContainer();
createElements(locationInputs, errorTextDivs);

drawUI(
  taxisContainer,
  unprocessedRequestsContainer,
  ridesContainer,
  locationInputs,
  errorTextDivs,
  formBtn
);

let request$ = makeRequestObs(errorTextDivs, locationInputs, formBtn);

getTaxis().then((taxis) => {
  let dispatchService: DispatchService = new DispatchService(request$, taxis);

  dispatchService.taxi$.subscribe((taxis) => {
    drawTaxis(taxisContainer, taxis);
  });
  dispatchService.ride$.subscribe((rides) => {
    drawTaxiRides(ridesContainer, rides);
  });
  dispatchService.unprocessedRequest$.subscribe((requests) => {
    drawRequests(unprocessedRequestsContainer, requests);
  });
});
