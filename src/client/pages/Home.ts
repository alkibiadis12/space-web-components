//==============COMPONENT================

export default class Home extends HTMLElement {
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
    template.innerHTML = `<my-tabs></my-tabs>`;

    this.append(template.content.cloneNode(true));
  }
}

//END OF COMPONENT
//========================================================================

customElements.define("home-page", Home);
