import { State, Data } from "./interfaces";

class Store {
  //==================================
  //TYPES
  private state: State;

  //==================================
  //INITIALIZATION
  constructor() {
    this.state = {
      url: {
        pathname: "/",
      },
      data: {
        name: "Kurapika",
      },
    };
  }

  //==================================
  //GET METHODS
  getURL() {
    return this.state.url;
  }

  getData() {
    return this.state.data;
  }

  //==================================
  //UPDATE METHODS
  updateURL(e: Event) {
    e.preventDefault();
    const target = e.target as HTMLAnchorElement;

    if (target && target.href) {
      const newURL = new URL(target.href);

      // Ensure that the link is internal (within the same origin)
      if (newURL.origin === window.location.origin) {
        // Use pushState to change the URL without reloading the page

        if (window.location.origin !== newURL.pathname) {
          this.state.url = { ...this.state.url, pathname: newURL.pathname };
          history.pushState({}, "", newURL.pathname);
          this._dispatchURLChangeEvent(newURL.pathname);
        }
      }
    }
  }

  updateData(newData: Data) {
    this.state.data = { ...this.state.data, ...newData };
    this._dispatchDataChangeEvent();
  }
  //==================================
  //CUSTOM EVENTS
  _dispatchURLChangeEvent(url_pathname: string) {
    const event = new CustomEvent("url-changed", {
      detail: this.state.url.pathname,
    });
    window.dispatchEvent(event);
  }

  _dispatchDataChangeEvent() {
    const event = new CustomEvent("stateChanged-data", {
      detail: this.state.data,
    });
    window.dispatchEvent(event);
  }
}

//==================================

const store = new Store();

export default store;
