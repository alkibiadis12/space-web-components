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

      window.addEventListener("url-changed", (e: Event) => {
        const customEvent = e as CustomEvent;
        this.styleEl!.textContent = `a {
          cursor: ${customEvent.detail === this.href ? "not-allowed" : "pointer"}}
        `;
      });
    }
  }
  //===================================================
  render() {
    const template = document.createElement("template");
    const anchor = document.createElement("a");
    const style = document.createElement("style");
    style.textContent = `
       a {
        cursor: ${window.location.pathname === this.href ? "not-allowed" : "pointer"}
       }`;
    anchor.textContent = this.textContent || "Link";
    if (this.href) anchor.href = this.href;
    template.content.appendChild(style);
    template.content.appendChild(anchor);
    this.root.append(template.content.cloneNode(true));
    this.firstRender = false;
  }

  //===================================================
  //SEND CUSTOM EVENT WHEN URL CHANGES
  dispatchURLChangeEvent(url_pathname: string) {
    const event = new CustomEvent("url-changed", {
      detail: url_pathname,
    });
    window.dispatchEvent(event);
  }
  //===================================================

  handleClick(e: Event) {
    e.preventDefault();
    const target = e.target as HTMLAnchorElement;

    if (target && target.href) {
      const url = new URL(target.href);

      // Ensure that the link is internal (within the same origin)
      if (url.origin === window.location.origin) {
        e.preventDefault(); // Prevent the browser from performing the default navigation

        // Use pushState to change the URL without reloading the page

        if (window.location.pathname !== url.pathname) {
          history.pushState({}, "", url.pathname);
          this.dispatchURLChangeEvent(url.pathname);
        }
      }
    }
  }

  //===================================================
  disconnectedCallback() {
    this.aEl!.removeEventListener("click", (e) => this.handleClick(e));
  }
}

customElements.define("my-link", Link);