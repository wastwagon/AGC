import React, {Fragment} from 'react';
import Navbar from '../../components/Navbar/Navbar'
import PageTitle from '../../components/pagetitle/PageTitle'
import Footer from '../../components/footer/Footer'
import Scrollbar from '../../components/scrollbar/scrollbar'
import ProjectSectionS2 from '../../components/ProjectSectionS2/ProjectSectionS2';



const ProjectPage =() => {
    return(
        <Fragment>
            <Navbar/>
            <PageTitle pageTitle={'Projects'} pagesub={'Projects'}/> 
            <ProjectSectionS2/>
            <Footer/>
            <Scrollbar/>
        </Fragment>
    )
};
export default ProjectPage;
