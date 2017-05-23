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
                id: 'waitVerify',
                name: '待核销',
                icon: '',
                params: {
                    main: {
                        key: 'yearMonth',
                        url: __URL.financial + 'verify/receivable/yearMonth/wait/cashier/list',
                        words: {
                            title: ['showYearMonth'],
                        },
                        param: {
                            "customerCode": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "yearMonth": 0
                        },
                    },
                    sub: {
                        key: 'customerCode',
                        url: __URL.financial + 'verify/receivable/customer/wait/cashier/list',
                        words: {
                            title: ['customerName'],
                            right: 'showTotalAmount',
                        },
                        param: {
                            "customerCode": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "yearMonth": 0
                        }
                    }
                }
            }, {
                id: 'wait',
                name: '待处理',
                icon: '',
                params: {
                    main: {
                        key: 'yearMonth',
                        url: __URL.financial + 'verify/receivable/yearMonth/wait/list',
                        words: {
                            title: ['showYearMonth'],
                        },
                        param: {
                            "customerCode": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "yearMonth": 0
                        },
                    },
                    sub: {
                        key: 'customerCode',
                        url: __URL.financial + 'verify/receivable/customer/wait/list',
                        words: {
                            title: ['customerName'],
                            right: 'showTotalAmount',
                        },
                        param: {
                            "customerCode": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "yearMonth": 0
                        }
                    }
                }
            }, {
                id: 'no',
                name: '未审核',
                icon: '',
                params: {
                    main: {
                        key: 'yearMonth',
                        url: __URL.financial + 'verify/receivable/yearMonth/unaudit/list',
                        words: {
                            title: ['showYearMonth'],
                        },
                        param: {
                            "customerCode": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "yearMonth": 0
                        },
                    },
                    sub: {
                        key: 'customerCode',
                        url: __URL.financial + 'verify/receivable/customer/unaudit/list',
                        words: {
                            title: ['customerName'],
                            right: 'showTotalAmount',
                        },
                        param: {
                            "customerCode": "",
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
                            url: __URL.financial + 'verify/receivable/yearMonth/audit/list',
                            words: {
                                title: ['showYearMonth'],
                            },
                            param: {
                                "customerCode": "",
                                "pageIndex": 0,
                                "pageSize": 0,
                                "yearMonth": 0
                            },
                        },
                        sub: {
                            key: 'customerCode',
                            url: __URL.financial + 'verify/receivable/customer/audit/list',
                            words: {
                                title: ['customerName'],
                                right: 'showTotalAmount',
                            },
                            param: {
                                "customerCode": "",
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
        checkbox: [true, 'cashierDocNo'],
        operating: [true, 'config-operate',[{text:'核销',btn:'edit'}]],
        review: [true, 'cashierDocType', [{
            val: 3,
            //icon: 'icon-success',
            style: [{
                color: 'red'
            }],
            //img: im
        }]],
        serial: true,
        width: [3, 3, 3, 3, 3, 3], //排除序号，多选，单选，操作栏
        match: [
            { key: 'cashierDocNo', href: true },
            'cashierDocDate',
            (obj) => {
                return obj.currencySymbol + obj.showRecReturnAmount
            },
            (obj) => {
                return obj.currencySymbol + obj.showTotalRevAmount
            },
        ],
        head: ['收/退款单号', '收/退款日期', '收/退款金额', '已核销金额'],
    },
    tableCfg2: {
        /*operating: [true, 'config-operate',
            [{text:'修改',btn:'edit'
            },{
            text:'删除',btn:'delete',type:'danger'
            },{
            text:'提交',btn:'push',type:'danger'}]],*/
        serial: true,
        width: [7, 7, 6,], //排除序号，多选，单选，操作栏
        match: [
            { key: 'docNo', href: true },
            'docDate',
            (obj) => {
                return obj.currencySymbol + obj.revAmount
            },
        ],
        head: ['核销单号', '核销日期', '核销金额'],
    },
    tableCfg3: {
        /*operating: [true, 'config-operate',[{text:'撤销提交',btn:'giveUp'},]],*/
        serial: true,
        width: [7, 7, 6,], //排除序号，多选，单选，操作栏
        match: [
            { key: 'docNo', href: true },
            'docDate',
            (obj) => {
                return obj.currencySymbol + obj.revAmount
            },
        ],
        head: ['核销单号', '核销日期', '核销金额'],
    },
    tableCfg4: {
        //operating: [true, 'config-operate',[{text:'修改',btn:'edit'},{text:'删除',btn:'delete',type:'danger'},{text:'提交',btn:'push',type:'danger'}]],
        serial: true,
        width: [7, 7, 6,], //排除序号，多选，单选，操作栏
        match: [
            { key: 'docNo', href: true },
            'docDate',
            (obj) => {
                return obj.currencySymbol + obj.revAmount
            },
        ],
        head: ['核销单号', '核销日期', '核销金额'],
    },


    allInfoModal: {
        "dataList": [
                {
                    "availableAmount": 0,
                    "currencyCode": "",
                    "currencyName": "",
                    "currencySymbol": "",
                    "currentAmount": 0,
                    "dispatch": false,
                    "dispatchDocNo": "",
                    "dispatchId": "",
                    "inventoryCode": "",
                    "inventoryId": "",
                    "inventoryName": "",
                    "inventorySpec": "",
                    "oldCurrentAmount": 0,
                    "quantity": 0,
                    "recordVersion": 0,
                    "showCurrentAmount": 0,
                    "showQuantity": 0,
                    "showTaxAmounts": 0,
                    "showTotalRevAmount": 0,
                    "taxAmounts": 0,
                    "totalRevAmount": 0,
                    "unitCode": "",
                    "unitName": "",
                    "unitPrice": 0,
                    "verifyId": ""
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
                "customerCode": "",
                "customerName": "",
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
        "customerCode": "",
        "customerName": "",
        "docStatus": -2,
        "verifyDocNo": ""
        }
    },
}
