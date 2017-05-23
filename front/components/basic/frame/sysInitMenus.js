/**
 * Created by SkyeTang on 2017/3/17.
 */
export const menu = [
    {
        name: '一 导入期初数据',
        url: '',
        status: 6,
        items: [
            {
                name: '人事档案',
                url: '/init/employeeInitBatchImport',
                status: 1,
                items: []
            }, {
                name: '工序档案',
                url: '/init/processInitBatchImport',
                status: 2,
                items: []
            }, {
                name: '客户档案',
                url: '/init/customerInitBatchImport',
                status: 3,
                items: []
            }, {
                name: '供应商档案',
                url: '/init/supplierInitBatchImport',
                status: 4,
                items: []
            }, {
                name: '货品期初存货档案',
                url: '/init/inventoryInitBatchImport',
                status: 5,
                items: []
            },
        ]
    },
    {
        name: '二 员工授权处理',
        url: '/init/initRbac',
        status: 6,
        items: []
    }
]
export const directMenu = ['/init/employeeInitBatchImport',
                            '/init/processInitBatchImport',
                            '/init/customerInitBatchImport',
                            '/init/supplierInitBatchImport',
                            '/init/inventoryInitBatchImport',
                            '/init/initRbac',
                          ]