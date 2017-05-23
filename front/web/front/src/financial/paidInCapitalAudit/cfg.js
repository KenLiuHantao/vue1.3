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
                        url: __URL.financial + 'paidincapital/yearMonth/list',
                        words: {
                            title: ['showYearMonth'],
                            sub: [],
                        },
                        param: {
                            "docStatus": 1,
                            "pageIndex": 0,
                            "pageSize": 0,
                            "yearMonth": '',
                            "currencyCode": ''
                        },
                    },
                    sub: {
                        key: 'investor',
                        url: __URL.financial + 'paidincapital/investor/list',
                        words: {
                            title: ['investor'],
                            right: 'showAmount',
                        },
                        param: {
                            "docStatus": 1,
                            "pageIndex": 0,
                            "pageSize": 0,
                            "yearMonth": '',
                            "investor": '',
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
                        url: __URL.financial + 'paidincapital/yearMonth/list',
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
                        key: 'investor',
                        url: __URL.financial + 'paidincapital/investor/list',
                        words: {
                            title: ['investor'],
                            right: 'showAmount',
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
        width: [6,6,6], //排除序号，多选，单选，操作栏
        match: [
            {key: 'docNo', href: true},
            'docDate',
            'amount'
        ],
        head: ['单号', '单据日期', '实收资本金额'],
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
        width: [6,6,6], //排除序号，多选，单选，操作栏
        match: [
            {key: 'docNo', href: true},
            'docDate',
            'amount'
        ],
        head: ['单号', '单据日期', '实收资本金额'],
    },

    auditTableCfg: {
        // operating: [true, 'config-operate',
        //     [{
        //         type: 'blue',
        //         btn: 'back',
        //         text: '退款',
        //         func:function(data){
        //             if(data.docType ==3){
        //                 return false;
        //             }else{
        //                 return true;
        //             }
        //         }
        //     }]
        // ],
        serial: true,
        width: [6,6,6], //排除序号，多选，单选，操作栏
        match: [
            {key: 'docNo', href: true},
            'docDate',
            'amount'
        ],
        head: ['单号', '单据日期', '实收资本金额'],
    },
}
