import store from "../store/Store";

export default class Technology extends HTMLElement {
  private listItems: NodeListOf<HTMLLIElement> | null;
  private isDragging: boolean;
  private startY: number;
  private threshold: number;

  constructor() {
    super();
    this.render = this.render.bind(this);
    this.handleTechnologyTabChange = this.handleTechnologyTabChange.bind(this);
    this.listItems = null;
    this.isDragging = false;
    this.startY = 0;
    this.threshold = 100;
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  connectedCallback() {
    this.render();

    window.addEventListener("data-loaded", this.render);
    window.addEventListener(
      "technology-tab-changed",
      this.handleTechnologyTabChange as unknown as EventListener,
    );

    this.addEventListener("pointerdown", this.handleMouseDown);
    this.addEventListener("pointermove", this.handleMouseMove);
    this.addEventListener("pointerup", this.handleMouseUp);
  }

  handleMouseDown(event: MouseEvent) {
    if (event.button === 0) {
      event.preventDefault();
      this.isDragging = true;
      this.startY = event.clientY;
    }
  }

  handleMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      event.preventDefault();
      const currentY = event.clientY;
      const deltaY = currentY - this.startY;

      if (Math.abs(deltaY) > this.threshold) {
        if (deltaY > 0) {
          store.incSelectedTechnologyTabIndex();
        } else if (deltaY < 0) {
          store.decSelectedTechnologyTabIndex();
        }

        this.isDragging = false;
      }
    }
  }

  handleMouseUp(event: MouseEvent) {
    // Reset isDragging if the left mouse button is released
    if (event.button === 0) {
      this.isDragging = false;
      document.removeEventListener("mouseup", this.handleMouseUp.bind(this)); // Clean up event listener
    }
  }

  async handleTechnologyTabChange(event: CustomEvent) {
    const selectedIndex = event.detail.technologyIndex;
    let previousSelectedIndex: number;

    if (this.listItems) {
      //USING FOR BECAUSE OF ASYNC
      for (let index = 0; index < this.listItems.length; index++) {
        const item = this.listItems[index];
        const isSelected = selectedIndex === index;

        //THE PREVIOUS SELECTION
        if (!isSelected && !item.classList.contains("hidden")) {
          previousSelectedIndex = index;

          //REMOVE ENTRY ANIMATIONS FROM THE PREV SELECTED ELEMENT
          item.classList.remove("slide-bottom-to-middle");
          item.classList.remove("slide-top-to-middle");

          //ADD EXIT ANIMATION TO THE PREVIOUS SELECTED ELEMENT
          if (`${event.detail.mode}`.startsWith("mouse")) {
            if (event.detail.mode === "mouse-top")
              item.classList.add("slide-middle-to-top");
            if (event.detail.mode === "mouse-bottom")
              item.classList.add("slide-middle-to-bottom");
          } else {
            if (previousSelectedIndex < selectedIndex) {
              item.classList.add("slide-middle-to-bottom");
            } else {
              item.classList.add("slide-middle-to-top");
            }
          }

          await new Promise((res) => {
            item.addEventListener("animationend", res, { once: true });
          });

          //AFTER THE END OF EXIT ANIMATION REMOVE ANIMATIONS AND MAKE THE LI HIDDEN
          item.classList.remove("slide-middle-to-bottom");
          item.classList.remove("slide-middle-to-top");

          item.classList.add("hidden");
        }
      }

      this.listItems.forEach((item, index) => {
        const isSelected = selectedIndex === index;

        //MAKE SELECTED ITEM VISIBLE
        if (isSelected) {
          item.classList.remove("hidden");

          //ADD ANIMATION WHEN IT APPEARS
          if (`${event.detail.mode}`.startsWith("mouse")) {
            if (event.detail.mode === "mouse-top")
              item.classList.add("slide-bottom-to-middle");
            if (event.detail.mode === "mouse-bottom")
              item.classList.add("slide-top-to-middle");
          } else {
            if (selectedIndex < previousSelectedIndex) {
              item.classList.add("slide-bottom-to-middle");
            } else {
              item.classList.add("slide-top-to-middle");
            }
          }
        }
      });
    }
  }

  render() {
    this.innerHTML = "";
    const template = document.createElement("template");

    const technology = store.getTechnology();

    if (technology.length === 0) {
      template.innerHTML = `<loading-spinner></loading-spinner>`;
      this.append(template.content.cloneNode(true));
      return;
    }

    template.innerHTML = /* HTML */ `
      <section>
        <h2
          aria-label="Choose a technology"
          class="focus:outline-none' text-center font-sans_cond text-xl uppercase tracking-normal text-white sm:tracking-wide md:text-start lg:tracking-widest 2xl:text-2xl"
        >
          <span class="mr-[.5em] font-bold text-white/50" aria-hidden="true">
            03
          </span>
          technology
        </h2>
        <ul
          role="tablist"
          class="mt-10 flex flex-col gap-7 lg:mt-20 lg:flex-row lg:gap-14 2xl:mt-40"
        >
          <number-indicators class="mx-auto lg:mx-0"></number-indicators>
          ${technology
            .map(
              (t, index) => /* HTML */ `
                <li
                  role="tabpanel"
                  aria-labelledby="technology-title-${index}"
                  aria-hidden="${index !== 0}"
                  aria-selected="${index === 0}"
                  tabindex="${index === 0 ? "0" : "-1"}"
                  class="${index !== 0 ? "hidden" : " "} cursor-pointer"
                >
                  <div class="grid gap-5 lg:grid-cols-2 lg:gap-32">
                    <div class="lg:hidden">
                      <img
                        src=${t.images.landscape}
                        alt="Image of ${t.name}"
                        class="h-full w-full object-contain"
                      />
                    </div>
                    <div>
                      <h2
                        class="text-center font-serif text-xl uppercase text-white/50 md:mt-4 md:text-2xl lg:mt-0 lg:text-start"
                      >
                        The terminology...
                      </h2>
                      <h1
                        class="pt-2 text-center font-serif text-3xl uppercase text-white md:text-5xl lg:text-start"
                      >
                        ${t.name}
                      </h1>
                      <p
                        class="destination-description max-w-sm pt-4 text-center font-sans leading-7 text-indigo-200 md:mx-auto lg:mx-0 lg:max-w-md lg:pt-7 lg:text-start"
                      >
                        ${t.description}
                      </p>
                    </div>
                    <div class="hidden lg:block">
                      <img src=${t.images.portrait} alt="Image of ${t.name}" />
                    </div>
                  </div>
                </li>
              `,
            )
            .join(" ")}
        </ul>
      </section>
    `;

    this.append(template.content.cloneNode(true));
    this.listItems = this.querySelectorAll("li");
  }

  disconnectedCallback() {
    window.removeEventListener("data-loaded", this.render);
    window.removeEventListener(
      "technology-tab-changed",
      this.handleTechnologyTabChange as unknown as EventListener,
    );
    this.removeEventListener("pointerdown", this.handleMouseDown);
    this.removeEventListener("pointermove", this.handleMouseMove);
    this.removeEventListener("pointerup", this.handleMouseUp);
  }
}

customElements.define("technology-page", Technology);
