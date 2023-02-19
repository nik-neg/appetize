import { RootStateOrAny } from "react-redux";

export const selectUserData = (state: RootStateOrAny) => state?.user?.userData;
