import React from 'react'
import Link from 'next/link'



const Pricing = (props) => {
    const ClickHandler = () =>{
        window.scrollTo(10, 0);
     }


     const pricing = [
         {
            fIcon:'fi flaticon-medal',
            li1:'24/7 Support available',
            li2:'Home Consulting System',
            li3:'30-Day analytics & insights',
            li4:'Ultimate Features',
            title:'Basic Pack',  
            price: '200',  
            link:'/pricing',
         },
         {
            fIcon:'fi flaticon-stats',
            li1:'24/7 Support available',
            li2:'Home Consulting System',
            li3:'30-Day analytics & insights',
            li4:'Ultimate Features',
            title:'Standard Pack', 
            price: '250',   
            link:'/pricing',
         },
         {
            fIcon:'fi flaticon-trophy',
            li1:'24/7 Support available',
            li2:'Home Consulting System',
            li3:'30-Day analytics & insights',
            li4:'Ultimate Features',
            title:'Extended Pack',  
            price: '300',  
            link:'/pricing',
         },
        
         
     ]


    return(
        <section className="wpo-pricing-section section-padding">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="wpo-section-title">
                            <span>Pricing</span>
                            <h2>Our Pricing Packages</h2>
                        </div>
                    </div>
                </div>
                <div className="wpo-pricing-items">
                    <div className="row">
                        {pricing.map((pricing, ptem) => (
                            <div className="col col-lg-4 col-md-6 col-12" key={ptem}>
                                <div className="wpo-pricing-item">
                                    <div className="wpo-pricing-rate">
                                        <h4>${pricing.price}</h4>
                                    </div>
                                    <h2>{pricing.title}</h2>
                                    <div className="price-icon">
                                        <i className={pricing.fIcon}></i>
                                    </div>
                                    <ul>
                                        <li>{pricing.li1}</li>
                                        <li>{pricing.li2}</li>
                                        <li>{pricing.li3}</li>
                                        <li>{pricing.li4}</li>
                                    </ul>
                                    <Link className="theme-btn" onClick={ClickHandler} href={pricing.link}>Choose Plan</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Pricing;