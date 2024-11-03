import Link from "./base/Link";

class NumberedTitleLink extends Link {
  get number(): string | null {
    return this.getAttribute("number");
  }

  set number(val: string) {
    this.setAttribute("number", val);
  }

  get text(): string | null {
    return this.getAttribute("text");
  }

  set text(val: string) {
    this.setAttribute("text", val);
  }

  render() {
    this.innerHTML = "";
    const template = document.createElement("template");
    template.innerHTML = `
      <a class=
      'text-white 
      font-sans_cond 
      uppercase 
      text-base 
      tracking-normal 
      sm:tracking-wide 
      lg:tracking-widest 
      sm:text-lg 
      lg:text-xl 
      2xl:text-2xl
      focus:outline-none' 
      href=${this.href}
      role="navigation">
      <span class='mr-[.5em] bg-opacity-30 font-bold'>${this.number}</span>${this.text}</a>
    `;
    this.append(template.content.cloneNode(true));
  }
}

customElements.define("numbered-title-link", NumberedTitleLink);
