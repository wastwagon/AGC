import React from 'react'
import ServiceSingleSidebar from './service-single-components/sidebar'
import Solutions from './service-single-components/solution'
import Benefits from './service-single-components/benefits'
import ssimg from '../../images/service-single/1.jpg'
import ssimg2 from '../../images/service-single/2.jpg'
import ssimg3 from '../../images/service-single/3.jpg'


const ServiceSingleSection = (props) => {
    return(
        <section className="wpo-service-single-section section-padding">
            <div className="container">
                <div className="row">
                    <div className="col-lg-8 col-md-12">
                        <div className="wpo-service-single-wrap">
                            <div className="wpo-service-single-content">
                                <img src={ssimg} alt=""/>
                                <div className="wpo-service-single-content-des">
                                    <h2>How To Creat a Great Company With Strategy and Planning</h2>
                                    <p>I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. </p>
                                    <p>Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise.</p>
                                    <div className="wpo-service-single-sub-img">
                                        <ul>
                                            <li><img src={ssimg2} alt=""/></li>
                                            <li><img src={ssimg3} alt=""/></li>
                                        </ul>
                                        
                                    </div>
                                </div>
                            </div>
                            <Solutions/>
                            <Benefits/>
                        </div>
                    </div>
                    <ServiceSingleSidebar/>
                    
                </div>
            </div>
        </section>
    )
}

export default ServiceSingleSection;