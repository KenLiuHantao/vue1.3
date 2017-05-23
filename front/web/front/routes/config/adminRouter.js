module.exports = {
    '/:systemType/employeeAuth': {
        key: 'employeeAuth',
        title: '员工权限待处理列表',
        component (resolve)  {
            require(['../../src/admin/employeeAuth/app'], resolve)
        },
    },
    '/:systemType/rbac': {
        key: 'rbac',
        title: '职能授权管理',
        component (resolve)  {
            require(['../../src/admin/rbac/app'], resolve)
        },
    },
    '/:systemType/entInfo': {
        key: 'entInfo',
        title: '企业信息',
        component (resolve)  {
            require(['../../src/admin/entInfo/app'], resolve)
        },
    },
    '/:systemType/helpfeedback': {
        key: 'helpfeedback',
        title: '用户帮助与反馈',
        component (resolve)  {
            require(['../../src/admin/helpfeedback/app'], resolve)
        },
    },
    '/:systemType/pendingEmployeeAuth': {
        key: 'pendingEmployeeAuth',
        title: '待授权岗位与职能',
        component (resolve)  {
            require(['../../src/admin/pendingEmployeeAuth/app'], resolve)
        },
    },
    '/:systemType/accountRecharge': {
        key: 'accountRecharge',
        title: '账户储值',
        component (resolve)  {
            require(['../../src/admin/accountRecharge/app'], resolve)
        }
    },
    '/:systemType/accountRecharge/history':{
        key: 'history',
        title: '历史记录',
        component (resolve)  {
            require(['../../src/admin/accountRecharge/history'], resolve)
        },
    },
    '/:systemType/accountRecharge/recharge':{
        key: 'history',
        title: '充值',
        component (resolve)  {
            require(['../../src/admin/accountRecharge/recharge'], resolve)
        },
    },
}


