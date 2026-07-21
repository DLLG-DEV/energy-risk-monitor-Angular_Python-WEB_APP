export interface RoleAdmin{
  id:number;
  name:string;
  modules:ModuleAdmin[];
}

export interface ModuleAdmin{
  id:number;
  label:string;
  route:string;
  icon:string;
}