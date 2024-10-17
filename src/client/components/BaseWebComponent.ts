import { css, html } from "../utils/templateHelpers";
import store from "../store/Store";
import { Data } from "../store/interfaces";

//============STYLE=================
const styleObj = css`
  :host {
  }
`;

//============HTML=================
const createInnerHTML = (data: Data) => html`
  <style>
    ${styleObj}
  </style>
  <p>${data?.name || "name not set"}</p>
  <!-- <slot name="slot">TO BE REPLACED </slot> -->
`;
//==============COMPONENT================

export default class BaseWebComponent extends HTMLElement {
  //========================================================================
  private root: ShadowRoot;
  private firstRender: boolean;
  private pElement: HTMLParagraphElement | null;
  private linkElement: HTMLLinkElement | null;
  //========================================================================
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "closed" });
    //SETTING LOCAL VAR INITIALIZATION
    this.firstRender = true;
    //HTML ELEMENTS INITIALIZATION
    this.pElement = null;
    this.linkElement = null;
    //BINDING FUNCTIONS
    this.handleStateChange_data = this.handleStateChange_data.bind(this);
  }

  //========================================================================
  //ATTRIBUTES
  static get observedAttributes() {
    //list of allowed attributes
    return ["bgcolor", "globalstyles"];
  }

  get bgcolor(): string | null {
    return this.getAttribute("bgcolor");
  }
  set bgcolor(value: string) {
    this.setAttribute("bgcolor", value);
  }

  attributeChangedCallback(
    attrName: string,
    oldValue: string,
    newValue: string
  ) {
    if (attrName.toLowerCase() === "bgcolor" && oldValue !== newValue) {
      this.style.setProperty("--background-color", newValue);
    }
    if (attrName.toLowerCase() === "globalstyles") {
      if (this.linkElement === null) {
        this.linkElement = document.createElement("link");
        this.linkElement.rel = "stylesheet";
        this.linkElement.href = "css/style.css";
        this.root.appendChild(this.linkElement);
      }
    }
  }

  //========================================================================
  connectedCallback() {
    //INITIAL RENDER
    this.render(store.getData());

    //Add event listeners below

    //STATE CHANGE - data
    window.addEventListener("stateChanged-data", this.handleStateChange_data);
  }

  //========================================================================
  render(data: Data) {
    if (this.firstRender) {
      const template = document.createElement("template");
      template.innerHTML = createInnerHTML(data);
      this.root.append(template.content.cloneNode(true));
      this.pElement = this.root.querySelector("p");
      this.firstRender = false;
    } else {
      this.pElement!.textContent = data.name || "name is not set";
    }
  }

  //========================================================================
  //FUNCTIONS FOR EVENT LISTENERS
  handleStateChange_data(event: Event) {
    const customEvent = event as CustomEvent<Data>; // Type assertion to CustomEvent
    this.render(customEvent.detail);
  }

  handleEvent(e: Event) {}

  //========================================================================
  disconnectedCallback() {
    window.removeEventListener(
      "stateChanged-data",
      this.handleStateChange_data
    );
  }
}

//END OF COMPONENT
//========================================================================

customElements.define("base-web-component", BaseWebComponent);
