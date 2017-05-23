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
                    name: '货品类别',
                    //icon: 'icon-teamwork',
                    params: {
                        main: {
                            key: 'inventoryCategoryCode',
                            url: __URL.warehouse + 'stock/query/inventory/categories',
                            words: {
                                title: ['inventoryCategoryName'],
                                right: '',
                                sub: []
                            },
                            param: {},
                        },
                        sub: {
                            key: 'inventoryId',
                            url: __URL.warehouse + 'stock/query/inventories',
                            words: {
                                title: ['inventoryName'],
                                right:'',
                                sub: []
                            },
                            param: {
                                'inventoryCategoryCode': ''
                            }
                        }
                    }
                },
                {
                    id: 'tab2',
                    name: '仓库分类',
                    //icon: 'icon-teamwork',
                    params: {
                        main: {
                            key: 'warehouseCode',
                            url: __URL.warehouse + 'stock/query/warehouses',
                            words: {
                                title: ['warehouseName'],
                                right :'',
                                sub: []
                            },
                            param: {},
                        },
                        sub: {
                            key: 'inventoryId',
                            url: __URL.warehouse + 'stock/query/inventories',
                            words: {
                                title: ['inventoryName'],
                                right :'',
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
                label: '货品编码:',
                key: 'inventoryCode',
                value: '',
                type: 'search',
                emit: 'inventory',
                placeholder: '请输入货品编码'
            }, {
                label: '货品名称',
                key: 'inventoryName',
                value: '',
                type: 'search',
                emit: 'inventory',
                placeholder: '请输入货品名称'
            }, {
                label: '规格型号',
                key: 'inventorySpec',
                value: '',
                type: 'search',
                emit: 'inventory',
                placeholder: '请输入规格型号'
            }, {
                label: '货品分类',
                key: 'inventoryCategoryCode',
                value: '',
                type: 'search',
                emit: 'inventory',
                placeholder: '请输入货品分类'
            }
        ]
    },

    /* 
     * table 配置
     */
    listParam: {
        'warehouseCode': '',
        'inventoryCode': '',
        'inventoryName': '',
        'inventorySpec': '',
        'inventoryCategoryCode':'',
        'pageIndex': 0,
        'pageSize': 20
    },
    tableCfg: {
        serial: true,
        width: [3, 3, 3, 3, 3, 3], //排除序号，多选，单选，操作栏
        match: [
            'warehouseName',
            [{key: 'inventoryCode', href: true}],
            'inventoryName',
            'inventorySpec',
            'unitName',
            'quantity'
        ],
        head: ['仓库', '货品编码', '货品名称', '规格型号', '单位', '库存量'],
    },
}
