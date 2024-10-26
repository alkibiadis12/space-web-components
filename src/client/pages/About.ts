//==============COMPONENT================

export default class About extends HTMLElement {
  //========================================================================
  constructor() {
    super();
  }
  //========================================================================
  connectedCallback() {
    //INITIAL RENDER
    this.render();

    //Add event listeners below
  }

  //========================================================================
  render() {
    this.innerHTML = "";
    const template = document.createElement("template");
    template.innerHTML = `<h1 class='text-white text-lg'>ABOUT PAGE</h1>`;
    this.append(template.content.cloneNode(true));
  }
}
//END OF COMPONENT
//========================================================================

customElements.define("about-page", About);
