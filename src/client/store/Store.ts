import { State } from "./interfaces";

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
    };
  }

  //==================================
  //GET METHODS
  getURL() {
    return this.state.url;
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
          this._dispatchURLChangeEvent(newURL.pathname);
        }
      }
    }
  }

  //==================================
  //CUSTOM EVENTS
  _dispatchURLChangeEvent(url_pathname: string) {
    const event = new CustomEvent("url-changed", {
      detail: this.state.url.pathname,
    });
    window.dispatchEvent(event);
  }
}

//==================================

const store = new Store();

export default store;
