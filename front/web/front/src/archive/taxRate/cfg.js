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
                name: '税率',
                icon: '',
                params: {
                    main: {
                        key: 'taxCode',
                        url: __URL.arc + 'taxrate/list',
                        words: {
                            title: ['taxRate','%'],
                            sub: [ ]
                        },
                        param: {
                            'taxCode': ''
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
        filterCfg: [

        ]
    },
    /* 
     * table 配置
     */
    taxRateTableCfg: {
        operating: [true,"config-operate",
            [{
            type: 'blue',
            btn: 'edit',
            text: '编辑'
        // }, {
        //     type: 'danger',
        //     btn: 'delete',
        //     text: '删除'
        }]
        ],
        width: [10, 10], //排除序号，多选，单选，操作栏
        match: [
            'taxRate',
            'taxTypeName'
        ],
        head: ['税率%', '税种']
    }
}
