import store from "../store/Store";

export default class Crew extends HTMLElement {
  private listItems: NodeListOf<HTMLLIElement> | null;
  private isDragging: boolean;
  private startX: number;
  private threshold: number;

  constructor() {
    super();
    this.render = this.render.bind(this);
    this.listItems = null;
    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.isDragging = false;
    this.startX = 0;
    this.threshold = 200;
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  //===============================================================

  connectedCallback() {
    this.render();

    window.addEventListener("data-loaded", this.render);

    this.addEventListener("pointerdown", this.handleMouseDown);
    this.addEventListener("pointermove", this.handleMouseMove);
    this.addEventListener("pointerup", this.handleMouseUp);

    window.addEventListener(
      "crew-slider-changed",
      this.handleSliderChange as unknown as EventListener,
    );
  }

  //===============================================================
  //FUNCTIONS

  handleMouseDown(event: MouseEvent) {
    // Checks if it's a left-click (button code 0)
    if (event.button === 0) {
      event.preventDefault();
      this.isDragging = true;
      this.startX = event.clientX;
    }
  }

  handleMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      event.preventDefault();
      const currentX = event.clientX;
      const deltaX = currentX - this.startX;

      if (Math.abs(deltaX) > this.threshold) {
        if (deltaX > 0) {
          store.incSelectedCrewTabIndex();
        } else if (deltaX < 0) {
          store.decSelectedCrewTabIndex();
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

  async handleSliderChange(event: CustomEvent) {
    const selectedIndex = event.detail.crewIndex;
    let previousSelectedIndex: number;

    if (this.listItems) {
      //USING FOR BECAUSE OF ASYNC
      for (let index = 0; index < this.listItems.length; index++) {
        const item = this.listItems[index];
        const isSelected = selectedIndex === index;

        //THE PREVIOUS SELECTION
        if (!isSelected && !item.classList.contains("hidden")) {
          previousSelectedIndex = index;

          //ADD EXIT ANIMATION TO THE PREVIOUS SELECTED ELEMENT
          await new Promise((resolve) => {
            if (`${event.detail.mode}`.startsWith("mouse")) {
              if (event.detail.mode === "mouse-right")
                item.classList.add("slide-in-middle-to-right");
              if (event.detail.mode === "mouse-left")
                item.classList.add("slide-in-middle-to-left");
            } else {
              if (previousSelectedIndex < selectedIndex) {
                item.classList.add("slide-in-middle-to-right");
              } else {
                item.classList.add("slide-in-middle-to-left");
              }
            }

            item.addEventListener("animationend", resolve, { once: true });
          });
          //AFTER THE END OF EXIT ANIMATION REMOVE ANIMATIONS AND MAKE THE LI HIDDEN
          item.classList.remove("slide-in-middle-to-right");
          item.classList.remove("slide-in-middle-to-left");
          item.classList.add("hidden");
          item.classList.remove("slide-left-to-middle");
          item.classList.remove("slide-right-to-middle");
        }
      }

      this.listItems.forEach((item, index) => {
        const isSelected = selectedIndex === index;

        //MAKE SELECTED ITEM VISIBLE
        if (isSelected) {
          item.classList.remove("hidden");

          //ADD ANIMATION WHEN IT APPEARS
          if (`${event.detail.mode}`.startsWith("mouse")) {
            if (event.detail.mode === "mouse-right")
              item.classList.add("slide-left-to-middle");
            if (event.detail.mode === "mouse-left")
              item.classList.add("slide-right-to-middle");
          } else {
            if (selectedIndex < previousSelectedIndex) {
              item.classList.add("slide-right-to-middle");
            } else {
              item.classList.add("slide-left-to-middle");
            }
          }
        }
      });
    }
  }

  //===============================================================
  //RENDER

  render() {
    this.innerHTML = "";
    const template = document.createElement("template");

    const crew = store.getCrew();

    if (crew.length === 0) {
      template.innerHTML = `<loading-spinner></loading-spinner>`;
      this.append(template.content.cloneNode(true));
      return;
    }

    template.innerHTML = /* HTML */ `
      <section class="max-h-[650px]">
        <h2
          class="focus:outline-none' text-center font-sans_cond text-xl uppercase tracking-normal text-white sm:tracking-wide md:text-start lg:tracking-widest 2xl:text-2xl"
        >
          <span class="mr-[.5em] font-bold text-white/50" aria-hidden="true">
            02
          </span>
          Meet your crew
        </h2>
        <div class="mt-10 flex justify-center lg:hidden">
          <dot-indicators></dot-indicators>
        </div>
        <ul role="tablist" aria-label="Crew members">
          ${crew
            .map((c, index) => {
              return /* HTML */ `
                <li
                  role="tabpanel"
                  tabindex="${index === 0 ? "0" : "-1"}"
                  aria-labelledby="crew-member-${index}"
                  aria-hidden="${index !== 0}"
                  class="${index !== 0 ? "hidden" : ""} cursor-pointer"
                >
                  <div class="mt-16 grid lg:mt-20 lg:grid-cols-2 2xl:mt-40">
                    <div>
                      <h1
                        class="text-center font-serif text-xl uppercase text-white/50 md:text-2xl lg:text-start lg:text-3xl"
                      >
                        ${c.role}
                        <span
                          class="block pt-1 text-3xl text-white md:pt-3 md:text-5xl xl:text-6xl"
                        >
                          ${c.name}
                        </span>
                      </h1>
                      <p
                        class="max-w-sm pt-5 text-center font-sans leading-7 text-indigo-200 md:mx-auto md:max-w-md lg:mx-0 lg:text-start"
                      >
                        ${c.bio}
                      </p>
                    </div>

                    <div
                      class="mt-10 max-h-[300px] w-full md:max-h-[490px] xl:mt-0 xl:w-fit"
                    >
                      <img
                        src=${c.images.webp}
                        alt="Image of ${c.role}, ${c.name}"
                        class="gradient-mask h-full w-full object-contain mix-blend-multiply"
                      />
                    </div>
                  </div>
                </li>
              `;
            })
            .join(" ")}
        </ul>
        <dot-indicators class="hidden lg:block"></dot-indicators>
      </section>
    `;
    this.append(template.content.cloneNode(true));

    this.listItems = this.querySelectorAll("li");
  }

  //===============================================================

  disconnectedCallback() {
    if (this.listItems) {
      window.removeEventListener(
        "crew-slider-changed",
        this.handleSliderChange as unknown as EventListener,
      );
    }

    window.removeEventListener("data-loaded", this.render);
    this.removeEventListener("pointerdown", this.handleMouseDown);
    this.removeEventListener("pointermove", this.handleMouseMove);
    this.removeEventListener("pointerup", this.handleMouseUp);
  }
}

customElements.define("crew-page", Crew);
