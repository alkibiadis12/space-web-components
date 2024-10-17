import "./pages/Home";
import "./pages//About";

window.addEventListener("popstate", (e) => {
  console.log("I AM IN POPSTATE");
  console.log(e);
});

window.addEventListener("url-changed", (e: Event) => {
  const customEvent = e as CustomEvent;
  console.log("URL CHANGED EVENT");
  console.log(customEvent.detail);
});
