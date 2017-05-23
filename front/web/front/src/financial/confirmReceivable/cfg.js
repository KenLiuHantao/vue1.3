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
                name: '待确认',
                icon: '',
                params: {
                    main: {
                        key: 'yearMonth',
                        url: __URL.financial + 'confirm/receivable/yearMonth/wait/list',
                        words: {
                            title: ['showYearMonth'],
                            sub: [],
                        },
                        param: {
                            "customerCode": '',
                            "pageIndex": 0,
                            "pageSize": 0,
                            "yearMonth": '',
                        },
                    },
                    sub: {
                        key: 'customerCode',
                        url: __URL.financial + 'confirm/receivable/customer/wait/list',
                        words: {
                            title: ['customerName'],
                            sub: [],
                            right:'showTotalAmount'
                        },
                        param: {
                            "customerCode": '',
                            "pageIndex": 0,
                            "pageSize": 0,
                            "yearMonth": '',
                        }
                    }
                }
            }, {
                id: 'tab2',
                name: '已确认',
                icon: '',
                params: {
                    main: {
                        key: 'yearMonth',
                        url: __URL.financial + 'confirm/receivable/yearMonth/confirm/list',
                        words: {
                            title: ['showYearMonth'],
                            sub: [],
                        },
                        param: {
                            "customerCode": '',
                            "pageIndex": 0,
                            "pageSize": 0,
                            "yearMonth": '',
                        },
                    },
                    sub: {
                        key: 'customerCode',
                        url: __URL.financial + 'confirm/receivable/customer/confirm/list',
                        words: {
                            title: ['customerName'],
                            sub: [],
                            right:'showTotalAmount'

                        },
                        param: {
                            "customerCode": '',
                            "pageIndex": 0,
                            "pageSize": 0,
                            "yearMonth": '',
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
    waitTableCfg: {
        operating: [true, 'config-operate',
            [{
                type: 'blue',
                btn: 'modify',
                text: '确认应收'
            }]
        ],
        serial: true,
        review: [true, 'dispatch', [{
            val: false,
            icon: 'icon-success',
            style: [{
                color: 'red'
            }],
        }]],
        width: [8, 6, 6], //排除序号，多选，单选，操作栏
        match: [
            [{ key: 'docNo', href: true }],
            'docDate',
            (obj) => {
                return obj.currencySymbol + obj.taxAmounts
            },
        ],
        head: ['发/退货单号', '单据日期', '应收金额'],
    },

    confirmTableCfg: {
        operating: [true, 'config-operate',
            [{
                type: 'blue',
                btn: 'modify',
                text: '放弃确认'
            }]
        ],
        serial: true,
        review: [true, 'docType', [{
            val: 3,
            icon: 'icon-success',
            style: [{
                color: 'red'
            }],
        }]],
        width: [8, 6, 6], //排除序号，多选，单选，操作栏
        match: [
            [{ key: 'docNo', href: true }],
            'docDate',
            (obj) => {
                return obj.currencySymbol + obj.showTaxAmounts
            },
        ],
        head: ['发/退货单号', '单据日期', '应收金额'],
    }

}
