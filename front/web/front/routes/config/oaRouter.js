module.exports = {
    '/:systemType/notice': {
        key: 'notice',
        title: '行政通知',
        component (resolve)  {
            require(['../../src/oa/notice/app'], resolve)
        },
    },
    '/:systemType/task': {
        key: 'task',
        title: '我的任务',
        component (resolve)  {
            require(['../../src/oa/task/app'], resolve)
        },
    }
}