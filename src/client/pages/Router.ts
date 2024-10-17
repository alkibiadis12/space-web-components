import "../components/header";
import "./Home";
import "./About";

//==============COMPONENT================

export default class Router extends HTMLElement {
  //========================================================================
  private root: ShadowRoot;

  //========================================================================
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "closed" });
  }
  //========================================================================
  connectedCallback() {
    //INITIAL RENDER
    this.render(window.location.pathname);

    window.addEventListener("url-changed", (e: Event) => {
      const customEvent = e as CustomEvent;
      this.render(customEvent.detail);
    });
  }

  //========================================================================
  render(url: String) {
    const template = document.createElement("template");

    switch (url) {
      case "/": {
        console.log("Inside home");
        template.content.appendChild(document.createElement("home-page"));
        break;
      }

      case "/about": {
        console.log("Inside about");
        template.content.appendChild(document.createElement("about-page"));
        break;
      }
    }
    if (this.root.firstChild) this.root.removeChild(this.root.firstChild);
    this.root.append(template.content.cloneNode(true));
  }
  //========================================================================
}
//END OF COMPONENT
//========================================================================

customElements.define("my-router", Router);
