import AxiosService from "./axiosService";

const getProfile = () => {
  return AxiosService.get("/api/user/me", { withCredentials: true });
};

const UserService = {
  getProfile,
};

export default UserService;
