export interface CartItem {
  type: string;
  itemName: string;
  itemId: string;
  firstImgUrl: string;
  itemOgName: string;
  creatorEmail: string;
  comboItems?: any[];
  filter: string;
  price: string;
  quantity: number;
  ogPrice: number; // Ensure this is a number or string that can be parsed to a number
  activeDiscount: boolean;
  discountPrice: any;
  discountAmount: any;
}