class Header extends HTMLElement {
  private hamburger: HTMLButtonElement | null;
  private dialog: HTMLDialogElement | null;
  private exitDialog: HTMLButtonElement | null;

  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.hamburger = null;
    this.dialog = null;
    this.exitDialog = null;
    this.handleHamburgerMenu = this.handleHamburgerMenu.bind(this);
    this.handleExitDialog = this.handleExitDialog.bind(this);
    this.handleClickOutsideOfDialog =
      this.handleClickOutsideOfDialog.bind(this);
  }

  connectedCallback() {
    this.render();
    window.addEventListener("url-changed", this.handleChange);

    this.addEventListener(
      "click",
      this.handleClickOutsideOfDialog as EventListener,
    );
  }

  handleClickOutsideOfDialog(event: Event) {
    const target = event.target as Node | null;

    if (this.dialog && this.dialog.open && target && target === this.dialog) {
      this.dialog.close();
      this.hamburger?.blur();
    }
  }

  handleChange() {
    this.render();
  }

  handleHamburgerMenu() {
    if (this.dialog) {
      this.dialog.showModal();
      this.dialog.setAttribute("aria-hidden", "false");
      this.hamburger?.setAttribute("aria-expanded", "true");
      this.dialog.querySelector("button")?.focus(); // Move focus to the first focusable element in the dialog
    }
  }

  handleExitDialog() {
    if (this.dialog) {
      this.dialog.close();
      this.dialog.setAttribute("aria-hidden", "true");
      this.hamburger?.setAttribute("aria-expanded", "false");
      this.hamburger?.focus();
    }
  }

  createListItem(
    currentPath: string,
    targetPath: string,
    number: string,
    text: string,
  ): string {
    const liElement = /* HTML */ `
      <li>
        <numbered-title-link
          number=${number}
          text=${text}
          href=${targetPath}
          class="${currentPath === targetPath
            ? "border-white"
            : "border-transparent "} border-b-2 transition-colors duration-150 ease-in-out focus-within:border-white/25 hover:border-white/25 focus:outline-none md:border-b-4 md:pb-8"
        ></numbered-title-link>
      </li>
    `;
    return liElement;
  }

  render() {
    this.innerHTML = "";
    const template = document.createElement("template");

    // Get the current page path
    const currentPath = window.location.pathname;

    const ulMenu = `<ul class='flex flex-col md:flex-row  gap-10 pr-14 '>
            ${this.createListItem(currentPath, "/", "00", "Home")}
            ${this.createListItem(currentPath, "/destination", "01", "Destination")}
            ${this.createListItem(currentPath, "/crew", "02", "crew")}
            ${this.createListItem(currentPath, "/technology", "03", "technology")}
          </ul>`;

    template.innerHTML = /* HTML */ `
      <header class='px-5  md:px-0 md:p-0 md:pl-10  h-24 flex items-center justify-between md:relative'>
          <dialog aria-hidden="true" aria-labelledby="menu-title" class="bg-slate-950/80 mr-0 mt-0 h-full p-5 w-1/2 slide-right-to-middle">
              <div class="flex flex-col items-center gap-32 h-full">
                  <button aria-label="Close Menu" class="exit-dialog self-end focus:outline-none border-2 p-2 focus:border-white border-transparent rounded-full transition-colors duration-500 ease"><img src="/assets/shared/icon-close.svg" alt="Close Menu" ' /></button>
                  <nav role="navigation" aria-label="Main Menu" class="p-5" >
                    <h2 id="menu-title" class="sr-only">Main Menu</h2>
                    ${ulMenu}
                  </nav>
              </div>
          </dialog>
        <my-logo class="md:mr-10" href='/' ></my-logo>
        <button aria-controls="menu" aria-expanded="false" class='bg-red block text-white md:hidden hamburger focus:outline-none border-2 p-2 focus:border-white border-transparent rounded-full transition-colors duration-500 ease '>
            <img src="/assets/shared/icon-hamburger.svg" alt="Hamburger Menu" ' />
            <span class='sr-only'>Open menu</span>
      </button>
        <hr class="hidden lg:block min-w-[350px]  2xl:min-w-[800px]  border-white/30 absolute z-10 left-52" />
        <nav class="hidden md:grid bg-slate-800 bg-opacity-80 h-full 2xl:w-1/2   place-items-center pl-32 lg:pl-40 " role="navigation" >
          ${ulMenu}
        </nav>
    </header>
    `;

    this.append(template.content.cloneNode(true));

    this.hamburger = this.querySelector(".hamburger");
    this.dialog = this.querySelector("dialog");
    this.exitDialog = this.querySelector(".exit-dialog");

    if (this.hamburger)
      this.hamburger.addEventListener("click", this.handleHamburgerMenu);

    if (this.exitDialog) {
      this.exitDialog.addEventListener("click", this.handleExitDialog);
    }
  }

  disconnectedCallback() {
    this.removeEventListener(
      "click",
      this.handleClickOutsideOfDialog as EventListener,
    );

    window.removeEventListener("url-changed", this.handleChange);
    if (this.hamburger)
      this.hamburger?.removeEventListener("click", this.handleHamburgerMenu);

    if (this.exitDialog)
      this.exitDialog.removeEventListener("click", this.handleExitDialog);
  }
}

customElements.define("my-header", Header);
