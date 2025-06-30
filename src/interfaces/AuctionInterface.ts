import type { Bid } from "./BidsInterface";

export interface Auction {
  startTime: string;
  endTime: string;
  currentPrice: number;
  bids: Bid[];
  winnerId: string | null;
}
