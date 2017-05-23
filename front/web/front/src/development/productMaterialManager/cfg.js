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
                name: '成品',
                icon: '',
                params: {
                    main: {
                        key: 'firstInventoryCategoryCode',
                        url: __URL.dev + 'product/bom/findFirstInventoryCategoryGroup',
                        words: {
                            title: ['firstInventoryCategoryName'],
                            right: 'count'
                        },
                        param: {
                            "firstInventoryCategoryCode": "",
                            "secondInventoryCategoryCode": "",
                            "inventoryCode": "",
                            "inventoryName": "",
                            "inventorySpec": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "tabIndex": 10,
                            "yearMonth": 0,
                            "yearWeek": 0
                        },
                    },
                    sub: {
                        key: 'secondInventoryCategoryCode',
                        url: __URL.dev + 'product/bom/findSecondInventoryCategoryGroup',
                        words: {
                            title: ['secondInventoryCategoryName'],
                            right: 'count'
                        },
                        param: {
                            "firstInventoryCategoryCode": "",
                            "secondInventoryCategoryCode": "",
                            "inventoryCode": "",
                            "inventoryName": "",
                            "inventorySpec": "",
                            "yearMonth": 0,
                            "yearWeek": 0,
                            "tabIndex": 10
                        },
                    }
                }
            },{
                id: 'tab2',
                name: '半成品',
                icon: '',
                params: {
                    main: {
                        key: 'firstInventoryCategoryCode',
                        url: __URL.dev + 'product/bom/findFirstInventoryCategoryGroup',
                        words: {
                            title: ['firstInventoryCategoryName'],
                            right: 'count'
                        },
                        param: {
                            "firstInventoryCategoryCode": "",
                            "secondInventoryCategoryCode": "",
                            "inventoryCode": "",
                            "inventoryName": "",
                            "inventorySpec": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "tabIndex": 11,
                            "yearMonth": 0,
                            "yearWeek": 0
                        },
                    },
                    sub: {
                        key: 'secondInventoryCategoryCode',
                        url: __URL.dev + 'product/bom/findSecondInventoryCategoryGroup',
                        words: {
                            title: ['secondInventoryCategoryName'],
                            right: 'count'
                        },
                        param: {
                            "firstInventoryCategoryCode": "",
                            "secondInventoryCategoryCode": "",
                            "inventoryCode": "",
                            "inventoryName": "",
                            "inventorySpec": "",
                            "yearMonth": 0,
                            "yearWeek": 0,
                            "tabIndex": 11
                        },
                    }
                }
            },{
                id: 'tab3',
                name: '已停用',
                icon: '',
                params: {
                    main: {
                        key: 'firstInventoryCategoryCode',
                        url: __URL.dev + 'product/bom/findFirstInventoryCategoryGroup',
                        words: {
                            title: ['firstInventoryCategoryName'],
                            right: 'count'
                        },
                        param: {
                            "firstInventoryCategoryCode": "",
                            "secondInventoryCategoryCode": "",
                            "inventoryCode": "",
                            "inventoryName": "",
                            "inventorySpec": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "tabIndex": 13,
                            "yearMonth": 0,
                            "yearWeek": 0
                        },
                    },
                    sub: {
                        key: 'secondInventoryCategoryCode',
                        url: __URL.dev + 'product/bom/findSecondInventoryCategoryGroup',
                        words: {
                            title: ['secondInventoryCategoryName'],
                            right: 'count'
                        },
                        param: {
                            "firstInventoryCategoryCode": "",
                            "secondInventoryCategoryCode": "",
                            "inventoryCode": "",
                            "inventoryName": "",
                            "inventorySpec": "",
                            "yearMonth": 0,
                            "yearWeek": 0,
                            "tabIndex": 13
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
        filterCfg: [{
            label: '货品编码:',
            key: 'inventoryCode',
            value: '',
            type: 'text',
            placeholder: '请输入货品编码'
        }, {
            label: '货品名称:',
            key: 'inventoryName',
            value: '',
            type: 'text',
            placeholder: '请输入货品名称'
        }, {
            label: '规格型号:',
            key: 'inventorySpec',
            value: '',
            type: 'text',
            placeholder: '请输入规格型号'
        }]
    },
    /* 
     * table 配置
     */
    tableCfg: {
        // checkbox: [true, 'inventoryId'],
        // operating: [true, { type: 0 }],
        // radio: [true, 'docNo'],
        serial:true,
        width: [3, 3, 3, 3, 3, 3], //排除序号，多选，单选，操作栏
        match: [
            { key: 'docNo', href:true },
            'inventoryCode',
            'inventoryName',
            'inventorySpec', 
            'docVersion',
            'docVersionTime'
        ],
        head: ['BOM', '货品编码', '货品名称', '规格型号', '版本','版本日期'],
        newline: [0],
    },
}
