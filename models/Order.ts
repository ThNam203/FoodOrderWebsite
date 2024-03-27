export type Order = {
  id: number;
  total: number;
  status: string;
  userId: number;
};

export type OrderDetail = {
  id: number;
  quantity: number;
  price: number;
  orderId: number;
  foodId: number;
  foodSizeId: number;
};
