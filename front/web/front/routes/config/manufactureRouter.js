module.exports = {
    '/:systemType/allOrder': {
        key: 'allOrder',
        title: '全部订单管理',
        component (resolve)  {
            require(['../../src/manufacture/allOrder/app'], resolve)
        },
    },
    '/:systemType/productPick': {
        key: 'productPick',
        title: '生产领料',
        component (resolve)  {
            require(['../../src/manufacture/productPick/app'], resolve)
        },
    },
    '/:systemType/productManager': {
        key: 'productManager',
        title: '生产订单管理',
        component (resolve)  {
            require(['../../src/manufacture/productManager/app'], resolve)
        },
    },
    '/:systemType/productInboundLook': {
        key: 'productInboundLook',
        title: '产成品入库/转仓',
        component (resolve)  {
            require(['../../src/manufacture/productInboundLook/app'], resolve)
        },
    },
    '/:systemType/redirect': {
        key: 'redirect',
        title: '生产工序流转',
        component (resolve)  {
            require(['../../src/manufacture/redirect/app'], resolve)
        },
    },
    '/:systemType/productSupplyScrap': {
        key: 'productSupplyScrap',
        title: '查看补料与报废审核',
        component (resolve)  {
            require(['../../src/manufacture/productSupplyScrap/app'], resolve)
        },
    },
    '/:systemType/productSupplyScrapAudit': {
        key: 'productSupplyScrapAudit',
        title: '生产补料与报废审核',
        component (resolve)  {
            require(['../../src/manufacture/productSupplyScrapAudit/app'], resolve)
        },
    },
    '/:systemType/productReturnScrap': {
        key: 'productReturnScrap',
        title: '生产退料与申请报废',
        component (resolve)  {
            require(['../../src/manufacture/productReturnScrap/app'], resolve)
        },
    },
    '/:systemType/productReturn': {
        key: 'productReturn',
        title: '生产退料',
        component (resolve)  {
            require(['../../src/manufacture/productReturn/app'], resolve)
        },
    },
    '/:systemType/productChangeManager': {
        key: 'productChangeManager',
        title: '销售订单变更处理',
        component (resolve)  {
            require(['../../src/manufacture/productChangeManager/app'], resolve)
        },
    },
    '/:systemType/productChangeDeal': {
        key: 'productChangeDeal',
        title: '销售订单变更处理',
        component (resolve)  {
            require(['../../src/manufacture/productChangeDeal/app'], resolve)
        },
    }
}
