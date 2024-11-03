class LoadingSpinner extends HTMLElement {
  constructor() {
    super();

    // Attach a shadow DOM
    const shadow = this.attachShadow({ mode: "closed" });

    // Create a wrapper for the spinner
    const wrapper = document.createElement("div");
    wrapper.setAttribute("class", "spinner");

    // Define spinner styling in shadow DOM
    const style = document.createElement("style");
    style.textContent = `
        .spinner {
          width: 50px;
          height: 50px;
          border: 6px solid #f3f3f3;
          border-top: 6px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
  
        /* Spinner animation */
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;

    // Append the elements to the shadow DOM
    shadow.appendChild(style);
    shadow.appendChild(wrapper);
  }

  // Method to show the spinner
  show() {
    this.style.display = "block";
  }

  // Method to hide the spinner
  hide() {
    this.style.display = "none";
  }

  // Connected callback
  connectedCallback() {
    this.show(); // Show the spinner when added to the DOM
  }
}

// Define the custom element
customElements.define("loading-spinner", LoadingSpinner);
