export default {
    leftItemCfg: {
        headCfg: {
            add: false,
            filter: false
        },
        /* 
         * tab 配置
         */
        tabCfg: {
            select: '',
            tabBarData: [
                {
                    id: 'tab1',
                    name: '已审核',
                    //icon: 'icon-teamwork',
                    params: {
                        main: {
                            key: 'warehouseCode',
                            url: __URL.warehouse + 'init/stock/take/product/query/warehouse/category/audit',
                            words: {
                                title: ['warehouseName'],
                                right: 'total',
                                sub: []
                            },
                            param: {
                            },
                        },
                        sub: {
                            key: 'inventoryCategoryCode',
                            url: __URL.warehouse + 'init/stock/take/product/query/inventory/category/audit',
                            words: {
                                title: ['inventoryCategoryName'],
                                right: 'total',
                                sub: []
                            },
                            param: {
                                'warehouseCode': ''
                            }
                        }
                    }
                }
            ]
        },
        /*
         * list 配置
         */
        listCfg: {
            hasNub: true,
            hasChild: true,
        },
        /*
         * filter 配置
         */
        filterCfg: [
            {
                label: '仓库:',
                key: 'warehouseName',
                value: '',
                type: 'text',
                placeholder: '请输入仓库'
            }, {
                label: '货品类别编码:',
                key: 'inventoryCategoryCode',
                value: '',
                type: 'search',
                emit: 'inventory',
                placeholder: '请输入货品类别编码'
            }, {
                label: '货品类别名称',
                key: 'inventoryCategoryName',
                value: '',
                type: 'search',
                emit: 'inventory',
                placeholder: '请输入货品类别名称'
            }
        ]
    },

    /*
     * table 配置
     */
    listParam: {
        'warehouseCode': '',
        'inventoryCategoryCode': '',
        'inventoryCategoryName':'',
        'pageIndex': 1,
        'pageSize': 50
    },
    tableCfg: {
        serial: true,
        width: [3, 3, 3, 3, 3, 3], //排除序号，多选，单选，操作栏
        match: [
            'inventoryCode',
            'inventoryName',
            'inventorySpec',
            'inventoryTypeName',
            'attributeName',
            'quantity',
            'unitName'
        ],
        head: ['货品编码', '货品名称', '规格型号', '存货类别', '属性', '数量', '单位'],
    },
}
