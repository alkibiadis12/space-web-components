export interface URL {
  pathname?: string;
}

export interface DotIndicatorTabs {
  tabs: string[];
}

export interface Image {
  png: string;
  webp: string;
}

export interface IDestination {
  name: string;
  images: Image;
  description: string;
  distance: string;
  travel: string;
}

export interface ICrew {
  name: string;
  images: Image;
  role: string;
  bio: string;
}

interface TechnologyImage {
  portrait: string;
  landscape: string;
}

interface ITechnology {
  name: string;
  images: TechnologyImage;
  description: string;
}

//===========STATE=====================
export interface State {
  url: URL;
  crew: ICrew[];
  destinations: IDestination[];
  technology: ITechnology[];
  selectedCrewTabIndex: number;
  selectedTechnologyTabIndex: number;
}
