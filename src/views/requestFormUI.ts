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
  formBtn: HTMLButtonElement
) {
  const formTitleParagraph = document.createElement("p");
  formTitleParagraph.innerText = "Novi zahtev";
  formTitleParagraph.classList.add("title");

  const formContainer: HTMLDivElement = document.createElement("div");
  formContainer.classList.add("requestForm");
  formContainer.appendChild(formTitleParagraph);

  const inputsWrapper: HTMLDivElement = document.createElement("div");
  inputsWrapper.classList.add("requestFormInputWrapper");

  const inputsContainer: HTMLDivElement = document.createElement("div");
  inputsContainer.classList.add("requestFormInputs");

  locationInputs.forEach((input, index) => {
    drawInput(
      inputsContainer,
      input,
      requestFormLabels[index],
      errorTextDivs[index]
    );
  });

  //inputsWrapper.appendChild(labelsContainer);
  inputsWrapper.appendChild(inputsContainer);
  formContainer.appendChild(inputsWrapper);

  formBtn.disabled = true;
  formBtn.textContent = "Dodaj zahtev";
  formContainer.appendChild(formBtn);

  container.appendChild(formContainer);
}

function drawInput(
  inputsContainer: HTMLDivElement,
  input: HTMLInputElement,
  labelText: string,
  errorDiv: HTMLSpanElement
) {
  const row: HTMLDivElement = document.createElement("div");
  row.classList.add("inputRow");
  const errorRow: HTMLDivElement = document.createElement("div");
  errorRow.classList.add("inputRow", "errorRow");
  const label: HTMLLabelElement = document.createElement("label");
  errorDiv.classList.add("errorText");
  label.innerText = labelText;
  row.appendChild(label);
  row.appendChild(input);
  errorRow.appendChild(errorDiv);
  errorDiv.innerText = "Van dometa taksi servisa";
  errorDiv.hidden = true;
  inputsContainer.appendChild(row);
  inputsContainer.appendChild(errorRow);
}
