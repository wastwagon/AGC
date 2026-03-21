import React from "react";
import Link from 'next/link'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import Services from '../../api/service'

const ServiceSection2 = (props) => {

    var settings = {
        dots: true,
        arrows: true,
        speed: 3000,
        slidesToShow: 4,
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

    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }

    return (
        <section className={`wpo-service-section section-padding ${props.srvClass}`}>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="wpo-section-title">
                            <span>Our Services</span>
                            <h2>Explore Our Services</h2>
                        </div>
                    </div>
                </div>
                <div className="wpo-service-items wpo-service-slider owl-carousel">
                    <Slider {...settings}>
                        {Services.map((service, sitem) => (
                            <div className="col-lg-4 col-md-6 col-12" key={sitem}>
                                <div className="wpo-service-item">
                                    <div className="wpo-service-icon">
                                        <div className="icon">
                                            <i className={`fi ${service.fIcon}`}></i>
                                        </div>
                                    </div>
                                    <div className="wpo-service-text">
                                        <h2><Link onClick={ClickHandler} href='/service-single/[slug]' as={`/service-single/${service.slug}`}>{service.title}</Link></h2>
                                        <p>{service.des}</p>
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

export default ServiceSection2;



