export interface IRecipeReviewCardProps {
  userID: string;
  dishUserID: string;
  voted: boolean;
  dishID: string;
  index: number;
  votes: number;
  title: string;
  created: string;
  imageUrl: string;
  description: string;
  creatorName: string;
  city: string;
  recipe: string;
}
