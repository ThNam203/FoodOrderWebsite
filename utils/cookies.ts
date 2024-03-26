import { cookies } from "next/headers";

const getServerSideCookies = (key: string) => {
  const requeseCookie = cookies().get(key);
  if (requeseCookie) return requeseCookie.value;
  return "false";
};

const setServerSideCookies = (key: string, value: string) => {
  cookies().set(key, value, { httpOnly: false });
};

export { getServerSideCookies, setServerSideCookies };
