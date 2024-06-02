import axios from "axios";

export const DOMAIN = "https://binatrade.net/";
export const DOMAIN2 = "https://binatrade.net";

export const axiosService = axios.create({
  baseURL: DOMAIN,
  timeout: 20000,
});

const refreshToken = async () => {
  try {
    const refreshToken = JSON.parse(localStorage.getItem("user")).refreshToken;
    let response = await axios.post(DOMAIN + "api/user/refreshToken", {
      refreshToken,
    });

    const newToken = response.data.data.token;
    const newExpiresIn = response.data.data.expiresIn;

    localStorage.setItem("token", newToken);

    const user = JSON.parse(localStorage.getItem("user"));
    user.token = newToken;
    user.expiresIn = newExpiresIn;
    localStorage.setItem("user", JSON.stringify(user));

    return newToken;
  } catch (error) {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.reload();
  }
};

axiosService.interceptors.request.use(
  async (config) => {
    if (localStorage.getItem("user")) {
      if (Date.now() > JSON.parse(localStorage.getItem("user")).expiresIn) {
        const newToken = await refreshToken();

        config.headers = {
          ...config.headers,
          ["Authorization"]: "Bearer " + newToken,
        };

        return config;
      }
    }

    config.headers = {
      ...config.headers,
      ["Authorization"]: "Bearer " + localStorage.getItem("token"),
    };
    return config;
  },
  (errors) => {
    return Promise.reject(errors);
  }
);
