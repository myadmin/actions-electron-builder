import React, { useEffect } from 'react';
const { ipcRender } = window.electron;

const app = () => {
    useEffect(() => {
        ipcRender.send('render-send', 'please update');
        setTimeout(() => {
            console.log(123);
            ipcRender.receive('ping', (data) => {
                console.log('data', data);
            });
        }, 3 * 1000);
    }, []);

    return <div>app</div>;
};

export default app;
