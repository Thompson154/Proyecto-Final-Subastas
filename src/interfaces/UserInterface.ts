import type { UserRole } from "./UserTypeInterface";

export interface User {
  id: string;
  username: string;
  avatar: string;
  role: UserRole;
}
