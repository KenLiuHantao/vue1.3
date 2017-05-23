export default {
    leftItemCfg: {
        headCfg: {
            add: true,
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
                            key: 'yearMonth',
                            url: __URL.warehouse + 'initial/inbound/query/months',
                            words: {
                                title: ['month'],
                                right: 'total',
                                sub: []
                            },
                            param: { },
                        },
                        sub: {
                            key: 'inventoryCategoryCode',
                            url: __URL.warehouse + 'initial/inbound/query/inventory/categories',
                            words: {
                                title: ['inventoryCategoryName'],
                                right:'total',
                                sub: []
                            },
                            param: {
                                'yearMonth': ''
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
                            key: 'yearMonth',
                            url: __URL.warehouse + 'initial/inbound/query/months',
                            words: {
                                title: ['month'],
                                right :'total',
                                sub: []
                            },
                            param: {},
                        },
                        sub: {
                            key: 'warehouseCode',
                            url: __URL.warehouse + 'initial/inbound/query/warehouses',
                            words: {
                                title: ['warehouseName'],
                                right :'total',
                                sub: []
                            },
                            param: {
                                'yearMonth': ''
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
                label: '单据号:',
                key: 'docNo',
                value: '',
                type: 'text',
                placeholder: '请输入结存单号'
            }, {
                label: '单据日期(从):',
                key: 'startDocDate',
                value: '',
                type: 'date',
                format:'YYYY-MM-DD',
                placeholder: '请选择开始时间'
            }, {
                label: '单据日期(到):',
                key: 'endDocDate',
                value: '',
                type: 'date',
                format:'YYYY-MM-DD',
                placeholder: '请选择结束时间'
            },{
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
            }
        ]
    },

    /* 
     * table 配置
     */
    listParam: {
        'startDocDate': '',
        'endDocDate': '',
        'docNo': '',
        'inventoryCode': '',
        'inventoryName': '',
        'warehouseCategoryCode': '',
        'inventoryCategoryCode':'',
        'yearMonth': '',
        'pageIndex': 0,
        'pageSize': 0
    },
    tableCfg: {
        serial:true,
        width: [4, 3, 3, 3, 3,3], //排除序号，多选，单选，操作栏
        match: [
            [{ key: 'docNo', href: true }],
            [{key:'inventoryCode', href:true}],
            'inventoryName',
            'warehouseName',
            'unitName',
            'quantity'
        ],
        head: ['结存单号', '货品编码', '货品名称', '仓库','单位', '数量'],
    },
}
