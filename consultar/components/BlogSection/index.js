import React from 'react'
import Link from 'next/link'
import blogs from '../../api/blogs'
import Image from 'next/image'

const BlogSection = (props) => {
    
    const ClickHandler = () =>{
        window.scrollTo(10, 0);
     }


    return(
        <section className="wpo-blog-section section-padding">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="wpo-section-title">
                            <span>blog</span>
                            <h2>Our blog Packages</h2>
                        </div>
                    </div>
                </div>
                <div className="wpo-blog-items">
                    <div className="row">
                         {blogs.map((blog, Bitem) => (
                            <div className="col col-lg-4 col-md-6 col-12"  key={Bitem}>
                                <div className="wpo-blog-item">
                                    <div className="wpo-blog-img">
                                        <Image src={blog.screens} alt=""/>
                                    </div>
                                    <div className="wpo-blog-content">
                                        <div className="wpo-blog-content-top">
                                            <div className="wpo-blog-thumb">
                                                <span>{blog.tag}</span>
                                            </div>
                                            <h2><Link onClick={ClickHandler} href="/blog-single/[slug]" as={`/blog-single/${blog.slug}`}>{blog.title}</Link></h2>
                                        </div>
                                        <div className="wpo-blog-content-btm">
                                            <div className="wpo-blog-content-btm-left">
                                                <div className="wpo-blog-content-btm-left-img">
                                                    <Image src={blog.authorImg} alt=""/>
                                                </div>
                                                <div className="wpo-blog-content-btm-left-text">
                                                    <h4><Link onClick={ClickHandler} href="/blog-single/[slug]" as={`/blog-single/${blog.slug}`}>{blog.author}</Link></h4>
                                                    <span>{blog.authorTitle}</span>
                                                </div>
                                            </div>
                                            <div className="wpo-blog-content-btm-right">
                                                <span>{blog.create_at}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default BlogSection;