import MainPageCarousel from "@/components/main_page_carousel";
import CurrentLocationMap from "@/components/map";

export default function IntroPage() {
  return (
    <>
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
          href="/browse"
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
            <p className="text-center font-medium my-2">Brunch: Thursday - Monday, 9am to 2:30pm </p>
            <p className="text-center">Dinner: Thursday - Sunday, 5pm to 9pm</p>
          </div>
          <div>
            <p className="text-xl text-center tracking-widest font-semibold">
              CONTACT
            </p>
            <p className="text-center font-medium my-2">(626) 281-1035</p>
            <p className="text-center">hello@yangskitchenla.com</p>
          </div>
        </div>
      </section>
      <section className="text-black w-full my-16">
        {/* <CurrentLocationMap /> */}
        <h3 className="text-3xl text-center">© 2024 SE109&apos;S KITCHEN</h3>
      </section>
    </>
  );
}
