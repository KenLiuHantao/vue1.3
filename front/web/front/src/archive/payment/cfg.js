//noinspection JSAnnotator
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
                name: '结算方式',
                icon: '',
                params: {
                    main: {
                        key: 'paymentCode',
                        url: __URL.arc + 'payment/list',
                        words: {
                            title: ['paymentName']
                        },
                        param: {
                            "paymentCode": ""
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
            hasChild: false,
        }
    },
    /* 
     * table 配置
     */
    tableCfg: {
        serial:false,
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
        width: [6, 6, 4], //排除序号，多选，单选，操作栏
        match: [
            'paymentName',
            'remark'
        ],
        head: ['结算方式', '备注'],
    },

    /* 
     * 新增结算方式 配置
     */
    paymentCfg:{
        "paymentCode":"",
        "paymentName": "",
        "remark":""
    },
    paymentModalCfg: {
        show: false,
        width: '410px',
        height: 'auto',
        header: '添加结算方式',
        btn: [{
            name: '取消',
            emit: 'close',
        }, {
            name: '确定',
            emit: 'sure',
        }]
    },
}
