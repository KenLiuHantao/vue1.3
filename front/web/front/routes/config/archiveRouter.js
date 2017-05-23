module.exports = {
    //销售 begin
    /*'/:systemType/customerCategory': {
        key: 'customerCategory',
        title: '客户分类',
        component (resolve)  {
            require(['../../src/archive/customerCategory/app'], resolve)
        },
    },*/
    /*'/:systemType/customer': {
        key: 'customer',
        title: '客户档案',
        component (resolve)  {
            require(['../../src/archive/customer/app'], resolve)
        },
    },*/
    '/:systemType/customerBatchImport': {
        key: 'customerBatchImport',
        title: '客户档案批量导入',
        component (resolve)  {
            require(['../../src/archive/customerBatchImport/app'], resolve)
        },
    },
    //销售 end

    //采购 begin
    '/:systemType/supplierCategory': {
        key: 'supplierCategory',
        title: '供应商分类',
        component (resolve)  {
            require(['../../src/archive/supplierCategory/app'], resolve)
        },
    },
    '/:systemType/supplier': {
        key: 'supplier',
        title: '供应商档案',
        component (resolve)  {
            require(['../../src/archive/supplier/app'], resolve)
        },
    },
    '/:systemType/supplierCooperate': {
        key: 'supplierCooperate',
        title: '供应商合作管理',
        component (resolve)  {
            require(['../../src/archive/supplierCooperate/app'], resolve)
        },
    },
    //采购 end

    //仓库 begin
    '/:systemType/warehouse': {
        key: 'warehouse',
        title: '仓库设置',
        component (resolve)  {
            require(['../../src/archive/warehouse/app'], resolve)
        },
    },
    //仓库 end

    //会计 begin
    '/:systemType/accountCfg': {
        key: 'accountCfg',
        title: '会计基础设置',
        component (resolve)  {
            require(['../../src/archive/accountCfg/app'], resolve)
        },
    },
    '/:systemType/payment': {
        key: 'payment',
        title: '结算方式',
        component (resolve)  {
            require(['../../src/archive/payment/app'], resolve)
        },
    },
    '/:systemType/unit': {
        key: 'unit',
        title: '计量单位',
        component (resolve)  {
            require(['../../src/archive/unit/app'], resolve)
        },
    },
    '/:systemType/bank': {
        key: 'bank',
        title: '银行设置',
        component (resolve)  {
            require(['../../src/archive/bank/app'], resolve)
        },
    },
    '/:systemType/parameterDigital': {
        key: 'parameterDigital',
        title: '数据格式设置',
        component (resolve)  {
            require(['../../src/archive/parameterDigital/app'], resolve)
        },
    },
    '/:systemType/currency': {
        key: 'currency',
        title: '币种与汇率设置',
        component (resolve)  {
            require(['../../src/archive/currency/app'], resolve)
        },
    },
    '/:systemType/recAndPay': {
        key: 'recAndPay',
        title: '收付款条件设置',
        component (resolve)  {
            require(['../../src/archive/recAndPay/app'], resolve)
        },
    },
    '/:systemType/taxRate': {
        key: 'taxRate',
        title: '税率设置',
        component (resolve)  {
            require(['../../src/archive/taxRate/app'], resolve)
        },
    },
    //会计 end

    //开发工程师 begin
    '/:systemType/process': {
        key: 'process',
        title: '工序档案管理',
        component (resolve)  {
            require(['../../src/archive/process/app'], resolve)
        },
    },
    // '/:systemType/inventoryCategory': {
    //     key: 'inventoryCategory',
    //     title: '货品分类',
    //     component (resolve)  {
    //         require(['../../src/archive/inventoryCategory/app'], resolve)
    //     },
    // },
    //开发工程师 end

    //货品分类
    /*'/:systemType/inventoryCategory': {
        key: 'inventoryCategory',
        title: '货品分类',
        component (resolve)  {
            require(['../../src/archive/inventoryCategory/app'], resolve)
        },
    },*/

    //行业分类
    '/:systemType/industryCategory': {
        key: 'industryCategory',
        title: '行业分类(旧)',
        component (resolve)  {
            require(['../../src/archive/industryCategory/app'], resolve)
        },
    },

    //资产类别
    '/:systemType/assetsType': {
        key: 'assetsType',
        title: '资产类别',
        component (resolve)  {
            require(['../../src/archive/assetsType/app'], resolve)
        },
    },
    //折旧方法
    '/:systemType/depreciationMethod':{
        key:'depreciationMethod',
        title:'折旧方法',
        component(resolve){
            require(['../../src/archive/depreciationMethod/app'],resolve)
        }
    },
    //资产状态
    '/:systemType/assetsStatus': {
        key: 'assetsStatus',
        title: '资产状态',
        component (resolve)  {
            require(['../../src/archive/assetsStatus/app'], resolve)
        },
    },
    //费用类别
    '/:systemType/expenseType': {
        key: 'expenseType',
        title: '费用类别',
        component (resolve)  {
            require(['../../src/archive/expenseType/app'], resolve)
        },
    },
    //财务基础设置
    '/:systemType/financialBaseSetting': {
        key: 'financialBaseSetting',
        title: '财务基础设置',
        component (resolve)  {
            require(['../../src/archive/financialBaseSetting/app'], resolve)
        },
    },
}
