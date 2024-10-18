import("./Home");

export default class Router extends HTMLElement {
  //========================================================================
  private root: ShadowRoot;

  //========================================================================
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "closed" });
    this.handleURLChange = this.handleURLChange.bind(this);
    this.handlePopState = this.handlePopState.bind(this);
  }
  //========================================================================
  connectedCallback() {
    //INITIAL RENDER
    this.render(window.location.pathname);

    window.addEventListener("url-changed", this.handleURLChange);

    // Listen for browser back/forward navigation using popstate
    window.addEventListener("popstate", this.handlePopState);
  }

  //========================================================================
  async render(url: String) {
    const template = document.createElement("template");

    switch (url) {
      case "/": {
        template.content.appendChild(document.createElement("home-page"));
        break;
      }

      case "/about": {
        await import("./About");
        template.content.appendChild(document.createElement("about-page"));
        break;
      }

      default: {
        await import("./Error");
        template.content.appendChild(document.createElement("error-page"));
        break;
      }
    }

    if (this.root.firstChild) this.root.removeChild(this.root.firstChild);
    this.root.append(template.content.cloneNode(true));
  }
  //========================================================================
  //FUNCTIONS
  handleURLChange(e: Event) {
    const customEvent = e as CustomEvent;
    this.render(customEvent.detail);
  }

  handlePopState() {
    this.render(window.location.pathname);
  }

  //========================================================================
  disconnectedCallback() {
    // Remove event listeners
    window.removeEventListener("url-changed", this.handleURLChange);
    window.removeEventListener("popstate", this.handlePopState);
  }
}
//END OF COMPONENT
//========================================================================

customElements.define("my-router", Router);
