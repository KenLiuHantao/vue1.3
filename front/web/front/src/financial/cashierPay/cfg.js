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
                name: '待处理',
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
                            "docStatus": 0,
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
                            "docStatus": 0,
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
                name: '未审核',
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
                id: 'tab3',
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
    waitSubmitTableCfg: {
        serial: true,
        review: [true, 'docType', [{
            val: 3,
            icon: 'icon-success',
            style: [{
                color: 'red'
            }],
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

    unauditTableCfg: {
        serial: true,
        review: [true, 'docType', [{
            val: 3,
            icon: 'icon-success',
            style: [{
                color: 'red'
            }],
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
        serial: true,
        review: [true, 'docType', [{
            val: 3,
            icon: 'icon-success',
            style: [{
                color: 'red'
            }],
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
