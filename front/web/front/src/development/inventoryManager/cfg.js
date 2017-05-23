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
                            "inventoryTypeCode": "001",
                            "inventoryCode": "",
                            "inventoryName": "",
                            "inventorySpec": "",
                            "keyword": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "tabIndex": 1
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
                            "inventoryTypeCode": "001",
                            "inventoryCode": "",
                            "inventoryName": "",
                            "inventorySpec": "",
                            "keyword": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "tabIndex": 1
                        },
                    }
                }
            },{
                id: 'tab2',
                name: '半成品',
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
                            "inventoryTypeCode": "002",
                            "inventoryCode": "",
                            "inventoryName": "",
                            "inventorySpec": "",
                            "keyword": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "tabIndex": 1
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
                            "inventoryTypeCode": "002",
                            "inventoryCode": "",
                            "inventoryName": "",
                            "inventorySpec": "",
                            "keyword": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "tabIndex": 1
                        },
                    }
                }
            },{
                id: 'tab3',
                name: '原料',
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
                            "inventoryTypeCode": "003",
                            "inventoryCode": "",
                            "inventoryName": "",
                            "inventorySpec": "",
                            "keyword": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "tabIndex": 1
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
                            "inventoryTypeCode": "003",
                            "inventoryCode": "",
                            "inventoryName": "",
                            "inventorySpec": "",
                            "keyword": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "tabIndex": 1
                        },
                    }
                }
            }, {
                id: 'tab4',
                name: '已停用',
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
                            "pageIndex": 0,
                            "pageSize": 0,
                            "tabIndex": 2
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
                            "tabIndex": 2
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
            placeholder: '请输入货品分类'
        }, {
            label: '货品名称:',
            key: 'inventoryName',
            value: '',
            type: 'text',
            placeholder: '请输入货品名称'
        }, {
            label: '货品分类:',
            key: 'inventoryCategoryName',
            value: '',
            type: 'text',
            placeholder: '请输入货品编码'
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
        /*operating: [true, 'config-operate',
         [{
         type: 'blue',
         btn: 'edit',
         text: '编辑'
         }]
         ],*/
        serial: true,
        width: [3, 3, 3, 3, 3, 3], //排除序号，多选，单选，操作栏
        match: [
            {key: 'inventoryCode', href: true},
            'inventoryName',
            'inventorySpec',
            'unitName',
            'attributeName',
            'enableDate'
        ],
        head: ['货品编码', '货品名称', '规格型号', '单位', '货品属性', '启用日期'],
    },
    /* 导入配置 */
    importCfg: {
        show: false,
        title: '导入'
    },
    /* mod配置 */
    tabConfig: {
        type:'page',
        select: 'tab1',
        tabBarData: [{
            id: 'tab1',
            name: '开发',
            icon: 'icon-develop'
        }, {
            id: 'tab2',
            name: '销售',
            icon: 'icon-sales'
        }, {
            id: 'tab3',
            name: '采购',
            icon: 'icon-purchase'
        }]
    },
    codeInitItem: {
        "attributeCode": -1,
        "attributeName": "",
        "byUnitCode": "",
        "byUnitName": "",
        "conversionRate": 0,
        "customerVos": [],
        "deductionTypeCode": "",
        "deductionTypeName": "",
        "developmentVo": {},
        "disableDate": "",
        "enableDate": "",
        "files": [],
        "images": [],
        "inventoryCategoryCode": "",
        "inventoryCategoryName": "",
        "firstIndustryCategoryCode": '',
        "firstIndustryCategoryName": '',
        "secondIndustryCategoryCode": '',
        "secondIndustryCategoryName": '',
        "firstInventoryCategoryCode": '',
        "firstInventoryCategoryName": '',
        "secondInventoryCategoryCode": '',
        "secondInventoryCategoryName": '',
        "inventoryTypeCode": '',
        "inventoryTypeName": '',
        "inventoryCode": "",
        "inventoryId": "",
        "inventoryName": "",
        "inventorySpec": "",
        "recordVersion": 0,
        "remark": "",
        "supplierVos": [],
        "unitCode": "",
        "unitName": "",
        "warehouseCode": "",
        "warehouseName": "",
        "developmentVo":{
            "departmentCode": "",
            "departmentEmployeeCode": "",
            "departmentEmployeeName": "",
            "departmentName": "",
            "employeeCode": "",
            "employeeName": "",
            "lossRate": 0,
            "minPackQty": "",
            "processCode": "",
            "processName": ""
        }
    },
    wareMod: {
        show: false,
        width: '400px',
        height: '530px',
        header: '仓库'
    },
    unitMod: {
        show: false,
        width: '400px',
        height: '530px',
        header: '单位'
    },
    addItem: {
        "attributeCode": 1,
        "attributeName": "生产件",
        "byUnitCode": "",
        "byUnitName": "",
        "conversionRate": 0,
        "customerVos": [{
            "beginDate": "2017-01-22 12:00:23",
            "currencyCode": "",
            "currencyName": "人民币",
            "currencySymbol": "",
            "customerCode": "92696500",
            "customerName": "美的集团",
            "customerPriceId": "",
            "endDate": "2017-01-22",
            "isDefault": 1,
            "orderMaxQty": "2220",
            "orderMinQty": 0,
            "recordVersion": 0,
            "taxRate": "20",
            "taxUnitPrice": "220"
        }],
        "deductionTypeCode": "",
        "deductionTypeName": "",
        "developmentVo": {
            "departmentCode": "91905430",
            "departmentEmployeeCode": "31731653",
            "departmentEmployeeName": "test",
            "departmentName": "开发部",
            "employeeCode": "73372162",
            "employeeName": "小小",
            "lossRate": "10",
            "minPackQty": "5",
            "processCode": "71090386",
            "processName": "工序1"
        },
        "disableDate": "",
        "enableDate": "",
        "files": [],
        "images": [],
        "inventoryCategoryCode": "41245518",
        "inventoryCategoryName": "cccgc",
        "inventoryCode": "asdfasdf",
        "inventoryId": "",
        "inventoryName": "adfasdf",
        "inventorySpec": "adsfadsfadf",
        "recordVersion": 1,
        "remark": "",
        "supplierVos": [{
            "beginDate": "2017-01-22 12:00:23",
            "currencyCode": "",
            "currencyName": "人民币",
            "currencySymbol": "",
            "endDate": "2017-01-22 12:00:23",
            "isDefault": 1,
            "orderMaxQty": "3330",
            "orderMinQty": 0,
            "recordVersion": 0,
            "supplierCode": "68789879",
            "supplierName": "假供应商",
            "supplierPriceId": "",
            "taxRate": "3",
            "taxUnitPrice": "3330"
        }],
        "unitCode": "3243243",
        "unitName": "件",
        "warehouseCode": "21633686",
        "warehouseName": "仓库2"
    }
}
