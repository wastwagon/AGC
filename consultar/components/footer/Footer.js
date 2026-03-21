import React from 'react'
import Link from 'next/link'
import Logo from '/public/images/logo2.png'
import Projects from '../../api/project'
import Services from '../../api/service'
import Image from 'next/image'


const Footer = (props) => {

    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }

    return (
        <footer className="wpo-site-footer">
            <div className="wpo-upper-footer">
                <div className="container">
                    <div className="row">
                        <div className="col col-lg-3 col-md-6 col-sm-12 col-12">
                            <div className="widget about-widget">
                                <div className="logo widget-title">
                                    <Link onClick={ClickHandler} href="/">
                                        <Image src={Logo} alt="blog" />
                                    </Link>
                                </div>
                                <p>Management consulting includes a broad range of activities, and the many firms and their members often define these practices.</p>
                                <ul>
                                    <li>
                                        <Link onClick={ClickHandler} href="/">
                                            <i className="ti-facebook"></i>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link onClick={ClickHandler} href="/">
                                            <i className="ti-twitter-alt"></i>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link onClick={ClickHandler} href="/">
                                            <i className="ti-instagram"></i>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link onClick={ClickHandler} href="/">
                                            <i className="ti-google"></i>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col col-lg-3 col-md-6 col-sm-12 col-12">
                            <div className="widget wpo-service-link-widget">
                                <div className="widget-title">
                                    <h3>Contact </h3>
                                </div>
                                <div className="contact-ft">
                                    <ul>
                                        <li><i className="fi flaticon-location"></i>7 Green Lake Street Crawfordsville, IN 47933</li>
                                        <li><i className="fi flaticon-phone-call"></i>+1 800 123 456 789</li>
                                        <li><i className="fi flaticon-send"></i>Consultar@gmail.com</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col col-lg-3 col-md-6 col-sm-12 col-12">
                            <div className="widget link-widget">
                                <div className="widget-title">
                                    <h3>Services </h3>
                                </div>
                                <ul>
                                    {Services.slice(0, 5).map((service, sitem) => (
                                        <li key={sitem}><Link href='/service-single/[slug]' as={`/service-single/${service.slug}`} >{service.title}</Link></li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="col col-lg-3 col-md-6 col-sm-12 col-12">
                            <div className="widget instagram">
                                <div className="widget-title">
                                    <h3>Projects</h3>
                                </div>
                                <ul className="d-flex">
                                    {Projects.slice(0, 6).map((project, pritem) => (
                                        <li key={pritem}><Link onClick={ClickHandler} href='/project-single/[slug]' as={`/project-single/${project.slug}`}><Image src={project.pImg} alt="" /></Link></li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="wpo-lower-footer">
                <div className="container">
                    <div className="row">
                        <div className="col col-xs-12">
                            <p className="copyright"> Copyright &copy; 2023 Consultar by <Link onClick={ClickHandler} href="/home">wpOceans</Link>. All Rights Reserved.</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;