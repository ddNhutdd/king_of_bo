import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router";

const ScrollToTop = (props) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();

  const signout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    dispatch({
      type: "USER_LOGOUT",
    });
    history.push("/login");
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    if (localStorage.getItem("user")) {
      const expiresInRefreshToken = JSON.parse(localStorage.getItem("user")).expiresInRefreshToken;
      if (expiresInRefreshToken < Date.now()) {
        signout();
      }
    }
  }, [location]);

  return <>{props.children}</>;
};

export default ScrollToTop;
