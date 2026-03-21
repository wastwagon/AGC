import React from 'react'
import Link from 'next/link'

const Support = (props) => {
    const ClickHandler = () =>{
        window.scrollTo(10, 0);
     }
    return(
        <section className="wpo-support-section">
            <div className="container">
                <div className="wpo-support-wrapper">
                    <div className="wpo-support-text">
                        <h2>Have You a Different Question?</h2>
                        <p>Please create a ticket to our support forum,a great place to learn, share, and troubleshoot. Get started.</p>
                    </div>
                    <div className="wpo-support-btn">
                        <Link onClick={ClickHandler} href="/contact">Ask Support Ticket</Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Support;