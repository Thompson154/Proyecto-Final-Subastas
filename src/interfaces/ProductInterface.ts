import type { Auction } from "./AuctionInterface";
import type { ChatMessage } from "./Message";

export interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  basePrice: number;
    duration: {
    years: number;
    months: number;
    weeks: number;
    hours: number;
  };
  state: "active" | "past" | "future" | null;
  auction: Auction;
  chat: ChatMessage[];
}
