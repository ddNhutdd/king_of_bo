import { Button, Empty } from "antd";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { axiosService } from "../../util/service";
import AdminVIP from "./AdminVIP";

export default function ManageUserNetwork() {
  const { uid } = useParams();
  const history = useHistory();

  const [userDetail, setUserDetail] = useState(undefined);

  // từ all user nhấn qua đây thì chạy bình thường
  // trường hợp sửa địa chỉ dẫn đến uid không tồn tại -> getProfile lỗi -> back về all user
  const getProfile = async () => {
    try {
      let response = await axiosService.post("api/user/getProfileToId", { userid: uid });
      setUserDetail(response.data.data);
    } catch (error) {
      console.log(error);
      history.replace("/admin/manage-users");
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div className="manage-users-network-vip">
      <div className="navigation-zone">
        <Button onClick={() => history.replace("/admin/manage-users")}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <i className="fa-solid fa-circle-chevron-left" style={{ fontSize: 16, color: "white", marginRight: 8 }}></i>
            <span style={{ fontSize: 14, color: "white" }}>
              {window.innerWidth <= 768 ? "All users" : "Back to all users"}
            </span>
          </div>
        </Button>

        <div className="user-info">
          <div className="user-username">
            {userDetail?.userName}
            <i className="fa-solid fa-circle-user" style={{ color: "whitesmoke", fontSize: 14, marginLeft: 6 }}></i>
          </div>
          <div className="user-email">
            {userDetail?.email}
            <i className="fa-solid fa-envelope" style={{ color: "whitesmoke", fontSize: 14, marginLeft: 6 }}></i>
          </div>
        </div>
      </div>

      {userDetail?.level === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_DEFAULT}
          description={<div>This user is not a VIP member. No data to show</div>}
        />
      ) : (
        <div className="main-content-zone">
          <AdminVIP />
        </div>
      )}
    </div>
  );
}
