import { Source } from "react-native-fast-image";

export type ProductType = {
  auctionEnd: string | null;
  bidder: number;
  condition: string;
  createdAt: string | null;
  createdBy: string;
  currentBid: number;
  description: string;
  id: string;
  images: Source[];
  startingBid: number;
  status: string;
  stepBid: number;
  title: string;
  winner: string;
};
