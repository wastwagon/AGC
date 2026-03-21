import React from 'react'
import Link from 'next/link'
import insimg1 from '../../../images/instragram/7.jpg'
import insimg2 from '../../../images/instragram/8.jpg'
import insimg3 from '../../../images/instragram/9.jpg'
import insimg4 from '../../../images/instragram/10.jpg'
import insimg5 from '../../../images/instragram/11.jpg'
import insimg6 from '../../../images/instragram/12.jpg'


const ServiceSingleSidebar = (props) => {
    return(
        <div className="col-lg-4 col-md-8">
            <div className="wpo-single-sidebar">
                <div className="wpo-service-widget widget">
                        <h2>All Services</h2>
                        <ul>
                            <li><Link href="/service-single">Strategy and Planning</Link></li>
                            <li><Link href="/service-single">Corporate Finance</Link></li>
                            <li><Link href="/service-single">Market Research</Link></li>
                            <li><Link href="/service-single">Business Analysis</Link></li>
                            <li><Link href="/service-single">Consumer Markets</Link></li>
                            <li><Link href="/service-single">Insurance</Link></li>
                        </ul>
                </div>
                <div className="wpo-newsletter-widget widget">
                        <h2>Newsletter</h2>
                        <p>Join 20,000 Sabscribers!</p>
                        <form className="form">
                            <input type="text" placeholder="Email Address"/>
                            <button type="submit">Sign Up</button>
                        </form>
                        <span>By signing up you agree to our <Link href="/service-single">Privecy Policy</Link></span>
                </div>
                <div className="wpo-instagram-widget widget">
                        <h2>Instagram Shot</h2>

                        <ul>
                            <li><Link href="/project"><img src={insimg1} alt=""/></Link></li>
                            <li><Link href="/project"><img src={insimg2} alt=""/></Link></li>
                            <li><Link href="/project"><img src={insimg3} alt=""/></Link></li>
                            <li><Link href="/project"><img src={insimg4} alt=""/></Link></li>
                            <li><Link href="/project"><img src={insimg5} alt=""/></Link></li>
                            <li><Link href="/project"><img src={insimg6} alt=""/></Link></li>
                        </ul>
                </div>

                <div className="wpo-contact-widget widget">
                        <h2>How We Can <br/> Help You!</h2>
                        <p>labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. </p>
                        <Link href="/contact">Contact Us</Link>
                </div>
            </div>
        </div>
    )
}

export default ServiceSingleSidebar;