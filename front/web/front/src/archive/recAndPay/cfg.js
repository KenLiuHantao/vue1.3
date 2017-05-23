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
                name: '收款协议',
                icon: '',
                params: {
                    main: {
                        key: 'recAgreementCode',
                        url: __URL.arc + 'rec/agreement/ref',
                        words: {
                            title: ['recAgreementName']
                        },
                        param: {
                            "keyWord": "",
                            "pageIndex": 0,
                            "pageSize": 0
                        },
                        detailCfg: ''
                    }
                }
            }, {
                id: 'tab2',
                name: '付款协议',
                icon: '',
                params: {
                    main: {
                        key: 'payAgreementCode',
                        url: __URL.arc + 'pay/agreement/ref',
                        words: {
                            title: ['payAgreementName']
                        },
                        param: {
                            "keyWord": "",
                            "pageIndex": 0,
                            "pageSize": 0
                        },
                    }
                }
            }]
        },
        /* 
         * list 配置
         */
        listCfg: {
            hasNub: true,
            hasChild: false,
        },
    },
    /* 
     * table 配置
     */
    recAgreementCfg: {
        serial: false,
        operating: [true, 'config-operate',
            [{
                type: 'blue',
                btn: 'modify',
                text: '编辑'
            }, {
                type: 'blue',
                btn: 'delete',
                text: '删除'
            }]
        ],
        width: [4, 4, 4, 6, 2], //排除序号，多选，单选，操作栏
        match: [
            'recAgreementName',
            'initialDay',
            'deviationDay',
            'remark'
        ],
        head: ['名称', '起算日', '账期日', '备注'],
    },
    payAgreementCfg: {
        serial: false,
        operating: [true, 'config-operate',
            [{
                type: 'blue',
                btn: 'modify',
                text: '编辑'
            }, {
                type: 'blue',
                btn: 'delete',
                text: '删除'
            }]
        ],
        width: [4, 4, 4, 6, 2], //排除序号，多选，单选，操作栏
        match: [
            'payAgreementName',
            'initialDay',
            'deviationDay',
            'remark'
        ],
        head: ['名称', '起算日', '账期日', '备注'],
    },

    recSaveCfg: {
        "recAgreementCode": "",
        "recAgreementName": "",
        "initialDay": "",
        "deviationDay": "",
        "remark": "",
    },

    paySaveCfg: {
        "payAgreementCode": "",
        "payAgreementName": "",
        "initialDay": "",
        "deviationDay": "",
        "remark": "",
    },

    recModalCfg: {
        show: false,
        width: '410px',
        height: 'auto',
        header: '新增收付款协议',
        btn: [{
            name: '取消',
            emit: 'close',
        }, {
            name: '确定',
            emit: 'sure',
        }]
    },

    recInitialDayCfg: ["出库日期", "出库月末日期", ""],

    payInitialDayCfg: ["入库日期", "入库月末日期", ""],

    payModalCfg: {
        show: false,
        width: '410px',
        height: 'auto',
        header: '新增收付款协议',
        btn: [{
            name: '取消',
            emit: 'close',
        }, {
            name: '确定',
            emit: 'sure',
        }]
    },

}
