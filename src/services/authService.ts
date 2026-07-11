import api from "../api/axios";

export interface LoginPayload {
  userId: string;
  password: string;
}

export interface User {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  data: {
    token: string;
    user: any;
  };
}

export const login = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>("/auth/login", payload);
  return data;
};

export const saveAuth = (data: LoginResponse["data"]) => {
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getUser = (): User | null => {
  const user = localStorage.getItem("user");

  return user ? JSON.parse(user) : null;
};

export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("token");
};