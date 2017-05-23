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
                name: '费用类别',
                icon: '',
                params: {
                    main: {
                        key: 'expenseCategoryCode',
                        url: __URL.arc + '/expensetype/list',
                        words: {
                            title: ['expenseCategoryName'],
                            sub:[]
                        },
                        param: {
                            "expenseCategoryCode":'',
                            "pageIndex": 0,
                            "pageSize": 0
                        }
                    }
                }
            }]
        },
        /* 
         * list 配置
         */
        listCfg: {
            hasNub: false,
            hasChild: false,
        },
        /* 
         * filter 配置
         */
        filterCfg: []
    },
    /* 
     * table 配置
     */
    tableCfg: {
        operating: [true, 'config-operate',
            [{
                type: 'blue',
                btn: 'edit',
                text: '编辑',
                func:function(item){
                    return item.isEnable == 1
                }
            }, {
                type: 'danger',
                btn: 'disable',
                text: '禁用',
                func:function(item){
                    return item.isEnable == 1
                }
            }, {
                type: 'blue',
                btn: 'enable',
                text: '启用',
                func:function(item){
                    return item.isEnable == 0
                }
            }]
        ],
        width: [5, 5, 5, 5], //排除序号，多选，单选，操作栏
        match: [
            'expenseTypeName',
            'remark'
        ],
        head: ['费用类别', '描述'],
    },

    bankCfg:{
            "account":"",
            "bankCode":"",
            "bankName":"",
            "accountBranch":"",
            "currencyCode":"",
            "currencyName":"",
            "accountNumber":""
    }

}
