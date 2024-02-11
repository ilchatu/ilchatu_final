import { Redirect, Route } from "react-router-dom";
import { ChatState } from "../Context/ChatProvider";

export function AdminRoute({ children, ...rest }) {
  const { user, isLoading } = ChatState();

  if (user === undefined || isLoading) {
    return;
  }

  return (
    <Route
      {...rest}
      render={({ location }) =>
        user?.isAdmin === true ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
