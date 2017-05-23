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
                name: '固定资产列表',
                icon: '',
                params: {
                    main: {
                        key: 'assetsCategoryCode',
                        url: __URL.arc + '/assetstype/list',
                        words: {
                            title: ['assetsCategoryName'],
                            sub:[]
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
    tableCfg: {
        operating: [true, 'config-operate',
            [{
                type: 'blue',
                btn: 'giveYouALittleColorToSeeSee',
                text: '查看'
            }]
        ],
        width: [5, 5, 5, 5], //排除序号，多选，单选，操作栏
        match: [
            'assetCode',
            'assetName',
            'depreciationMethodName',
            'purchasePrice',
            'purchaseDate',
            'usePeriod',
            function (val) {
                return val.assetStatus == '0'? "闲置":val.assetStatus == 1 ? "使用中" : "废弃";
            },

        ],
        head: [
            '资产编号',
            '资产名称',
            '折旧方法',
            '金额',
            '购入时间',
            '使用期限',
            '状态'],
    },

}
