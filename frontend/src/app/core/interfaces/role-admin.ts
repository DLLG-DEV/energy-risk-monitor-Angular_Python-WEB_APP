export interface RoleAdmin {
  id: number;
  name: string;
  modules: ModuleAdmin[];
}

export interface ModuleAdmin {
  id: number;
  label: string;
  route: string;
  icon: string;
}

interface LoginResponse {
  access_token: string;
  status: string;
  token_type: string;
}

export interface RegisterResponse {
  status_code: string;
  detail: string;
}

export interface NewUser {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role_id: number;
}
