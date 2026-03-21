import React, { Fragment } from 'react';
import Navbar from '../../components/Navbar/Navbar'
import Hero from '../../components/hero';
import Features from '../../components/Features';
import About from '../../components/about'
import ServiceSection from '../../components/ServiceSection/ServiceSection';
import Pricing from '../../components/Pricing/Pricing'
import FunFact from '../../components/FunFact'
import ProjectSection from '../../components/ProjectSection/ProjectSection';
import Testimonial from '../../components/Testimonial'
import Support from '../../components/Support'
import BlogSection from '../../components/BlogSection'
import Footer from '../../components/footer/Footer'
import Scrollbar from '../../components/scrollbar/scrollbar'



const HomePage = () => {
    return (
        <Fragment>
            <Navbar hclass={'topbar-none'} />
            <Hero />
            <Features />
            <About />
            <ServiceSection />
            <Pricing />
            <FunFact fnClass={'wpo-fun-fact-section-s2'} />
            <ProjectSection />
            <Testimonial />
            <Support/>
            <BlogSection/>
            <Footer />
            <Scrollbar />
        </Fragment>
    )
};
export default HomePage;