const express = require('express');
const app = express();
app.use(express.static('dist')); //监控静态资源
app.listen(2060, () => {
    console.log('loaclhost:2060')
})