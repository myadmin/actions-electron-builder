import React, { useState, useEffect } from 'react';
const { ipcRender } = window.electron;

const app = () => {
    const [text, setText] = useState('');

    useEffect(() => {
        ipcRender.send('checkForUpdate', 'please update');
        setTimeout(() => {
            console.log(123);
            ipcRender.receive('ping', (data) => {
                console.log('data', data);
                setText(data);
            });
        }, 3 * 1000);
    }, []);

    return <div>app - {text}</div>;
};

export default app;
