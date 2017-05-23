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
                //icon: 'icon-teamwork',
                params: {
                    main: {
                        key: 'yearMonth',
                        url: __URL.financial + 'init/receivable/yearMonth/list',
                        words: {
                            title: ['showYearMonth'],
                            sub: [],
                        },
                        param: {
                            "docStatus": 1,
                            "pageIndex": 0,
                            "pageSize": 0,
                            "yearMonth": '',
                            "customerCode": ''
                        },
                    },
                    sub: {
                        key: 'customerCode',
                        url: __URL.financial + 'init/receivable/customer/list',
                        words: {
                            title: ['customerName'],
                            sub: [],
                            right: 'showTotalAmount',
                        },
                        param: {
                            "docStatus": 1,
                            "pageIndex": 0,
                            "pageSize": 0,
                            "yearMonth": '',
                            "customerCode": ''
                        }
                    }
                }
            }, {
                id: 'tab2',
                name: '已审核',
                //icon: 'icon-teamwork',
                params: {
                    main: {
                        key: 'yearMonth',
                        url: __URL.financial + 'init/receivable/yearMonth/list',
                        words: {
                            title: ['showYearMonth'],
                            sub: [],
                        },
                        param: {
                            "docStatus": 2,
                            "pageIndex": 0,
                            "pageSize": 0,
                            "yearMonth": '',
                            "customerCode": ''
                        },
                    },
                    sub: {
                        key: 'customerCode',
                        url: __URL.financial + 'init/receivable/customer/list',
                        words: {
                            title: ['customerName'],
                            sub: [],
                            right: 'showTotalAmount',
                        },
                        param: {
                            "docStatus": 2,
                            "pageIndex": 0,
                            "pageSize": 0,
                            "yearMonth": '',
                            "customerCode": ''
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
        serial: true,
        width: [5, 5, 4, 5], //排除序号，多选，单选，操作栏
        match: [
            {key: 'docNo', href: true},
            'docDate',
            'customerName',
            (obj) => {
                return obj.currencySymbol + obj.recAmount
            }
        ],
        head: ['单号', '单据日期', '客户名称', '应收金额'],
    },

    auditTableCfg: {
        serial: true,
        width: [5, 5, 4, 5], //排除序号，多选，单选，操作栏
        match: [
            {key: 'docNo', href: true},
            'docDate',
            'customerName',
            (obj) => {
                return obj.currencySymbol + obj.recAmount
            }
        ],
        head: ['单号', '单据日期', '客户名称', '应收金额'],
    },
}
