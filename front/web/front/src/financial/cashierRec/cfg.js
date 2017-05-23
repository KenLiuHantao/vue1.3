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
                        url: __URL.financial + 'cashier/rec/yearMonth/list',
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
                        url: __URL.financial + 'cashier/rec/currency/list',
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
                        url: __URL.financial + 'cashier/rec/yearMonth/list',
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
                        url: __URL.financial + 'cashier/rec/currency/list',
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
                        url: __URL.financial + 'cashier/rec/yearMonth/list',
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
                        url: __URL.financial + 'cashier/rec/currency/list',
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
        /*operating: [true, 'config-operate',
            [{
                type: 'blue',
                btn: 'modify',
                text: '修改'
            }, {
                type: 'blue',
                btn: 'delete',
                text: '删除'
            }, {
                type: 'blue',
                btn: 'submit',
                text: '提交'
            }]
        ],*/
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
            'showRecReturnAmount'
        ],
        head: ['单号', '付/退款人', '收/退款日期', '结算方式', '币种', '金额'],
    },

    unauditTableCfg: {
        /*operating: [true, 'config-operate',
            [{
                type: 'blue',
                btn: 'repeal',
                text: '撤销审核',
                func: function (data) {
                    return !data.repeal
                }
            }]
        ],*/
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
            'showRecReturnAmount'
        ],
        head: ['单号', '付/退款人', '收/退款日期', '结算方式', '币种', '金额'],
    },

    auditTableCfg: {
        /*operating: [true, 'config-operate',
            [{
                type: 'blue',
                btn: 'back',
                text: '退款',
                func: function (data) {
                    if (data.docType == 3) {
                        return false;
                    } else {
                        return true;
                    }
                }
            }]
        ],*/
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
            'showRecReturnAmount'
        ],
        head: ['单号', '付/退款人', '收/退款日期', '结算方式', '币种', '金额'],
    },
}
