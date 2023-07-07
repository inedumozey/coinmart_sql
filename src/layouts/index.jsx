import React, { } from 'react'
import Admin from './admin';
import User from './user';
import LandingPage from './landing';
import Auth from './auth';
import Certificate from './certificate'
import Video from './video'
import { useLocation } from "react-router-dom";
import PageNotFound from './404/404';


export default function Layout({ children }) {
    const location = useLocation();

    return (
        (function () {
            if (location.pathname.includes('/dashboard')) {
                return <User children={children} />
            }
            else if (location.pathname.includes('/admin')) {
                return <Admin children={children} />
            }
            else if (location.pathname.includes('/auth')) {
                return <Auth children={children} />
            }
            else if (location.pathname === '/certificate/1668012585323') {
                return <Certificate children={children} />
            }
            else if (location.pathname === '/video/about/55474857575') {
                return <Video children={children} />
            }
            else if (location.pathname == '/404') {
                return <PageNotFound children={children} />
            }
            else {
                return <LandingPage children={children} />
            }
        }())
    )
}
