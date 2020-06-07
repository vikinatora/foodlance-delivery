import React, { useEffect, useContext } from 'react';
import INavigationProps from './INavigationProps';
import { Menu, Col, Row, message, notification } from 'antd';
import { Link } from 'react-router-dom';
import { LayerContext } from '../../context/LayerContext';
import { LoginService } from '../../services/loginService';
import { UserOutlined, LogoutOutlined, LoginOutlined, UserAddOutlined } from '@ant-design/icons';

export const Navigation: React.FC<INavigationProps> = () => {
    const { token, setToken, firstName, setFirstName } = useContext(LayerContext)

    useEffect(() => {
      const authenticate = async() => {
        const token = localStorage.getItem("token");
        if (token) {
            const result = await LoginService.authenticateUser(token);
            if (result.success) {
                setFirstName(result.user.firstName);
            }
        }
      }
      authenticate();
    }, [])

    useEffect(() => {
        if (!token) {
            setFirstName("");
        }
    }, [token])

    return (
        <Row>
            <Col span={!firstName ? 19 : 19}>
                <Menu mode="horizontal">
                    <Menu.Item><Link to="/">Map</Link></Menu.Item>
                </Menu>
            </Col>
            <Col span={!firstName ? 4 : 5}>
                {
                    !firstName
                    ? <Menu className="rightMenu" mode="horizontal">
                        <Menu.Item ><Link to="/login"><LoginOutlined /> Login</Link></Menu.Item>
                        <Menu.Item ><Link to="/regi ster"><UserAddOutlined /> Register</Link></Menu.Item>
                    </Menu>
                    : <Menu className="rightMenu" mode="horizontal">
                        <Menu.Item ><Link to="/profile">
                            <UserOutlined /> Profile
                        </Link></Menu.Item>
                        <Menu.Item ><Link to="#" onClick={() => {
                            message.success({content: "Successfully logged out!", duration: 1})
                            localStorage.removeItem("token");
                            notification.close("order-alert");
                            setToken("");
                        }}><LogoutOutlined /> Logout</Link></Menu.Item>
                    </Menu>
                }
            </Col>
        </Row>
    );
}
