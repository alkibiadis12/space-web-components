import store from "../../store/Store";

export default class Link extends HTMLElement {
  protected aEl: HTMLAnchorElement | null;

  constructor() {
    super();
    this.aEl = null;
    this.handleClick = this.handleClick.bind(this);
  }

  // Core logic for managing href attribute
  get href(): string | null {
    return this.getAttribute("href");
  }

  set href(value: string) {
    this.setAttribute("href", value);
  }

  connectedCallback() {
    this.render();

    this.aEl = this.querySelector("a");
    if (this.aEl) {
      this.aEl.addEventListener("click", this.handleClick);
    }
  }

  // Method to be overridden by child components
  render() {
    this.innerHTML = `
      <a href="${this.href ? this.href : "#"}"></a>
    `;
  }

  handleClick(e: Event) {
    store.updateURL(e); // Or any common behavior across link components
  }

  disconnectedCallback() {
    if (this.aEl) {
      this.aEl.removeEventListener("click", this.handleClick);
    }
  }
}

customElements.define("base-link", Link);
