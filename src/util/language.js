import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./language/en.json";
import vn from "./language/vn.json";
import kr from "./language/kr.json";
import jp from "./language/jp.json";
import cn from "./language/cn.json";
import th from "./language/th.json";
import km from "./language/km.json";
import lo from "./language/lo.json";
import id from "./language/id.json";

i18next.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    vn: {
      translation: vn,
    },
    kr: {
      translation: kr,
    },
    jp: {
      translation: jp,
    },
    cn: {
      translation: cn,
    },
    th: {
      translation: th,
    },
    km: {
      translation: km,
    },
    lo: {
      translation: lo,
    },
    id: {
      translation: id,
    },
  },
  lng: localStorage.getItem("language") || "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;
