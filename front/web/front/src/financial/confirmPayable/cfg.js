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
                        url: __URL.financial + 'confirm/payable/yearMonth/wait/list',
                        words: {
                            title: ['showYearMonth'],
                            sub: [],
                        },
                        param: {
                            "supplierCode": '',
                            "pageIndex": 0,
                            "pageSize": 0,
                            "yearMonth": '',
                        },
                    },
                    sub: {
                        key: 'supplierCode',
                        url: __URL.financial + 'confirm/payable/supplier/wait/list',
                        words: {
                            title: ['supplierName'],
                            sub: [],
                            right:'showTotalAmount'
                        },
                        param: {
                            "supplierCode": '',
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
                        url: __URL.financial + 'confirm/payable/yearMonth/confirm/list',
                        words: {
                            title: ['showYearMonth'],
                            sub: [],
                        },
                        param: {
                            "supplierCode": '',
                            "pageIndex": 0,
                            "pageSize": 0,
                            "yearMonth": '',
                        },
                    },
                    sub: {
                        key: 'supplierCode',
                        url: __URL.financial + 'confirm/payable/supplier/confirm/list',
                        words: {
                            title: ['supplierName'],
                            sub: [],
                            right:'showTotalAmount'

                        },
                        param: {
                            "supplierCode": '',
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
                text: '确认应付'
            }]
        ],
        serial: true,
        review: [true, 'inbound', [{
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
                return obj.currencySymbol + obj.showTaxAmounts
            },
        ],
        head: ['入/退货单号', '单据日期', '应付金额'],
    },

    confirmTableCfg: {
        operating: [true, 'config-operate',
            [{
                type: 'blue',
                btn: 'modify',
                text: '放弃确认'
            }]
        ],
        review: [true, 'inbound', [{
            val: false,
            icon: 'icon-success',
            style: [{
                color: 'red'
            }],
        }]],
        serial: true,
        width: [8, 6, 6], //排除序号，多选，单选，操作栏
        match: [
            [{ key: 'docNo', href: true }],
            'docDate',
            (obj) => {
                return obj.currencySymbol + obj.showTaxAmounts
            },
        ],
        head: ['入/退货单号', '单据日期', '应付金额'],
    }

}
