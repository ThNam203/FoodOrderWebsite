import { LoginFormData } from "@/app/(auth)/login/page";
import { RegisterFormData } from "@/app/(auth)/register/page";
import AxiosService from "./axiosService";

const register = (data: RegisterFormData) => {
  return AxiosService.post(
    "/api/auth/register",
    {
      name: data.username,
      password: data.password,
      email: data.email,
    },
    { withCredentials: true }
  );
};

const login = (data: LoginFormData) => {
  return AxiosService.post(
    "/api/auth/authenticate",
    {
      email: data.email,
      password: data.password,
    },
    { withCredentials: true }
  );
};

const logOut = (token: string) => {
  return AxiosService.get("/auth/logout", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
};

const AuthService = {
  register,
  login,
  logOut,
};

export default AuthService;
