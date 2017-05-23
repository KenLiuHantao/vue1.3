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
                id: 'no',
                name: '待审核',
                icon: '',
                params: {
                    main: {
                        key: 'yearWeek',
                        url: __URL.sale + 'salesOrder/findWaitingAuditListForWeek',
                        words: {
                            title: ['weekShowName'],
                            right:'orderQuantity',
                        },
                        param: {
                            "customerCode": "",
                            "customerName": "",
                            "customerOrderDocNo": "",
                            "docNo": "",
                            "employeeName": "",
                            "endDeliveryDate": "",
                            "endDocDate": "",
                            "inventoryCode": "",
                            "inventoryName": "",
                            "inventorySpec": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "startDeliveryDate": "",
                            "startDocDate": "",
                            "yearMonth": 0,
                            "yearWeek": 0
                        },
                    },
                    sub: {
                        key: 'customerCode',
                        url: __URL.sale + 'salesOrder/findWaitingAuditListForCustomer',
                        words: {
                            title: ['customerName'],
                            right:'orderQuantity',
                        },
                        param: {
                            "customerCode": "",
                            "customerName": "",
                            "customerOrderDocNo": "",
                            "docNo": "",
                            "employeeName": "",
                            "endDeliveryDate": "",
                            "endDocDate": "",
                            "inventoryCode": "",
                            "inventoryName": "",
                            "inventorySpec": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "startDeliveryDate": "",
                            "startDocDate": "",
                            "yearMonth": 0,
                            "yearWeek": 0
                        }
                    }
                }
            }, {
                id: 'yes',
                name: '已审核',
                icon: '',
                params: {
                    main: {
                        key: 'yearMonth',
                        url: __URL.sale + 'salesOrder/findAuditListForMonth',
                        words: {
                            title: ['monthShowName'],
                            right:'orderQuantity',
                        },
                        param: {
                            "customerCode": "",
                            "customerName": "",
                            "customerOrderDocNo": "",
                            "docNo": "",
                            "employeeName": "",
                            "endDeliveryDate": "",
                            "endDocDate": "",
                            "inventoryCode": "",
                            "inventoryName": "",
                            "inventorySpec": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "startDeliveryDate": "",
                            "startDocDate": "",
                            "yearMonth": 0,
                            "yearWeek": 0
                        },
                    },
                    sub: {
                        key: 'customerCode',
                        url: __URL.sale + 'salesOrder/findAuditListForCustomer',
                        words: {
                            title: ['customerName'],
                            right:'orderQuantity',
                        },
                        param: {
                            "customerCode": "",
                            "customerName": "",
                            "customerOrderDocNo": "",
                            "docNo": "",
                            "employeeName": "",
                            "endDeliveryDate": "",
                            "endDocDate": "",
                            "inventoryCode": "",
                            "inventoryName": "",
                            "inventorySpec": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "startDeliveryDate": "",
                            "startDocDate": "",
                            "yearMonth": 0,
                            "yearWeek": 0
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
            placeholder: ''
        }, {
            label: '结束时间:',
            key: 'endDocDate',
            value: '',
            type: 'date',
            placeholder: ''
        }, ]
    },
    /* 
     * table 配置
     */
    tableCfg: {
        serial: true,
        width: [4, 16], //排除序号，多选，单选，操作栏
        match: [
            { key: 'docNo', href: true },
            'employeeName',
        ],
        head: ['销售单号', '业务员'],
        newline: [0],
    },


    /*bom初始数据*/
    childrenItem: {
        "attributeCode": "",
        "attributeName": "",
        "byUnitCode": "",
        "byUnitName": "",
        "childBom": null,
        "conversionRate": 0,
        "demandDate": "",
        "docNo": "",
        "docVersion": 0,
        "inventoryCategoryCode": "",
        "inventoryCategoryName": "",
        "inventoryCode": "",
        "inventoryId": "",
        "inventoryName": "",
        "inventorySpec": "",
        "last": false,
        "lossRate": 0,
        "manuPlanQuantity": 0,
        "manuQuantity": 0,
        "packQty": 0,
        "quantity": 0,
        "recordId": "",
        "recordStatus": 0,
        "recordVersion": 0,
        "remark": "",
        "supplierAmount": 0,
        "supplierCode": "",
        "supplierName": "",
        "supplierPrice": 0,
        "unitCode": "",
        "unitName": ""
    },
    processVo: {
        "departmentCode": "",
        "departmentEmployeeCode": "",
        "departmentEmployeeName": "",
        "departmentName": "",
        "docNo": "",
        "docVersion": 0,
        "manuQuantity": 0,
        "processCode": "",
        "processName": "",
        "recordId": "",
        "recordVersion": 0,
        "workAmount": 0,
        "workPrice": 0
    }
}
