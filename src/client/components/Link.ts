import store from "../store/Store";

class Link extends HTMLElement {
  private root: ShadowRoot;
  private firstRender: boolean;
  private aEl: HTMLAnchorElement | null;
  private styleEl: HTMLStyleElement | null;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "closed" });
    this.firstRender = true;
    this.aEl = null;
    this.styleEl = null;
  }

  //===================================================
  static getObservedAttributes() {
    return ["href", "textcontent"];
  }

  get href(): string | null {
    return this.getAttribute("href");
  }

  set href(value: string) {
    this.setAttribute("href", value);
  }

  get textContent(): string | null {
    return this.getAttribute("textContent");
  }

  set textContent(value: string) {
    this.setAttribute("textContent", value);
  }
  //===================================================
  connectedCallback() {
    if (this.firstRender) this.render();

    if (!this.firstRender) {
      if (!this.aEl) this.aEl = this.root.querySelector("a")!;
      if (!this.styleEl) this.styleEl = this.root.querySelector("style");
      this.aEl!.addEventListener("click", (e) => this.handleClick(e));

      //TODO use it to change active, non active style
      // window.addEventListener("url-changed", (e: Event) => {
      //   const customEvent = e as CustomEvent;
      // });
    }
  }
  //===================================================
  render() {
    const template = document.createElement("template");
    const anchor = document.createElement("a");
    const style = document.createElement("style");
    // style.textContent = ``
    anchor.textContent = this.textContent || "Link";
    if (this.href) anchor.href = this.href;
    template.content.appendChild(style);
    template.content.appendChild(anchor);
    this.root.append(template.content.cloneNode(true));
    this.firstRender = false;
  }

  //===================================================
  handleClick(e: Event) {
    store.updateURL(e);
  }

  //===================================================
  disconnectedCallback() {
    this.aEl!.removeEventListener("click", (e) => this.handleClick(e));
  }
}

customElements.define("my-link", Link);
