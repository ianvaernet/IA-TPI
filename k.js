const sliderId = "k-slider";
const labelId = "k-label";

let slider;
let label;

function setupK() {
  slider = document.getElementById(sliderId);
  slider.addEventListener("input", updateK);
  label = document.getElementById(labelId);
  updateKLabel();
}

function updateKLabel() {
  label.innerText = `K = ${slider.value}`;
}

function updateK() {
  updateKLabel();
  updateTrainingData();
}

function getK() {
  return parseInt(slider.value);
}
