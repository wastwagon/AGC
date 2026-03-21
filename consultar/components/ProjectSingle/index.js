import React from 'react'
import Link from 'next/link'

import prjImg1 from '../../images/project-single/1.jpg'
import prjImg2 from '../../images/project-single/2.jpg'
import prjImg3 from '../../images/project-single/3.jpg'

import prIcon1 from '../../images/icon/document.svg'
import prIcon2 from '../../images/icon/bar-graph.svg'
import prIcon3 from '../../images/icon/clipboard.svg'

import pn1 from '../../images/project-single/prev.png'
import pn2 from '../../images/project-single/next.png'


const ProjectSingle = (props) => {
    const ClickHandler = () =>{
        window.scrollTo(10, 0);
     }


    return(
        <section className="wpo-project-single-section section-padding">
        <div className="container">
            <div className="row">
                <div className="col-lg-10 offset-lg-1">
                    <div className="wpo-project-single-wrap">
                        <div className="wpo-project-single-content">
                            <img src={prjImg1} alt=""/>
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
                                        <li><img src={prjImg2} alt=""/></li>
                                        <li><img src={prjImg3} alt=""/></li>
                                    </ul>
                                    
                                </div>
                            </div>
                        </div>
                        <div className="wpo-solutions-section">
                            <h2>Best Benefits of Project</h2>
                            <div className="row">
                                <div className="col-lg-4 col-md-6 col-12">
                                    <div className="wpo-solutions-item">
                                        <div className="wpo-solutions-icon">
                                            <div className="icon">
                                                <img src={prIcon1} alt=""/>
                                            </div>
                                        </div>
                                        <div className="wpo-solutions-text">
                                            <h2><Link onClick={ClickHandler} href="/service-single">Business Planning</Link></h2>
                                            <p>The lower-numbered purposes are better understood and practiced </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6 col-12">
                                    <div className="wpo-solutions-item">
                                        <div className="wpo-solutions-icon">
                                            <div className="icon">
                                                <img src={prIcon2} alt=""/>
                                            </div>
                                        </div>
                                        <div className="wpo-solutions-text">
                                            <h2><Link onClick={ClickHandler} href="/service-single">Market Analysis</Link></h2>
                                            <p>The lower-numbered purposes are better understood and practiced </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6 col-12">
                                    <div className="wpo-solutions-item">
                                        <div className="wpo-solutions-icon">
                                            <div className="icon">
                                                <img src={prIcon3} alt=""/>
                                            </div>
                                        </div>
                                        <div className="wpo-solutions-text">
                                            <h2><Link onClick={ClickHandler} href="/service-single">Investment Strategy</Link></h2>
                                            <p>The lower-numbered purposes are better understood and practiced </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
    
                            <p>I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. </p>
                            <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem Ut enim ad minima veniam, quis nostrum exercitationem .</p>
                        </div>
                        <div className="tag-share clearfix">
                            <div className="tag">
                                <ul>
                                    <li><Link onClick={ClickHandler} href="/project-single">Consulting</Link></li>
                                    <li><Link onClick={ClickHandler} href="/project-single">Business</Link></li>
                                    <li><Link onClick={ClickHandler} href="/project-single">Idea</Link></li>
                                </ul>
                            </div>
                            <div className="share">
                                <span>Share: </span>
                                <ul>
                                    <li><Link onClick={ClickHandler} href="/project-single"><i className="ti-facebook"></i></Link></li>
                                    <li><Link onClick={ClickHandler} href="/project-single"><i className="ti-twitter-alt"></i></Link></li>
                                    <li><Link onClick={ClickHandler} href="/project-single"><i className="ti-linkedin"></i></Link></li>
                                    <li><Link onClick={ClickHandler} href="/project-single"><i className="ti-instagram"></i></Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="more-posts">
                            <div className="previous-post">
                                <Link onClick={ClickHandler} href="/project-single">
                                    <div className="post-img">
                                        <img src={pn1} alt=""/>
                                    </div>
                                    <div className="post-text">
                                        <span className="post-control-link">Previous Post</span>
                                        <span className="post-name">Creativity of Planning</span>
                                    </div>
                                </Link>
                            </div>
                            <div className="next-post">
                                <Link onClick={ClickHandler} href="/project-single">
                                    <div className="post-text">
                                        <span className="post-control-link">Next Post</span>
                                        <span className="post-name">Digital Product Development</span>
                                    </div>
                                    <div className="post-img">
                                        <img src={pn2} alt=""/>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    )
}

export default ProjectSingle;