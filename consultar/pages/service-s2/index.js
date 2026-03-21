import React, {Fragment} from 'react';
import Navbar from '../../components/Navbar/Navbar'
import PageTitle from '../../components/pagetitle/PageTitle'
import ServiceSection2 from '../../components/ServiceSection2/ServiceSection2';
import Footer from '../../components/footer/Footer'
import Scrollbar from '../../components/scrollbar/scrollbar'


const ServicePage =() => {
    return(
        <Fragment>
            <Navbar/>
            <PageTitle pageTitle={'Services'} pagesub={'Services'}/> 
            <ServiceSection2 srvClass={'wpo-service-section-s2'}/>
            <Footer/>
            <Scrollbar/>
        </Fragment>
    )
};
export default ServicePage;
