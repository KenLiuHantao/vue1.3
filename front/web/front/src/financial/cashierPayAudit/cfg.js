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
                name: '待审核',
                icon: '',
                params: {
                    main: {
                        key: 'yearMonth',
                        url: __URL.financial + 'cashier/pay/yearMonth/list',
                        words: {
                            title: ['showYearMonth'],
                            sub: [],
                        },
                        param: {
                            "docStatus": 1,
                            "pageIndex": 0,
                            "pageSize": 0,
                            "yearMonth": '',
                            "paymentCode": '',
                            "currencyCode": ''
                        },
                    },
                    sub: {
                        key: 'key',
                        url: __URL.financial + 'cashier/pay/currency/list',
                        words: {
                            title: ['currencyName'],
                            sub: [['currencySymbol', 'totalAmount']],
                            right: 'paymentName',
                        },
                        param: {
                            "docStatus": 1,
                            "pageIndex": 0,
                            "pageSize": 0,
                            "yearMonth": '',
                            "paymentCode": '',
                            "currencyCode": ''
                        }
                    }
                }
            }, {
                id: 'tab2',
                name: '已审核',
                icon: '',
                params: {
                    main: {
                        key: 'yearMonth',
                        url: __URL.financial + 'cashier/pay/yearMonth/list',
                        words: {
                            title: ['showYearMonth'],
                            sub: [],
                        },
                        param: {
                            "docStatus": 2,
                            "pageIndex": 0,
                            "pageSize": 0,
                            "yearMonth": '',
                            "paymentCode": '',
                            "currencyCode": ''
                        },
                    },
                    sub: {
                        key: 'key',
                        url: __URL.financial + 'cashier/pay/currency/list',
                        words: {
                            title: ['currencyName'],
                            sub: [['currencySymbol', 'totalAmount']],
                            right: 'paymentName',
                        },
                        param: {
                            "docStatus": 2,
                            "pageIndex": 0,
                            "pageSize": 0,
                            "yearMonth": '',
                            "paymentCode": '',
                            "currencyCode": ''
                        }
                    }
                }
            }]
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
        filterCfg: []
    },
    /* 
     * table 配置
     */
    unauditTableCfg: {
        // operating: [true, 'config-operate',
        //     [{
        //         type: 'blue',
        //         btn: 'audit',
        //         text: '审核',
        //         func:function(val){
        //             return !val.repeal
        //         }
        //     },{
        //         type: 'blue',
        //         btn: 'repeal',
        //         text: '同意撤销审核',
        //         func:function(val){
        //             return val.repeal
        //         }
        //     }]
        // ],
        serial: false,
        review: [true, 'docType', [{
            val: 3,
            icon: 'icon-success',
            style: [{
                color: 'red'
            }],
            //img: im
        }]],
        width: [4, 3, 3, 3, 2, 3], //排除序号，多选，单选，操作栏
        match: [
            {key: 'docNo', href: true},
            'payerName',
            'docDate',
            'paymentName',
            'currencyName',
            'showPayReturnAmount'
        ],
        head: ['单号', '付/退款人', '付/退款日期', '结算方式', '币种', '金额'],
    },

    auditTableCfg: {
        // operating: [true, 'config-operate',
        //     [{
        //         type: 'blue',
        //         btn: 'unaudit',
        //         text: '弃审'
        //     }]
        // ],
        serial: false,
        review: [true, 'docType', [{
            val: 3,
            icon: 'icon-success',
            style: [{
                color: 'red'
            }],
            //img: im
        }]],
        width: [4, 3, 3, 3, 2, 3], //排除序号，多选，单选，操作栏
        match: [
            {key: 'docNo', href: true},
            'payerName',
            'docDate',
            'paymentName',
            'currencyName',
            'showPayReturnAmount'
        ],
        head: ['单号', '付/退款人', '付/退款日期', '结算方式', '币种', '金额'],
    },
}
