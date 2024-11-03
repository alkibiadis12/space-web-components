import { State } from "./interfaces";
import { readDataFromJSON } from "./asyncDataLoading";

class Store {
  private state: State;

  //==================================
  //INITIALIZATION
  constructor() {
    this.state = {
      url: {
        pathname: "/",
      },
      crew: [],
      selectedCrewTabIndex: 0,
      destinations: [],
      technology: [],
      selectedTechnologyTabIndex: 0,
    };
  }

  //==================================
  //INITIALIZE ASYNC VALUES

  async setPageData() {
    const { crew, technology, destinations } = await readDataFromJSON();
    this.state.destinations = destinations;
    this.state.crew = crew;
    this.state.technology = technology;
    this._dispatchDataLoadedEvent();
  }

  //==================================
  //GET METHODS
  getURL() {
    return this.state.url;
  }

  getDestinations() {
    return this.state.destinations;
  }

  getCrew() {
    return this.state.crew;
  }

  getTechnology() {
    return this.state.technology;
  }

  //==================================
  //UPDATE METHODS
  updateURL(e: Event) {
    e.preventDefault();
    const target = (e.target as HTMLElement).closest("a");

    if (target && target.href) {
      const newURL = new URL(target.href);

      // Ensure that the link is internal (within the same origin)
      if (newURL.origin === window.location.origin) {
        // Use pushState to change the URL without reloading the page

        if (window.location.origin !== newURL.pathname) {
          this.state.url = { ...this.state.url, pathname: newURL.pathname };
          history.pushState({}, "", newURL.pathname);
          this._dispatchURLChangeEvent();
        }
      }
    }
  }

  updateSelectedCrewTabIndex(selectedIndex: number) {
    this.state.selectedCrewTabIndex = selectedIndex;
    this._dispatchCrewSliderEvent(this.state.selectedCrewTabIndex);
  }

  incSelectedCrewTabIndex() {
    this.state.selectedCrewTabIndex = (this.state.selectedCrewTabIndex + 1) % 4; // Cycle through 0 to 3
    this._dispatchCrewSliderEvent(
      this.state.selectedCrewTabIndex,
      "mouse-right",
    );
  }

  decSelectedCrewTabIndex() {
    if (this.state.selectedCrewTabIndex === 0) {
      this.state.selectedCrewTabIndex = 3; // Go to the last index (3) if at the start
    } else {
      this.state.selectedCrewTabIndex--;
    }
    this._dispatchCrewSliderEvent(
      this.state.selectedCrewTabIndex,
      "mouse-left",
    );
  }

  updateSelectedTechnologyTabIndex(selectedIndex: number) {
    this.state.selectedTechnologyTabIndex = selectedIndex;
    this._dispatchTechnologyTabChangeEvent(selectedIndex);
  }

  incSelectedTechnologyTabIndex() {
    this.state.selectedTechnologyTabIndex =
      (this.state.selectedTechnologyTabIndex + 1) % 3;
    this._dispatchTechnologyTabChangeEvent(
      this.state.selectedTechnologyTabIndex,
      "mouse-bottom",
    );
  }

  decSelectedTechnologyTabIndex() {
    if (this.state.selectedTechnologyTabIndex === 0) {
      this.state.selectedTechnologyTabIndex = 2;
    } else {
      this.state.selectedTechnologyTabIndex--;
    }
    this._dispatchTechnologyTabChangeEvent(
      this.state.selectedTechnologyTabIndex,
      "mouse-top",
    );
  }

  //==================================
  //CUSTOM EVENTS
  _dispatchURLChangeEvent() {
    const event = new CustomEvent("url-changed", {
      detail: this.state.url.pathname,
    });
    window.dispatchEvent(event);
  }

  _dispatchDataLoadedEvent() {
    const event = new CustomEvent("data-loaded");
    window.dispatchEvent(event);
  }

  dispatchDestinationTabClickedEvent(destinationIndex: number) {
    const event = new CustomEvent("destination-tab-clicked", {
      detail: this.state.destinations[destinationIndex]
        ? this.state.destinations[destinationIndex]
        : undefined,
    });
    window.dispatchEvent(event);
  }

  _dispatchCrewSliderEvent(crewIndex: number, mode = "default") {
    const event = new CustomEvent("crew-slider-changed", {
      detail: {
        crewIndex,
        mode,
      },
    });
    window.dispatchEvent(event);
  }

  _dispatchTechnologyTabChangeEvent(technologyIndex: number, mode = "default") {
    const event = new CustomEvent("technology-tab-changed", {
      detail: {
        technologyIndex,
        mode,
      },
    });
    window.dispatchEvent(event);
  }
}

//==================================

const store = new Store();

//==================================
// (async () => {
//   await store.setPageData();
// })();

//==================================

export default store;
