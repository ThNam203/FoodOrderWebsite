"use client";

import MainPageCarousel from "@/components/main_page_carousel";
import CurrentLocationMap from "@/components/map";

export default function IntroPage() {
  return (
    <div className="h-screen overflow-y-scroll">
      <section className="p-2">
        <MainPageCarousel />
      </section>
      <section className="w-full mt-16 flex flex-col items-center text-black">
        <h3 className="text-black text-2xl font-bold">
          ONLINE ORDERING IS NOW AVAILABLE!
        </h3>
        <p className="text-black text-lg text-center w-[800px] mb-16">
          We&apos;ve streamlined the process to make it easier for you to enjoy
          your favorite dishes from the comfort of your home. Experience the
          convenience of online ordering today and let us bring the flavors of
          our restaurant directly to you!
        </p>
        <a
          href="/"
          className="px-10 py-6 mb-16 border-2 border-black text-black hover:text-white rounded-sm  hover:cursor-pointer hover:bg-primary font-bold "
        >
          ORDER ONLINE
        </a>
        <div className="grid grid-cols-3 w-[70%]">
          <div>
            <p className="text-xl text-center tracking-widest font-semibold">
              LOCATION
            </p>
            <p className="text-center font-medium my-2">SE109.O21 St.</p>
            <p className="text-center">UIT, Thu Duc, TPHCM</p>
          </div>
          <div>
            <p className="text-xl text-center tracking-widest font-semibold">
              HOURS
            </p>
            <p className="text-center font-medium my-2">
              Brunch: Thursday - Monday, 9am to 2:30pm{" "}
            </p>
            <p className="text-center">Dinner: Thursday - Sunday, 5pm to 9pm</p>
          </div>
          <div>
            <p className="text-xl text-center tracking-widest font-semibold">
              CONTACT
            </p>
            <p className="text-center font-medium my-2">(626) 281-1035</p>
            <p className="text-center">hello@sen1orkitchenhcm.com</p>
          </div>
        </div>
      </section>
      <section className="text-black w-full my-16">
        <CurrentLocationMap />
      </section>
      <section className="bg-primary py-8 px-12 flex justify-evenly">
        <div>
          <h2 className="text-xl font-bold">About Us Devs</h2>
          <ul>
            <li className="my-4">
              <a className="underline hover:cursor-pointer hover:font-bold font-medium text-base">
                Nam, Huỳnh Thành
              </a>
            </li>
            <li className="my-4">
              <a className="underline hover:cursor-pointer hover:font-bold font-medium text-base">
                Đạt, Phạm Tiến{" "}
              </a>
            </li>
            <li className="my-4">
              <a className="underline hover:cursor-pointer hover:font-bold font-medium text-base">
                Khôi, Nguyễn Nguyên
              </a>
            </li>
            <li className="my-4">
              <a className="underline hover:cursor-pointer hover:font-bold font-medium text-base">
                Sơn, Trương Văn Hoàng
              </a>
            </li>
          </ul>
          <p>UIT, Thu Duc, Thanh Pho HCM</p>
        </div>
        <div>
          <p className="hover:cursor-pointer hover:font-bold hover:underline">
            FAQS
          </p>
          <p className="hover:cursor-pointer hover:font-bold hover:underline">
            CAREERS
          </p>
          <p className="hover:cursor-pointer hover:font-bold hover:underline">
            STORES
          </p>
          <p className="hover:cursor-pointer hover:font-bold hover:underline">
            PRIVACY POLICY
          </p>
          <p className="hover:cursor-pointer hover:font-bold hover:underline">
            TERMS OF USE
          </p>
          <p className="hover:cursor-pointer hover:font-bold hover:underline">
            SHIPPING POLICY
          </p>
          <p className="hover:cursor-pointer hover:font-bold hover:underline">
            REFUND POLICY
          </p>
        </div>
        <div>
          <ul>
            <li>
              <a className="hover:cursor-pointer hover:font-bold hover:underline">
                FACEBOOK
              </a>
            </li>
            <li>
              <a className="hover:cursor-pointer hover:font-bold hover:underline">
                GITHUB
              </a>
            </li>
            <li>
              <a className="hover:cursor-pointer hover:font-bold hover:underline">
                LINKEDIN
              </a>
            </li>
          </ul>
          <h3 className="text-center">© 2024 FFOOD&apos;S KITCHEN</h3>
        </div>
      </section>
    </div>
  );
}
