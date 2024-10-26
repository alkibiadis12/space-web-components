class Header extends HTMLElement {
  private anchors: NodeList | null;

  constructor() {
    super();

    this.handleChange = this.handleChange.bind(this);
    this.anchors = null;
  }

  connectedCallback() {
    this.render();

    window.addEventListener("url-changed", this.handleChange);
  }

  render() {
    this.innerHTML = "";
    const template = document.createElement("template");

    // Get the current page path
    const currentPath = window.location.pathname;

    template.innerHTML = `
      <header class='hidden pl-10 lg:mt-10 h-20 md:flex items-center justify-between'>
         <my-logo href='/' ></my-logo>
        <nav class=' bg-slate-800 bg-opacity-80 h-full md:grid place-items-center pl-40 pt-5'>
          <ul class='flex gap-10'>
            <li class='border-b-[0.15rem] ${currentPath === "/" ? "border-white" : "border-transparent "}hover:border-white/25 focus-within:border-white/25 pb-6  focus:outline-none'>
              <numbered-title-link
              number="00"
              text="HOME"
              href="/"
            ></numbered-title-link>
            </li>
            <li class='border-b-[0.15rem] ${currentPath === "/about" ? "border-white" : "border-transparent "}hover:border-white/25 focus-within:border-white/25 pb-6  focus:outline-none'>
              <numbered-title-link
                number="01"
                text="Destination"
                href="/about"
              ></numbered-title-link>
           </li>
           <li class='border-b-[0.15rem] ${currentPath === "/crew" ? "border-white" : "border-transparent "}hover:border-white/25 focus-within:border-white/25 pb-6  focus:outline-none'>
              <numbered-title-link
                number="02"
                text="crew"
                href="/crew"
              ></numbered-title-link>
            </li>
            <li class='border-b-[0.15rem] ${currentPath === "/technology" ? "border-white" : "border-transparent "}hover:border-white/25 focus-within:border-white/25 pb-6  focus:outline-none'>
              <numbered-title-link
                number="03"
                text="technology"
                href="/technology"
              ></numbered-title-link>
            <li>
          </ul>
        </nav>
      </header>
    `;

    this.append(template.content.cloneNode(true));
  }

  handleChange() {
    this.render();
  }
}

customElements.define("my-header", Header);
