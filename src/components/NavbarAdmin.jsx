import { Drawer, Switch } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import logo from "../assets/img/logo/logoImgTextHorizontal.png";
import { axiosService } from "../util/service";

export default function NavbarAdmin() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  // auto chart
  const [isAutoChart, setIsAutoChart] = useState(false);
  const onChange = (checked) => {
    if (checked) setValue(1);
    else setValue(0);
  };
  const getValue = async () => {
    try {
      let response = await axiosService.post("api/user/getValueConfig", {
        name: "autoChart",
      });
      setIsAutoChart(response.data.data[0].value);
    } catch (error) {
      console.log(error);
    }
  };
  const setValue = async (value) => {
    try {
      await axiosService.post("api/admin/updateConfigData", {
        name: "autoChart",
        value,
      });
      getValue();
    } catch (error) {
      console.log(error);
    }
  };

  // auto chart
  const [isMessage, setIsMessage] = useState(false);
  const onChange2 = () => {
    updateMessageConfigOrder();
  };
  const getMessageConfigOrder = async () => {
    try {
      let response = await axiosService.post("api/admin/getMessageConfig");
      setIsMessage(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const updateMessageConfigOrder = async () => {
    try {
      await axiosService.post("api/admin/updateMessageConfig");
      getMessageConfigOrder();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getValue();
    getMessageConfigOrder();
  }, []);

  return (
    <>
      <div className="navbar-admin">
        <div className="logo">
          <i
            className="fa-solid fa-bars"
            onClick={() => {
              dispatch({
                type: "TOGGLE_SIDEBAR",
              });
            }}
          ></i>

          <img
            src={logo}
            onClick={() => {
              // nhấn logo -> copy nhanh token
              try {
                const token = localStorage.getItem("token");
                if (token) {
                  navigator.clipboard.writeText(token);
                }
              } catch (error) {
                console.log(error);
              }
            }}
          />
        </div>

        <div className="setting" onClick={showDrawer}>
          <i className="fa-solid fa-gear"></i>
          <span>{t("setting")}</span>
        </div>
      </div>

      <Drawer title={t("setting")} onClose={onClose} visible={open} className="setting-drawer" width={300}>
        <div className="st-div">
          <div className="st-left">Auto Chart</div>
          <div className="st-right">
            <Switch defaultChecked={isAutoChart == 1} onChange={onChange} />
          </div>
        </div>

        <div className="st-div">
          <div className="st-left">{t("message")}</div>
          <div className="st-right">
            <Switch defaultChecked={isMessage == 1} onChange={onChange2} />
          </div>
        </div>
      </Drawer>
    </>
  );
}
