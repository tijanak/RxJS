import { ICustomerRequest } from "../models/ICustomerRequest";

export function createUnprocessedReqDiv(): HTMLDivElement {
  const unprocessedReqDiv = document.createElement("div");
  unprocessedReqDiv.classList.add("reqDiv");
  const title = document.createElement("p");
  title.innerText = "Neobradjeni zahtevi";
  unprocessedReqDiv.appendChild(title);
  const reqContainer = document.createElement("div");
  reqContainer.classList.add("reqContainer");
  unprocessedReqDiv.appendChild(reqContainer);
  document.body.appendChild(unprocessedReqDiv);
  return reqContainer;
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
export function drawRequest(container: HTMLDivElement, req: ICustomerRequest) {
  const reqContainer = document.createElement("div");
  reqContainer.classList.add("request");
  const id = document.createElement("p");
  id.innerText = "id: " + req.id;
  reqContainer.appendChild(id);
  container.appendChild(reqContainer);
}
