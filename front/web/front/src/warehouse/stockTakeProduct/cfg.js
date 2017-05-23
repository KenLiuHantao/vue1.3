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
                    name: '待盘点',
                    //icon: 'icon-teamwork',
                    params: {
                        main: {
                            key: 'warehouseCode',
                            url: __URL.warehouse + 'stock/take/product/query/warehouse/category/wait',
                            words: {
                                title: ['warehouseName'],
                                right: 'total',
                                sub: []
                            },
                            param: {},
                        },
                        sub: {
                            key: 'inventoryCategoryCode',
                            url: __URL.warehouse + 'stock/take/product/query/inventory/category/wait',
                            words: {
                                title: ['inventoryCategoryName'],
                                right: 'total',
                                sub: []
                            },
                            param: {
                                'warehouseCode': ''
                            }
                        }
                    },
                } ,
                {
                    id: 'tab2',
                    name: '未审核',
                    //icon: 'icon-teamwork',
                    params: {
                        main: {
                            key: 'warehouseCode',
                            url: __URL.warehouse + 'stock/take/product/query/warehouse/category/unaudit',
                            words: {
                                title: ['warehouseName'],
                                right: 'total',
                                sub: []
                            },
                            param: {},
                        },
                        sub: {
                            key: 'inventoryCategoryCode',
                            url: __URL.warehouse + 'stock/take/product/query/inventory/category/unaudit',
                            words: {
                                title: ['inventoryCategoryName'],
                                right: 'total',
                                sub: []
                            },
                            param: {
                                'warehouseCode': ''
                            }
                        }
                    },
                },
                {
                    id: 'tab3',
                    name: '已审核',
                    //icon: 'icon-teamwork',
                    params: {
                        main: {
                            key: 'warehouseCode',
                            url: __URL.warehouse + 'stock/take/product/query/warehouse/category/audit',
                            words: {
                                title: ['warehouseName'],
                                right: 'total',
                                sub: []
                            },
                            param: {},
                        },
                        sub: {
                            key: 'inventoryCategoryCode',
                            url: __URL.warehouse + 'stock/take/product/query/inventory/category/audit',
                            words: {
                                title: ['inventoryCategoryName'],
                                right: 'total',
                                sub: []
                            },
                            param: {
                                'warehouseCode': ''
                            }
                        }
                    },
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
    waitTableCfg: {
        serial: true,
        width: [3, 3, 3, 3, 3, 3], //排除序号，多选，单选，操作栏
        match: [
            [{key: 'docNo', href: true }],
            'docDate',
            'employeeName',
            'total',
            'totalTaked',
            'totalUntake'
        ],
        head: ['盘点单号', '盘点日期', '仓管员', '盘点项总计', '已盘项', '未盘项'],
    },
    unauditTableCfg: {
        serial: true,
        width: [3, 3, 3, 3, 3, 3], //排除序号，多选，单选，操作栏
        match: [
            [{key: 'docNo', href: true }],
            'docDate',
            'employeeName',
            'total',
            'totalTaked',
            'totalUntake'
        ],
        head: ['盘点单号', '盘点日期', '仓管员', '盘点项总计', '已盘项', '未盘项'],
    },
    auditTableTableCfg: {
        serial: true,
        width: [3, 3, 3, 3, 3, 3], //排除序号，多选，单选，操作栏
        match: [
            [{key: 'docNo', href: true }],
            'docDate',
            'employeeName',
            'total',
            'totalTaked',
            'totalUntake'
        ],
        head: ['盘点单号', '盘点日期', '仓管员', '盘点项总计', '已盘项', '未盘项'],
    }
}
