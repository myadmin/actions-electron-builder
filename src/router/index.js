import { lazy, Suspense } from 'react';
import Layout from '../pages/Layout';
const CheckUpdate = lazy(() => import('../checkUpdate'));
const Home = lazy(() => import('../pages/Home'));

const lazyLoad = (children) => {
    return <Suspense fallback={<>loading...</>}>{children}</Suspense>;
};

const router = [
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                index: true,
                element: lazyLoad(<CheckUpdate />),
            },
            {
                path: '/home',
                element: lazyLoad(<Home />),
            }
        ],
    },
];

export default router;
