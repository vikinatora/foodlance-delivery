import Avatar from "antd/lib/avatar";
import React, { useState, useEffect, useContext } from "react";
import { Row, Upload, Col, Table, Button, Badge, message, notification } from "antd";
import Progress from "antd/lib/progress"
import { UserService } from "../../services/userService";
import { Navigation } from "../Navigation/Navigation";
import { ProfileHelpers } from "../../helpers/ProfileHelpers";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { IProfile } from "../../models/IProfile";
import { ProfileModel } from "../../models/Profile";
import { OrderService } from "../../services/orderService";
import { IMapOrder } from "../../models/IMapOrder";
import cloneDeep from "lodash.clonedeep";
import { LayerContext } from "../../context/LayerContext";

interface ProfileProps {

}

export const Profile: React.FC<ProfileProps> = (props: ProfileProps) => {
  const { allOrders, setAllOrders } = useContext(LayerContext);
  const [userInfo, setUserInfo] = useState<IProfile>(new ProfileModel());
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([])
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getProfileInfo = async () => {
      const [userInfo, userOrders] = await UserService.getProfile();
      setUserInfo(userInfo);
      setUserOrders(userOrders);
    }
    getProfileInfo()
  }, []);
  const completedOrderColumns = [
    {
      title: 'Completed',
      dataIndex: 'completedDate',
      key: 'completedDate',
    },
    {
      title: 'Requestor name',
      dataIndex: 'requestorName',
      key: 'requestorName',
    },
    {
      title: 'Total price',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
    },
    {
      title: 'Delivery tip',
      dataIndex: 'tip',
      key: 'tip',
    },
  ];
  
  const userOrderColumns = [
    {
      title: 'Created',
      dataIndex: 'createdDate',
      key: 'createdDate',
    },
    {
      title: 'Total price of order',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
    },
    {
      title: 'Delivery tip',
      dataIndex: 'tip',
      key: 'tip',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_: any, order: any) => {
        if (order.completed) {
          return (
            <span>
              <Badge status="success" />
              Completed
            </span>
          )
        } else if(order.inProgress) {
          return (
            <span>
              <Badge status="processing" />
              In progress
            </span>
          );
        } else if(order.active) {
          return (
            <span>
              <Badge status="warning" />
              Active
            </span>
          );
        } else if (!order.active && !order.completed) {
          return (
            <span>
              <Badge status="error" />
                Removed
            </span>
          );
        }
      }
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (_: any, order: any) => {
        if(order.reactivated) {
          return (
            <span>Reactivated</span>
          )
        } else if (order.active) {
          if (order.inProgress) {
            return (
              <>
                <Button type="primary" onClick={() => completeOrder(order.id)}>Complete</Button>
                <Button type="danger" onClick={() => deactivateOrder(order.id)}>Deactivate</Button>
              </>
            )
          } else {
            return (
              <Button type="danger" onClick={() => deactivateOrder(order.id)}>Deactivate</Button>
            )
          }
        } else {
          return (
            <Button type="dashed" onClick={() => activateOrder(order.id, order.completed)}>Reactivate</Button>
          )
        }
      }
    }
  ];
  
  const productColumns =[{
    title: 'Product name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'name',
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
  }
  ];
  const completeOrder = async (orderId: string) => {
    const result = await OrderService.completeRequestorOrder(orderId);
    message.info(result.message)
    if (result.success) {
      notification.close("order-alert");
      let clonedUserOrders = cloneDeep(userOrders);
      let orderIndex = clonedUserOrders.findIndex(o => o.id === orderId)
      let changedOrder = clonedUserOrders[orderIndex];
      changedOrder.completed = true;

      clonedUserOrders.splice(orderIndex, 1, changedOrder);
      setUserOrders(clonedUserOrders);
      
    }
  }

  const deactivateOrder = async (orderId: string) => {
    const result = await OrderService.removeOrder(orderId);
    message.info(result.message)
    if (result.success) {
      notification.close("order-alert");
      let clonedUserOrders = cloneDeep(userOrders);
      let orderIndex = clonedUserOrders.findIndex(o => o.id === orderId)
      let changedOrder = clonedUserOrders[orderIndex];
      changedOrder.inProgress = false;
      changedOrder.active = false;

      clonedUserOrders.splice(orderIndex, 1, changedOrder);
      setUserOrders(clonedUserOrders);
    }
  }

  const activateOrder = async (orderId: string, completed: boolean) => {
    const result = await OrderService.activateOrder(orderId, completed);
    message.info(result.message)
    if (result.success) {
      notification.close("order-alert");
      let clonedUserOrders = cloneDeep(userOrders);
      if(!result.newOrder) {
        let orderIndex = clonedUserOrders.findIndex(o => o.id === orderId)
        let changedOrder = clonedUserOrders[orderIndex];
        changedOrder.active = true;
        clonedUserOrders.splice(orderIndex, 1, changedOrder);
      } else {
        let orderIndex = clonedUserOrders.findIndex(o => o.id === orderId)
        let changedOrder = clonedUserOrders[orderIndex];
        changedOrder.reactivated = true;
        clonedUserOrders.splice(orderIndex, 1, changedOrder);
        const mappedOrder = ProfileHelpers.mapToOrderInfo([result.newOrder]);
        clonedUserOrders.push(mappedOrder[0]);
      }
      setUserOrders(clonedUserOrders);
    }
  }

  const expandedRowRender =  (order: any) => {
    const products: any[] = userOrders.find(o => o.id === order.id).products;

    return <Table columns={productColumns} dataSource={products} pagination={false} />;
  };
  const onTableRowExpand = (expanded: boolean, order: any) => {
    var keys = [];
    if (expanded){
        keys.push(order.id); // I have set my record.id as row key. Check the documentation for more details.
    }

    setExpandedRowKeys(keys);
  }
  const handleAvatarChange = (info: any) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      ProfileHelpers.getBase64(info.file.originFileObj, (imageUrl: string) => {
        UserService.uploadAvatar(imageUrl);

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
      <Navigation />
      <div className="profile-wrapper">
        <Row className="row">
        <Col offset="10">
            <div className="avatar">
              {
              userInfo.avatarSrc
              ? <Avatar 
                  style={{ backgroundColor: "orange", verticalAlign: 'middle' }}
                  shape="square"
                  size="large"
                  src={userInfo.avatarSrc}
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
          <Col span="12">
            <Row className="user-name-row">
              <div className="user-name">{userInfo?.firstName} {userInfo?.lastName}</div>
            </Row>
            <Row>
              <div className="delivery-level">Delivery level {Math.floor(userInfo.experience / 10)}</div>
            </Row>
            <Row>
              <div className="delivery-level">Total tips: {userInfo.tips} lv.</div>
            </Row>
          </Col>
        </Row>
        
        <Row>
          <Col offset="8" span="6">
            <div className="experince">
              <Progress  percent={userInfo.experience % 10 * 10 } format={percent => `${(10 - userInfo.experience % 10).toFixed(2)} experience to next level`}/>
            </div>
          </Col>
        </Row>
        <Row className="row">
          <Col offset="1" span="8">
            <h3>Recent orders</h3>
          </Col>
          <Col offset="4" span="8">
            <h3>Completed orders</h3>
          </Col>
        </Row>
        <Row>
          <Col offset="1" span="11">
            <Table
              columns={userOrderColumns}
              dataSource={userOrders}
              expandedRowKeys={expandedRowKeys}
              expandedRowRender={(order: any) => expandedRowRender(order) }
              onExpand={onTableRowExpand}
              rowKey="id"
            />
          </Col>
          <Col offset="1" span="10">
            <Table
              columns={completedOrderColumns}
              dataSource={userInfo.completedOrders}
              rowKey="id"
            />
          </Col>
        </Row>
      </div>
    </>
  );
};