import { ICustomerRequest } from "../models/ICustomerRequest";
import { showLocation } from "./locationUI";
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
  container: HTMLDivElement,
  requests: ICustomerRequest[]
) {
  container.innerHTML = "";
  requests.forEach((req) => {
    drawRequest(container, req);
  });
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
