class Input {
  constructor(name, elementId, labelId, onInput) {
    this.listeners = [];
    this.name = name;
    this.input = document.getElementById(elementId);
    this.label = document.getElementById(labelId);
    this.input.addEventListener("input", evt => this.update(evt.target.value));
    this.onInput(onInput);
  }

  update(value) {
    this.value = value;
    if (this.label) this.label.innerText = this.name + " = " + value;
    this.listeners.forEach(listener => listener(value));
  }

  onInput(listener) {
    this.listeners.push(listener);
  }

  set value(value) {
    this.input.value = value;
  }

  get value() {
    return this.input.value;
  }
}
