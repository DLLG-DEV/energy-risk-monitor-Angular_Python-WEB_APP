export interface UserAdmin {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role_id: number;
  role: string;
  is_active: boolean;
  created_at: string;
}

export interface RoleList {
  id: number;
  name: string;
}
