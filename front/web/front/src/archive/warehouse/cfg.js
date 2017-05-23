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
            tabBarData: [{
                id: 'tab1',
                name: '货品仓库',
                icon: '',
                params: {
                    main: {
                        key: 'warehouseCode',
                        url: __URL.arc + 'warehouse/list',
                        words: {
                            title: ['warehouseName'],
                            sub: [ ]
                        },
                        param: {
                            'warehouseCategoryCode': '001',
                            'warehouseCode': ''
                        }
                    }
                }
            }, {
                id: 'tab2',
                name: '行政仓库',
                icon: '',
                params: {
                    main: {
                        key: 'warehouseCode',
                        url: __URL.arc + 'warehouse/list',
                        words: {
                            title: ['warehouseName'],
                            sub: [ ]
                        },
                        param: {
                            'warehouseCategoryCode': '002',
                            'warehouseCode': ''
                        }
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
        filterCfg: [

        ]
    },
    /* 
     * table 配置
     */
    inventoryTableCfg: {
        warehouseOperate: [true, { type: 0 }],
        width: [6, 6, 6], //排除序号，多选，单选，操作栏
        match: [
            'warehouseName',
            'warehouseCategoryName',
            'status'
        ],
        head: ['名称', '仓库类型', '状态']
    },
    adminTableCfg: {
        warehouseOperate: [true, { type: 0 }],
        width: [6, 6, 6], //排除序号，多选，单选，操作栏
        match: [
            'warehouseName',
            'warehouseCategoryName',
            'status'
        ],
        head: ['名称', '仓库类型', '状态']
    }
}
