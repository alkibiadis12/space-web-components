import Link from "./base/Link";

class ExploreLink extends Link {
  constructor() {
    super();
  }

  render() {
    this.innerHTML = "";
    const template = document.createElement("template");
    template.innerHTML = `<div class='size-24 sm:size-32 lg:size-36 xl:size-40 2xl:size-44'><a 
    class="explore-link uppercase font-serif text-xs sm:text-base lg:text-lg xl:text-xl text-slate-950 bg-white focus:outline-none"
    href=${this.href ? this.href : "#"}>
    <span>Explore</span>
    </a><div>`;
    this.append(template.content.cloneNode(true));
  }
}

customElements.define("explore-link", ExploreLink);
