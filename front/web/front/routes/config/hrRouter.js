module.exports = {
    //人事 begin
    '/:systemType/employee': {
        key: 'employee',
        title: '人事档案',
        component (resolve)  {
            require(['../../src/hr/employee/app'], resolve)
        },
    },
    '/:systemType/employeeBatchImport': {
        key: 'employeeBatchImport',
        title: '批量导入人事档案',
        component (resolve)  {
            require(['../../src/hr/employeeBatchImport/app'], resolve)
        },
    },
    '/:systemType/employeeLeaveApplyAudit': {
        key: 'employeeLeaveApplyAudit',
        title: '员工离职申请审核',
        component (resolve)  {
            require(['../../src/hr/employeeLeaveApplyAudit/app'], resolve)
        },
    },
    '/:systemType/employeeLeaveApplyCheck': {
        key: 'employeeLeaveApplyCheck',
        title: '员工离职申请复核',
        component (resolve)  {
            require(['../../src/hr/employeeLeaveApplyCheck/app'], resolve)
        },
    },
    '/:systemType/employeeRefuseApply': {
        key: 'employeeRefuseApply',
        title: '员工辞退申请',
        component (resolve)  {
            require(['../../src/hr/employeeRefuseApply/app'], resolve)
        },
    },
    '/:systemType/employeeRefuseApplyAudit': {
        key: 'employeeRefuseApplyAudit',
        title: '员工辞退申请审核',
        component (resolve)  {
            require(['../../src/hr/employeeRefuseApplyAudit/app'], resolve)
        },
    },
    '/:systemType/employeeLeave': {
        key: 'employeeLeave',
        title: '员工离职登记',
        component (resolve)  {
            require(['../../src/hr/employeeLeave/app'], resolve)
        },
    },
    '/:systemType/employeeLeaveCheck': {
        key: 'employeeLeaveCheck',
        title: '员工离职手续复核',
        component (resolve)  {
            require(['../../src/hr/employeeLeaveCheck/app'], resolve)
        },
    },
    '/:systemType/employeeProbation': {
        key: 'employeeProbation',
        title: '员工试用期与转正跟进',
        component (resolve)  {
            require(['../../src/hr/employeeProbation/app'], resolve)
        },
    },
    '/:systemType/employeeContract': {
        key: 'employeeContract',
        title: '员工合同续签管理',
        component (resolve)  {
            require(['../../src/hr/employeeContract/app'], resolve)
        },
    },
    '/:systemType/employeeTransferApply': {
        key: 'employeeTransferApply',
        title: '员工调岗与兼岗申请',
        component (resolve)  {
            require(['../../src/hr/employeeTransferApply/app'], resolve)
        },
    },
    '/:systemType/employeeTransferAudit': {
        key: 'employeeTransferAudit',
        title: '员工调岗与兼岗审核',
        component (resolve)  {
            require(['../../src/hr/employeeTransferAudit/app'], resolve)
        },
    },
    '/:systemType/employeeTransfer': {
        key: 'employeeTransfer',
        title: '员工调岗与兼岗处理',
        component (resolve)  {
            require(['../../src/hr/employeeTransfer/app'], resolve)
        },
    },
    '/:systemType/employeeAuthCheck': {
        key: 'employeeAuthCheck',
        title: '查看员工职能授权',
        component (resolve)  {
            require(['../../src/hr/employeeAuthCheck/app'], resolve)
        },
    },

    //人事 end

    // 公共 begin
    '/:systemType/announcement': {
        key: 'announcement',
        title: '行政公告',
        component (resolve)  {
            require(['../../src/hr/announcement/app'], resolve)
        },
    },
    '/:systemType/asset': {
        key: 'asset',
        title: '固定资产档案',
        component (resolve)  {
            require(['../../src/hr/asset/app'], resolve)
        },
    },
    '/:systemType/hrRbac': {
        key: 'hrRbac',
        title: '组织架构设定',
        component (resolve)  {
            require(['../../src/hr/hrRbac/app'], resolve)
        },
    },
    // 公共 end
}