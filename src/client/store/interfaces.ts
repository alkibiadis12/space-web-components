export interface URL {
  pathname?: string; //name is optional
}

export interface Data {
  name?: string; //name is optional
}

//===========STATE=====================
export interface State {
  url: URL;
  data: Data;
}
