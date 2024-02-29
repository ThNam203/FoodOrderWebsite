"use client";

import { useState } from "react";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState(1);

  var data: any = {
    categories: [
      {
        id: 1,
        text: "All",
        icon: "https://cdn-icons-png.flaticon.com/128/5110/5110796.png",
      },
      {
        id: 2,
        text: "Pizzaa",
        icon: "https://cdn-icons-png.flaticon.com/128/1404/1404945.png",
      },
      {
        id: 3,
        text: "Asian",
        icon: "https://cdn-icons-png.flaticon.com/128/4329/4329449.png",
      },
      {
        id: 4,
        text: "Burgers",
        icon: "https://cdn-icons-png.flaticon.com/128/878/878052.png",
      },
      {
        id: 5,
        text: "Barbecue",
        icon: "https://cdn-icons-png.flaticon.com/128/2946/2946598.png",
      },
      {
        id: 6,
        text: "Desserts",
        icon: "https://cdn-icons-png.flaticon.com/128/4465/4465242.png",
      },
      {
        id: 7,
        text: "Thai",
        icon: "https://cdn-icons-png.flaticon.com/128/197/197452.png",
      },
      {
        id: 8,
        text: "Sushi",
        icon: "https://cdn-icons-png.flaticon.com/128/3183/3183425.png",
      },
    ],
    foodItems: [
      {
        title: "Bagel Story",
        image:
          "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/25008305-442083466194421-4458779521922891776-n-1517333246.jpg?crop=1xw:1xh;center,top&resize=480:*",
        prepTimeValue: "25 - 30",
        prepTimeUnit: "min",
        rating: 4.7,
        cat1: "Deli",
        cat2: "Bagels",
        range: "$$",
      },
      {
        title: "Dessert Rose",
        image:
          "https://images.mygoodtimes.in/wp-content/uploads/2018/12/08210525/Bakers-Copy.jpg",
        prepTimeValue: "30 - 35",
        prepTimeUnit: "min",
        rating: 4.5,
        cat1: "Cafes",
        cat2: "Desserts",
        range: "$",
      },
      {
        title: "Barbecue Nation",
        image:
          "https://chowhound1.cbsistatic.com/thumbnail/370/0/chowhound1.cbsistatic.com/assets/2012/08/30453_RecipeImage_620x413_grilled_chicken_nectarine.jpg",
        prepTimeValue: "40 - 60",
        prepTimeUnit: "min",
        rating: 4.6,
        cat1: "Barbecue",
        cat2: "Chicken",
        range: "$$$",
      },
    ],
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

  return (
    <>
      <div className="flex" v-cloak id="dribbleShot">
        <div className="main px-8 border-gray-200">
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
            <div className="flex flex-row items-center gap-2 hover:cursor-pointer">
              <img
                src="https://scontent.fsgn19-1.fna.fbcdn.net/v/t1.6435-1/89355819_802321806918041_2820306896441835520_n.jpg?stp=dst-jpg_p240x240&_nc_cat=106&ccb=1-7&_nc_sid=2b6aad&_nc_ohc=mGJ07GAwJPIAX-HmCpl&_nc_ht=scontent.fsgn19-1.fna&oh=00_AfDzBpS8oC1vm-lKKyG65r9dHO5IqZrn36HGZ17stH9nXg&oe=6606CBD4"
                className="w-10 h-10 rounded-full"
              />
              <p className="text-sm">Huynh Nam</p>
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
          <div className="flex mt-8 justify-center">
            <h3 className="text-3xl font-bold">Categories</h3>
          </div>
          <div className="grid grid-cols-9 gap-6 mt-12">
            {data.categories.map((cat: any, idx: number) => (
              <div
                key={idx}
                onClick={() => setActiveCategory(cat.id)}
                className={`border rounded-full p-2 flex flex-col items-center shadow-xl cursor-pointer transition-colors duration-700 ease-in-out ${
                  cat.id === activeCategory ? "bg-yellow-400" : ""
                }`}
              >
                <div className="rounded-full p-2 bg-white">
                  <img className="h-12 w-12" src={cat.icon} alt="" />
                </div>
                <p className="mt-3 mb-10 font-bold text-xs">{cat.text}</p>
              </div>
            ))}
            <button className="h-10 rounded-lg self-center hover:shadow-xl flex justify-center items-center bg-gray-100 p-3 ml-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20px"
                height="20px"
                viewBox="0 0 24 24"
              >
                <path fill="black" d="M12.6 12L8 7.4L9.4 6l6 6l-6 6L8 16.6z" />
              </svg>
            </button>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-10">
              {data.foodItems.map((food: any, index: number) => (
                <div className="flex flex-row">
                  <div
                    key={index}
                    className="shadow-lg relative h-40 custom-rounded"
                    style={{
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                      backgroundImage: `url(${food.image})`,
                    }}
                  >
                    <div className="absolute bottom-0 left-0 w-1/3 bg-gray-200 rounded-tr-lg p-2 text-center text-xs">
                      <span className="font-bold">{food.prepTimeValue}</span>{" "}
                      {food.prepTimeUnit}
                    </div>
                  </div>
                  <p className="mt-4 font-medium">{food.title}</p>
                  <div className="mt-2 flex items-center">
                    <span className="text-xs">
                      <i className="fa fa-star"></i> {food.rating}
                    </span>
                    <span className="text-gray-600 font-hairline text-xs mx-4">
                      {food.cat1}
                    </span>
                    <span className="text-gray-600 font-hairline text-xs mx-4">
                      {food.cat2}
                    </span>
                    <span className="text-gray-600 font-hairline text-xs mx-4">
                      {food.range}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      <div className="flex h-10">
        <div className="flex-grow px-16 main border-r border-gray-200"></div>
        <div className="sidebar bg-gray-100"></div>
      </div>
    </>
  );
}
