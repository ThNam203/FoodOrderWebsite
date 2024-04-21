import { Food, FoodStatus } from "@/models/Food";

export const fakeFoodItems: Food[] = [
  {
    id: 1,
    name: "Bagel Story",
    images: [
      "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/25008305-442083466194421-4458779521922891776-n-1517333246.jpg?crop=1xw:1xh;center,top&resize=480:*",
    ],
    rating: 4.7,
    tags: ["Deli", "Bagels"],
    category: {
      id: 1,
      name: "Deli",
      image:
        "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D",
    },
    status: FoodStatus.ACTIVE,
    description: "Bagel Story is a deli that specializes in bagels.",
    foodSizes: [
      {
        id: 1,
        name: "Small",
        price: 120000,
        weight: 100,
        note: "Small bagel",
      },
      {
        id: 1,
        name: "Medium",
        price: 150000,
        weight: 200,
        note: "Medium bagel",
      },
    ],
    isDeleted: false,
    createdAt: new Date(),
  },
  {
    id: 2,
    name: "Dessert Rose",
    images: [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D",
    ],
    rating: 4.5,
    tags: ["Cafes", "Desserts"],
    category: {
      id: 2,
      name: "Cafes",
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D",
    },
    status: FoodStatus.ACTIVE,
    description: "Dessert Rose is a cafe that specializes in desserts.",
    foodSizes: [
      {
        id: 1,
        name: "Small",
        price: 120000,
        weight: 100,
        note: "Small dessert",
      },
    ],
    isDeleted: false,
    createdAt: new Date(),
  },
  {
    id: 3,
    name: "Barbecue Nation",
    images: [
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D",
    ],
    rating: 4.6,
    tags: ["Barbecue", "Chicken"],
    category: {
      id: 3,
      name: "Barbecue",
      image:
        "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D",
    },
    status: FoodStatus.ACTIVE,
    description:
      "Barbecue Nation is a restaurant that specializes in barbecue and chicken.",
    foodSizes: [
      {
        id: 1,
        name: "Small",
        price: 120000,
        weight: 100,
        note: "Small barbecue",
      },
    ],
    isDeleted: false,
    createdAt: new Date(),
  },
  {
    id: 4,
    name: "Twinkle Star",
    images: [
      "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGZvb2R8ZW58MHx8MHx8fDA%3D",
    ],
    rating: 4.6,
    tags: ["Barbecue", "Chicken"],
    category: {
      id: 3,
      name: "Barbecue",
      image:
        "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGZvb2R8ZW58MHx8MHx8fDA%3D",
    },
    status: FoodStatus.ACTIVE,
    description:
      "Twinkle Star is a restaurant that specializes in barbecue and chicken.",
    foodSizes: [
      {
        id: 1,
        name: "Small",
        price: 120000,
        weight: 100,
        note: "Small barbecue",
      },
    ],
    isDeleted: false,
    createdAt: new Date(),
  },
  {
    id: 1,
    name: "Pizza",
    rating: 3,
    category: {
      id: 777777,
      name: "Italian",
      image:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    images: [
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    status: FoodStatus.ACTIVE,
    description: "Delicious pizza with assorted toppings.",
    createdAt: new Date(),
    isDeleted: false,
    foodSizes: [
      {
        id: 1,
        name: "Default",
        weight: 100,
        note: "6 pieces",
        price: 100000,
      },
    ],
    tags: ["pizza", "italian"],
  },
  {
    id: 2,
    name: "Sushi",
    rating: 3,
    category: {
      id: 777777,
      name: "Japanese",
      image:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    images: [
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    status: FoodStatus.ACTIVE,
    description: "Fresh sushi rolls with wasabi and soy sauce.",
    createdAt: new Date(),
    isDeleted: false,
    foodSizes: [
      {
        id: 1,
        name: "Default",
        weight: 100,
        note: "6 pieces",
        price: 100000,
      },
    ],
    tags: ["sushi", "japanese"],
  },
];
