import type { Product } from "./ProductInterface";
import type { User } from "./UserInterface";

export interface DB {
  users: User[];
  products: Product[];
}
