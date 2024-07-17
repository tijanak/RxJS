import { ITaxi } from "../models/ITaxi";

const requestFormLabels = ["Ime:", "Polazna lokacija:", "Destinacija:"];
export function createElements(inputs: HTMLInputElement[]) {
  for (let i = 0; i < requestFormLabels.length; i++) {
    inputs[i] = document.createElement("input");
  }
}

export function drawNewRequestForm(
  container: HTMLElement,
  inputs: HTMLInputElement[]
) {
  const formTitleParagraph = document.createElement("p");
  formTitleParagraph.innerText = "Novi zahtev";
  formTitleParagraph.classList.add("formTitle");

  const formContainer: HTMLDivElement = document.createElement("div");
  formContainer.classList.add("requestForm");
  formContainer.appendChild(formTitleParagraph);

  const inputsWrapper: HTMLDivElement = document.createElement("div");
  inputsWrapper.classList.add("requestFormInputWrapper");

  const inputsContainer: HTMLDivElement = document.createElement("div");
  inputsContainer.classList.add("requestFormInputs");
  const labelsContainer: HTMLDivElement = document.createElement("div");
  labelsContainer.classList.add("requestFormLabels");

  inputs.forEach((input, index) => {
    const label: HTMLLabelElement = document.createElement("label");
    label.innerText = requestFormLabels[index];
    labelsContainer.appendChild(label);
    inputsContainer.appendChild(input);
  });

  inputsWrapper.appendChild(labelsContainer);
  inputsWrapper.appendChild(inputsContainer);
  formContainer.appendChild(inputsWrapper);
  container.appendChild(formContainer);
}
export function drawTaxi(container: HTMLDivElement, taxi: ITaxi) {}
