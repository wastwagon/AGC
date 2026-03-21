import React, { Component } from "react";
import Slider from "react-slick";
import Link from 'next/link'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";



const Hero3 = () => {

    var settings = {
        dots: false,
        arrows: true,
        speed: 1200,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2500,
        fade: true
    };

    return (
        <section className="wpo-hero-slider">
            <div className="hero-container">
                <div className="hero-wrapper">
                    <Slider {...settings}>
                        <div className="hero-slide">
                            <div className="slide-inner slide-bg-image" style={{ backgroundImage: `url(${'images/slider/slide-2.jpg'})` }}>
                                <div className="container">
                                    <div className="slide-content">
                                        <div className="wpo-hero-title-top">
                                            <span>We bring the right people together.</span>
                                        </div>
                                        <div className="slide-title">
                                            <h2>Helping You Solve Your Problems</h2>
                                        </div>
                                        <div className="slide-text">
                                            <p>Facilitating client learning that is,teaching clients how to resolve similar problems in the future.</p>
                                        </div>
                                        <div className="clearfix"></div>
                                        <div className="slide-btns">
                                            <Link href="/about" className="theme-btn">Get Started</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="hero-slide">
                            <div className="slide-inner slide-bg-image" style={{ backgroundImage: `url(${'images/slider/slide-3.jpg'})` }}>
                                <div className="container">
                                    <div className="slide-content">
                                        <div className="wpo-hero-title-top">
                                            <span>We bring the right people together.</span>
                                        </div>
                                        <div className="slide-title">
                                            <h2>Helping You Solve Your Problems</h2>
                                        </div>
                                        <div className="slide-text">
                                            <p>Facilitating client learning that is,teaching clients how to resolve similar problems in the future.</p>
                                        </div>
                                        <div className="clearfix"></div>
                                        <div className="slide-btns">
                                            <Link href="/about" className="theme-btn">Get Started</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Slider>
                </div>
            </div>
        </section>
    )
}
export default Hero3;