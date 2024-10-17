export default class Header extends HTMLElement {
  private root: ShadowRoot;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "closed" });
    //SETTING LOCAL VAR INITIALIZATION
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const navEl = document.createElement("nav");
    const aEl = document.createElement("a");
    aEl.href = "/about";
    aEl.textContent = "About";
    navEl.appendChild(aEl);
    const template = document.createElement("template");
    const style = document.createElement("style");
    style.textContent = `
    :host {
      display: block;
      width: 200px;
      height: 50px;
      border: 1px solid black;
    }`;
    template.content.appendChild(style);
    template.content.appendChild(navEl);
    this.root.appendChild(template.content.cloneNode(true));
  }
}

customElements.define("my-header", Header);
