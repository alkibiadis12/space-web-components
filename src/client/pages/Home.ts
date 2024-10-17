//==============COMPONENT================

export default class Home extends HTMLElement {
  //========================================================================
  private root: ShadowRoot;

  //========================================================================
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "closed" });
    //SETTING LOCAL VAR INITIALIZATION

    //HTML ELEMENTS INITIALIZATION
  }
  //========================================================================
  connectedCallback() {
    //INITIAL RENDER
    this.render();

    //Add event listeners below
  }

  //========================================================================
  render() {
    const template = document.createElement("template");
    const h1Element = document.createElement("h1");
    h1Element.textContent = "Home Page";
    template.content.appendChild(h1Element);
    this.root.append(template.content.cloneNode(true));
  }
}

//END OF COMPONENT
//========================================================================

customElements.define("home-page", Home);
