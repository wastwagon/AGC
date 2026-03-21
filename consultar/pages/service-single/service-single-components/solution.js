import React from 'react'
import Link from 'next/link'
import Services from '../../../api/service'
import Image from 'next/image'


const Solutions = (props) => {
    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }

    return (
        <div className="wpo-solutions-section">
            <h2>Our Solutions</h2>
            <div className="row">
                {Services.slice(0, 3).map((service, sitem) => (
                    <div className="col-lg-4 col-md-6 col-12" key={sitem}>
                        <div className="wpo-solutions-item">
                            <div className="wpo-solutions-icon">
                                <div className="icon">
                                    <Image src={service.sIcon} alt="" />
                                </div>
                            </div>
                            <div className="wpo-solutions-text">
                                <h2><Link onClick={ClickHandler} href='/service-single/[slug]' as={`/service-single/${service.slug}`}>{service.title}</Link></h2>
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