export interface IUserData {}

export interface State {
  userData: {};
  dishesInRadius: [];
  searchData: {
    pageNumber: number;
    radius: number;
    filter: {
      cooked: boolean;
      ordered: boolean;
      own: boolean;
    };
    geoLocationPolygon: [];
  };
  clearDishTextRequest: number;
  newDishesRequest: number;
  allDishesDeletedRequest: boolean;
  initialProfileRender: boolean;
  chosenImageDate: string;
  loading: boolean;
  isAuthenticated: boolean;
}

export interface ICityUser {
  id: string;
  city: string;
}

export interface IDishesInRadius {
  id: string;
  radius: number;
  filter: string;
  pageNumber: number;
  geoLocationPolygon: any;
}

export interface IUploadImage {
  userId: string;
  file: File;
  chosenImageDate: string;
  imageURL: string;
}

export interface IDeleteDish {
  userId: string;
  dishId: string;
}

export interface IVote {
  voteID: string;
  dishID: string;
  vote: number;
}
