import { Button, Input } from "antd";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { signupAction } from "../redux/actions/signupAction";
import { axiosService } from "../util/service";
import { useTranslation } from "react-i18next";

export default function Signup(props) {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const referral = props.match.params.referral;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      userName: "",
      email: "",
      password: "",
      password2: "",
      referral: "",
    },
    validationSchema: Yup.object({
      userName: Yup.string().required(t("required")).min(6, t("min6")),
      email: Yup.string().required(t("required")).email(t("invalidEmail")),
      password: Yup.string().required(t("required")),
      password2: Yup.string()
        .required(t("required"))
        .oneOf([Yup.ref("password"), null], t("notMatch")),
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      dispatch(
        signupAction(
          {
            ...values,
            userName: values.userName.toLowerCase(),
          },
          setLoading,
          props.history
        )
      );
    },
  });

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      formik.handleSubmit();
    }
  };

  const stringToSlug = (str) => {
    var from = "àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ",
      to = "aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy";
    for (var i = 0, l = from.length; i < l; i++) {
      str = str.replace(RegExp(from[i], "gi"), to[i]);
    }

    str = str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\-]/g, "")
      .replace(/-+/g, "");

    return str;
  };

  useEffect(() => {
    window.addEventListener("keypress", handleEnter);

    return () => {
      window.removeEventListener("keypress", handleEnter);
    };
  }, []);

  useEffect(() => {
    async function getReferral() {
      if (referral === undefined) {
        let response = await axiosService.get("/api/user/getReferral");
        formik.setFieldValue("referral", response.data.data);
      } else {
        formik.setFieldValue("referral", referral);
      }
    }
    getReferral();
  }, []);

  return (
    <div className="main-signup">
      <div className="center-area">
        <h2 className="title">{t("createAccount")}</h2>

        <div className="link-to-login">
          {t("hadAccount")}
          <span onClick={() => props.history.push("/login")}> {t("login")}</span>
        </div>

        <form>
          <div className="userName-field field">
            <label htmlFor="userName">{t("username")}</label>
            <Input
              type="text"
              id="userName"
              value={formik.values.userName}
              onChange={(e) => formik.setFieldValue("userName", stringToSlug(e.target.value))}
              style={{ caretColor: "white" }}
              name="userName"
            />
            {formik.errors.userName ? <div className="error">{formik.errors.userName}</div> : null}
          </div>

          <div className="email-field field">
            <label htmlFor="email">{t("email")}</label>
            <Input
              type="email"
              id="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              name="email"
              style={{ caretColor: "white" }}
            />
            {formik.errors.email ? <div className="error">{formik.errors.email}</div> : null}
          </div>

          <div className="new-field-pw field">
            <div className="password-field sub-field">
              <label htmlFor="password">{t("password")}</label>
              <Input.Password
                type="password"
                id="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                style={{ caretColor: "white" }}
                name="password"
              />
              {formik.errors.password ? <div className="error">{formik.errors.password}</div> : null}
            </div>

            <div className="password-confirm-field sub-field">
              <label htmlFor="password2">{t("confirmPassword")}</label>
              <Input.Password
                type="password"
                id="password2"
                value={formik.values.password2}
                onChange={formik.handleChange}
                style={{ caretColor: "white" }}
                name="password2"
              />
              {formik.errors.password2 ? <div className="error">{formik.errors.password2}</div> : null}
            </div>
          </div>

          <div className="code-field field">
            <label htmlFor="code">{t("referralCode")}</label>
            <Input
              type="text"
              id="referral"
              disabled
              value={formik.values.referral}
              name="referral"
              onChange={formik.handleChange}
              style={{ userSelect: "none", pointerEvents: "none", caretColor: "white" }}
            />
          </div>

          <Button
            type="primary"
            style={{ width: "100%", fontWeight: "bold" }}
            size="large"
            loading={loading}
            onClick={formik.handleSubmit}
          >
            {t("createAccount")}
          </Button>
        </form>
      </div>
    </div>
  );
}
