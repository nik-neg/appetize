import { useSelector, RootStateOrAny } from "react-redux";

export const selectUser = useSelector((state: RootStateOrAny) => state.user.userData);