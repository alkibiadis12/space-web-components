import store from "../store/Store";

class DestinationTabs extends HTMLElement {
  private buttonList: NodeListOf<HTMLButtonElement> | null;
  private clickHandlers: ((this: HTMLButtonElement, ev: Event) => void)[];

  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.render = this.render.bind(this);
    this.buttonList = null;
    this.clickHandlers = []; // Initialize the state
  }

  connectedCallback() {
    this.render();
  }

  handleClick(clickedButtonIndex: number): void {
    if (!this.buttonList) return;
    store.dispatchDestinationTabClickedEvent(clickedButtonIndex);

    this.buttonList.forEach((b, i) => {
      const isSelected = i === clickedButtonIndex;
      b.classList.toggle("border-white", isSelected);
      b.classList.toggle("border-transparent", !isSelected);
      b.classList.toggle("text-white", isSelected);
      b.setAttribute("aria-selected", String(isSelected));
      if (isSelected) b.blur();
    });
  }

  render() {
    this.innerHTML = "";
    const template = document.createElement("template");

    const destinations = store.getDestinations();

    const buttons = destinations
      .map(
        (tab, index) => `<button
          aria-selected=${index === 0 ? "true" : "false"}
          role="tab"
          aria-controls="tabpanel-${index}"
          class="border-b-2 
          uppercase
          text-md
          ${index === 0 ? "border-white" : "border-transparent"} 
          pb-2 
          ${index === 0 && "text-white"}
          hover:border-white/25 
          focus:border-white/25 
          focus:outline-none
          transition-colors
          duration-100
          ease-linear
          "
        >
          ${tab.name ? tab.name : "Loading..."}
        </button>`,
      )
      .join(" ");

    template.innerHTML = /* HTML */ `
      <div
        role="tablist"
        class="flex w-fit gap-5 align-middle font-sans_cond text-indigo-200"
      >
        ${buttons}
      </div>
    `;
    this.append(template.content.cloneNode(true));

    //ADD EVENT LISTENERS AGAIN AFTER RERENDERING
    this.buttonList = this.querySelectorAll("button");
    if (this.buttonList) {
      this.buttonList.forEach((button, clickedButtonIndex) => {
        const clickHandler = () => this.handleClick(clickedButtonIndex);

        // Save the handler reference in the state
        this.clickHandlers[clickedButtonIndex] = clickHandler;

        // Attach the click event listener
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

customElements.define("destination-tabs", DestinationTabs);
