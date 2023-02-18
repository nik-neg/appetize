import { useSelector, RootStateOrAny } from "react-redux";

export const selectUserData = useSelector((state: RootStateOrAny) => state.user.userData);