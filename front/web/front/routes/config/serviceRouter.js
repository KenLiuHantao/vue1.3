/**
 * Created by SkyeTang on 2017/3/14.
 */
module.exports = {
    '/:systemType/employeeInitBatchImport': {
        key: 'employeeInitBatchImport',
        title: '批量导入人事档案',
        component (resolve)  {
            require(['../../src/service/employeeInitBatchImport/app'], resolve)
        },
    },
    '/:systemType/processInitBatchImport': {
        key: 'processInitBatchImport',
        title: '批量导入工序档案',
        component (resolve)  {
            require(['../../src/service/processInitBatchImport/app'], resolve)
        },
    },
    '/:systemType/customerInitBatchImport': {
        key: 'customerInitBatchImport',
        title: '批量导入客户档案',
        component (resolve)  {
            require(['../../src/service/customerInitBatchImport/app'], resolve)
        },
    },
    '/:systemType/supplierInitBatchImport': {
        key: 'supplierInitBatchImport',
        title: '批量导入供应商档案',
        component (resolve)  {
            require(['../../src/service/supplierInitBatchImport/app'], resolve)
        },
    },
    '/:systemType/inventoryInitBatchImport': {
        key: 'inventoryInitBatchImport',
        title: '批量导入期初货品',
        component (resolve)  {
            require(['../../src/service/inventoryInitBatchImport/app'], resolve)
        },
    },
    '/:systemType/initRbac': {
        key: 'initRbac',
        title: '职能授权',
        component (resolve)  {
            require(['../../src/service/initRbac/app'], resolve)
        },
    },
}