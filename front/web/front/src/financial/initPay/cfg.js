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
                //icon: 'icon-teamwork',
                params: {
                    main: {
                        key: 'yearMonth',
                        url: __URL.financial + 'init/payable/yearMonth/list',
                        words: {
                            title: ['showYearMonth'],
                            sub: [],
                        },
                        param: {
                            "docStatus": 0,
                            "pageIndex": 0,
                            "pageSize": 0,
                            "yearMonth": '',
                            "supplierCode": ''
                        },
                    },
                    sub: {
                        key: 'supplierCode',
                        url: __URL.financial + 'init/payable/supplier/list',
                        words: {
                            title: ['supplierName'],
                            sub: [],
                            right: 'showTotalAmount',
                        },
                        param: {
                            "docStatus": 0,
                            "pageIndex": 0,
                            "pageSize": 0,
                            "yearMonth": '',
                            "supplierCode": ''
                        }
                    }
                }
            }, {
                id: 'tab2',
                name: '未审核',
                //icon: 'icon-teamwork',
                params: {
                    main: {
                        key: 'yearMonth',
                        url: __URL.financial + 'init/payable/yearMonth/list',
                        words: {
                            title: ['showYearMonth'],
                            sub: [],
                        },
                        param: {
                            "docStatus": 1,
                            "pageIndex": 0,
                            "pageSize": 0,
                            "yearMonth": '',
                            "supplierCode": ''
                        },
                    },
                    sub: {
                        key: 'supplierCode',
                        url: __URL.financial + 'init/payable/supplier/list',
                        words: {
                            title: ['supplierName'],
                            sub: [],
                            right: 'showTotalAmount',
                        },
                        param: {
                            "docStatus": 1,
                            "pageIndex": 0,
                            "pageSize": 0,
                            "yearMonth": '',
                            "supplierCode": ''
                        }
                    }
                }
            }, {
                id: 'tab3',
                name: '已审核',
                //icon: 'icon-teamwork',
                params: {
                    main: {
                        key: 'yearMonth',
                        url: __URL.financial + 'init/payable/yearMonth/list',
                        words: {
                            title: ['showYearMonth'],
                            sub: [],
                        },
                        param: {
                            "docStatus": 2,
                            "pageIndex": 0,
                            "pageSize": 0,
                            "yearMonth": '',
                            "supplierCode": ''
                        },
                    },
                    sub: {
                        key: 'supplierCode',
                        url: __URL.financial + 'init/payable/supplier/list',
                        words: {
                            title: ['supplierName'],
                            sub: [],
                            right: 'showTotalAmount',
                        },
                        param: {
                            "docStatus": 2,
                            "pageIndex": 0,
                            "pageSize": 0,
                            "yearMonth": '',
                            "supplierCode": ''
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

        // operating: [true, 'config-operate',
        //     [{
        //         type: 'blue',
        //         btn: 'modify',
        //         text: '修改'
        //     }, {
        //         type: 'danger',
        //         btn: 'delete',
        //         text: '删除'
        //     }, {
        //         type: 'blue',
        //         btn: 'submit',
        //         text: '提交'
        //     }]
        // ],

        serial: true,
        width: [5, 5, 4, 5], //排除序号，多选，单选，操作栏
        match: [
            {key: 'docNo', href: true},
            'docDate',
            'supplierName',
            (obj) => {
                return obj.currencySymbol + obj.payAmount
            }
        ],
        head: ['单号', '单据日期', '供应商名称', '应付金额'],
    },

    unauditTableCfg: {
        // operating: [true, 'config-operate',
        //     [{
        //         type: 'blue',
        //         btn: 'repeal',
        //         text: '撤销审核',
        //         func:function(data){
        //             return !data.repeal
        //         }
        //     }]
        // ],
        serial: true,
        width: [5, 5, 4, 5], //排除序号，多选，单选，操作栏
        match: [
            {key: 'docNo', href: true},
            'docDate',
            'supplierName',
            (obj) => {
                return obj.currencySymbol + obj.payAmount
            }
        ],
        head: ['单号', '单据日期', '供应商名称', '应付金额'],
    },

    auditTableCfg: {
        serial: true,
        width: [5, 5, 4, 5], //排除序号，多选，单选，操作栏
        match: [
            {key: 'docNo', href: true},
            'docDate',
            'supplierName',
            (obj) => {
                return obj.currencySymbol + obj.payAmount
            }
        ],
        head: ['单号', '单据日期', '供应商名称', '应付金额'],
    },
}
