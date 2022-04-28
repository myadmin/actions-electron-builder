import React, { useState, useEffect } from 'react';
const { ipcRender } = window.electron;

const app = () => {
    const [text, setText] = useState('');
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // console.log('ipcRender', ipcRender);
        ipcRender.receive('downloadProgress', data => {
            console.log('data: download-progress', data);
            // setText(data);
            const progress = parseInt(data.percent, 10);
            setProgress(progress);
            if (progress === 100) {
                ipcRender.send('isUpdateNow');
            }
        });
        // ipcRender.receive('updateAvailable', data => {
        //     console.log('data-updateAvailable', data);
        // });
        // ipcRender.receive('checking-for-update', data => {
        //     console.log('data-checking-for-update', data);
        // });
        // ipcRender.receive('update-not-available', data => {
        //     console.log('data-update-not-available', data);
        // });
        ipcRender.receive('message', data => {
            console.log('data: message', data);
            setText(data);
        });
        ipcRender.send('checkForUpdate');
    }, []);

    return (
        <div style={{ color: '#fff' }}>
            <p>app - {text}</p>
            {progress ? <p>下载进度：{progress}%</p> : null}
        </div>
    )
};

export default app;
