module.exports = {
    '/:systemType/stockMaterial': {
        key: 'stockMaterial',
        title: '原料库存查询',
        component (resolve)  {
            require(['../../src/warehouse/stock/app'], resolve)
        },
    },
    '/:systemType/stockProduct': {
        key: 'stockProduct',
        title: '成品库存查询',
        component (resolve)  {
            require(['../../src/warehouse/stock/app'], resolve)
        },
    },
    '/:systemType/initStockTakeMaterial': {
        key: 'initStockTakeMaterial',
        title: '期初盘点单',
        component (resolve)  {
            require(['../../src/warehouse/initStockTakeMaterial/app'], resolve)
        },
    },
    '/:systemType/initStockTakeProduct': {
        key: 'stockTake',
        title: '期初盘点单',
        component (resolve)  {
            require(['../../src/warehouse/initStockTakeProduct/app'], resolve)
        },
    },
    '/:systemType/stockTakeMaterial': {
        key: 'stockTakeMaterial',
        title: '盘点单',
        component (resolve)  {
            require(['../../src/warehouse/stockTakeMaterial/app'], resolve)
        },
    },
    '/:systemType/stockTakeProduct': {
        key: 'stockTakeProduct',
        title: '盘点单',
        component (resolve)  {
            require(['../../src/warehouse/stockTakeProduct/app'], resolve)
        },
    },
    '/:systemType/stockTakeAudit': {
        key: 'stockTakeAudit',
        title: '盘点单审核',
        component (resolve)  {
            require(['../../src/warehouse/stockTakeAudit/app'], resolve)
        },
    },
    '/:systemType/qualityCheck': {
        key: 'qualityCheck',
        title: '来料品质检验作业',
        component (resolve)  {
            require(['../../src/warehouse/qualityCheck/app'], resolve)
        },
    },
    '/:systemType/returnReceive': {
        key: 'returnReceive',
        title: '来料退收',
        component (resolve)  {
            require(['../../src/warehouse/returnReceive/app'], resolve)
        },
    },
    '/:systemType/returnInbound': {
        key: 'returnInbound',
        title: '入库后退货',
        component (resolve)  {
            require(['../../src/warehouse/returnInbound/app'], resolve)
        },
    },
    '/:systemType/materialPrepare': {
        key: 'materialPrepare',
        title: '生产备料与发料',
        component (resolve)  {
            require(['../../src/warehouse/materialPrepare/app'], resolve)
        },
    },
    '/:systemType/materialSupply': {
        key: 'materialSupply',
        title: '生产补料',
        component (resolve)  {
            require(['../../src/warehouse/materialSupply/app'], resolve)
        },
    },
    '/:systemType/materialReturn': {
        key: 'materialReturn',
        title: '生产退料',
        component (resolve)  {
            require(['../../src/warehouse/materialReturn/app'], resolve)
        },
    },
    '/:systemType/oscQualityCheck': {
        key: 'oscQualityCheck',
        title: '委外加工品质检验作业',
        component (resolve)  {
            require(['../../src/warehouse/oscQualityCheck/app'], resolve)
        },
    },
    '/:systemType/oscMaterialPrepare': {
        key: 'oscMaterialPrepare',
        title: '委外加工备料与发料',
        component (resolve)  {
            require(['../../src/warehouse/oscMaterialPrepare/app'], resolve)
        },
    },
    '/:systemType/outbound': {
        key: 'outbound',
        title: '成品出库',
        component (resolve)  {
            require(['../../src/warehouse/outbound/app'], resolve)
        },
    },
    '/:systemType/pointReceive': {
        key: 'pointReceive',
        title: '点数暂收',
        component (resolve)  {
            require(['../../src/warehouse/pointReceive/app'], resolve)
        },
    },
    '/:systemType/goodsInbound': {
        key: 'goodsInbound',
        title: '货品入库',
        component (resolve)  {
            require(['../../src/warehouse/goodsInbound/app'], resolve)
        },
    },
    '/:systemType/abnormalInbound': {
        key: 'abnormalInbound',
        title: '非正常入库',
        component (resolve)  {
            require(['../../src/warehouse/abnormalInbound/app'], resolve)
        },
    },
    '/:systemType/abnormalOutbound': {
        key: 'abnormalOutbound',
        title: '非正常出库',
        component (resolve)  {
            require(['../../src/warehouse/abnormalOutbound/app'], resolve)
        },
    },
    '/:systemType/abnormalInboundAudit': {
        key: 'abnormalInboundAudit',
        title: '非正常入库审核',
        component (resolve)  {
            require(['../../src/warehouse/abnormalInboundAudit/app'], resolve)
        },
    },
    '/:systemType/abnormalOutboundAudit': {
        key: 'abnormalOutboundAudit',
        title: '非正常出库审核',
        component (resolve)  {
            require(['../../src/warehouse/abnormalOutboundAudit/app'], resolve)
        },
    },
    '/:systemType/productQualityCheck': {
        key: 'productQualityCheck',
        title: '成品品质检验作业',
        component (resolve)  {
            require(['../../src/warehouse/productQualityCheck/app'], resolve)
        },
    },
    '/:systemType/returnOutbound': {
        key: 'returnOutbound',
        title: '销售退回',
        component (resolve)  {
            require(['../../src/warehouse/returnOutbound/app'], resolve)
        },
    },
}