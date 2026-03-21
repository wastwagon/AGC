import React from 'react'
import Link from 'next/link'
import Services from '../../../api/service'
import Projects from '../../../api/project'
import Image from 'next/image'


const ServiceSingleSidebar = (props) => {

    const SubmitHandler = (e) => {
        e.preventDefault()
    }

    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }

    return (
        <div className="col-lg-4 col-md-8">
            <div className="wpo-single-sidebar">
                <div className="wpo-service-widget widget">
                    <h2>All Services</h2>
                    <ul>
                        {Services.map((service, sitem) => (
                            <li key={sitem}><Link href='/service-single/[slug]' as={`/service-single/${service.slug}`} >{service.title}</Link></li>
                        ))}
                    </ul>
                </div>
                <div className="wpo-newsletter-widget widget">
                    <h2>Newsletter</h2>
                    <p>Join 20,000 Sabscribers!</p>
                    <form className="form" onSubmit={SubmitHandler}>
                        <input type="text" placeholder="Email Address" />
                        <button type="submit">Sign Up</button>
                    </form>
                    <span>By signing up you agree to our <Link href="/service">Privecy Policy</Link></span>
                </div>
                <div className="wpo-instagram-widget widget">
                    <h2>Instagram Shot</h2>

                    <ul>
                        {Projects.slice(0, 6).map((project, pritem) => (
                            <li key={pritem}><Link onClick={ClickHandler} href='/project-single/[slug]' as={`/project-single/${project.slug}`}><Image src={project.pImg} alt="" /></Link></li>
                        ))}
                    </ul>
                </div>

                <div className="wpo-contact-widget widget">
                    <h2>How We Can <br /> Help You!</h2>
                    <p>labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. </p>
                    <Link href="/contact">Contact Us</Link>
                </div>
            </div>
        </div>
    )
}

export default ServiceSingleSidebar;