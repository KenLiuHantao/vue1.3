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
                name: '草稿箱',
                icon: '',
                params: {
                    main: {
                        key: 'yearWeek',
                        url: __URL.dev + 'product/bom/findYearWeekGroup',
                        words: {
                            title: ['text'],
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
                            "tabIndex": 0,
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
                            "tabIndex": 0
                        },
                    }
                }
            },{
                id: 'tab2',
                name: '未审核',
                icon: '',
                params: {
                    main: {
                        key: 'yearWeek',
                        url: __URL.dev + 'product/bom/findYearWeekGroup',
                        words: {
                            title: ['text'],
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
                            "tabIndex": 1,
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
                            "tabIndex": 1
                        },
                    }
                }
            },{
                id: 'tab3',
                name: '已驳回',
                icon: '',
                params: {
                    main: {
                        key: 'yearWeek',
                        url: __URL.dev + 'product/bom/findYearWeekGroup',
                        words: {
                            title: ['text'],
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
                            "tabIndex": 2,
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
                            "tabIndex": 2
                        },
                    }
                }
            },{
                id: 'tab4',
                name: '已审核',
                icon: '',
                params: {
                    main: {
                        key: 'yearMonth',
                        url: __URL.dev + 'product/bom/findYearMonthGroup',
                        words: {
                            title: ['text'],
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
                            "tabIndex": 3,
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
                            "tabIndex": 3
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
    /* 
     * 新增产品 配置
     */
    bomCfg:{
        "attributeCode": "",
        "attributeName": "",
        "children": [
          // {
          //   "attributeCode": "string",
          //   "attributeName": "string",
          //   "byUnitCode": "string",
          //   "byUnitName": "string",
          //   "childBom": {},
          //   "conversionRate": 0,
          //   "demandDate": "string",
          //   "docNo": "string",
          //   "docVersion": 0,
          //   "inventoryCategoryCode": "string",
          //   "inventoryCategoryName": "string",
          //   "inventoryCode": "string",
          //   "inventoryId": "string",
          //   "inventoryName": "string",
          //   "inventorySpec": "string",
          //   "last": false,
          //   "lossRate": 0,
          //   "manuPlanQuantity": 0,
          //   "manuQuantity": 0,
          //   "packQty": 0,
          //   "quantity": 0,
          //   "recordId": "string",
          //   "recordStatus": 0,
          //   "recordVersion": 0,
          //   "remark": "string",
          //   "supplierAmount": 0,
          //   "supplierCode": "string",
          //   "supplierName": "string",
          //   "supplierPrice": 0,
          //   "unitCode": "string",
          //   "unitName": "string"
          // }
        ],
        "docNo": "",
        "docVersion": 10,
        "docVersionRemark": "",
        "docVersionTime": "",
        "files": [
          // {
          //   "eTag": "string",
          //   "ext": "string",
          //   "fileId": "string",
          //   "fileName": "string",
          //   "fileSize": 0,
          //   "mimeType": "string",
          //   "url": "string"
          // }
        ],
        "inventoryCategoryCode": "",
        "inventoryCategoryName": "",
        "inventoryCode": "",
        "inventoryId": "",
        "inventoryName": "",
        "inventorySpec": "",
        "employeeCode":"",
        "employeeName":"",
        "processVo": {
          "departmentCode": "",
          "departmentEmployeeCode": "",
          "departmentEmployeeName": "",
          "departmentName": "",
          "docNo": "",
          "docVersion": 0,
          "manuQuantity": 1,
          "processCode": "",
          "processName": "",
          "recordId": "",
          "recordVersion": 0,
          "workAmount": 0,
          "workPrice": 0,
          "unitWorkingHours":0,
          "processWorkingHours":0,
          "files":[]
        },
        "recordId": "",
        "recordStatus": 0,
        "recordVersion": 0,
        "remark": "",
        "supplierCode": "",
        "supplierName": ""
    }
}
