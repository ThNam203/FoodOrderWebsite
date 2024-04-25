"use client";

import { FoodDetail } from "@/components/food_detail";
import MainPageItem from "@/components/main_page_item";
import { showErrorToast, showSuccessToast } from "@/components/toast";
import { FoodToReceive } from "@/convertor/foodConvertor";
import { fakeFoodItems } from "@/fakedata/foodData";
import { Cart } from "@/models/Cart";
import { Food, FoodSize } from "@/models/Food";
import default_user_image from "@/public/images/default_user.png";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addCartItem } from "@/redux/slices/cart";
import { setFoods } from "@/redux/slices/food";
import CartService from "@/services/cartService";
import FoodService from "@/services/foodService";
import emblaStyle from "@/styles/embla_carousel.module.css";
import { cn } from "@/utils/cn";
import { he, is } from "date-fns/locale";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

var data: any = {
  categories: [
    {
      id: 1,
      text: "All",
      icon: "https://cdn-icons-png.flaticon.com/128/5110/5110796.png",
      quantity: 5,
    },
    {
      id: 2,
      text: "Pizzaa",
      icon: "https://cdn-icons-png.flaticon.com/128/1404/1404945.png",
      quantity: 5,
    },
    {
      id: 3,
      text: "Asian",
      icon: "https://cdn-icons-png.flaticon.com/128/4329/4329449.png",
      quantity: 5,
    },
    {
      id: 4,
      text: "Burgers",
      icon: "https://cdn-icons-png.flaticon.com/128/878/878052.png",
      quantity: 5,
    },
    {
      id: 5,
      text: "Barbecue",
      icon: "https://cdn-icons-png.flaticon.com/128/2946/2946598.png",
      quantity: 5,
    },
    {
      id: 6,
      text: "Desserts",
      icon: "https://cdn-icons-png.flaticon.com/128/4465/4465242.png",
      quantity: 5,
    },
    {
      id: 7,
      text: "Thai",
      icon: "https://cdn-icons-png.flaticon.com/128/197/197452.png",
      quantity: 5,
    },
    {
      id: 8,
      text: "Sushi",
      icon: "https://cdn-icons-png.flaticon.com/128/3183/3183425.png",
      quantity: 5,
    },
  ],
  // foodItems: [
  //   {
  //     title: "Bagel Story",
  //     image:
  //       "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/25008305-442083466194421-4458779521922891776-n-1517333246.jpg?crop=1xw:1xh;center,top&resize=480:*",
  //     prepTimeValue: "25 - 30",
  //     prepTimeUnit: "min",
  //     rating: 4.7,
  //     cat1: "Deli",
  //     cat2: "Bagels",
  //     range: "$$",
  //     favourite: false,
  //   },
  //   {
  //     title: "Dessert Rose",
  //     image:
  //       "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D",
  //     prepTimeValue: "30 - 35",
  //     prepTimeUnit: "min",
  //     rating: 4.5,
  //     cat1: "Cafes",
  //     cat2: "Desserts",
  //     range: "$",
  //     favourite: false,
  //   },
  //   {
  //     title: "Barbecue Nation",
  //     image:
  //       "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D",
  //     prepTimeValue: "40 - 60",
  //     prepTimeUnit: "min",
  //     rating: 4.6,
  //     cat1: "Barbecue",
  //     cat2: "Chicken",
  //     range: "$$$",
  //     favourite: false,
  //   },
  //   {
  //     title: "Twinkle Star",
  //     image:
  //       "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGZvb2R8ZW58MHx8MHx8fDA%3D",
  //     prepTimeValue: "40 - 60",
  //     prepTimeUnit: "min",
  //     rating: 4.6,
  //     cat1: "Barbecue",
  //     cat2: "Chicken",
  //     range: "$$$",
  //     favourite: false,
  //   },
  // ],
  cartItems: [
    {
      title: "BBQ Burger",
      image:
        "https://hips.hearstapps.com/pop.h-cdn.co/assets/cm/15/05/54ca71fb94ad3_-_5summer_skills_burger_470_0808-de.jpg?crop=1xw:1.0xh;center,top&resize=480:*",
      quantity: 1,
      price: 14.99,
    },
    {
      title: "French Fries",
      image:
        "https://recipes.timesofindia.com/thumb/54659021.cms?width=1200&height=1200",
      quantity: 1,
      price: 9.99,
    },
    {
      title: "Cheese Sauce",
      image:
        "https://www.pepperscale.com/wp-content/uploads/2017/10/spicy-nacho-cheese.jpeg",
      quantity: 1,
      price: 0.99,
    },
  ],
};

export default function Home() {
  const dispatch = useAppDispatch();
  const [activeCategory, setActiveCategory] = useState(1);
  const categoriesContainerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setOpen] = useState(false);
  const router = useRouter();
  const food = useAppSelector((state) => state.food.activeFood);
  const thisUser = useAppSelector((state) => state.profile.value);
  const [favoriteFoodList, setFavoriteFoodList] = useState<number[]>([]);

  const onCategoriesScrollButtonClick = (scrollValue: number) => {
    if (categoriesContainerRef.current) {
      categoriesContainerRef.current.scrollLeft += scrollValue;
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      await FoodService.getAllFood()
        .then((res) => {
          const data = res.data.map((food) => FoodToReceive(food));
          dispatch(setFoods(data));
        })
        .catch((err) => {
          showErrorToast("Failed to fetch data");
        });
    };
    fetchData();
  }, []);

  useEffect(() => {
    setFavoriteFoodList(
      thisUser && thisUser.listFavorite ? thisUser.listFavorite : []
    );
  }, [thisUser]);

  const handleFavoriteFoodIdsChange = async (id: number) => {
    await FoodService.addFavouriteFood(id)
      .then(() => {
        onFavoriteFoodIdsChange(id);
      })
      .catch((err) => {
        showErrorToast("Failed to add to favorite");
      });
  };

  const onFavoriteFoodIdsChange = (id: number) => {
    if (favoriteFoodList.includes(id)) {
      const newFavoriteFoodList = favoriteFoodList.filter((foodId) => {
        return foodId !== id;
      });
      setFavoriteFoodList(newFavoriteFoodList);
    } else {
      setFavoriteFoodList([...favoriteFoodList, id]);
    }
  };

  return (
    <>
      <section
        className="h-screen flex overflow-y-scroll"
        style={{
          background:
            "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8) ), url('/images/bg-main-page.jpg')",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="w-full px-8 border-gray-200">
          <div className="h-12 mt-8 flex items-center justify-between">
            <div className="flex items-center rounded-md bg-gray-100 self-stretch px-4 w-2/3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20px"
                height="20px"
                viewBox="0 0 16 16"
              >
                <path
                  fill="black"
                  d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0a5.5 5.5 0 0 1 11 0"
                />
              </svg>
              <input
                type="text"
                className="px-4 self-stretch bg-transparent flex-grow outline-none"
                placeholder="Search"
              />
            </div>
            <div
              className="flex flex-row items-center gap-4 cursor-pointer hover:bg-gray-50/20 rounded-md px-4 py-1 ease-linear duration-200"
              onClick={() => {
                router.push("/user-setting");
              }}
            >
              <p className="text-sm text-white font-semibold">
                {thisUser ? thisUser.name : ""}
              </p>
              <Image
                width={500}
                height={400}
                sizes="100vw"
                src={
                  thisUser && thisUser.profileImage
                    ? thisUser.profileImage
                    : default_user_image
                }
                alt="image"
                className="w-[50px] h-[50px] flex-shrink-0 rounded-full object-cover overflow-hidden cursor-pointer"
              />
            </div>
          </div>
          <div className="grid grid-cols-6 grid-rows-2 mt-12 rounded-lg gap-1">
            <img
              src="https://cf.shopee.vn/file/vn-50009109-93074cd7272fcd06fc514ef80e8aa20f_xxhdpi"
              alt="banner 1"
              className="col-span-4 row-span-2 h-full object-cover rounded-md"
            />
            <img
              src="https://cf.shopee.vn/file/vn-50009109-ed6696a2bea64ffee99377b73c44d5e8_xhdpi"
              alt="banner 2"
              className="col-span-2 rounded-md"
            />
            <img
              src="https://cf.shopee.vn/file/vn-50009109-c5335039e1b1aab390cc29f3446908fc_xhdpi"
              alt="banner 2"
              className="col-span-2 rounded-md"
            />
          </div>
          <section>
            <h3 className="text-4xl font-semibold my-8">Best sellers</h3>

            <FoodListComponent
              foods={food}
              favoriteFoodIds={favoriteFoodList}
              onFavoriteFoodIdsChange={handleFavoriteFoodIdsChange}
            />
          </section>
          <section>
            <h3 className="text-4xl font-semibold my-8">On sale</h3>

            <FoodListComponent
              foods={fakeFoodItems}
              favoriteFoodIds={favoriteFoodList}
              onFavoriteFoodIdsChange={handleFavoriteFoodIdsChange}
            />
          </section>
          <section>
            <h3 className="text-4xl font-semibold my-8">Best rated</h3>
            <FoodListComponent
              foods={fakeFoodItems}
              favoriteFoodIds={favoriteFoodList}
              onFavoriteFoodIdsChange={handleFavoriteFoodIdsChange}
            />
          </section>
          <section className="mb-8">
            <h3 className="text-4xl font-semibold my-8">Categories</h3>
            <div className="flex flex-row gap-8 my-8 items-center w-full">
              <button
                onClick={() => onCategoriesScrollButtonClick(-50)}
                className="h-10 w-10 flex-grow-0 rounded-lg hover:shadow-xl flex justify-center items-center bg-gray-100 p-3 "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20px"
                  height="20px"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="black"
                    d="m14 18l-6-6l6-6l1.4 1.4l-4.6 4.6l4.6 4.6z"
                  />
                </svg>
              </button>
              <div
                className="flex flex-row flex-1 overflow-x-auto scrollbar small-scrollbar gap-2 pb-1"
                ref={categoriesContainerRef}
              >
                {data.categories.map((cat: any, idx: number) => (
                  <div
                    key={idx}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`rounded-md p-2 grid grid-cols-3 grid-rows-2 gap-2 shadow-xl cursor-pointer transition-colors duration-500 ease-in-out h-16 min-w-40 ${
                      cat.id === activeCategory ? "bg-primary" : ""
                    }`}
                  >
                    <div className="rounded-full flex items-center justify-center bg-white row-span-2">
                      <img className="h-8 w-8" src={cat.icon} alt="" />
                    </div>
                    <p className="font-bold text-xs col-span-2 text-ellipsis whitespace-nowrap overflow-hidden">
                      {cat.text}
                    </p>
                    <p className="text-xs text-slate-400 col-span-2 text-ellipsis whitespace-nowrap overflow-hidden">
                      {cat.quantity} dishes
                    </p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => onCategoriesScrollButtonClick(50)}
                className="h-10 w-10 flex-grow-0 rounded-lg hover:shadow-xl flex justify-center items-center bg-gray-100 p-3"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20px"
                  height="20px"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="black"
                    d="M12.6 12L8 7.4L9.4 6l6 6l-6 6L8 16.6z"
                  />
                </svg>
              </button>
            </div>
            <FoodListComponent
              foods={fakeFoodItems}
              favoriteFoodIds={favoriteFoodList}
              onFavoriteFoodIdsChange={handleFavoriteFoodIdsChange}
            />
          </section>
        </div>
      </section>
    </>
  );
}

const FoodListComponent = ({
  foods,
  favoriteFoodIds = [],
  onFavoriteFoodIdsChange,
}: {
  foods: Food[];
  favoriteFoodIds?: number[];
  onFavoriteFoodIdsChange?: (id: number) => void;
}) => {
  const [emblaRef] = useEmblaCarousel({}, [Autoplay()]);
  const dispatch = useAppDispatch();
  const [isOpen, setOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState<Food>(fakeFoodItems[0]);
  const [selectedSize, setSelectedSize] = useState<FoodSize>(
    selectedFood.foodSizes[0]
  );
  const [selectedFoodQuantity, setSelectedFoodQuantity] = useState(1);

  const handleFoodClick = (food: Food) => {
    setSelectedFood(food);
    if (selectedFood !== food) setSelectedSize(food.foodSizes[0]);
    setOpen(!isOpen);
  };

  const handleAddToCart = async (food: Food) => {
    const newCartItem: Cart = {
      id: -1,
      quantity: selectedFoodQuantity,
      price: selectedFoodQuantity * selectedSize.price,
      food: food,
      foodSize: selectedSize,
    };
    await CartService.AddCart(newCartItem)
      .then((res) => {
        console.log(res);
        dispatch(addCartItem(res.data));
        showSuccessToast("Added to cart successfully");
      })
      .catch((err) => {
        console.log(err);
        showErrorToast("Failed to add to cart");
      })
      .finally(() => {});
  };
  const handleFoodSizeChange = (foodSize: FoodSize) => {
    if (selectedSize !== foodSize) setSelectedSize(foodSize);
  };

  return (
    <div className={cn(emblaStyle.embla)} ref={emblaRef}>
      <div className="w-full flex gap-[calc((100%-99%)/3)] mb-8">
        {foods.map((food: any, index: number) => (
          <MainPageItem
            className="flex-[0_0_33%] min-w-0"
            food={food}
            key={index}
            isFavorite={favoriteFoodIds.includes(food.id)}
            onFavoriteChange={(isFavorite: boolean) =>
              onFavoriteFoodIdsChange && onFavoriteFoodIdsChange(food.id)
            }
            onClick={() => handleFoodClick(food)}
          />
        ))}

        <FoodDetail
          isOpen={isOpen}
          onOpenChange={() => setOpen(!isOpen)}
          food={selectedFood}
          foodQuantity={selectedFoodQuantity}
          onFoodQuantityChange={(quantity: number) =>
            setSelectedFoodQuantity(quantity)
          }
          selectedSize={selectedSize}
          onFoodSizeChange={(foodSize: any) => handleFoodSizeChange(foodSize)}
          isFavorite={favoriteFoodIds.includes(selectedFood.id)}
          onFavoriteChange={(isFavorite: boolean) =>
            onFavoriteFoodIdsChange && onFavoriteFoodIdsChange(selectedFood.id)
          }
          onAddToCart={() => handleAddToCart(selectedFood)}
        />
      </div>
    </div>
  );
};
