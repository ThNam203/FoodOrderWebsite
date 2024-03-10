"use client";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function MainPageCarousel() {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 2000,
  };
  return (
    <Slider {...settings}>
      <div className="bg-[url('/images/banner_intro_1.jpg')] h-72 bg-center bg-cover relative after:absolute after:left-0 after:right-0 after:bottom-0 after:top-0 after:bg-slate-800 after:bg-opacity-40">
        <h3 className="absolute left-60 bottom-3 right-3 text-4xl text-right z-[1]">
          Indulge in the exquisite flavors of our artisanal cheeses, handcrafted
          with the finest ingredients sourced locally.
        </h3>
      </div>
      <div className="bg-[url('/images/banner_intro_2.jpg')] h-72 bg-center bg-cover relative after:absolute after:left-0 after:right-0 after:bottom-0 after:top-0 after:bg-slate-800 after:bg-opacity-40">
        <h3 className="absolute left-60 bottom-3 right-3 text-4xl text-right z-[1]">
          Elevate your dining experience with our succulent, melt-in-your-mouth
          steak, expertly seasoned and grilled to perfection.
        </h3>
      </div>
      <div className="bg-[url('/images/banner_intro_3.jpg')] h-72 bg-center bg-cover relative after:absolute after:left-0 after:right-0 after:bottom-0 after:top-0 after:bg-slate-800 after:bg-opacity-40">
        <h3 className="absolute left-60 bottom-3 right-3 text-4xl text-right z-[1]">
          Savor the harmony of sweet and savory in our signature dessert, a
          decadent chocolate lava cake oozing with rich, velvety goodness.
        </h3>
      </div>
    </Slider>
  );
}
