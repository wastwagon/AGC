import React from 'react'
import Link from 'next/link'
import Projects from '../../api/project'
import Image from 'next/image'


const ProjectSection = (props) => {
    const ClickHandler = () =>{
        window.scrollTo(10, 0);
     }



    return(
        <section className="wpo-gallery-section section-padding">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-6 col-sm-8">
                        <div className="wpo-section-title">
                            <span>Projects</span>
                            <h2>Our Project Gallery</h2>
                        </div>
                    </div>
                    <div className="col-lg-6 col-sm-4">
                        <div className="wpo-section-title-button">
                            <Link onClick={ClickHandler} href="/project">More Projects</Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col col-xs-12 sortable-gallery">
                        <div className="wpo-gallery-container">
                            {Projects.slice(0,4).map((project, pritem) => (
                                <div className="grid" key={pritem}>
                                    <div className="wpo-gallery-item">
                                        <Link onClick={ClickHandler} href='/project-single/[slug]' as={`/project-single/${project.slug}`}>
                                            <Image src={project.pImg} alt="" className="img img-responsive"/>
                                            <div className="wpo-gallery-text">
                                                <h3>{project.title}</h3>
                                                <i className="ti-plus"></i>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div> 
            </div>
        </section>
    )
}

export default ProjectSection;