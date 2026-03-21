import React from 'react'
import Link from 'next/link'

import srvimg1 from '../../../images/icon/clipboard.svg'
import srvimg2 from '../../../images/icon/briefcase.svg'
import srvimg3 from '../../../images/icon/chart.svg'


const Solutions = (props) => {
    const ClickHandler = () =>{
        window.scrollTo(10, 0);
     }


     const service = [
         {
            sIcon:srvimg1,
            title:'Strategy and Planning',
            des:'The lower-numbered purposes are better understood and practiced',      
            link:'/service-single',
         },
         {
            sIcon:srvimg2,
            title:'Corporate Finance',
            des:'The lower-numbered purposes are better understood and practiced',      
            link:'/service-single',
         },
         {
            sIcon:srvimg3,
            title:'Market Research',
            des:'The lower-numbered purposes are better understood and practiced',      
            link:'/service-single',
         },
         
     ]


    return(
        <div className="wpo-solutions-section">
            <h2>Our Solutions</h2>
            <div className="row">
                {service.map((service, sitem) => (
                    <div className="col-lg-4 col-md-6 col-12" key={sitem}>
                        <div className="wpo-solutions-item">
                            <div className="wpo-solutions-icon">
                                <div className="icon">
                                    <img src={service.sIcon} alt=""/>
                                </div>
                            </div>
                            <div className="wpo-solutions-text">
                                <h2><Link onClick={ClickHandler} to={service.link}>{service.title}</Link></h2>
                                <p>{service.des}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        
    )
}

export default Solutions;