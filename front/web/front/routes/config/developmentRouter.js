module.exports = {
    '/:systemType/inventoryCategory': {
        key: 'inventoryCategory',
        title: '货品分类与规则设置',
        component (resolve)  {
            require(['../../src/development/inventoryCategory/app'], resolve)
        },
    },
    '/:systemType/inventory': {
        key: 'inventory',
        title: '新增货品编码档案',
        component (resolve)  {
            require(['../../src/development/inventory/app'], resolve)
        },
    },
    '/:systemType/inventoryManager': {
        key: 'inventoryManager',
        title: '货品编码与档案管理',
        component (resolve)  {
            require(['../../src/development/inventoryManager/app'], resolve)
        },
    },
    '/:systemType/inventoryBatchImport': {
        key: 'inventoryBatchImport',
        title: '货品档案批量导入',
        component (resolve)  {
            require(['../../src/development/inventoryBatchImport/app'], resolve)
        },
    },
    '/:systemType/orderMaterial': {
        key: 'orderMaterial',
        title: '待完善销售订单BOM',
        component (resolve)  {
            require(['../../src/development/orderMaterial/app'], resolve)
        },
    },
    '/:systemType/orderMaterialLook': {
        key: 'orderMaterialLook',
        title: '订单BOM查看',
        component (resolve)  {
            require(['../../src/development/orderMaterialLook/app'], resolve)
        },
    },
    '/:systemType/productMaterial': {
        key: 'productMaterial',
        title: '新增产品生产BOM档案',
        component (resolve)  {
            require(['../../src/development/productMaterial/app'], resolve)
        },
    },
    '/:systemType/productMaterialManager': {
        key: 'productMaterialManager',
        title: '产品生产BOM档案管理',
        component (resolve)  {
            require(['../../src/development/productMaterialManager/app'], resolve)
        },
    },
    '/:systemType/productMaterialAudit': {
        key: 'productMaterialAudit',
        title: '产品生产BOM档案审核',
        component (resolve)  {
            require(['../../src/development/productMaterialAudit/app'], resolve)
        },
    },
}
