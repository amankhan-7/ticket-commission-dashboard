"use client"
import { store } from "@/utils/redux/store";
import { Provider } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
// import { hydrate } from "@/utils/redux/features/user/userSlice";

function UserLoader({ children }) {
  const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(hydrate());
//   }, [dispatch]);

  return children;
}

export default function ReduxWrapper({ children }) {
  return (
    <Provider store={store}>
      <UserLoader>{children}</UserLoader>
    </Provider>
  );
}