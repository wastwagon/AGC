import React, { Fragment } from 'react';
import Navbar from '../../components/Navbar/Navbar'
import PageTitle from '../../components/pagetitle/PageTitle'
import Scrollbar from '../../components/scrollbar/scrollbar'
import { useRouter } from 'next/router'
import Projects from '../../api/project'
import Services from '../../api/service'
import Footer from '../../components/footer/Footer.js'
import Image from 'next/image';
import Link from 'next/link'

import pn1 from '/public/images/project-single/prev.png'
import pn2 from '/public/images/project-single/next.png'

const ServiceSinglePage = (props) => {

    const router = useRouter()

    const projectDetails = Projects.find(item => item.slug === router.query.slug)

    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }

    return (
        <Fragment>
            <Navbar hclass={'wpo-header-style-5'} />
            <PageTitle pageTitle={`${projectDetails?.title} Cleaning `} pagesub={'Project'} />
            <section className="wpo-project-single-section section-padding">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-10 offset-lg-1">
                            <div className="wpo-project-single-wrap">
                                <div className="wpo-project-single-content">
                                    <Image src={projectDetails?.pSImg} alt="" />
                                    <div className="wpo-project-single-content-des">
                                        <div className="wpo-project-single-content-des-wrap">
                                            <div className="wpo-project-single-content-des-left">
                                                <h2>Digital Analysis</h2>
                                                <p>I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. </p>
                                                <p>Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise.</p>
                                            </div>
                                            <div className="wpo-project-single-content-des-right">
                                                <ul>
                                                    <li>Client :<span>Robert William</span></li>
                                                    <li>Location :<span>7 Lake Street,London</span></li>
                                                    <li>Date :<span>20 Apr 2023</span></li>
                                                    <li>Duration : <span>3 Month</span></li>
                                                    <li>Tag :<span>Consulting, Business</span></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="wpo-project-single-sub-img">
                                            <ul>
                                                <li><Image src={projectDetails?.spImg1} alt="" /></li>
                                                <li><Image src={projectDetails?.spImg2} alt="" /></li>
                                            </ul>

                                        </div>
                                    </div>
                                </div>
                                <div className="wpo-solutions-section">
                                    <h2>Best Benefits of Project</h2>
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

                                    <p>I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. </p>
                                    <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem Ut enim ad minima veniam, quis nostrum exercitationem .</p>
                                </div>
                                <div className="tag-share clearfix">
                                    <div className="tag">
                                        <ul>
                                            <li><Link onClick={ClickHandler} href="/project-single/Digital-Analysis">Consulting</Link></li>
                                            <li><Link onClick={ClickHandler} href="/project-single/Digital-Analysis">Business</Link></li>
                                            <li><Link onClick={ClickHandler} href="/project-single/Digital-Analysis">Idea</Link></li>
                                        </ul>
                                    </div>
                                    <div className="share">
                                        <span>Share: </span>
                                        <ul>
                                            <li><Link onClick={ClickHandler} href="/project-single/Digital-Analysis"><i className="ti-facebook"></i></Link></li>
                                            <li><Link onClick={ClickHandler} href="/project-single/Digital-Analysis"><i className="ti-twitter-alt"></i></Link></li>
                                            <li><Link onClick={ClickHandler} href="/project-single/Digital-Analysis"><i className="ti-linkedin"></i></Link></li>
                                            <li><Link onClick={ClickHandler} href="/project-single/Digital-Analysis"><i className="ti-instagram"></i></Link></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="more-posts">
                                    <div className="previous-post">
                                        <Link onClick={ClickHandler} href="/project-single/Corporate-Finance">
                                            <div className="post-img">
                                                <Image src={pn1} alt="" />
                                            </div>
                                            <div className="post-text">
                                                <span className="post-control-link">Previous Post</span>
                                                <span className="post-name">Creativity of Planning</span>
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="next-post">
                                        <Link onClick={ClickHandler} href="/project-single/Digital-Analysis">
                                            <div className="post-text">
                                                <span className="post-control-link">Next Post</span>
                                                <span className="post-name">Digital Product Development</span>
                                            </div>
                                            <div className="post-img">
                                                <Image src={pn2} alt="" />
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
            <Scrollbar />
        </Fragment>
    )
};
export default ServiceSinglePage;
