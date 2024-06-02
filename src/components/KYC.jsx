import { Alert, Button, Input, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../function/showToastify";
import { axiosService } from "../util/service";

const NOT_KYC = "NOT_KYC";
const PENDING = "PENDING";
const APPROVED = "APPROVED";

export default function KYC() {
  const { t } = useTranslation();

  const { user } = useSelector((root) => root.userReducer);
  const [status, setStatus] = useState("");

  const [info, setInfo] = useState({
    userid: user?.id,
    firstname: "",
    lastname: "",
    gender: "",
    passport: "",
    country: "",
    phone: "",
    photo1: "",
    photo2: "",
    photo3: "",
  });

  const [country, setCountry] = useState([]);

  useEffect(() => {
    async function getCountry() {
      let response = await axiosService.get("/api/user/getCountry");
      setCountry(response.data.data);
    }
    getCountry();

    async function checkKYC() {
      try {
        let response = await axiosService.post("/api/user/checkKycUser");
        setStatus(response.data.data);
      } catch (error) {
        if (error.response.data.message === "user is not kyc") {
          setStatus(NOT_KYC);
        }
      }
    }
    checkKYC();
  }, []);

  const kycUser = async (formData) => {
    try {
      let response = await axiosService.post("/api/user/kycUser", formData);
      showSuccessToast(response.data.message);
      setStatus(PENDING);
    } catch (error) {
      console.log(error);
      showErrorToast(error.response.data.message);
    }
  };

  const handleSubmit = () => {
    let formData = new FormData();
    formData.append("userid", info.userid);
    formData.append("firstname", info.firstname);
    formData.append("lastname", info.lastname);
    formData.append("gender", info.gender);
    formData.append("passport", info.passport);
    formData.append("country", info.country);
    formData.append("phone", info.phone);
    formData.append("photo", info.photo1);
    formData.append("photo", info.photo2);
    formData.append("photo", info.photo3);

    kycUser(formData);
  };

  const handleChange = (event) => {
    setInfo({
      ...info,
      [event.target.id]: event.target.value,
    });
  };

  const handleChangeGender = (value) => {
    setInfo({
      ...info,
      gender: value,
    });
  };

  const handleChangeCountry = (value) => {
    setInfo({
      ...info,
      country: value,
    });
  };

  const handleChangePhoto = (e) => {
    setInfo({
      ...info,
      [e.target.id]: e.target.files[0],
    });
  };

  const renderKYC = () => {
    if (status === "") {
      return <></>;
    } else if (status === APPROVED) {
      return (
        <div className="kyc">
          <h2 className="title">{t("kyc")}</h2>

          <div className="kyc-note-922023">
            <div className="p-wrapper">
              <i className="fa-solid fa-circle-info"></i>
              <p>{t("KYCNote1")}</p>
            </div>
            <div className="p-wrapper">
              <i className="fa-solid fa-circle-info"></i>
              <p>{t("KYCNote2")}</p>
            </div>
          </div>

          <Alert
            message={<div style={{ fontSize: 16, fontWeight: 600 }}>{t("kycOk2")}</div>}
            type="success"
            banner={true}
            icon={<i className="fa-solid fa-circle-check"></i>}
          />
        </div>
      );
    } else if (status === PENDING) {
      return (
        <div className="kyc">
          <h2 className="title">{t("kyc")}</h2>

          <div className="kyc-note-922023">
            <div className="p-wrapper">
              <i className="fa-solid fa-circle-info"></i>
              <p>{t("KYCNote1")}</p>
            </div>
            <div className="p-wrapper">
              <i className="fa-solid fa-circle-info"></i>
              <p>{t("KYCNote2")}</p>
            </div>
          </div>

          <Alert
            message={<div style={{ fontSize: 16, fontWeight: 600 }}>{t("kycPending2")}</div>}
            type="warning"
            banner={true}
            icon={<i className="fa-solid fa-circle-exclamation"></i>}
          />
        </div>
      );
    } else {
      return (
        <div className="kyc">
          <h2 className="title">{t("kyc")}</h2>

          <div className="kyc-note-922023">
            <div className="p-wrapper">
              <i className="fa-solid fa-circle-info"></i>
              <p>{t("KYCNote1")}</p>
            </div>
            <div className="p-wrapper">
              <i className="fa-solid fa-circle-info"></i>
              <p>{t("KYCNote2")}</p>
            </div>
          </div>

          <form>
            {/* <div className="userid-field field">
              <label htmlFor="userid">{t("userID")}</label>
              <Input type="text" id="userid" name="userid" value={info.userid} disabled />
            </div> */}

            <div className="firstname-field field">
              <label htmlFor="firstname">{t("firstName")}</label>
              <Input type="text" id="firstname" name="firstname" onChange={handleChange} />
            </div>

            <div className="lastname-field field">
              <label htmlFor="lastname">{t("lastName")}</label>
              <Input type="text" id="lastname" name="lastname" onChange={handleChange} />
            </div>

            <div className="gender-field field">
              <label htmlFor="gender">{t("gender")}</label>
              <Select id="gender" name="gender" style={{ width: "100%" }} onChange={handleChangeGender}>
                <Select.Option value="0">{t("male")}</Select.Option>
                <Select.Option value="1">{t("female")}</Select.Option>
              </Select>
            </div>

            <div className="passport-field field">
              <label htmlFor="passport">{t("passport")}</label>
              <Input type="text" id="passport" name="passport" onChange={handleChange} />
            </div>

            <div className="country-field field">
              <label htmlFor="country">{t("country")}</label>
              <Select id="country" name="country" style={{ width: "100%" }} onChange={handleChangeCountry}>
                {country.map((c, i) => {
                  return (
                    <Select.Option value={c.nicename} key={i}>
                      {c.nicename}
                    </Select.Option>
                  );
                })}
              </Select>
            </div>

            <div className="phone-field field">
              <label htmlFor="phone">{t("phone")}</label>
              <Input type="text" id="phone" name="phone" onChange={handleChange} />
            </div>

            {/* Photo 1 */}
            <div className="photo1-field field">
              <label htmlFor="photo1">{t("photoP1")}</label>
              <input type="file" id="photo1" name="photo1" onChange={handleChangePhoto} accept="image/*" />
            </div>

            {/* Photo 2 */}
            <div className="photo2-field field">
              <label htmlFor="photo2">{t("photoP2")}</label>
              <input type="file" id="photo2" name="photo2" onChange={handleChangePhoto} accept="image/*" />
            </div>

            {/* Photo 3 */}
            <div className="photo3-field field">
              <label htmlFor="photo3">{t("photoP3")}</label>
              <input type="file" id="photo3" name="photo3" onChange={handleChangePhoto} accept="image/*" />
            </div>
          </form>

          <Button size="large" type="primary" onClick={handleSubmit} style={{ marginTop: 50, width: 120 }}>
            {t("saveChange")}
          </Button>
        </div>
      );
    }
  };

  if (!localStorage.getItem("user") || !localStorage.getItem("token")) {
    return <Redirect to="/login" />;
  }

  return <>{renderKYC()}</>;
}
