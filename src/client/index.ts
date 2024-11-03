import store from "./store/Store";

//PRELOAD DATA
(async () => {
  await store.setPageData();
})();

//ROUTER
import "./pages/Router";
//COMPONENTS
import "./components/Logo";
import "./components/Header";
import "./components/NumberedTitleLink";
import "./components/ExploreLink";
import "./components/DestinationTabs";
import "./components/DotIndicators";
import "./components/NumberIndicators";
import "./components/LoadingSpinner";
