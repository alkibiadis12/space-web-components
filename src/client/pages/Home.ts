export default class Home extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = "";
    const template = document.createElement("template");
    template.innerHTML = `
      <section role="region"  class="md:mt-40 lg:mt-80 grid lg:grid-cols-2 items-center justify-center lg:justify-normal">
        <div class="grid gap-10">
          <h1 class="font-sans_cond text-lg md:text-2xl uppercase tracking-wider text-indigo-200 text-center  lg:text-start">
            So, you want to travel to
            <span class="font-serif text-7xl md:text-9xl text-white block mt-5">space</span>
          </h1>
          <p class="text-center lg:text-start max-w-sm md:max-w-md lg:max-w-lg font-sans leading-7 text-indigo-200">
            Let’s face it. If you want to go to space, you might as well genuinely go to outer space and not hover on the edge of it.
            Sit back and relax because we’ll give you a truly out of this world experience!
          </p>
        </div>
        <explore-link class="justify-self-center mt-11 md:mt-14 lg:mt-0 lg:justify-self-end" href="/destination"></explore-link>
      </section>
    `;

    this.append(template.content.cloneNode(true));
  }
}

customElements.define("home-page", Home);
