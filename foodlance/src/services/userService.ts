import axios from "axios";

export class UserService {
  public static getUserId = async(): Promise<string> => {
    try {
      const response = await axios.request<string>({
        url: "http://localhost:5000/api/user/getId",
        method: "GET",
        headers: {
          "X-Auth-Token": localStorage.getItem("token")
        },
      })
      return response.data;
    }
    catch(error) {
      return "";
    }
  }

}