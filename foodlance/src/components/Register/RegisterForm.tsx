import React, { useState, useContext } from "react";
import { Form, Button, message } from "antd";
import { Input } from "antd";
import { Redirect } from "react-router-dom";
import { Navigation } from "../Navigation/Navigation";
import { LoginService } from "../../services/loginService";
import { LayerContext } from "../../context/LayerContext";

interface RegisterProps {

}

export const RegisterForm: React.FC<RegisterProps> = (props: RegisterProps) => {
  const { setToken } = useContext(LayerContext);
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
    message.loading({ content: 'Registering account...', key });
    const result = await LoginService.registerUser(values);
    if (result.success) {
      setTimeout(() => {
        message.success({content: "Successfully registered! Redirecting to login page...", key, duration: 1})
      }, 1000);

      setTimeout(() => {
        setToken(result.token);
        // TODO: Set token in session storage if remember me is not checked
        localStorage.setItem("token", result.token);
        setRedirect(true);
      }, 2000);

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
          label="First name"
          name="firstName"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Last name"
          name="lastName"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>
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
          hasFeedback
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject('The two passwords that you entered do not match!');
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    </>
  );

}