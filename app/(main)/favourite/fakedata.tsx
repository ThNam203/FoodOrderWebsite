import { Food } from "@/models/Food";

export const fakeFoodData: Food[] = [
  {
    id: 1,
    name: "Bagel Story",
    image:
      "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/25008305-442083466194421-4458779521922891776-n-1517333246.jpg?crop=1xw:1xh;center,top&resize=480:*",
    rating: 4.7,
    tags: ["Deli", "Bagels"],
    categoryId: 1,
    isDeleted: false,
    description: "Bagel Story is a deli that specializes in bagels.",
    currency: "$",
    foodSizes: [
      {
        id: 1,
        name: "Small",
        price: 5.99,
        weight: 100,
        note: "Small bagel",
        quantity: 1,
        foodId: 1,
      },
      {
        id: 1,
        name: "Medium",
        price: 7.99,
        weight: 200,
        note: "Medium bagel",
        quantity: 1,
        foodId: 1,
      },
    ],
  },
  {
    id: 2,
    name: "Dessert Rose",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D",
    rating: 4.5,
    tags: ["Cafes", "Desserts"],
    categoryId: 2,
    isDeleted: false,
    description: "Dessert Rose is a cafe that specializes in desserts.",
    currency: "$",
    foodSizes: [
      {
        id: 1,
        name: "Small",
        price: 5.99,
        weight: 100,
        note: "Small dessert",
        quantity: 1,
        foodId: 2,
      },
    ],
  },
  {
    id: 3,
    name: "Barbecue Nation",
    image:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D",
    rating: 4.6,
    tags: ["Barbecue", "Chicken"],
    categoryId: 3,
    isDeleted: false,
    description:
      "Barbecue Nation is a restaurant that specializes in barbecue.",
    currency: "$",
    foodSizes: [
      {
        id: 1,
        name: "Small",
        price: 5.99,
        weight: 100,
        note: "Small barbecue",
        quantity: 1,
        foodId: 3,
      },
    ],
  },
  {
    id: 4,
    name: "Twinkle Star",
    image:
      "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGZvb2R8ZW58MHx8MHx8fDA%3D",
    rating: 4.6,
    tags: ["Barbecue", "Chicken"],
    categoryId: 4,
    isDeleted: false,
    description: "Twinkle Star is a restaurant that specializes in barbecue.",
    currency: "$",
    foodSizes: [
      {
        id: 1,
        name: "Small",
        price: 5.99,
        weight: 100,
        note: "Small barbecue",
        quantity: 1,
        foodId: 4,
      },
    ],
  },
];
