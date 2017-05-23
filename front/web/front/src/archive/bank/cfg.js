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
                name: '银行',
                icon: '',
                params: {
                    main: {
                        key: 'bankCode',
                        url: __URL.arc + '/bankaccount/bank/list',
                        words: {
                            title: ['bankName'],
                            right: 'isDefault',
                        },
                        param: {
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
            hasNub: true,
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
        // checkbox: [true, 'inventoryId'],
        // operating: [true, { type: 0 }],
        // radio: [true, 'docNo'],
      //  bank: [true, { type: 0 }],
       // serial:true,
        width: [3, 3, 3, 3, 3], //排除序号，多选，单选，操作栏
        match: [
            'account',
            'accountBranch',
            'accountNumber',
            'isUsing',
            'isDefault'
        ],
        head: ['账号名', '开户银行网点', '开户账号', '状态','默认账户'],
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
