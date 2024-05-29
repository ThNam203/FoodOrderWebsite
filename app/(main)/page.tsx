"use client";

import CategoryCarousel from "@/components/CustomCarousel/category_carousel";
import { FoodDetail } from "@/components/food_detail";
import MainPageItem, { Tag } from "@/components/main_page_item";
import { showErrorToast, showSuccessToast } from "@/components/toast";
import { FoodToReceive } from "@/convertor/foodConvertor";
import { Cart } from "@/models/Cart";
import { Food, FoodSize } from "@/models/Food";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addCartItem } from "@/redux/slices/cart";
import { setFoodCategories } from "@/redux/slices/category";
import { getActiveFood, setFoods } from "@/redux/slices/food";
import CartService from "@/services/cartService";
import FoodService from "@/services/foodService";
import emblaStyle from "@/styles/embla_carousel.module.css";
import { cn } from "@/utils/cn";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import default_food_image from "@/public/images/default_food.jpg";
import Image from "next/image";
import { formatNumberInput } from "@/utils/func";
import { FoodPrice } from "@/components/food_price";
import FoodRating from "@/components/food_rating";

export default function Home() {
  const dispatch = useAppDispatch();
  const [activeCategory, setActiveCategory] = useState("All");
  const categoriesContainerRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<number>(-1);
  const router = useRouter();
  const foods = useAppSelector((state) => state.food.activeFood);
  const categories = useAppSelector((state) => state.foodCategory.value);
  const thisUser = useAppSelector((state) => state.profile.value);
  const [topFoods, setTopFoods] = useState<Food[]>([]);
  const [searchFocus, setSearchFocus] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [bestRatedFoods, setBestRatedFoods] = useState<Food[]>([]);
  const [favoriteFoodIds, setFavoriteFoodIds] = useState<number[]>([]);
  const [favoriteFoodList, setFavoriteFoodList] = useState<Food[]>([]);

  const [isOpen, setOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState<Food>();
  const [selectedSize, setSelectedSize] = useState<FoodSize>();
  const [selectedFoodQuantity, setSelectedFoodQuantity] = useState(1);

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
          const data = getActiveFood(res.data[0].data.map((item) => item.food));
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
    if (!thisUser || !thisUser.listFavorite) return;
    setFavoriteFoodIds(thisUser.listFavorite);
  }, [thisUser]);

  useEffect(() => {
    const sorted = foods.toSorted((a, b) => a.rating - b.rating);
    setBestRatedFoods(sorted.slice(0, sorted.length > 4 ? 4 : sorted.length));
  }, [foods]);

  useEffect(() => {
    if (!favoriteFoodIds || favoriteFoodIds.length === 0) return;
    const newFavoriteFoodList = foods.filter((f) =>
      favoriteFoodIds.includes(f.id)
    );
    setFavoriteFoodList(newFavoriteFoodList);
  }, [favoriteFoodIds, foods]);

  useEffect(() => {
    console.log("top foods", topFoods);
  }, [topFoods]);

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
    if (favoriteFoodIds.includes(id)) {
      const newFavoriteFoodList = favoriteFoodIds.filter((foodId) => {
        return foodId !== id;
      });
      setFavoriteFoodIds(newFavoriteFoodList);
    } else {
      setFavoriteFoodIds([...favoriteFoodIds, id]);
    }
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
  const handleFoodClick = (food: Food) => {
    setSelectedFood(food);
    if (selectedFood !== food) setSelectedSize(food.foodSizes[0]);
    setOpen(!isOpen);
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
        <div className="w-full h-fit px-8 border-gray-200 pb-8">
          <div className="h-12 mt-8 flex items-center justify-between relative">
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
                className="px-4 self-stretch bg-transparent flex-grow text-black outline-none"
                placeholder="Search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onFocus={() => setSearchFocus(true)}
                onBlur={() => setSearchFocus(false)}
              />
            </div>
            {searchFocus && searchInput.length > 0 ? (
              <div className="absolute bg-slate-700 top-full left-0 w-2/3 mt-1 rounded-md overflow-hidden">
                {foods
                  .filter((f) =>
                    f.name.toLowerCase().includes(searchInput.toLowerCase())
                  )
                  .map((f) => (
                    <FoodItemSearch
                      food={f}
                      key={f.id}
                      searchInput={searchInput}
                      onMouseDown={() => handleFoodClick(f)}
                    />
                  ))}
              </div>
            ) : null}
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
          {topFoods && topFoods.length > 0 && (
            <section>
              <h3 className="text-4xl font-semibold my-8">Best sellers</h3>
              <FoodListComponent
                foods={topFoods}
                favoriteFoodIds={favoriteFoodIds}
                onFavoriteFoodIdsChange={handleFavoriteFoodIdsChange}
              />
            </section>
          )}

          {bestRatedFoods && bestRatedFoods.length > 0 && (
            <section>
              <h3 className="text-4xl font-semibold my-8">Best rated</h3>

              <FoodListComponent
                foods={bestRatedFoods}
                favoriteFoodIds={favoriteFoodIds}
                onFavoriteFoodIdsChange={handleFavoriteFoodIdsChange}
              />
            </section>
          )}

          {/* {favoriteFoodList && favoriteFoodList.length > 0 && (
            <section>
              <h3 className="text-4xl font-semibold mb-8">Favorite</h3>
              <FoodListComponent
                foods={favoriteFoodList}
                favoriteFoodIds={favoriteFoodIds}
                onFavoriteFoodIdsChange={handleFavoriteFoodIdsChange}
              />
            </section>
          )} */}

          <section>
            <CategoryCarousel
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              carouselItems={categories.map((item) => ({
                ...item,
                quantity: foods.filter((f) => f.category.id === item.id).length,
              }))}
            />

            <FoodListComponent
              foods={foods.filter(
                (f) =>
                  selectedCategory === -1 || f.category.id === selectedCategory
              )}
              favoriteFoodIds={foods
                .filter(
                  (f) =>
                    selectedCategory === -1 ||
                    f.category.id === selectedCategory
                )
                .map((f) => f.id)}
              onFavoriteFoodIdsChange={handleFavoriteFoodIdsChange}
            />
          </section>
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
              onFoodSizeChange={(foodSize: any) =>
                handleFoodSizeChange(foodSize)
              }
              isFavorite={favoriteFoodIds.includes(selectedFood.id)}
              onFavoriteChange={(isFavorite: boolean) =>
                onFavoriteFoodIdsChange &&
                onFavoriteFoodIdsChange(selectedFood.id)
              }
              onAddToCart={() => handleAddToCart(selectedFood)}
            />
          )}
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

const FoodItemSearch = ({
  food,
  onMouseDown,
  searchInput,
}: {
  food: Food;
  onMouseDown?: () => void;
  searchInput?: string;
}) => {
  const imageSrc =
    food.images && food.images.length > 0 ? food.images[0] : default_food_image;
  const foodPriceRange = food.foodSizes.toSorted((a, b) => a.price - b.price);

  const highlightMatch = (text: string, query: string | undefined) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(
      regex,
      '<mark style="background-color: yellow;">$1</mark>'
    );
  };

  const highlightedName = highlightMatch(food.name, searchInput);

  return (
    <div
      onMouseDown={onMouseDown}
      className="px-4 py-2 text-sm flex flex-row items-center hover:bg-slate-600 hover:cursor-pointer"
    >
      <div className="rounded-md overflow-hidden">
        <Image
          alt="food image"
          width={70}
          height={60}
          src={imageSrc}
          className="object-cover w-[70px] h-[60px] rounded-md"
        />
      </div>
      <div className="flex flex-col m-2 gap-2">
        <div className="flex flex-row items-center gap-4">
          <p
            className="font-semibold"
            dangerouslySetInnerHTML={{ __html: highlightedName }}
          />
          <FoodRating
            className={cn(food.rating === 0 ? "hidden" : "")}
            rating={food.rating}
          />
        </div>
        <FoodPrice
          currency="$"
          defaultPrice={foodPriceRange[0].price}
          secondPrice={foodPriceRange[foodPriceRange.length - 1].price}
        />
      </div>
    </div>
  );
};
