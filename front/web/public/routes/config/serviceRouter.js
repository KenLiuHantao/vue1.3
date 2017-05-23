/**
 * Created by SkyeTang on 2017/3/14.
 */
module.exports = {
    '/:systemType/retrievePassword': {
        key: 'retrievePassword',
        title: '我的经管',
        component (resolve)  {
            require(['../../src/service/retrievePassword/app'], resolve)
        },
    },
    '/:systemType/agreement': {
        key: 'agreement',
        title: '我的经管',
        component (resolve)  {
            require(['../../src/service/agreement/app'], resolve)
        },
    },
    '/:systemType/createCompanyAccount/': {
        name: 'createCompanyAccount',
        key: 'createCompanyAccount',
        title: '我的经管',
        component (resolve)  {
            require(['../../src/service/createCompanyAccount/app'], resolve)
        },
    },
    '/:systemType/emailVerify': {
        key: 'emailVerify',
        title: '我的经管',
        component (resolve)  {
            require(['../../src/service/emailVerify/app'], resolve)
        },
    },
}