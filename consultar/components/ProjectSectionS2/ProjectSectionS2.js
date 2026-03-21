import React from 'react'
import Link from 'next/link'
import Projects from '../../api/project'
import Image from 'next/image'


const ProjectSectionS2 = (props) => {
    const ClickHandler = () =>{
        window.scrollTo(10, 0);
     }



    return(
        <section className="wpo-gallery-section section-padding wpo-gallery-section-s2">
            <div className="container">
                <div className="row">
                    <div className="col col-xs-12 sortable-gallery">
                        <div className="wpo-gallery-container">
                            {Projects.slice(0,6).map((project, pritem) => (
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

export default ProjectSectionS2;