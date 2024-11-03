import Link from "./base/Link";

class ExploreLink extends Link {
  set href(value: string) {
    this.setAttribute("href", value);
  }

  get href(): string | null {
    return this.getAttribute("href");
  }

  render() {
    this.innerHTML = "";
    const template = document.createElement("template");
    template.innerHTML = `<div class='size-36 sm:size-52 xl:size-60 2xl:size-80'><a 
     aria-label="Explore destinations"
    class="explore-link uppercase font-serif text-xs sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl text-slate-950 bg-white focus:outline-none"
    href=${this.href ? this.href : "#"}>
    <span>Explore</span>
    </a></div>`;
    this.append(template.content.cloneNode(true));
  }
}

customElements.define("explore-link", ExploreLink);
