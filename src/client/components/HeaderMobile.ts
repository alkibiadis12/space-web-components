class HeaderMobile extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = "";
    const template = document.createElement("template");
    template.innerHTML = `
     <header class='md:hidden p-3 flex justify-between px-4'>
      <my-logo href='/' class='size-8'></my-logo>
      <button class='bg-red block text-white '>
        <img src="/assets/shared/icon-hamburger.svg" alt="Hamburger Menu" ' />
        <span class='sr-only'>Open menu</span>
      </button>
      </header>
    `;
    this.appendChild(template.content.cloneNode(true));
  }
}

customElements.define("my-header-mobile", HeaderMobile);
