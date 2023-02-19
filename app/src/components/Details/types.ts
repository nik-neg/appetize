export interface IDetailsProps {
  route: {
    params: {
      dishId: string;
    };
  };
}

export interface IDish {
  _id: string;
  userID: string;
  cookedNotOrdered: boolean;
  cookedOrdered: {
    cooked: boolean;
    ordered: boolean;
  };
  title: string;
  description: string;
  recipe: string;
  creatorName: string;
  city: string;
  imageUrl: string;
}
