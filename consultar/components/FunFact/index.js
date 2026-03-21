import React from 'react'

const FunFact = (props) => {

    const funfact = [
        {
            title: '500',
            subTitle: 'Strategy and Planning',
            symbol:'+',
        },
        {
            title: '25',
            subTitle: 'Expert Consultants',
            symbol:'+',
        },
        {
            title: '95',
            subTitle: 'Client Satisfaction',
            symbol:'%',
        },
        {
            title: '30',
            subTitle: 'Award Winning',
            symbol:'+',
        },


    ]

    return (
        <section className={`wpo-fun-fact-section  ${props.fnClass}`}>
            <div className="container">
                <div className="row">
                    <div className="col col-xs-12" >
                        <div className="wpo-fun-fact-grids clearfix">
                            {funfact.map((funfact, fitem) => (
                                <div className="grid" key={fitem}>
                                    <div className="info">
                                        <h3>{funfact.title}{funfact.symbol}</h3>
                                        <p>{funfact.subTitle}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <span id="counter" />
        </section>
    )
}

export default FunFact;