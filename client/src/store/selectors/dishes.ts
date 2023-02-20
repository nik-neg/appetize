import { useSelector, RootStateOrAny } from "react-redux";

export const selectDishes = useSelector((state: RootStateOrAny) => state.user.dishesInRadius);