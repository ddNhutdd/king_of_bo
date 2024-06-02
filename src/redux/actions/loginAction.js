import { showErrorToast } from "../../function/showToastify";
import { axiosService } from "../../util/service";
import socket from "../../util/socket";

export const loginAction = (info, setLoading, fa2code) => {
  return async (dispatch) => {
    let payloadToLogin;
    if (fa2code) {
      payloadToLogin = { ...info, otp: fa2code };
    } else {
      payloadToLogin = { ...info };
    }

    try {
      setLoading(true);
      let response = await axiosService.post("/api/user/login", payloadToLogin);
      if (response.data.status === true) {
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data));
        dispatch({
          type: "USER_LOGIN",
          payload: response.data.data,
        });
        socket.emit("joinUser", `${response.data.data.id}`);
      }
    } catch (error) {
      console.log(error);
      showErrorToast(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
};
