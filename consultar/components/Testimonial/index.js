import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ts1 from '/public/images/testimonial/img-1.jpg'
import ts2 from '/public/images/testimonial/img-2.jpg'
import ts3 from '/public/images/testimonial/img-3.jpg'
import Image from "next/image";


const Testimonial = (props) => {

    var settings = {
        dots: false,
        arrows: true,
        speed: 3000,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2500,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                }
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    const testimonial = [
        {
            tsImg: ts1,
            Des: "I just wanted to share a quick note and let you know that you guys do a really good job. I’m glad I decided to work with you. It’s really great how easy.",
            Title: 'Jenny Watson',
            Sub: "SCG First Company",
        },
        {
            tsImg: ts2,
            Des: "I just wanted to share a quick note and let you know that you guys do a really good job. I’m glad I decided to work with you. It’s really great how easy.",
            Title: 'Harry Abraham',
            Sub: "SCG First Company",
        },
        {
            tsImg: ts3,
            Des: "I just wanted to share a quick note and let you know that you guys do a really good job. I’m glad I decided to work with you. It’s really great how easy.",
            Title: 'Ron Di-soza',
            Sub: "SCG First Company",
        },
        {
            tsImg: ts1,
            Des: "I just wanted to share a quick note and let you know that you guys do a really good job. I’m glad I decided to work with you. It’s really great how easy.",
            Title: 'Benjir Walton',
            Sub: "SCG First Company",
        }
    ]
    return (
        <section className={`wpo-testimonial-section section-padding ${props.tClass}`}>
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-12">
                        <div className="wpo-testimonial-title">
                            <h2><i className="fi flaticon-left-quote"></i> What <span>Our Clients</span> are Saying</h2>
                        </div>
                    </div>
                </div>
                <div className="wpo-testimonial-items wpo-testimonial-slider owl-carousel">
                    <Slider {...settings}>
                        {testimonial.map((tesmnl, tsm) => (
                            <div className="wpo-testimonial-item" key={tsm}>
                                <div className="wpo-testimonial-avatar">
                                    <Image src={tesmnl.tsImg} alt="" />
                                </div>
                                <div className="wpo-testimonial-text">
                                    <p>{tesmnl.Des}</p>
                                    <div className="wpo-testimonial-text-btm">
                                        <h3>{tesmnl.Title}</h3>
                                        <span>{tesmnl.Sub}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </section>
    );
}

export default Testimonial;