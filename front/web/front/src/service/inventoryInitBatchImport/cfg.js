export default {
    leftItemCfg: {
        headCfg: {
            add: [true, '上传草稿'],
            filter: false
        },
        /* 
         * tab 配置
         */
        tabCfg: {
            select: '',
            tabBarData: [{
                id: 'tab1',
                name: '待正式导入',
                params: {
                    main: {
                        key: 'firstInventoryCategoryName',
                        url: __URL.osiu + 'import/init/inventory/findFirstCategoryGroup',
                        words: {
                            title: ['firstInventoryCategoryName'],
                            right: 'count'
                        },
                        param: {
                            "inventoryCode": "",
                            "inventoryName": "",
                            "inventorySpec": "",
                            "firstInventoryCategoryName": "",
                            "secondInventoryCategoryName": "",
                            "pageIndex": 1,
                            "pageSize": 50,
                            "tabIndex": 0
                        }
                    },
                    sub: {
                        key: 'secondInventoryCategoryName',
                        url: __URL.osiu + 'import/init/inventory/findSecondCategoryGroup',
                        words: {
                            title: ['secondInventoryCategoryName'],
                            right: 'count'
                        },
                        param: {
                            "inventoryCode": "",
                            "inventoryName": "",
                            "inventorySpec": "",
                            "firstInventoryCategoryName": "",
                            "secondInventoryCategoryName": "",
                            "pageIndex": 1,
                            "pageSize": 50,
                            "tabIndex": 0
                        },
                    }
                }
            }, {
                id: 'tab2',
                name: '有异常',
                params: {
                    main: {
                        key: 'firstInventoryCategoryName',
                        url: __URL.osiu + 'import/init/inventory/findFirstCategoryGroup',
                        words: {
                            title: ['firstInventoryCategoryName'],
                            right: 'count'
                        },
                        param: {
                            "inventoryCode": "",
                            "inventoryName": "",
                            "inventorySpec": "",
                            "firstInventoryCategoryName": "",
                            "secondInventoryCategoryName": "",
                            "pageIndex": 1,
                            "pageSize": 50,
                            "tabIndex": 1
                        }
                    },
                    sub: {
                        key: 'secondInventoryCategoryName',
                        url: __URL.osiu + 'import/init/inventory/findSecondCategoryGroup',
                        words: {
                            title: ['secondInventoryCategoryName'],
                            right: 'count'
                        },
                        param: {
                            "inventoryCode": "",
                            "inventoryName": "",
                            "inventorySpec": "",
                            "firstInventoryCategoryName": "",
                            "secondInventoryCategoryName": "",
                            "pageIndex": 1,
                            "pageSize": 50,
                            "tabIndex": 1
                        },
                    }
                }
            },{
                id: 'tab3',
                name: '已导入',
                params: {
                    main: {
                        key: 'firstInventoryCategoryCode',
                        url: __URL.dev + 'inventory/findInventoryFirstCategory',
                        words: {
                            title: ['firstInventoryCategoryName'],
                            right: 'count'
                        },
                        param: {
                            "attributeCode": '',
                            "firstInventoryCategoryCode": "",
                            "firstInventoryCategoryName": "",
                            "secondInventoryCategoryCode": "",
                            "secondInventoryCategoryName": "",
                            "inventoryCode": "",
                            "inventoryName": "",
                            "inventorySpec": "",
                            "keyword": "",
                            "pageIndex": 1,
                            "pageSize": 50,
                            "tabIndex": 0
                        }
                    },
                    sub: {
                        key: 'secondInventoryCategoryCode',
                        url: __URL.dev + 'inventory/findInventorySenCategory',
                        words: {
                            title: ['secondInventoryCategoryName'],
                            right: 'count'
                        },
                        param: {
                            "attributeCode": '',
                            "firstInventoryCategoryCode": "",
                            "firstInventoryCategoryName": "",
                            "secondInventoryCategoryCode": "",
                            "secondInventoryCategoryName": "",
                            "inventoryCode": "",
                            "inventoryName": "",
                            "inventorySpec": "",
                            "keyword": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "tabIndex": 0
                        },
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
            placeholder: '123'
        }, {
            label: '规格型号:',
            key: 'inventorySpec',
            value: '',
            type: 'text',
            placeholder: ''
        }]
    },
    /* 
     * table 配置
     */
    tableCfg1: {
        checkbox: [true, 'inventoryCode'],
        operating: [true, 'config-operate',
            [{
                type: 'blue',
                btn: 'edit',
                text: '编辑'
            }, {
                type: 'danger',
                btn: 'delete',
                text: '删除'
            }]
        ],
        serial: true,
        statusControl:[true,{
            'test': function (val) {
                if (val.status === 0) {
                    return false
                } else if (val.status === 1) {
                    return true
                }
            },
            'title':'分析状态',
            'success':'正常',
            'successStyle':{color:"#61BA5B"},
            'fail':'异常',
            'failStyle':{color:"red"}
        }],
        width: [3, 3, 3, 3, 3], //排除序号，多选，单选，操作栏
        match: [
            {key: 'inventoryCode', href: true},
            'inventoryName',
            'inventorySpec',
            'unitName',
            'attributeName',
        ],
        head: ['货品编码', '货品名称', '规格型号', '单位', '货品属性', ],
    },
    tableCfg2: {
        operating: [true, 'config-operate',
            [{
                type: 'blue',
                btn: 'edit',
                text: '编辑'
            }]
        ],
        serial: true,
        statusControl:[true,{
            'test': function (val) {
                return true
            },
            'title':'分析状态',
            'success':'已导入',
            'successStyle':{color:"#61BA5B"},
            'fail':'未导入',
            'failStyle':{color:"red"}
        }],
        width: [3, 3, 3, 3, 3], //排除序号，多选，单选，操作栏
        match: [
            {key: 'inventoryCode', href: true},
            'inventoryName',
            'inventorySpec',
            'unitName',
            'attributeName',
        ],
        head: ['货品编码', '货品名称', '规格型号', '单位', '货品属性', ],
    },
    importFormal: {
        "firstIndustryCategoryCode": "",
        "firstIndustryCategoryName": "",
        "secondIndustryCategoryCode": "",
        "secondIndustryCategoryName": "",
        "firstInventoryCategoryCode":"",
        "firstInventoryCategoryName":"",
        "secondInventoryCategoryCode":"",
        "secondInventoryCategoryName":"",
        "ids": []
    }
}
