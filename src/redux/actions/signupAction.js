import { showErrorToast, showSuccessToast } from "../../function/showToastify";
import { axiosService } from "../../util/service";

export const signupAction = (info, setLoading, history) => {
  return async (dispatch) => {
    setLoading(true);
    try {
      let response = await axiosService.post("/api/user/signup", info);
      if (response.data.status === true) {
        dispatch({
          type: "USER_SIGNUP",
          userSignup: response.data.data[0],
        });
        showSuccessToast(response.data.message);
        history.push("/verify-account");
      }
    } catch (error) {
      console.log(error);
      showErrorToast(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
};
