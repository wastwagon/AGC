// images
import blogImg1 from '/public/images/blog/img-1.jpg'
import blogImg2 from '/public/images/blog/img-2.jpg'
import blogImg3 from '/public/images/blog/img-3.jpg'

import blogAvaterImg1 from "/public/images/blog/blog-avater/img-1.jpg";
import blogAvaterImg2 from "/public/images/blog/blog-avater/img-2.jpg";
import blogAvaterImg3 from "/public/images/blog/blog-avater/img-3.jpg";

import blogSingleImg1 from "/public/images/blog/img-4.jpg";
import blogSingleImg2 from "/public/images/blog/img-5.jpg";
import blogSingleImg3 from "/public/images/blog/img-6.jpg";



const blogs = [
    {
        id: '1',
        title: '8 Mistakes First-Time Founders Make When Starting a Business.',
        slug: '8-Mistakes-First-Time-Founders-Make-When-Starting-a-Business',
        tag: 'Business',
        screens: blogImg1,
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet autem beatae errodio.',
        author: 'Jenefer Willy',
        authorTitle: 'Marketing Manager',
        authorImg: blogAvaterImg1,
        create_at: '14 AUG,22',
        blogSingleImg: blogSingleImg1,
        comment: '5,975',
        blClass: 'format-standard-image',
    },
    {
        id: '2',
        title: '3 of the Worst Ways Small Businesses Waste Money on Marketing',
        slug: '3-of-the-Worst-Ways-Small-Businesses-Waste-Money-on-Marketing',
        tag: 'Consulitng',
        screens: blogImg2,
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet autem beatae errodio.',
        author: 'Konal Biry',
        authorTitle: 'Marketing Expart',
        authorImg: blogAvaterImg2,
        create_at: '16 AUG,22',
        blogSingleImg: blogSingleImg2,
        comment: '7,275',
        blClass: 'format-standard-image',
    },
    {
        id: '3',
        tag: 'Business',
        title: 'Good Advice: Tips From Successful Small Business Owners',
        slug: 'Good-Advice-Tips-From-Successful-Small-Business-Owners',
        screens: blogImg3,
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet autem beatae errodio.',
        author: 'Jenefer Willy',
        authorTitle: 'Marketing Leader',
        authorImg: blogAvaterImg3,
        create_at: '18 AUG,22',
        blogSingleImg: blogSingleImg3,
        comment: '6,725',
        blClass: 'format-video',
    }
];
export default blogs;