import store from "../store/Store";

export default class Destination extends HTMLElement {
  private destinationName: HTMLHeadingElement | null;
  private destinationDesc: HTMLParagraphElement | null;
  private destinationImage: HTMLImageElement | null;
  private destinationTravel: HTMLSpanElement | null;
  private destinationDist: HTMLSpanElement | null;

  constructor() {
    super();
    this.handleDestinationChange = this.handleDestinationChange.bind(this);
    this.handleDataLoaded = this.handleDataLoaded.bind(this);
    this.destinationName = null;
    this.destinationDesc = null;
    this.destinationImage = null;
    this.destinationTravel = null;
    this.destinationDist = null;
  }

  connectedCallback() {
    this.render();

    window.addEventListener("data-loaded", this.handleDataLoaded);

    window.addEventListener(
      "destination-tab-clicked",
      this.handleDestinationChange as EventListener,
    );
  }

  handleDestinationChange(event: CustomEvent) {
    const { name, description, images, distance, travel } = event.detail;

    const crossfadeAndChangeContent = (
      element: HTMLElement | null,
      newValue: string,
      isImage = false,
    ) => {
      if (element) {
        // Apply crossfade-out animation
        element.classList.add("crossfade-out");

        // Wait for the crossfade-out animation to end before updating
        element.addEventListener(
          "animationend",
          () => {
            // Update content after crossfade-out
            if (isImage) {
              (element as HTMLImageElement).src = newValue;
            } else {
              element.textContent = newValue;
            }

            // Remove crossfade-out, apply crossfade-in for smooth transition
            element.classList.remove("crossfade-out");
            element.classList.add("crossfade-in");

            // Remove crossfade-in after animation ends to reset
            element.addEventListener(
              "animationend",
              () => {
                element.classList.remove("crossfade-in");
              },
              { once: true },
            );
          },
          { once: true },
        );
      }
    };

    // Apply animations and update content
    crossfadeAndChangeContent(this.destinationName, name);
    crossfadeAndChangeContent(this.destinationDesc, description);
    crossfadeAndChangeContent(this.destinationImage, images.webp, true);
    crossfadeAndChangeContent(this.destinationDist, distance);
    crossfadeAndChangeContent(this.destinationTravel, travel);
  }

  handleDataLoaded() {
    this.render();
  }

  render() {
    this.innerHTML = "";
    const template = document.createElement("template");

    const destinations = store.getDestinations();

    if (destinations.length === 0) {
      template.innerHTML = `<loading-spinner></loading-spinner>`;
      this.append(template.content.cloneNode(true));
      return;
    }

    template.innerHTML = /* HTML */ `
      <section role="region" style="--animation-duration: 0.2s ">
        <h2
          aria-label="Choose a travel destination"
          class="focus:outline-none' text-center font-sans_cond text-2xl uppercase tracking-normal text-white sm:tracking-wide md:text-start md:text-xl lg:tracking-widest 2xl:text-2xl"
        >
          <span class="mr-[.5em] font-bold text-white/50" aria-hidden="true">
            01
          </span>
          Pick your destination
        </h2>
        <div
          class="mt-14 grid md:mt-20 lg:grid-cols-2 2xl:mt-40"
          role="main"
          aria-labelledby="main-destination"
        >
          <div class="mx-auto size-56 md:block md:size-72 lg:mx-0 lg:size-fit">
            <img
              class="destination-image h-full w-full object-contain"
              src="${destinations[0].images.webp} "
              alt="Image of ${destinations[0].name}"
              role="img"
              aria-live="polite"
              aria-label="Visual representation of ${destinations[0].name}"
            />
          </div>
          <div
            class="mt-5 flex flex-col items-center gap-5 md:mt-10 lg:mt-0 lg:items-stretch"
          >
            <destination-tabs
              role="tablist"
              aria-label="Destination selection tabs"
            ></destination-tabs>
            <h1
              class="destination-name mt-5 font-serif text-6xl uppercase text-white md:text-7xl lg:text-8xl"
              aria-labelledby="destination-name-label"
            >
              ${destinations[0].name}
            </h1>
            <p
              class="destination-description max-w-sm text-center font-sans leading-7 text-indigo-200 lg:max-w-md lg:text-start"
              aria-describedby="destination-name-label"
            >
              ${destinations[0].description}
            </p>
            <hr
              class="mt-3 block w-full border-gray-300 md:max-w-md md:border-gray-700"
            />

            <div
              class="mt-1 flex max-w-xs flex-col gap-3 md:mt-3 md:flex-row md:justify-between md:gap-10 lg:gap-0"
            >
              <div>
                <span
                  class="block text-center font-sans_cond text-sm uppercase text-indigo-200 lg:text-start"
                >
                  avg. distance
                </span>
                <span
                  class="destination-distance block text-center font-serif text-xl uppercase text-white md:text-2xl lg:text-start"
                >
                  ${destinations[0].distance}
                </span>
              </div>
              <div>
                <span
                  class="block text-center font-sans_cond text-sm uppercase text-indigo-200 lg:text-start"
                >
                  est. travel time
                </span>
                <span
                  class="destination-travel block text-center font-serif text-xl uppercase text-white md:text-2xl lg:text-start"
                >
                  ${destinations[0].travel}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
    this.append(template.content.cloneNode(true));

    this.destinationName = this.querySelector(".destination-name");
    this.destinationDesc = this.querySelector(".destination-description");
    this.destinationImage = this.querySelector(".destination-image");
    this.destinationTravel = this.querySelector(".destination-travel");
    this.destinationDist = this.querySelector(".destination-distance");
  }

  disconnectedCallback() {
    window.removeEventListener("data-loaded", this.handleDataLoaded);

    window.removeEventListener(
      "destination-tab-clicked",
      this.handleDestinationChange as EventListener,
    );
  }
}

customElements.define("destination-page", Destination);
