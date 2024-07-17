export function createElements(inputs: HTMLInputElement[]) {
  for (let i = 0; i < inputs.length; i++) {
    inputs[i] = document.createElement("input");
  }
}
