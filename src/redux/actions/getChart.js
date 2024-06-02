import { axiosService } from "../../util/service";

export const getChart = (symbol) => {
  return async (dispatch) => {
    try {
      let response = await axiosService.post("api/binaryOption/getChart", { symbol });

      dispatch({
        type: "GET_CHART",
        payload: response.data.data,
      });
    } catch (error) {
      console.log(error);
    }
  };
};
