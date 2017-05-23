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
            tabBarData: [
                {
                    id: 'tab1',
                    name: '币种与汇率',
                    icon: '',
                    params: {
                        main: {
                            key: 'currencyCode',
                            url: __URL.arc + 'currency/list',
                            words: {
                                title: ['currencyName'],
                                sub: []
                            },
                            param: {
                                "currencyCode":"",
                                "accYear":""
                            },
                        }
                    }
                },

            ]
        },
        /* 
         * list 配置
         */
        listCfg: {
            hasNub: false,
            hasChild: false,
        }

    },

    /* 
     * table 配置
     */
    listParam: {
        "accMonth": "",
        "starDate": "",
        "endDate": "",
        "rate": "",
        "opt": ""
    },
    tableCfg: {
        serial:false,
        width: [4, 3, 3, 3, 3], //排除序号，多选，单选，操作栏
        match: [
            'accMonth',
            'startDate',
            'endDate',
            'rate',
            [{ key: 'opt', href: true }]
        ],
        head: ['会计月份', '开始日期', '结束日期', '汇率','操作'],
    },
}
