import axios from "axios";
import { message } from "antd";

export class LoginService {
  public static registerUser = async (values: any)  => {
    try {
      const result = await axios({
        method: 'POST',
        url: 'http://localhost:5000/api/user',
        data: {
          firstName: values.firstName,
          lastName: values.lastName,
          username: values.username,
          password: values.password
        }
      });

      return result.data;
    }
    catch(err) {
      message.error({content: "Unexpected error occured. Please refresh and try again", duration: 2});
      return {
        success: false,
        message: "Unexpected error occured. Please refresh and try again."
      };
    }
    
  }

  public static loginUser = async (values: any)  => {
    try {
      const result = await axios({
        method: 'POST',
        url: 'http://localhost:5000/api/auth/login',
        data: {
          username: values.username,
          password: values.password
        }
      });
      return result.data;
    }
    catch(err) {
      message.error({content: "Unexpected error occured. Please refresh and try again", duration: 2});
      return {
        success: false,
        message: "Unexpected error occured. Please refresh and try again."
      };
    }
  }

  public static authenticateUser = async (values: any)  => {
    try {
      const result = await axios({
        method: 'GET',
        url: 'http://localhost:5000/api/auth',
        headers: {
            "X-Auth-Token": localStorage.getItem("token")
        }
      });
      return result.data;
    }
    catch(err) {
      message.error({content: "Unexpected error occured. Please refresh and try again", duration: 2});
      return {
        success: false,
        message: "Unexpected error occured. Please refresh and try again."
      };
    }
  }
}