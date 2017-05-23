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
                name: '折旧方法',
                icon: '',
                params: {
                    main: {
                        key: 'depreciationMethodCode',
                        url: __URL.arc + '/depreciationmethod/findallinfo',
                        words: {
                            title: ['depreciationMethodName']
                        },
                        param: {
                            "assetsCategoryCode":'',
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
