/**
 * Created by wuhongyu on 2016/12/8.
 */
module.exports={
    ierp:{
        target:process.env.TARGETMANU ||  'https://dev.yj2025.com/',
        logLevel: 'debug',
        changeOrigin: true,
        headers: {
            cookie: process.env.COOKIEMANU || 'SESSION=b4153a66-5d59-4180-a402-6d1a5b0bbb98',
            //pcServer:'192.168.6.67'
        }
    }
};
