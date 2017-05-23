/**
 * Created by SkyeTang on 2017/2/22.
 */
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
                        key: 'yearMonth',
                        url: __URL.financial + 'verify/payable/yearMonth/unaudit/list',
                        words: {
                            title: ['showYearMonth'],
                        },
                        param: {
                            "supplierCode": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "yearMonth": 0
                        },
                    },
                    sub: {
                        key: 'supplierCode',
                        url: __URL.financial + 'verify/payable/supplier/unaudit/list',
                        words: {
                            title: ['supplierName'],
                            right: 'showTotalAmount',
                        },
                        param: {
                            "supplierCode": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "yearMonth": 0
                        }
                    }
                }
            },
                {
                    id: 'yes',
                    name: '已审核',
                    icon: '',
                    params: {
                        main: {
                            key: 'yearMonth',
                            url: __URL.financial + 'verify/payable/yearMonth/audit/list',
                            words: {
                                title: ['showYearMonth'],
                            },
                            param: {
                                "supplierCode": "",
                                "pageIndex": 0,
                                "pageSize": 0,
                                "yearMonth": 0
                            },
                        },
                        sub: {
                            key: 'supplierCode',
                            url: __URL.financial + 'verify/payable/supplier/audit/list',
                            words: {
                                title: ['supplierName'],
                                right: 'showTotalAmount',
                            },
                            param: {
                                "supplierCode": "",
                                "pageIndex": 0,
                                "pageSize": 0,
                                "yearMonth": 0
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
            label: '供应商名称:',
            key: 'supplierName',
            value: '',
            type: 'text',
            placeholder: '请输入供应商名称'
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
        },]
    },
    /*
     * table 配置
     */
    tableCfg: {
        // operating: [true, 'config-operate', [{type: 'blue', text: '审核', btn: 'edit'}]],
        serial: true,
        width: [7, 7, 6,], //排除序号，多选，单选，操作栏
        match: [
            {key: 'docNo', href: true},
            'docDate',
            'totalAmount',
        ],
        head: ['核销单号', '核销日期', '核销金额'],
    },
    tableCfg2: {
        // operating: [true, 'config-operate', [{type: 'blue', text: '弃审', btn: 'edit'}]],
        serial: true,
        width: [7, 7, 6,], //排除序号，多选，单选，操作栏
        match: [
            {key: 'docNo', href: true},
            'docDate',
            'totalAmount',
        ],
        head: ['核销单号', '核销日期', '核销金额'],
    },

    allInfoModal: {
        "dataList": [
            {
                "availableAmount": 0,
                "currencyCode": "string",
                "currencyName": "string",
                "currencySymbol": "string",
                "currentAmount": 0,
                "dispatch": false,
                "dispatchDocNo": "string",
                "dispatchId": "string",
                "inventoryCode": "string",
                "inventoryId": "string",
                "inventoryName": "string",
                "inventorySpec": "string",
                "oldCurrentAmount": 0,
                "quantity": 0,
                "recordVersion": 0,
                "showCurrentAmount": 0,
                "showQuantity": 0,
                "showTaxAmounts": 0,
                "showTotalRevAmount": 0,
                "taxAmounts": 0,
                "totalRevAmount": 0,
                "unitCode": "string",
                "unitName": "string",
                "unitPrice": 0,
                "verifyId": "string"
            }
        ],
        "dataListCount": 0,
        "footList": [
            {
                "availableAmount": 0,
                "currentAmount": 0,
                "initDocDate": "",
                "initDocNo": "",
                "oldCurrentAmount": 0,
                "recAmount": 0,
                "recordVersion": 0,
                "totalRevAmount": 0
            }
        ],
        "footListCount": 0,
        "headList": [
            {
                "availableAmount": 0,
                "cashierDocDate": "",
                "cashierDocNo": "",
                "cashierDocType": 0,
                "currencyName": "",
                "currencySymbol": "",
                "currentAmount": 0,
                "supplierCode": "",
                "supplierName": "",
                "oldCurrentAmount": 0,
                "paymentName": "",
                "recReturnAmount": 0,
                "recordVersion": 0,
                "showCurrentAmount": 0,
                "showRecReturnAmount": 0,
                "showTotalRevAmount": 0,
                "totalRevAmount": 0
            }
        ],
        "headListCount": 0,
        "header": {
            "supplierCode": "",
            "supplierName": "",
            "docStatus": -2,
            "verifyDocNo": ""
        }
    },
}
