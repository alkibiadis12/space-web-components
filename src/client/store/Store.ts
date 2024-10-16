import { State, Data } from "./interfaces";

class Store {
  //==================================
  //TYPES
  private state: State;

  //==================================
  //INITIALIZATION
  constructor() {
    this.state = {
      data: {
        name: "Kurapika",
      },
    };
  }

  //==================================
  //GET METHODS
  getData() {
    return this.state.data;
  }

  //==================================
  //UPDATE METHODS
  updateData(newData: Data) {
    this.state.data = { ...this.state.data, ...newData };
    this._dispatchDataChangeEvent();
  }

  //==================================
  //CUSTOM EVENTS
  _dispatchDataChangeEvent() {
    const event = new CustomEvent("stateChanged-data", {
      detail: this.state.data,
    });
    window.dispatchEvent(event);
  }
}

//==================================

const store = new Store();

export default store;
