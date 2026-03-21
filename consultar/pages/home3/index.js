import React, { Fragment } from 'react';
import Navbar from '../../components/Navbar/Navbar'
import Hero3 from '../../components/hero3';
import Features from '../../components/Features';
import About from '../../components/about'
import ServiceSection2 from '../../components/ServiceSection2/ServiceSection2';
import Pricing from '../../components/Pricing/Pricing'
import FunFact from '../../components/FunFact'
import ProjectSection from '../../components/ProjectSection/ProjectSection';
import Testimonial from '../../components/Testimonial'
import Support from '../../components/Support'
import BlogSection from '../../components/BlogSection'
import Footer from '../../components/footer/Footer'
import Scrollbar from '../../components/scrollbar/scrollbar'



const HomePage3 = () => {
    return (
        <Fragment>
            <Navbar />
            <Hero3 />
            <Features featuresClass="wpo-features-section-s2"/>
            <About />
            <ServiceSection2 srvClass={'wpo-service-section-s3'}/>
            <Pricing />
            <FunFact fnClass={'section-padding'} />
            <ProjectSection />
            <Testimonial />
            <Support/>
            <BlogSection/>
            <Footer />
            <Scrollbar />
        </Fragment>
    )
};
export default HomePage3;