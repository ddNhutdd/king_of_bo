import { Button, Input, Modal } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import avatarDefault from "../assets/img/avatar-default.svg";
import KYC from "./KYC";
import SecurityProfile from "./SecurityProfile";

// Cropper
import "cropperjs/dist/cropper.css";
import Cropper from "react-cropper";
import { showErrorToast, showSuccessToast } from "../function/showToastify";
import { axiosService, DOMAIN2 } from "../util/service";

export default function Profile() {
  const { user } = useSelector((root) => root.userReducer);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // Modal upload avatar
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => setIsModalOpen(true);
  const handleOk = () => {
    setIsModalOpen(false);
    setImage(undefined);
    setPath(undefined);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setImage(undefined);
    setPath(undefined);
  };

  const htmlInputRef = useRef();
  const [image, setImage] = useState(undefined); // img file
  const [path, setPath] = useState(undefined); // img url
  const [loading, setLoading] = useState(false);
  const cropperRef = useRef(null);

  const triggerInput = () => htmlInputRef.current.click();
  const handleInputFileChange = (e) => {
    const userChosenImage = e.target.files[0];

    // size tính theo bytes
    if (userChosenImage.size > 3 * 1024 * 1024) {
      showErrorToast(t("fileSizeAllowed"));
      return;
    }

    setImage(userChosenImage);
  };

  useEffect(() => {
    if (image) {
      const path = URL.createObjectURL(image);
      setPath(path);
    }
  }, [image]);

  const handleUpload = () => {
    setLoading(true);
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;

    cropper.getCroppedCanvas().toBlob((blob) => {
      const formData = new FormData();
      formData.append("userid", user.id);
      formData.append("image", blob);

      uploadActionAPI(formData);
    });
  };

  const uploadActionAPI = async (formData) => {
    try {
      let response = await axiosService.post("api/user/uploadAvatar", formData);
      await getProfileAPI();
      showSuccessToast(response.data.message);
      handleOk();
    } catch (error) {
      console.log(error);
      showErrorToast(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  // Modal upload avatar

  const getProfileAPI = async () => {
    try {
      let response = await axiosService.post("api/user/getProfile");
      dispatch({
        type: "UPDATE_USER_AVATAR",
        payload: response.data.data.avatar,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProfileAPI();
  }, []);

  return (
    <div className="profile">
      <div className="profile-info">
        <h2 className="title">{t("profile")}</h2>

        <div className="profile-new-img">
          <img src={!user.avatar ? avatarDefault : `${DOMAIN2}${user.avatar}`} alt="avatar" />
          <Button size="large" type="primary" onClick={showModal}>
            {t("changeAvatar")}
          </Button>
        </div>

        <div className="profile-new-form">
          <div className="field email-field">
            <label>Email</label>
            <Input value={user?.email} disabled size="large" />
          </div>

          <div className="field username-field">
            <label>{t("username")}</label>
            <Input value={user?.userName} disabled size="large" />
          </div>
        </div>
      </div>

      <KYC />

      <SecurityProfile />

      <Modal
        title={<div style={{ fontSize: 18, fontWeight: "bold", textAlign: "center" }}>{t("changeAvatar")}</div>}
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        className="profileModalUpdateAvatar"
        maskClosable={false}
        footer={
          image && path
            ? [
                <Button key="fb1" onClick={() => triggerInput()}>
                  {t("chooseAnotherImage")}
                </Button>,
                <Button key="fb2" onClick={() => handleUpload()} type="primary" loading={loading}>
                  {t("update")}
                </Button>,
              ]
            : null
        }
      >
        <input
          type="file"
          name="myImage"
          accept="image/*"
          style={{ display: "none" }}
          ref={htmlInputRef}
          onChange={handleInputFileChange}
        />

        {(!image || !path) && (
          <div className="img-choser-placeholder" onClick={() => triggerInput()}>
            {t("clickHereToChoose")}
          </div>
        )}

        {image && path && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Cropper
              src={path}
              style={{ height: 300, width: "100%" }}
              guides={true}
              ref={cropperRef}
              aspectRatio={1}
              viewMode={1}
            />
          </div>
        )}

        <div className="upload-img-note">* {t("fileSizeAllowed")}</div>
      </Modal>
    </div>
  );
}
