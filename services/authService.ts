import { LoginFormData } from "@/app/(auth)/login/page";
import { RegisterFormData } from "@/app/(auth)/register/page";
import AxiosService from "./axiosService";

const Register = (data: RegisterFormData) => {
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

const Login = (data: LoginFormData) => {
  return AxiosService.post(
    "/api/auth/authenticate",
    {
      email: data.email,
      password: data.password,
    },
    { withCredentials: true }
  );
};

const LogOut = (token: string) => {
  return AxiosService.get("/auth/logout", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
};

const AuthService = {
  Register,
  Login,
  LogOut,
};

export default AuthService;
