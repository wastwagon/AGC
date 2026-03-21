import React from 'react';
import Link from 'next/link'
import Services from '../../api/service'
import about from '/public/images/blog/about-widget.jpg'
import about2 from '/public/images/blog/ab.png'
import blogs from '../../api/blogs'
import Projects from '../../api/project'
import Image from 'next/image';


const BlogSidebar = (props) => {

    const SubmitHandler = (e) => {
        e.preventDefault()
    }

    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }

    return (
        <div className={`col col-lg-4 col-12 ${props.blLeft}`}>
            <div className="blog-sidebar">
                <div className="widget about-widget">
                    <div className="img-holder">
                        <Image src={about} alt="" />
                    </div>
                    <h4>Jenny Watson</h4>
                    <p>Hi! beautiful people. I`m an authtor of this blog. Read our post - stay with us</p>
                    <div className="social">
                        <ul className="clearfix">
                            <li><Link onClick={ClickHandler} href="/blog-single/3-of-the-Worst-Ways-Small-Businesses-Waste-Money-on-Marketing"><i className="ti-facebook"></i></Link></li>
                            <li><Link onClick={ClickHandler} href="/blog-single/3-of-the-Worst-Ways-Small-Businesses-Waste-Money-on-Marketing"><i className="ti-twitter-alt"></i></Link></li>
                            <li><Link onClick={ClickHandler} href="/blog-single/3-of-the-Worst-Ways-Small-Businesses-Waste-Money-on-Marketing"><i className="ti-linkedin"></i></Link></li>
                            <li><Link onClick={ClickHandler} href="/blog-single/3-of-the-Worst-Ways-Small-Businesses-Waste-Money-on-Marketing"><i className="ti-pinterest"></i></Link></li>
                        </ul>
                    </div>
                    <div className="aw-shape">
                        <Image src={about2} alt="" />
                    </div>
                </div>
                <div className="widget search-widget">
                    <form onSubmit={SubmitHandler}>
                        <div>
                            <input type="text" className="form-control" placeholder="Search Post.." />
                            <button type="submit"><i className="ti-search"></i></button>
                        </div>
                    </form>
                </div>
                <div className="widget category-widget">
                    <h3>Categories</h3>
                    <ul>
                        {Services.map((service, sitem) => (
                            <li key={sitem}><Link href='/service-single/[slug]' as={`/service-single/${service.slug}`} >{service.title} <span>{service.id}</span></Link></li>
                        ))}
                    </ul>
                </div>
                <div className="widget recent-post-widget">
                    <h3>Related Posts</h3>
                    <div className="posts">
                        {blogs.slice(0, 3).map((blog, Bitem) => (
                            <div className="post" key={Bitem}>
                                <div className="img-holder">
                                    <Image src={blog.screens} alt="" />
                                </div>
                                <div className="details">
                                    <h4><Link onClick={ClickHandler} href="/blog-single/[slug]" as={`/blog-single/${blog.slug}`}>{blog.title}</Link></h4>
                                    <span className="date">{blog.create_at}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="widget wpo-instagram-widget">
                    <div className="widget-title">
                        <h3>Projects</h3>
                    </div>
                    <ul className="d-flex">
                        {Projects.slice(0, 6).map((project, pritem) => (
                            <li key={pritem}><Link onClick={ClickHandler} href='/project-single/[slug]' as={`/project-single/${project.slug}`}><Image src={project.pImg} alt="" /></Link></li>
                        ))}
                    </ul>
                </div>
                <div className="widget tag-widget">
                    <h3>Tags</h3>
                    <ul>
                        <li><Link onClick={ClickHandler} href="/blog-single/3-of-the-Worst-Ways-Small-Businesses-Waste-Money-on-Marketing">Consulting</Link></li>
                        <li><Link onClick={ClickHandler} href="/blog-single/3-of-the-Worst-Ways-Small-Businesses-Waste-Money-on-Marketing">Planning</Link></li>
                        <li><Link onClick={ClickHandler} href="/blog-single/3-of-the-Worst-Ways-Small-Businesses-Waste-Money-on-Marketing">Marketing</Link></li>
                        <li><Link onClick={ClickHandler} href="/blog-single/3-of-the-Worst-Ways-Small-Businesses-Waste-Money-on-Marketing">Strategy</Link></li>
                        <li><Link onClick={ClickHandler} href="/blog-single/3-of-the-Worst-Ways-Small-Businesses-Waste-Money-on-Marketing">Finance</Link></li>
                        <li><Link onClick={ClickHandler} href="/blog-single/3-of-the-Worst-Ways-Small-Businesses-Waste-Money-on-Marketing">Solution</Link></li>
                        <li><Link onClick={ClickHandler} href="/blog-single/3-of-the-Worst-Ways-Small-Businesses-Waste-Money-on-Marketing">Corporate</Link></li>
                        <li><Link onClick={ClickHandler} href="/blog-single/3-of-the-Worst-Ways-Small-Businesses-Waste-Money-on-Marketing">Idea</Link></li>
                        <li><Link onClick={ClickHandler} href="/blog-single/3-of-the-Worst-Ways-Small-Businesses-Waste-Money-on-Marketing">Market Reserch</Link></li>
                    </ul>
                </div>
                <div className="wpo-contact-widget widget">
                    <h2>How We Can <br /> Help You!</h2>
                    <p>labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. </p>
                    <Link onClick={ClickHandler} href="/contact">Contact Us</Link>
                </div>
            </div>
        </div>
    )

}

export default BlogSidebar;
