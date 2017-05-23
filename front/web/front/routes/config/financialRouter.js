module.exports = {
    '/:systemType/saleInOutVerify': {
        key: 'saleInOutVerify',
        title: '销售收款与退款核销',
        component (resolve)  {
            require(['../../src/financial/saleInOutVerify/app'], resolve)
        },
    },
    '/:systemType/saleInOutVerifyAudit': {
        key: 'saleInOutVerifyAudit',
        title: '销售收款与退款核销审核',
        component (resolve)  {
            require(['../../src/financial/saleInOutVerifyAudit/app'], resolve)
        },
    },
    // '/:systemType/saleInOutVerify': {
    //     key: 'saleInOutVerify',
    //     title: '销售收款与退款核销审核',
    //     component (resolve)  {
    //         require(['../../src/financial/saleInOutVerify/app'], resolve)
    //     },
    // },
    '/:systemType/purchaseInOutVerify': {
        key: 'purchaseInOutVerify',
        title: '采购付款与退款核销',
        component (resolve)  {
            require(['../../src/financial/purchaseInOutVerify/app'], resolve)
        },
    },
    '/:systemType/purchaseInOutVerifyAudit': {
        key: 'purchaseInOutVerifyAudit',
        title: '采购付款与退款核销审核',
        component (resolve)  {
            require(['../../src/financial/purchaseInOutVerifyAudit/app'], resolve)
        },
    },
    '/:systemType/initBalance': {
        key: 'initBalance',
        title: '现金与银行存款期初余额',
        component (resolve)  {
            require(['../../src/financial/initBalance/app'], resolve)
        },
    },
    '/:systemType/initBalanceAudit': {
        key: 'initBalanceAudit',
        title: '现金与银行存款期初余额审核',
        component (resolve)  {
            require(['../../src/financial/initBalanceAudit/app'], resolve)
        },
    },
    '/:systemType/purchaseInvoice': {
        key: 'purchaseInvoice',
        title: '采购收票与退票',
        component (resolve)  {
            require(['../../src/financial/purchaseInvoice/app'], resolve)
        },
    },
    '/:systemType/purchaseInvoiceAudit': {
        key: 'purchaseInvoiceAudit',
        title: '采购收票与退票审核',
        component (resolve)  {
            require(['../../src/financial/purchaseInvoiceAudit/app'], resolve)
        },
    },
    '/:systemType/saleInvoice': {
        key: 'saleInvoice',
        title: '销售收票与退票',
        component (resolve)  {
            require(['../../src/financial/saleInvoice/app'], resolve)
        },
    },
    '/:systemType/saleInvoiceAudit': {
        key: 'saleInvoiceAudit',
        title: '销售收票与退票审核',
        component (resolve)  {
            require(['../../src/financial/saleInvoiceAudit/app'], resolve)
        },
    },
    '/:systemType/cashierRec': {
        key: 'cashierRec',
        title: '出纳收款与退款',
        component (resolve)  {
            require(['../../src/financial/cashierRec/app'], resolve)
        },
    },
    '/:systemType/cashierRecAudit': {
        key: 'cashierRecAudit',
        title: '出纳收款与退款审核',
        component (resolve)  {
            require(['../../src/financial/cashierRecAudit/app'], resolve)
        },
    },
    '/:systemType/cashierPay': {
        key: 'cashierPay',
        title: '出纳付款与退款',
        component (resolve)  {
            require(['../../src/financial/cashierPay/app'], resolve)
        },
    },
    '/:systemType/cashierPayAudit': {
        key: 'cashierPayAudit',
        title: '出纳付款与退款审核',
        component (resolve)  {
            require(['../../src/financial/cashierPayAudit/app'], resolve)
        },
    },
    '/:systemType/initRec': {
        key: 'initRec',
        title: '期初应收款',
        component (resolve)  {
            require(['../../src/financial/initRec/app'], resolve)
        },
    },
    '/:systemType/initRecAudit': {
        key: 'initRecAudit',
        title: '期初应收款审核',
        component (resolve)  {
            require(['../../src/financial/initRecAudit/app'], resolve)
        },
    },
    '/:systemType/initPay': {
        key: 'initPay',
        title: '期初应付款',
        component (resolve)  {
            require(['../../src/financial/initPay/app'], resolve)
        },
    },
    '/:systemType/initPayAudit': {
        key: 'initPayAudit',
        title: '期初应付款审核',
        component (resolve)  {
            require(['../../src/financial/initPayAudit/app'], resolve)
        },
    },
    '/:systemType/confirmReceivable': {
        key: 'confirmReceivable',
        title: '确认应收款',
        component (resolve)  {
            require(['../../src/financial/confirmReceivable/app'], resolve)
        },
    },
    '/:systemType/confirmPayable': {
        key: 'confirmPayable',
        title: '确认应付款',
        component (resolve)  {
            require(['../../src/financial/confirmPayable/app'], resolve)
        },
    },
    '/:systemType/initInventoryVerify': {
        key: 'initInventoryVerify',
        title: '期初存货核算',
        component (resolve)  {
            require(['../../src/financial/initInventoryVerify/app'], resolve)
        },
    },
    '/:systemType/initInventoryVerifyAudit': {
        key: 'initInventoryVerifyAudit',
        title: '期初存货核算审核',
        component (resolve)  {
            require(['../../src/financial/initInventoryVerifyAudit/app'], resolve)
        },
    },
    //固定资产
    '/:systemType/fixedAssets': {
    key: 'fixedAssets',
        title: '固定资产',
        component (resolve)  {
        require(['../../src/financial/fixedAssets/app'], resolve)
        },
    },
    //实收资本
    '/:systemType/paidInCapital': {
        key: 'paidInCapital',
        title: '实收资本',
        component (resolve)  {
            require(['../../src/financial/paidInCapital/app'], resolve)
        },
    },
    //实收资本审核
    '/:systemType/paidInCapitalAudit': {
        key: 'paidInCapitalAudit',
        title: '实收资本',
        component (resolve)  {
            require(['../../src/financial/paidInCapitalAudit/app'], resolve)
        },
    },
}