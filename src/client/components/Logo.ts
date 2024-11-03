import Link from "./base/Link";

class Logo extends Link {
  render() {
    this.innerHTML = "";
    const template = document.createElement("template");
    template.innerHTML = `
    <div class="flex justify-center items-center">
     <a href=${this.href} aria-label="Go to homepage" class="size-12 md:size-16 lg:size-20 focus:outline-none border-2 focus:border-white  border-transparent  rounded-full p-2  transition-colors duration-500 ease">
      <img src='/assets/shared/logo.svg' alt='space tourism logo' class="w-full h-full object-contain" />
     </a>
     </div>
    `;
    this.append(template.content.cloneNode(true));
  }
}

customElements.define("my-logo", Logo);
