import store from "../store/Store";

class NumberIndicators extends HTMLElement {
  private clickHandlers: ((this: HTMLButtonElement, ev: Event) => void)[];
  private buttonList: NodeListOf<HTMLButtonElement> | null;

  constructor() {
    super();
    this.clickHandlers = [];
    this.buttonList = null;
    this.technologyTabChangedHandler =
      this.technologyTabChangedHandler.bind(this);
  }

  connectedCallback() {
    this.render();

    window.addEventListener(
      "technology-tab-changed",
      this.technologyTabChangedHandler as EventListener,
    );
  }

  technologyTabChangedHandler(event: CustomEvent) {
    if (this.buttonList) {
      this.buttonList.forEach((b, i) => {
        const isSelected = i === event.detail.technologyIndex;
        b.classList.toggle("bg-white", isSelected);
        b.classList.toggle("text-slate-950", isSelected);
        b.classList.toggle("text-white", !isSelected);
        b.setAttribute("aria-selected", String(isSelected));
        if (isSelected) b.blur();
      });
    }
  }

  handleClick(clickedButtonIndex: number) {
    if (!this.buttonList) return;
    store.updateSelectedTechnologyTabIndex(clickedButtonIndex);
  }

  render() {
    this.innerHTML = "";
    const template = document.createElement("template");

    const tabs = store.getTechnology();

    if (tabs.length === 0) {
      template.innerHTML = `<loading-spinner></loading-spinner>`;
      this.append(template.content.cloneNode(true));
      return;
    }

    const createdButtonTabs = tabs
      .map(
        (tab, index) => /* HTML */ `
          <button
            aria-selected="${index === 0 ? "true" : "false"}"
            aria-controls="technology-panel-${index}"
            role="tab"
            class="${index === 0
              ? "bg-white text-slate-950"
              : "text-white"} grid size-12 place-items-center rounded-full border border-white/25 transition-colors duration-300 ease-in-out hover:border-white hover:bg-slate-950 hover:text-white focus:border-white focus:bg-slate-950 focus:text-white focus:outline-none"
          >
            <span class="font-sans_cond text-xl">${index + 1}</span>
            <span class="sr-only">${tab.name} tab</span>
          </button>
        `,
      )
      .join(" ");

    template.innerHTML = `<div role="tablist" class="flex lg:flex-col gap-8 lg:gap-14 ">${createdButtonTabs}</div>`;
    this.append(template.content.cloneNode(true));

    this.buttonList = this.querySelectorAll("button");
    if (this.buttonList) {
      this.buttonList.forEach((button, index) => {
        const clickHandler = () => this.handleClick(index);
        this.clickHandlers[index] = clickHandler;
        button.addEventListener("click", clickHandler);
      });
    }
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
  }
}

customElements.define("number-indicators", NumberIndicators);
