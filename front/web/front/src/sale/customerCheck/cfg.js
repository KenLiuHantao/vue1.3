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
            tabBarData: [
                {
                    id: 'tab1',
                    name: '未对账',
                    //icon: 'icon-teamwork',
                    params: {
                        main: {
                            key: 'yearMonth',
                            url: __URL.sale + 'customer/check/uncheck/yearMonth',
                            words: {
                                title: ['monthShowName']
                            },
                            param: {
                                "pageIndex": 0,
                                "pageSize": 0
                            },
                        },
                        sub: {
                            key: 'customerCode',
                            url: __URL.sale + 'customer/check/uncheck/customer',
                            words: {
                                title: ['customerName']
                            },
                            param: {
                                "yearMonth": "",
                                "customerCode":"",
                                "pageIndex": 0,
                                "pageSize": 0
                            }
                        }
                    }
                },
                {
                    id: 'tab2',
                    name: '已对账',
                    //icon: 'icon-teamwork',
                    params: {
                        main: {
                            key: 'yearMonth',
                            url: __URL.sale + 'customer/check/checked/yearMonth',
                            words: {
                                title: ['monthShowName']
                            },
                            param: {
                                "docStatus": 0,
                                "pageIndex": 0,
                                "pageSize": 0
                            },
                        },
                        sub: {
                            key: 'customerCode',
                            url: __URL.sale + 'customer/check/checked/customer',
                            words: {
                                title: ['customerName']
                            },
                            param: {
                                "docStatus": 0,
                                "yearMonth": "",
                                "customerCode":"",
                                "pageIndex": 0,
                                "pageSize": 0
                            }
                        }
                    }
                }
            ]
        },
        /* 
         * list 配置
         */
        listCfg: {
            hasNub: false,
            hasChild: true
        },
        /* 
         * filter 配置
         */
        filterCfg: [
            {
                label: '客户名称:',
                key: 'customerName',
                value: '',
                type: 'search',
                emit:"customer",
                placeholder: '请选择客户'
            }, {
                label: '销售单号:',
                key: 'saleOrderDocNo',
                value: '',
                type: 'text',
                placeholder: '请输入销售单号'
            }, {
                label: '发/退货单号:',
                key: 'dispatchReturnDocNo',
                value: '',
                type: 'text',
                placeholder: '请输入发/退货单号'
            },{
                label: '货品信息:',
                key: 'inventoryCode',
                value: '',
                type: 'text',
                placeholder: '请输入货品信息'
            }
        ]
    },

    /*
     * table 配置
     */
    listParam: {
        "beginApplyDate": "",
        "endApplyDate": "",
        "docNo": "",
        "beginPurchaseDate": "",
        "endPurchaseDate": "",
        "beginDemandDate": "",
        "endDemandDate": '',
        "beginDeliveryDate": '',
        "endDeliveryDate": "",
        "inventoryCode": "",
        "inventoryName": "",
        "inventorySpec": "",
        "saleDocNo": "",
        "customerNo": "",
        "supplierCode": "",
        "yearWeek": "",
        "pageIndex": 0,
        "pageSize": 0
    },
    customerUncheckTableCfg: {
        serial: true,
        checkbox: [true, 'recordId'],

        totalShow:[true,
            [{key:'taxAmount',value:'totalTaxAmount'},
                {key:'thisTimeCheckAmounts',value:'totalThisTimeCheckAmount'}]],
        width: [3, 3, 3, 3, 4, 4], //排除序号，多选，单选，操作栏
        match: [
            {href:true,key:'saleDocNo'},
            ['inventoryCode','inventoryName','inventorySpec'],
            [{prefix:'订单:',key:'salesOrderQty'},{prefix:'已完:',key:'totalOutboundQty'}],
            'currencyName',
            [{prefix:'订单:',key:'taxAmount'},{prefix:'已对:',key:'hasCheckedTaxAmount'}],
            'thisTimeCheckAmounts'
        ],
        head: ['销售单号', '货品信息', '数量', '币种', '金额','本次对账金额'],
    },
    customerCheckedTableCfg: {
        serial: true,
        totalShow:[true,
            [{key:'taxAmount',value:'totalTaxAmount'},
                {key:'thisTimeCheckAmounts',value:'totalThisTimeCheckAmount'}]],
        width: [4, 3, 3, 2, 4, 4], //排除序号，多选，单选，操作栏
        match: [
            {href:true,key:'saleDocNo'},
            ['inventoryCode','inventoryName','inventorySpec'],
            [{prefix:'订单:',key:'salesOrderQty'},{prefix:'已完:',key:'totalOutboundQty'}],
            'currencyName',
            [{prefix:'订单:',key:'taxAmount'},{prefix:'已对:',key:'hasCheckedTaxAmount'}],
            'filterStartDate'
        ],
        head: ['销售单号', '货品信息', '数量', '币种', '金额','对账日期'],
    },
}