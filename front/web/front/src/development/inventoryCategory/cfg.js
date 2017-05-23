export default {
    leftItemCfg: {
        headCfg: {
            add: [true,'新增一级分类'],
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
                        url: __URL.arc + 'inventory/category/first',
                        words: {
                            title: ['firstInventoryCategoryName'],
                        },
                        param: {
                            "firstInventoryCategoryCode": "",
                            "inventoryTypeCode": "001",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "secondInventoryCategoryCode": ""
                        },
                    },
                    sub: {
                        key: 'secondInventoryCategoryCode',
                        url: __URL.arc + 'inventory/category/second',
                        words: {
                            title: ['secondInventoryCategoryName'],
                        },
                        param: {
                            "firstInventoryCategoryCode": "",
                            "inventoryTypeCode": "001",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "secondInventoryCategoryCode": ""
                        }
                    }
                }
            }, {
                id: 'tab2',
                name: '半成品',
                icon: '',
                params: {
                    main: {
                        key: 'firstInventoryCategoryCode',
                        url: __URL.arc + 'inventory/category/first',
                        words: {
                            title: ['firstInventoryCategoryName'],
                        },
                        param: {
                            "firstInventoryCategoryCode": "",
                            "inventoryTypeCode": "002",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "secondInventoryCategoryCode": ""
                        },
                    },
                    sub: {
                        key: 'secondInventoryCategoryCode',
                        url: __URL.arc + 'inventory/category/second',
                        words: {
                            title: ['secondInventoryCategoryName'],
                        },
                        param: {
                            "firstInventoryCategoryCode": "",
                            "inventoryTypeCode": "002",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "secondInventoryCategoryCode": ""
                        }
                    }
                }
            }, {
                id: 'tab3',
                name: '原料',
                icon: '',
                params: {
                    main: {
                        key: 'firstInventoryCategoryCode',
                        url: __URL.arc + 'inventory/category/first',
                        words: {
                            title: ['firstInventoryCategoryName'],
                        },
                        param: {
                            "firstInventoryCategoryCode": "",
                            "inventoryTypeCode": "003",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "secondInventoryCategoryCode": ""
                        },
                    },
                    sub: {
                        key: 'secondInventoryCategoryCode',
                        url: __URL.arc + 'inventory/category/second',
                        words: {
                            title: ['secondInventoryCategoryName'],
                        },
                        param: {
                            "firstInventoryCategoryCode": "",
                            "inventoryTypeCode": "003",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "secondInventoryCategoryCode": ""
                        }
                    }
                }
            }]
        },
        /* 
         * list 配置
         */
        listCfg: {
            hasNub: false,
            hasChild: true,
        },
        /* 
         * filter 配置
         */
        filterCfg: [{
            label: '客户名称:',
            key: 'customerName',
            value: '',
            type: 'text',
            placeholder: '请输入客户名称'
        }, {
            label: '开始时间:',
            key: 'startDocDate',
            value: '',
            type: 'date',
            config: {
                placeholder: '请输入开始时间',
                format: 'YYYY-MM-DD',
            }
        }, {
            label: '结束时间:',
            key: 'endDocDate',
            value: '',
            type: 'date',
            config: {
                placeholder: '请输入结束时间',
                format: 'YYYY-MM-DD',
            }
        },]
    },
    /* 
     * table 配置
     */
    tableCfg: {
        // checkbox: [true, 'inventoryId'],
        operating: [true, 'config-operate', [{
            text: '编辑规则定义',
            btn: 'edit'
        }, /*{text:'删除',btn:'delete',type:'danger'}*/]],
        // radio: [true, 'docNo'],
        serial: true,
        width: [4, 3, 4, 3, 3, 3,], //排除序号，多选，单选，操作栏
        match: [
            'typeName',
            'valueName',
            function (val) {
                if(val.recordStatus ==1){
                    return '启用'
                }
                if(val.recordStatus ==0){
                    return '未启用'
                }
            },
        ],
        head: ['规则项目', '规则定义', '启用状态',],
    },

}
