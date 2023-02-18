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
  title: string;
  description: string;
  recipe: string;
  creatorName: string;
  city: string;
  imageUrl: string;
}
