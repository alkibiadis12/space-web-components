class Tabs extends HTMLElement {
  private buttonList: NodeListOf<HTMLButtonElement> | null;
  private clickHandlers: ((this: HTMLButtonElement, ev: Event) => any)[]; // Private state for storing click handlers

  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.buttonList = null;
    this.clickHandlers = []; // Initialize the state
  }

  connectedCallback() {
    this.render();

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

  handleClick(clickedButtonIndex: number): void {
    if (!this.buttonList) return;

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
    template.innerHTML = `
      <div class='flex gap-5 font-sans_cond text-indigo-200 w-fit align-middle'>
        <button aria-selected="true" class='text-white focus:outline-none focus:border-white/25 border-white border-b-2 pb-2 hover:border-white/25'>MARS</button>
        <button aria-selected="false" class='focus:outline-none focus:border-white/25 border-transparent border-b-2 pb-2 hover:border-white/25'>JUPITER</button>
        <button aria-selected="false" class='focus:outline-none focus:border-white/25 border-transparent border-b-2 pb-2 hover:border-white/25'>NEPTUNE</button>
      </div>
    `;
    this.append(template.content.cloneNode(true));
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

customElements.define("my-tabs", Tabs);
