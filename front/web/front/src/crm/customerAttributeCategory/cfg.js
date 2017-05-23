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
                name: '区域分类',
                icon: '',
                params: {
                    main: {
                        key: 'code',
                        url: __URL.crm + 'customer/attribute/region/category/list',
                        words: {
                            title: ['name'],
                        },
                        param: {
                            "code": '',
                        }
                    },
                }
            }, {
                id: 'tab2',
                name: '行业分类',
                icon: '',
                params: {
                    main: {
                        key: 'code',
                        url: __URL.crm + 'customer/attribute/industry/category/list',
                        words: {
                            title: ['name'],
                        },
                        param: {
                            "code": '',
                        }
                    },
                }
            }, {
                id: 'tab3',
                name: '重要度分级',
                icon: '',
                params: {
                    main: {
                        key: 'code',
                        url: __URL.crm + 'customer/attribute/importance/grade',
                        words: {
                            title: ['name'],
                        },
                        param: {
                            "code": '',
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
        serial: false,
        width: [20], //排除序号，多选，单选，操作栏
        match: [
            'name'
        ],
        head: ['分类名称'],
    },

}
