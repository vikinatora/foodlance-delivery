import Avatar from "antd/lib/avatar";
import React, { useState, useEffect } from "react";
import { Row, Upload } from "antd";
import { UserService } from "../../services/userService";
import { Navigation } from "../Navigation/Navigation";
import { ProfileHelpers } from "../../helpers/ProfileHelpers";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

interface ProfileProps {

}

export const Profile: React.FC<ProfileProps> = (props: ProfileProps) => {
  const [user, setUser] = useState("Viktor Todorov");
  const [color, setColor] = useState();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("")

  useEffect(() => {
    const getProfileInfo = async () => {
      const result = await UserService.getProfile();
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
        setImageUrl(imageUrl);
        setLoading(false);
      });
    }
  };

  return (
    <>
      <Navigation/>

      <Row>
      {
        !imageUrl
        ? <Upload
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
              <div className="ant-upload-text">Upload</div>
          </div>
          </Upload>
        :
        <Avatar 
          style={{ backgroundColor: "orange", verticalAlign: 'middle' }}
          size="large"
          src={imageUrl}
        >
        </Avatar>
      }
      <div>{user}</div>
      </Row>
    </>
  );
};