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
            tabBarData: [
                {
                    id: 'tab1',
                    name: '待审核',
                    //icon: 'icon-teamwork',
                    params: {
                        main: {
                            key: 'processCode',
                            url: __URL.manufacture + 'production/material/process',
                            words: {
                                title: ['processName'],
                                right: 'countDocNo',
                                sub: []
                            },
                            param: {
                                "processCode": '',
                                "yearWeek": '',
                                "pageIndex": 1,
                                "pageSize": 20,
                                "audit": 0
                            },
                        },
                        sub: {
                            key: 'yearWeek',
                            url: __URL.manufacture + 'production/material/yearWeek',
                            words: {
                                title: ['parsedYearWeek',"(",'weekBeginDate',"~",'weekEndDate',")"],
                                right: 'countDocNo',
                                sub: []
                            },
                            param: {
                                "processCode": '',
                                "yearWeek": '',
                                "pageIndex": 1,
                                "pageSize": 20,
                                "audit": 0
                            }
                        }
                    }
                },
                {
                    id: 'tab2',
                    name: '已审核',
                    //icon: 'icon-teamwork',
                    params: {
                        main: {
                            key: 'processCode',
                            url: __URL.manufacture + 'production/material/process',
                            words: {
                                title: ['processName'],
                                right: 'countDocNo',
                                sub: []
                            },
                            param: {
                                "processCode": '',
                                "yearWeek": '',
                                "pageIndex": 1,
                                "pageSize": 20,
                                "audit": 1
                            },
                        },
                        sub: {
                            key: 'yearWeek',
                            url: __URL.manufacture + 'production/material/yearWeek',
                            words: {
                                title: ['parsedYearWeek',"(",'weekBeginDate',"~",'weekEndDate',")"],
                                right: 'countDocNo',
                                sub: []
                            },
                            param: {
                                "processCode": '',
                                "yearWeek": '',
                                "pageIndex": 1,
                                "pageSize": 20,
                                "audit": 1
                            }
                        }
                    }
                }
            ]
        },
        /* 
         * list 配置
         */
        listCfg: {
            hasNub: true,
            hasChild: true,
        },
    },

    tableCfg: {
        serial: true,
        width: [6, 6, 6], //排除序号，多选，单选，操作栏
        match: [
            {key: 'docNo', href: true},
            'docTypeName',
            'applyTime'
        ],
        head: ['单号', '单据类型', '申请时间'],
    },
}
