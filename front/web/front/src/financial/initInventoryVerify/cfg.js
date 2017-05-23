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
            tabBarData: [{
                id: 'tab1',
                name: '草稿箱',
                icon: '',
                params: {
                    main: {
                        key: 'warehouseCode',
                        url: __URL.financial + 'init/inventory/verify/warehouse/list',
                        words: {
                            title: ['warehouseName'],
                        },
                        param: {
                            "warehouseCode": '',
                            "warehouseName": '',
                            "docStatus":-2
                        }
                    },
                }
            }, {
                id: 'tab2',
                name: '待处理',
                icon: '',
                params: {
                    main: {
                        key: 'warehouseCode',
                        url: __URL.financial + 'init/inventory/verify/warehouse/list',
                        words: {
                            title: ['warehouseName'],
                        },
                        param: {
                            "warehouseCode": '',
                            "warehouseName": '',
                            "docStatus":0
                        }
                    },
                }
            }, {
                id: 'tab3',
                name: '未审核',
                icon: '',
                params: {
                    main: {
                        key: 'warehouseCode',
                        url: __URL.financial + 'init/inventory/verify/warehouse/list',
                        words: {
                            title: ['warehouseName'],
                        },
                        param: {
                            "warehouseCode": '',
                            "warehouseName": '',
                            "docStatus":1
                        },
                    }
                }
            }, {
                id: 'tab4',
                name: '已审核',
                icon: '',
                params: {
                    main: {
                        key: 'warehouseCode',
                        url: __URL.financial + 'init/inventory/verify/warehouse/list',
                        words: {
                            title: ['warehouseName'],
                            right: 'count'
                        },
                        param: {
                            "warehouseCode": '',
                            "warehouseName": '',
                            "docStatus":2
                        },
                    }
                }
            }]
        },
        /* 
         * list 配置
         */
        listCfg: {
            hasNub: true,
            hasChild: false,
        },
        /* 
         * filter 配置
         */
        filterCfg: []
    },
    /* 
     * table 配置
     */
    draftTableCfg: {
        checkbox: [true, 'recordId'],
        /*operating: [true, 'config-operate',
            [{
                type: 'blue',
                btn: 'draftModify',
                text: '编辑'
            }, {
                type: 'blue',
                btn: 'draftDelete',
                text: '删除'
            }, {
                type: 'blue',
                btn: 'draftSubmit',
                text: '提交'
            }]
        ],*/
        serial: true,
        width: [4, 4, 4, 4, 4], //排除序号，多选，单选，操作栏
        match: [
            {key: 'inventoryCode', href: true},
            'inventoryName',
            'inventorySpec',
            'unitName',
            'inductionQuantity'
        ],
        head: ['货品编码', '货品名称', '货品规格', '单位', '数量'],
    },

    waitTableCfg: {
        checkbox: [true, 'recordId'],
        /*operating: [true, 'config-operate',
            [{
                type: 'blue',
                btn: 'waitModify',
                text: '编辑'
            }, {
                type: 'blue',
                btn: 'waitDelete',
                text: '删除'
            }, {
                type: 'blue',
                btn: 'waitSubmit',
                text: '提交'
            }]
        ],*/
        serial: true,
        width: [3, 3, 3, 3, 3, 2, 2], //排除序号，多选，单选，操作栏
        match: [
            {key: 'inventoryCode', href: true},
            'inventoryName',
            'inventorySpec',
            'unitName',
            'inductionQuantity',
            'actualQuantity',
            'status'
        ],
        head: ['货品编码', '货品名称', '货品规格', '单位', '导入数量', '盘点数量', '分析状态'],
    },

    unauditTableCfg: {
        operating: [true, 'config-operate',
            [{
                type: 'blue',
                btn: 'repeal',
                text: '撤销提交审核',
                func: function (data) {
                    return !data.repeal
                }
            }]
        ],
        serial: true,
        width: [4, 4, 4, 4, 4], //排除序号，多选，单选，操作栏
        firstItemTextAlignLeft: true,
        match: [
            {key: 'inventoryCode', href: true},
            'inventoryName',
            'inventorySpec',
            'unitName',
            'inductionQuantity',
        ],
        head: ['货品编码', '货品名称', '货品规格', '单位', '数量'],
    },

    auditTableCfg: {
        serial: true,
        width: [4, 4, 4, 4, 4], //排除序号，多选，单选，操作栏
        firstItemTextAlignLeft: true,
        match: [
            {key: 'inventoryCode', href: true},
            'inventoryName',
            'inventorySpec',
            'unitName',
            'actualQuantity',
        ],
        head: ['货品编码', '货品名称', '货品规格', '单位', '数量'],
    },
}
