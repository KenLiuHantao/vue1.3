module.exports = {
    '/:systemType/purOrder': {
        key: 'purOrder',
        title: '订单物料采购',
        component (resolve)  {
            require(['../../src/purchase/purOrder/app'], resolve)
        },
    },
    '/:systemType/purChange': {
        key: 'purOrder',
        title: '订单物料采购变更',
        component (resolve)  {
            require(['../../src/purchase/purChange/app'], resolve)
        },
    },
    '/:systemType/purPrice': {
        key: 'purPrice',
        title: '采购价格表',
        component (resolve)  {
            require(['../../src/purchase/purPrice/app'], resolve)
        },
    },
    '/:systemType/supplierQuotation': {
        key: 'supplierQuotation',
        title: '供应商报价',
        component (resolve)  {
            require(['../../src/purchase/supplierQuotation/app'], resolve)
        },
    },
    '/:systemType/supplierQuotationAudit': {
        key: 'supplierQuotationAudit',
        title: '供应商报价审核',
        component (resolve)  {
            require(['../../src/purchase/supplierQuotationAudit/app'], resolve)
        },
    },
    '/:systemType/outsource': {
        key: 'outsource',
        title: '委外加工采购',
        component (resolve)  {
            require(['../../src/purchase/outsource/app'], resolve)
        },
    },
    '/:systemType/outsourceChange': {
        key: 'outsourceChange',
        title: '委外加工采购变更',
        component (resolve)  {
            require(['../../src/purchase/outsourceChange/app'], resolve)
        },
    },
    '/:systemType/supplierCheck': {
        key: 'supplierCheck',
        title:'供应商对账',
        component (resolve)  {
            require(['../../src/purchase/supplierCheck/app'], resolve)
        },
    },
    '/:systemType/purReturnReceive': {
        key: 'purReturnReceive',
        title:'来料退收处理',
        component (resolve)  {
            require(['../../src/purchase/purReturnReceive/app'], resolve)
        },
    },
    '/:systemType/purReturnInbound': {
        key: 'purReturnInbound',
        title:'入库后退货处理',
        component (resolve)  {
            require(['../../src/purchase/purReturnInbound/app'], resolve)
        },
    }
}
