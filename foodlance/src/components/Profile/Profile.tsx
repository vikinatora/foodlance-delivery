import Avatar from "antd/lib/avatar";
import React, { useState, useEffect } from "react";
import { Row, Upload, Col, Table } from "antd";
import Progress from "antd/lib/progress"
import { UserService } from "../../services/userService";
import { Navigation } from "../Navigation/Navigation";
import { ProfileHelpers } from "../../helpers/ProfileHelpers";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { IProfile } from "../../models/IProfile";
import { ProfileModel } from "../../models/Profile";

interface ProfileProps {

}
const completedOrderColumns = [
  {
    title: 'Requestor name',
    dataIndex: 'requestorName',
    key: 'requestorName',
  },
  {
    title: 'Total price of order',
    dataIndex: 'totalPrice',
    key: 'totalPrice',
  },
  {
    title: 'Tip percentage',
    dataIndex: 'tipPercentage',
    key: 'tipPercentage',
  },
  {
    title: 'Tip',
    dataIndex: 'tip',
    key: 'tip',
  },
];

export const Profile: React.FC<ProfileProps> = (props: ProfileProps) => {
  const [userInfo, setUserInfo] = useState<IProfile>(new ProfileModel());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getProfileInfo = async () => {
      const userInfo: IProfile = await UserService.getProfile();
      setUserInfo(userInfo);
    }
    getProfileInfo()
  }, []);
  
  const handleAvatarChange = (info: any) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      ProfileHelpers.getBase64(info.file.originFileObj, (imageUrl: string) => {
        setUserInfo(prev => ({
          ...prev,
          avatarSrc: imageUrl
        }));
        setLoading(false);
      });
    }
  };

  return (
    <>
      <Navigation/>
      <div className="profile-wrapper">

        <Row>
          <Col offset="10">
            <div className="avatar">
              {
              userInfo?.avatarSrc
              ? <Avatar 
                  style={{ backgroundColor: "orange", verticalAlign: 'middle' }}
                  size="large"
                  src={userInfo?.avatarSrc}
                >
                </Avatar>
              :   
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                beforeUpload={ProfileHelpers.beforeUpload}
                onChange={handleAvatarChange}
              >
                <div>
                    {loading ? <LoadingOutlined /> : <PlusOutlined />}
                  <div className="ant-upload-text">Upload avatar</div>
                </div>
              </Upload>
              }
            </div>
          </Col>
        
        </Row>
        <Row>
          <Col offset="10" span="12">
            <div className="user-name">{userInfo?.firstName} {userInfo?.lastName}</div>
          </Col>
        </Row>
      
        {console.log(userInfo?.experience)}
        <Row>
          <Col offset="10" span="6"> 
            <div className="delivery-level">Delivery level {Math.floor(userInfo.experience / 10)}</div>
          </Col>
        </Row>
        <Row>
          <Col offset="10" span="6"> 
            <div className="delivery-level">Total tips: {userInfo.tips} lv.</div>
          </Col>
        </Row>
        <Row>
          <Col offset="8" span="6">
            <div className="experince"><Progress  percent={userInfo.experience % 10 * 10 } format={percent => `${10 - userInfo.experience % 10} experience to next level`}/></div>
          </Col>
        </Row>
        <Row>
          <Col offset="1" span="8">
            <Table
              columns={completedOrderColumns}
              dataSource={userInfo.completedOrders}
            />
          </Col>
        </Row>
        <Row>
          <Col offset="4" span="8">
          </Col>
        </Row>
      </div>
    </>
  );
};