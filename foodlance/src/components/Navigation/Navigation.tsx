import React, { useEffect, useContext } from 'react';
import INavigationProps from './INavigationProps';
import { Menu, Col, Row, message } from 'antd';
import { Link } from 'react-router-dom';
import { LayerContext } from '../../context/LayerContext';
import { LoginService } from '../../services/loginService';

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
        if(!token) {
            setFirstName("");
        }
    }, [token])

    return (
        <Row>
            <Col span={!firstName || !token ? 20 : 19}>
                <Menu mode="horizontal">
                    <Menu.Item><Link to="/">Foodlance</Link></Menu.Item>
                </Menu>
            </Col>
            <Col span={!firstName || !token ? 4 : 5}>
                {
                    !firstName || !token
                    ? <Menu className="rightMenu" mode="horizontal">
                        <Menu.Item ><Link to="/login">Login</Link></Menu.Item>
                        <Menu.Item ><Link to="/register">Register</Link></Menu.Item>
                    </Menu>
                    : <Menu className="rightMenu" mode="horizontal">
                        <Menu.Item ><Link to="/profile">Hello, {firstName}</Link></Menu.Item>
                        <Menu.Item ><Link to="#" onClick={() => {
                            message.success({content: "Successfully logged out!", duration: 1})
                            localStorage.removeItem("token");
                            setToken("")
                        }}>Logout</Link></Menu.Item>
                    </Menu>
                }
            </Col>
        </Row>
    );
}
