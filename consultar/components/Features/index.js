import React from 'react'

import prdimg1 from '/public/images/icon/document.svg'
import prdimg2 from '/public/images/icon/bar-graph.svg'
import prdimg3 from '/public/images/icon/clipboard.svg'
import Image from 'next/image'


const Features = (props) => {

     const featres = [
         {
            fIcon:prdimg1,
            title:'Strategy and Planning',
            des:'One way to categorize the activities is in terms of the professional’s area of expertise such as competitive analysis, corporate strategy.',
         },
         {
            fIcon:prdimg2,
            title:'Market Analysis',
            des:'One way to categorize the activities is in terms of the professional’s area of expertise such as competitive analysis, corporate strategy.',
         },
         {
            fIcon:prdimg3,
            title:'Investment Strategy',
            des:'One way to categorize the activities is in terms of the professional’s area of expertise such as competitive analysis, corporate strategy.',
         },
         
     ]


    return(
        <section className={`wpo-features-section section-padding  ${props.featuresClass}`}>
            <div className="container">
                <div className="row">
                    {featres.map((featres, fitem) => (
                        <div className="col-lg-4 col-md-6 col-12" key={fitem}>
                            <div className="wpo-features-item">
                                <div className="wpo-features-icon">
                                    <div className="icon">
                                        <Image src={featres.fIcon} alt=""/>
                                    </div>
                                </div>
                                <div className="wpo-features-text">
                                    <h2>{featres.title}</h2>
                                    <p>{featres.des}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Features;