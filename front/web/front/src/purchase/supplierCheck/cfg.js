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
                    name: '待对账',
                    //icon: 'icon-teamwork',
                    params: {
                        main: {
                            key: 'yearMonth',
                            url: __URL.purchase + 'suppliercheckinbounds/uncheck/yearmonth',
                            words: {
                                title: ['yearMonthStr'],
                                sub: []
                            },
                            param: {
                                "pageIndex": 0,
                                "pageSize": 0
                            },
                        },
                        sub: {
                            key: 'supplierCode',
                            url: __URL.purchase + 'suppliercheckinbounds/uncheck/supplier',
                            words: {
                                title: ['supplierName'],
                                sub: [
                                    ['currencySymbol','taxAmounts']
                                ]
                            },
                            param: {
                                "docStatus": -1,
                                "yearMonth": "",
                                "supplierCode":"",
                                "currencyCode":"",
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
                            url: __URL.purchase + 'suppliercheckinbounds/checked/yearmonth',
                            words: {
                                title: ['yearMonthStr'],
                                sub: []
                            },
                            param: {
                                "docStatus": 0,
                                "pageIndex": 0,
                                "pageSize": 0
                            },
                        },
                        sub: {
                            key: 'supplierCode',
                            url: __URL.purchase + 'suppliercheckinbounds/checked/supplier',
                            words: {
                                title: ['supplierName'],
                                sub: [
                                    ['currencySymbol','taxAmounts']
                                ]
                            },
                            param: {
                                "docStatus": 0,
                                "yearMonth": "",
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
            hasNub: true,
            hasChild: true,
        },
        /* 
         * filter 配置
         */
        filterCfg: [
            {
                label: '供应商:',
                key: 'supplierName',
                value: '',
                type: 'search',
                emit:"supplier",
                placeholder: '请选择供应商'
            }, {
                label: '对账单号:',
                key: 'docNo',
                value: '',
                type: 'text',
                placeholder: '请输入对账单号'
            }, {
                label: '采购单号:',
                key: 'purchaseDocNo',
                value: '',
                type: 'text',
                placeholder: '请输入采购单号'
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
    supplierUncheckTableCfg: {
        checkbox: [true, 'recordId'],
        totalShow:[true,
            [{key:'purchaseTaxAmounts',value:'totalPurchaseTaxAmounts'},
            {key:'purchaseTodoAmounts',value:'totalPurchaseTodoAmounts'},
            {key:'purchaseDoneAmounts',value:'totalPurchaseDoneAmounts'},
            {key:'thisTimeTaxAmount',value:'totalThisTimeTaxAmount'}]],
        width: [3, 3, 3, 3, 3, 3, 3], //排除序号，多选，单选，操作栏
        match: [
            {key:'purchaseDocNo',href:true},
            'purchaseDocDate',
            {key:'purchaseDocStatus',status:{success:'已完成',danger:'未完成',default:'',disabled:''}},
            'purchaseTaxAmounts',
            'purchaseTodoAmounts',
            'purchaseDoneAmounts',
            'thisTimeTaxAmount'
        ],
        head: ['采购单号', '采购日期', '完成状态', '订单金额', '未完成金额', '已完成金额','本次对账金额'],
    },
    supplierCheckedTableCfg: {
        serial: true,
        width: [3, 3, 3, 3, 3], //排除序号，多选，单选，操作栏
        match: [
            {key:'docNo',href:true},'docDate','supplierName','currencyName','exchRate','taxAmounts'
        ],
        head: ['对账单号', '对账日期', '供应商名称', '币种', '汇率','对账金额'],
    },
}