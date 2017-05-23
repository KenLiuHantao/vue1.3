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
                name: '待审核',
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
                id: 'tab2',
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
    unauditTableCfg: {
        /*operating: [true, 'config-operate',
            [{
                type: 'blue',
                btn: 'repeal',
                text: '同意撤销提交',
                func: function (data) {
                    return !data.repeal
                }
            }, {
                type: 'blue',
                btn: 'audit',
                text: '审核'
            }]
        ],*/
        serial: false,
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

    auditTableCfg: {
        /*operating: [true, 'config-operate',
            [{
                type: 'blue',
                btn: 'unaudit',
                text: '弃审'
            }]
        ],*/
        serial: false,
        width: [4, 4, 4, 4, 4], //排除序号，多选，单选，操作栏
        match: [
            {key: 'inventoryCode', href: true},
            'inventoryName',
            'inventorySpec',
            'unitName',
            'actualQuantity'
        ],
        head: ['货品编码', '货品名称', '货品规格', '单位', '数量'],
    },
}
