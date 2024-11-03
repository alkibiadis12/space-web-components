//==============COMPONENT================

export default class ErrorPage extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = ``;
    const template = document.createElement("template");
    template.innerHTML = /* HTML */ `
      <section class="mt-44" role="alert" aria-live="assertive">
        <h1 class="text-center font-sans text-5xl text-white">
          <span class="font-sans text-6xl text-red-600">Error 404</span>
          . Page does not exist!
        </h1>
        <p class="mt-5 text-center font-sans text-lg text-indigo-200">
          Sorry, the page you're looking for cannot be found. Please check the
          URL or go back
          <a href="/" class="text-indigo-400 underline hover:text-indigo-600">
            Home
          </a>
          .
        </p>
      </section>
    `;
    this.append(template.content.cloneNode(true));
  }
}

customElements.define("error-page", ErrorPage);
