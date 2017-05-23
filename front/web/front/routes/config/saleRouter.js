module.exports = {
    '/:systemType/customerQuotation': {
        key: 'customerQuotation',
        title: '客户报价单' ,
        component (resolve)  {
            require(['../../src/sale/customerQuotation/app'], resolve)
        },
    },
    '/:systemType/customerPricing': {
        key: 'customerPricing',
        title: '销售价格表' ,
        component (resolve)  {
            require(['../../src/sale/customerPricing/app'], resolve)
        },
    },
    '/:systemType/dispatchStatus': {
        key: 'dispatchStatus',
        title: '发货状态' ,
        component (resolve)  {
            require(['../../src/sale/dispatchStatus/app'], resolve)
        },
    },
    '/:systemType/waitSendOrder': {
        key: 'waitSendOrder',
        title: '待发货订单' ,
        component (resolve)  {
            require(['../../src/sale/waitSendOrder/app'], resolve)
        },
    },
    '/:systemType/saleOrder': {
        key: 'saleOrder',
        title: '销售订单',
        component (resolve)  {
            require(['../../src/sale/saleOrder/app'], resolve)
        },
    },
    '/:systemType/saleManageOrder': {
        key: 'saleManageOrder',
        title: '业务主管销售订单',
        component (resolve)  {
            require(['../../src/sale/saleManageOrder/app'], resolve)
        },
    },
    '/:systemType/salesReturn': {
        key: 'salesReturn',
        title: '销售退货' ,
        component (resolve)  {
            require(['../../src/sale/salesReturn/app'], resolve)
        },
    },
    '/:systemType/salesReturnAudit': {
        key: 'salesReturnAudit',
        title: '销售退货审核' ,
        component (resolve)  {
            require(['../../src/sale/salesReturnAudit/app'], resolve)
        },
    },
    '/:systemType/traceOrder': {
        key: 'traceOrder',
        title: '业务跟单',
        component (resolve)  {
            require(['../../src/sale/traceOrder/app'], resolve)
        },
    },
    /*'/:systemType/unfinishedOrder': {
        key: 'unfinishedOrder',
        title: '销售',
        component (resolve)  {
            require(['../../src/sale/unfinishedOrder/app'], resolve)
        },
    },*/
    '/:systemType/customerCheck': {
        key: 'customerCheck',
        title:'客户对账单',
        component (resolve)  {
            require(['../../src/sale/customerCheck/app'], resolve)
        },
    },
    '/:systemType/customerQuotationAudit': {
        key: 'customerQuotationAudit',
        title: '客户报价单审核' ,
        component (resolve)  {
            require(['../../src/sale/customerQuotationAudit/app'], resolve)
        },
    },
    '/:systemType/customerPricingAudit': {
        key: 'customerPricingAudit',
        title: '销售价格表审核' ,
        component (resolve)  {
            require(['../../src/sale/customerPricingAudit/app'], resolve)
        },
    },
    '/:systemType/dispatchStatusAudit': {
        key: 'dispatchStatusAudit',
        title: '发货审核' ,
        component (resolve)  {
            require(['../../src/sale/dispatchStatusAudit/app'], resolve)
        },
    },
    // '/:systemType/saleManageOrder': {
    //     key: 'saleManageOrder',
    //     title: '销售审核' ,
    //     component (resolve)  {
    //         require(['../../src/sale/saleManageOrder/app'], resolve)
    //     },
    // },
    '/:systemType/checkChangeStatus': {
        key: 'checkChangeStatus',
        title: '查看销售订单变更状态' ,
        component (resolve)  {
            require(['../../src/sale/checkChangeStatus/app'], resolve)
        },
    },
    '/:systemType/saleOrderFollow': {
        key: 'saleOrderFollow',
        title: '订单跟进与申请变更',
        component (resolve)  {
            require(['../../src/sale/saleOrderFollow/app'], resolve)
        },
    },
    '/:systemType/saleOrderChange': {
        key: 'saleOrderChange',
        title: '查看销售订单变更状态',
        component (resolve)  {
            require(['../../src/sale/saleOrderChange/app'], resolve)
        },
    },
    '/:systemType/salesNonCompletionOrder': {
        key: 'salesNonCompletionOrder',
        title: '未完工订单跟进与反馈',
        component (resolve)  {
            require(['../../src/sale/salesNonCompletionOrder/app'], resolve)
        },
    },
    '/:systemType/saleOrderChangeAudit': {
        key: 'saleOrderChangeAudit',
        title: '销售订单变更审核' ,
        component (resolve)  {
            require(['../../src/sale/saleOrderChangeAudit/app'], resolve)
        },
    },
}