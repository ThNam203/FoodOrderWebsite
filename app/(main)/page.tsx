"use client";

import CategoryCarousel from "@/components/CustomCarousel/category_carousel";
import { FoodDetail } from "@/components/food_detail";
import MainPageItem from "@/components/main_page_item";
import { showErrorToast, showSuccessToast } from "@/components/toast";
import { FoodToReceive } from "@/convertor/foodConvertor";
import { Cart } from "@/models/Cart";
import { Food, FoodSize } from "@/models/Food";
import default_user_image from "@/public/images/default_user.png";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addCartItem } from "@/redux/slices/cart";
import { setFoodCategories } from "@/redux/slices/category";
import { setFoods } from "@/redux/slices/food";
import CartService from "@/services/cartService";
import FoodService from "@/services/foodService";
import emblaStyle from "@/styles/embla_carousel.module.css";
import { cn } from "@/utils/cn";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const dispatch = useAppDispatch();
  const [activeCategory, setActiveCategory] = useState("All");
  const categoriesContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const food = useAppSelector((state) => state.food.activeFood);
  const categories = useAppSelector((state) => state.foodCategory.value);
  const thisUser = useAppSelector((state) => state.profile.value);
  const [topFoods, setTopFoods] = useState<Food[]>([]);
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

      await FoodService.getTopFoodInMonthRange()
        .then((res) => {
          const data = res.data[0].values.map((food: any) =>
            FoodToReceive(food)
          );
          data.slice(0, data.length > 4 ? 4 : data.length - 1);
          setTopFoods(data);
        })
        .catch((err) => {
          showErrorToast("Failed to get top foods");
        });

      await FoodService.getCategories()
        .then((res) => {
          dispatch(setFoodCategories(res.data));
        })
        .catch((err) => {
          showErrorToast("Failed to fetch categories");
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
        className="relative h-screen flex overflow-y-scroll"
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
              className="flex flex-row items-center gap-4 cursor-pointer sm:hover:bg-gray-50/20 rounded-md sm:px-4 sm:py-1 ease-linear duration-200"
              onClick={() => {
                router.push("/user-setting");
              }}
            >
              <p className="text-sm text-white font-semibold max-sm:hidden">
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
          {/* <ImageCarousel carouselItems={data.adImages} className="mt-12" /> */}
          <div className="grid grid-cols-6 lg:grid-rows-2 max-lg:grid-rows-3 mt-12 rounded-lg gap-1">
            <img
              src="https://cf.shopee.vn/file/vn-50009109-93074cd7272fcd06fc514ef80e8aa20f_xxhdpi"
              alt="banner 1"
              className="lg:col-span-4 max-lg:col-span-6 row-span-2 h-full object-cover rounded-md"
            />
            <img
              src="https://cf.shopee.vn/file/vn-50009109-ed6696a2bea64ffee99377b73c44d5e8_xhdpi"
              alt="banner 2"
              className="lg:col-span-2 max-lg:col-span-3 max-lg:row-span-1 max-lg:row-start-3 rounded-md"
            />
            <img
              src="https://cf.shopee.vn/file/vn-50009109-c5335039e1b1aab390cc29f3446908fc_xhdpi"
              alt="banner 2"
              className="lg:col-span-2 max-lg:col-span-3 max-lg:row-span-1 max-lg:row-start-3 rounded-md"
            />
          </div>
          <section>
            <h3 className="text-4xl font-semibold my-8">Best sellers</h3>

            <FoodListComponent
              foods={topFoods}
              favoriteFoodIds={favoriteFoodList}
              onFavoriteFoodIdsChange={handleFavoriteFoodIdsChange}
            />
          </section>
          <section>
            <h3 className="text-4xl font-semibold my-8">Best rated</h3>

            <FoodListComponent
              foods={(() => {
                const sorted = food.toSorted((a, b) => a.rating - b.rating);
                return sorted.splice(
                  0,
                  sorted.length > 4 ? 4 : sorted.length - 1
                );
              })()}
              favoriteFoodIds={favoriteFoodList}
              onFavoriteFoodIdsChange={handleFavoriteFoodIdsChange}
            />
          </section>
          <section className="mb-8 space-y-4">
            <CategoryCarousel
              carouselItems={categories.map((item) => ({
                ...item,
                quantity: food.filter((f) => f.category.id === item.id).length,
              }))}
            />
            <FoodListComponent
              foods={food}
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
  const [selectedFood, setSelectedFood] = useState<Food>();
  const [selectedSize, setSelectedSize] = useState<FoodSize>();
  const [selectedFoodQuantity, setSelectedFoodQuantity] = useState(1);

  const handleFoodClick = (food: Food) => {
    setSelectedFood(food);
    if (selectedFood !== food) setSelectedSize(food.foodSizes[0]);
    setOpen(!isOpen);
  };

  const handleAddToCart = async (food: Food) => {
    if (!selectedSize) return;
    const newCartItem: Cart = {
      id: -1,
      quantity: selectedFoodQuantity,
      price: selectedFoodQuantity * selectedSize.price,
      food: food,
      foodSize: selectedSize,
      note: "",
    };
    await CartService.AddCart(newCartItem)
      .then((res) => {
        console.log(res);
        dispatch(addCartItem(res.data));
        showSuccessToast("Added to cart successfully");
        setOpen(!isOpen);
      })
      .catch((err) => {
        console.log(err);
        showErrorToast("Failed to add to cart");
      });
  };
  const handleFoodSizeChange = (foodSize: FoodSize) => {
    if (selectedSize !== foodSize) setSelectedSize(foodSize);
  };

  return (
    <div className={cn(emblaStyle.embla)} ref={emblaRef}>
      <div className="w-full flex gap-[calc((100%-99%)/3)] mb-8">
        {foods.map((food: any, index: number) => (
          <MainPageItem
            className="xl:flex-[0_0_33%] max-xl:flex-[0_0_50%] max-md:flex-[0_0_100%] min-w-0"
            food={food}
            key={index}
            isFavorite={favoriteFoodIds.includes(food.id)}
            onFavoriteChange={(isFavorite: boolean) =>
              onFavoriteFoodIdsChange && onFavoriteFoodIdsChange(food.id)
            }
            onClick={() => handleFoodClick(food)}
          />
        ))}

        {selectedFood && selectedSize && (
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
              onFavoriteFoodIdsChange &&
              onFavoriteFoodIdsChange(selectedFood.id)
            }
            onAddToCart={() => handleAddToCart(selectedFood)}
          />
        )}
      </div>
    </div>
  );
};
