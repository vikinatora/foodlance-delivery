import React, { useEffect, useState, useContext } from 'react';
import INavigationProps from './INavigationProps';
import { Menu, Col, Row, message } from 'antd';
import { Link } from 'react-router-dom';
import axios from "axios";
import { LayerContext } from '../../context/LayerContext';

export const Navigation: React.FC<INavigationProps> = () => {
    const {token, setToken, firstName, setFirstName } = useContext(LayerContext)

    useEffect(() => {
      const authenticate = async() => {
        
        if (localStorage.getItem("token")) {
            try {
                const response = await axios({
                  method: 'GET',
                  url: 'http://localhost:5000/api/auth',
                  headers: {
                      "X-Auth-Token": localStorage.getItem("token")
                  }
                });
                setFirstName(response.data.firstName);
              } catch(err) {
                message.error({content: err.message, duration: 2})
                console.log(err.message);
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
                            message.success({content: "Successfully logged out!", duration: 2})
                            localStorage.removeItem("token");
                            setToken("")
                        }}>Logout</Link></Menu.Item>
                    </Menu>
                }
            </Col>
        </Row>
    );
}
