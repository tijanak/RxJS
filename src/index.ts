import { getTaxis } from "./api/apiCalls";
import { DispatchService } from "./controllers/DispatchService";
import { makeRequestObs } from "./controllers/observables";
import { createElements, drawNewRequestForm } from "./views/requestFormUI";
import {
  createRidesContainer,
  drawTaxiRideContainer,
  drawTaxiRides,
} from "./views/taxiRideUI";
import {
  createTaxisContainer,
  drawTaxiContainer,
  drawTaxis,
} from "./views/taxiUI";
import {
  createUnprocessedReqDiv,
  drawRequests,
  drawUnprocessedReqDiv,
} from "./views/unprocessedRequestsUI";

let locationInputs: HTMLInputElement[] = [];
let errorTextDivs: HTMLSpanElement[] = [];
let formBtn: HTMLButtonElement = document.createElement("button");
let taxisContainer: HTMLDivElement = createTaxisContainer();
let unprocessedRequestsContainer: HTMLDivElement = createUnprocessedReqDiv();
let ridesContainer: HTMLDivElement = createRidesContainer();
createElements(locationInputs, errorTextDivs);

drawTaxiContainer(taxisContainer);
drawNewRequestForm(document.body, locationInputs, errorTextDivs, formBtn);
drawUnprocessedReqDiv(unprocessedRequestsContainer);
drawTaxiRideContainer(ridesContainer);

let request$ = makeRequestObs(locationInputs, formBtn);

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
