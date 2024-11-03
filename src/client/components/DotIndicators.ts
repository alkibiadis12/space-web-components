import store from "../store/Store";

class DotIndicators extends HTMLElement {
  private clickHandlers: ((this: HTMLButtonElement, ev: Event) => void)[];
  private buttonList: NodeListOf<HTMLButtonElement> | null;

  constructor() {
    super();
    this.clickHandlers = [];
    this.buttonList = null;
    this.render = this.render.bind(this);
    this.handleCrewSliderChange = this.handleCrewSliderChange.bind(this);
  }

  connectedCallback() {
    this.render();

    window.addEventListener(
      "crew-slider-changed",
      this.handleCrewSliderChange as EventListener,
    );
  }

  handleCrewSliderChange(event: CustomEvent) {
    if (this.buttonList) {
      this.buttonList.forEach((b, i) => {
        const isSelected = i === event.detail.crewIndex;
        b.classList.toggle("bg-white", isSelected);
        b.classList.toggle("bg-white/25", !isSelected);

        b.setAttribute("aria-selected", String(isSelected));
        if (isSelected) b.blur();
      });
    }
  }

  handleClick(clickedButtonIndex: number) {
    if (!this.buttonList) return;
    store.updateSelectedCrewTabIndex(clickedButtonIndex);
  }

  render() {
    this.innerHTML = "";
    const template = document.createElement("template");

    const crew = store.getCrew();

    const createdButtonTabs = crew
      .map(
        (c, index) => `
          <button
            aria-selected="${index === 0 ? "true" : "false"}"
            role="tab"
            aria-label="Select crew member ${c.name}"
            class="${index === 0 ? "bg-white" : "bg-white/25"} 
            size-3
            lg:size-4 
            rounded-full 
            transition-colors 
            duration-300 
            ease-in-out 
            hover:bg-white/70
            focus:bg-white/70 
            focus:outline-none"
          >
            <span class="sr-only">Tab of crew member - ${c.name}</span>
          </button>
        `,
      )
      .join(" ");
    template.innerHTML = `<div role="tablist" class="flex gap-5 lg:gap-10">${createdButtonTabs}</div>`;
    this.append(template.content.cloneNode(true));

    this.buttonList = this.querySelectorAll("button");
    this.buttonList.forEach((button, index) => {
      const clickHandler = () => this.handleClick(index);
      this.clickHandlers[index] = clickHandler;
      button.addEventListener("click", clickHandler);
    });
  }

  disconnectedCallback() {
    if (this.buttonList) {
      this.buttonList.forEach((button, index) => {
        // Retrieve the corresponding click handler from the state
        const clickHandler = this.clickHandlers[index];
        if (clickHandler) {
          button.removeEventListener("click", clickHandler);
        }
      });
    }
    window.removeEventListener(
      "crew-slider-changed",
      this.handleCrewSliderChange as EventListener,
    );
  }
}

customElements.define("dot-indicators", DotIndicators);
