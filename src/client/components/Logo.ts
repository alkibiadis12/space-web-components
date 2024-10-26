import Link from "./base/Link";

class Logo extends Link {
  constructor() {
    super();
  }

  render() {
    this.innerHTML = "";
    const template = document.createElement("template");
    template.innerHTML = `
     <a  href=${this.href} class='explore-link focus:outline-none'>
      <img src='/assets/shared/logo.svg' alt='space tourism logo' class='size-8 md:size-10 lg:size-12 xl:size-14' />
     </a>
    `;
    this.append(template.content.cloneNode(true));
  }
}

customElements.define("my-logo", Logo);
