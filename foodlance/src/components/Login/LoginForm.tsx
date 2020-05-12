import React, { useState, useContext } from "react";
import { Form, Checkbox, Button, message } from "antd";
import { Input } from "antd";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { LayerContext } from "../../context/LayerContext";
import { Navigation } from "../Navigation/Navigation";

interface LoginProps {

}
export const LoginForm: React.FC<LoginProps> = (props: LoginProps) => {
  const { setToken } = useContext(LayerContext)
  const [redirect, setRedirect] = useState<boolean>(false);
  const layout = {
    labelCol: { span: 9 },
    wrapperCol: { span: 6 },
  };
  const tailLayout = {
    wrapperCol: { offset: 9, span: 16 },
  };
  const key = 'updatable';

  const onFinish = async (values: any) => {
    console.log('Success:', values);
    
    try {
      message.loading({ content: 'Logging in...', key });
      const result = await axios({
        method: 'POST',
        url: 'http://localhost:5000/api/auth/login',
        data: {
          username: values.username,
          password: values.password
        }
      });
      
      console.log(result.data.token);
      setToken(result.data.token);
      // TODO: Set token in session storage if remember me is not checked
      localStorage.setItem("token", result.data.token);
      setTimeout(() => {
        message.success({content: "Successfully logged in! Redirecting to login page...", key, duration: 2})
      }, 1000);
      setTimeout(() => {
        setRedirect(true);
      }, 2000);
    } catch(err) {
      message.error({content: "Unexpected error occured. Please try again", key, duration: 2});
      console.log(err.message);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  
  if (redirect) {
    return <Redirect to="/" />
  }

  return (
    <>
      <Navigation/>
      <Form
        {...layout}
        className="loginForm"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailLayout} name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
    </>
  );

}