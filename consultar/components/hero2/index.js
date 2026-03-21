import React from "react";
import Link from 'next/link'
import VideoModal from '../ModalVideo'




const Hero2 = () =>  {

    return (
        <section className="wpo-hero-section-1">
            <div className="container">
                <div className="row">
                    <div className="col col-xs-7 col-lg-7">
                        <div className="wpo-hero-section-text">
                            <div className="wpo-hero-title-top">
                                <span>We bring the right people together.</span>
                            </div>
                            <div className="wpo-hero-title">
                                <h2>Making Your <span>Business</span> Idea Come True</h2>
                            </div>
                            <div className="wpo-hero-subtitle">
                                <p>Facilitating client learning—that is, teaching clients how to resolve similar problems in the future.</p>
                            </div>
                            <div className="btns">
                                <Link href="/about" className="btn theme-btn">Get Started</Link>
                            </div>
                            <div className="pop-up-video">
                                <div className="video-holder">
                                    <VideoModal />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="right-img">
                <div className="right-img2">
                    <svg width="283" height="240" viewBox="0 0 283 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M81 0H0V240H240.151C148.189 234.105 125.568 154.555 97.8475 57.0741C92.5852 38.5685 87.1391 19.4168 81 0ZM283 238C276.079 238.969 269.458 239.631 263.12 240H283V238Z" fill="#EDF2F8" />
                    </svg>
                </div>
            </div>
        </section>
    )
}

export default Hero2;