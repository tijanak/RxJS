const requestFormLabels: string[] = ["Polazna lokacija:", "Destinacija:"];
export function createElements(
  inputs: HTMLInputElement[],
  errorTextDivs: HTMLSpanElement[]
) {
  for (let i = 0; i < requestFormLabels.length; i++) {
    inputs[i] = document.createElement("input");
    errorTextDivs[i] = document.createElement("SPAN");
  }
}

export function drawNewRequestForm(
  container: HTMLElement,
  locationInputs: HTMLInputElement[],
  errorTextDivs: HTMLSpanElement[],
  nameInput: HTMLInputElement,
  formBtn: HTMLButtonElement
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

  drawInput(labelsContainer, inputsContainer, nameInput, "Ime");

  locationInputs.forEach((input, index) => {
    drawInput(
      labelsContainer,
      inputsContainer,
      input,
      requestFormLabels[index]
    );
  });

  inputsWrapper.appendChild(labelsContainer);
  inputsWrapper.appendChild(inputsContainer);
  formContainer.appendChild(inputsWrapper);

  formBtn.textContent = "Dodaj zahtev";
  formContainer.appendChild(formBtn);

  container.appendChild(formContainer);
}

function drawInput(
  labelsContainer: HTMLDivElement,
  inputsContainer: HTMLDivElement,
  input: HTMLInputElement,
  labelText: string
) {
  const label: HTMLLabelElement = document.createElement("label");
  label.innerText = labelText;
  labelsContainer.appendChild(label);
  inputsContainer.appendChild(input);
}
