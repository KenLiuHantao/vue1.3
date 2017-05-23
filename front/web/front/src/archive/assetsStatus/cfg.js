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
                name: '资产状态',
                icon: '',
                params: {
                    main: {
                        key: 'assetsStatusCode',
                        url: __URL.arc + '/assetsstatus/findallinfo',
                        words: {
                            title: ['assetsStatusName'],
                            sub:[]
                        },
                        param: {
                            "assetsStatusCode":'',
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
