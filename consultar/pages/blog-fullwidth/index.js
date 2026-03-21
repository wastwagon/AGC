import React, { Fragment } from 'react';
import { useRouter } from 'next/router'
import PageTitle from '../../components/pagetitle/PageTitle';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/footer/Footer';
import BlogList from '../../components/BlogList/BlogList';
import Scrollbar from '../../components/scrollbar/scrollbar';

const BlogSingle = (props) => {
    const router = useRouter()

    return (
        <Fragment>
            <Navbar />
            <PageTitle pageTitle='Latest News' pagesub="blog" />
            <BlogList blLeft={'d-none'} blRight={'col-lg-10 offset-lg-1'}/>
            <Footer />
            <Scrollbar />
        </Fragment>
    )
};
export default BlogSingle;
