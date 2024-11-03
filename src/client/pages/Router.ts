import("./Home");

export default class Router extends HTMLElement {
  //========================================================================
  constructor() {
    super();
    this.handleURLChange = this.handleURLChange.bind(this);
    this.handlePopState = this.handlePopState.bind(this);
  }
  //========================================================================
  connectedCallback() {
    //INITIAL RENDER
    this.render(window.location.pathname);

    window.addEventListener("url-changed", this.handleURLChange);

    // Listen for browser back/forward navigation using popstate
    window.addEventListener("popstate", this.handlePopState);
  }

  //========================================================================
  async render(url: string) {
    const template = document.createElement("template");

    let pageContent;
    let imageName;
    let title;

    switch (url) {
      case "/": {
        imageName = "home/background-home";
        pageContent = `<home-page ></home-page>`;
        title = "Space Travel - Home Page";
        this.updateMetaDescription(
          "Welcome to our space travel home page, where dreams of exploring the cosmos come true.",
        );
        break;
      }

      case "/destination": {
        await import("./Destination");
        imageName = "destination/background-destination";
        pageContent = `<destination-page ></destination-page>`;
        title = "Space Travel - Destination Page";
        this.updateMetaDescription(
          "Explore our space travel destinations, including Mars, the Moon, and beyond.",
        );
        break;
      }
      case "/crew": {
        await import("./Crew");
        imageName = "crew/background-crew";
        pageContent = `<crew-page ></crew-page>`;
        title = "Space Travel - Crew Page";
        this.updateMetaDescription(
          "Meet our experienced space crew and learn about their roles and expertise.",
        );
        break;
      }
      case "/technology": {
        await import("./Technology");
        imageName = "technology/background-technology";
        pageContent = `<technology-page ></technology-page>`;
        title = "Space Travel - Technology Page";
        this.updateMetaDescription(
          "Discover the cutting-edge technology that makes space travel possible.",
        );
        break;
      }
      default: {
        await import("./Error");
        pageContent = `<error-page ></error-page>`;
        title = "Space Travel - Error Page";
        this.updateMetaDescription(
          "Error 404: Page not found. Explore more about space travel on our other pages.",
        );
        break;
      }
    }

    document.title = title;

    template.innerHTML = /* HTML */ `
      <div
        class="min-h-screen bg-cover bg-center bg-no-repeat"
        style="background-image: url('/assets/${imageName}-desktop.jpg')"
      >
        <my-header role="banner"></my-header>
        <main
          role="main"
          aria-live="polite"
          class="crossfade-in mx-auto mt-10 max-w-7xl px-10 md:mt-20"
        >
          ${pageContent}
        </main>
      </div>
    `;

    const mainEl = this.querySelector("main");
    if (mainEl) {
      mainEl.classList.add("crossfade-out");
      await new Promise((resolve) => {
        mainEl.addEventListener("animationend", resolve, {
          once: true,
        });
      });
      mainEl.classList.remove("crossfade-out");
    }

    this.innerHTML = "";

    this.append(template.content.cloneNode(true));
  }
  //========================================================================
  //FUNCTIONS
  handleURLChange(e: Event) {
    const customEvent = e as CustomEvent;
    this.render(customEvent.detail);
  }

  handlePopState() {
    this.render(window.location.pathname);
  }

  updateMetaDescription(content: string) {
    let metaTag = document.querySelector('meta[name="description"]');

    if (metaTag) {
      // Update the existing meta description tag
      metaTag.setAttribute("content", content);
    } else {
      // Create a new meta description tag if it doesn't exist
      metaTag = document.createElement("meta");
      metaTag.setAttribute("name", "description");
      metaTag.setAttribute("content", content);
      document.head.appendChild(metaTag);
    }
  }

  //========================================================================
  disconnectedCallback() {
    // Remove event listeners
    window.removeEventListener("url-changed", this.handleURLChange);
    window.removeEventListener("popstate", this.handlePopState);
  }
}
//END OF COMPONENT
//========================================================================

customElements.define("my-router", Router);
