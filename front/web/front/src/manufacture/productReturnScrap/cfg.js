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
                    name: '待退料',
                    //icon: 'icon-teamwork',
                    params: {
                        main: {
                            key: 'processCode',
                            url: __URL.manufacture + 'production/material/return/process',
                            words: {
                                title: ['processName'],
                                right: 'countDocNo',
                                sub: []
                            },
                            param: {
                                "processCode": '',
                                "yearWeek": '',
                                "pageIndex": 1,
                                "pageSize": 100,
                                "status": 10
                            },
                        },
                        sub: {
                            key: 'yearWeek',
                            url: __URL.manufacture + 'production/material/return/yearWeek',
                            words: {
                                title: ['parsedYearWeek', "(", 'weekBeginDate', "~", 'weekEndDate', ")"],
                                right: 'countDocNo',
                                sub: []
                            },
                            param: {
                                "processCode": '',
                                "yearWeek": '',
                                "pageIndex": 1,
                                "pageSize": 100,
                                "status": 10
                            }
                        }
                    }
                },
                {
                    id: 'tab2',
                    name: '已退料',
                    //icon: 'icon-teamwork',
                    params: {
                        main: {
                            key: 'processCode',
                            url: __URL.manufacture + 'production/material/return/process',
                            words: {
                                title: ['processName'],
                                right: 'countDocNo',
                                sub: []
                            },
                            param: {
                                "processCode": '',
                                "yearWeek": '',
                                "pageIndex": 1,
                                "pageSize": 100,
                                "status": 20
                            },
                        },
                        sub: {
                            key: 'yearWeek',
                            url: __URL.manufacture + 'production/material/return/yearWeek',
                            words: {
                                title: ['parsedYearWeek', "(", 'weekBeginDate', "~", 'weekEndDate', ")"],
                                right: 'countDocNo',
                                sub: []
                            },
                            param: {
                                "processCode": '',
                                "yearWeek": '',
                                "pageIndex": 1,
                                "pageSize": 100,
                                "status": 20
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

    tableOneCfg: {
        serial: true,
        width: [9, 9], //排除序号，多选，单选，操作栏
        match: [
            {key: 'docNo', href: true},
            'applyTime'
        ],
        head: ['生产退料单号', '日期'],
    },

    tableTwoCfg: {
        serial: true,
        width: [6, 6, 6], //排除序号，多选，单选，操作栏
        match: [
            {key: 'docNo', href: true},
            'applyTime',
            'returnCompleteTime'
        ],
        head: ['生产退料单号', '申请退料时间', '退料完成时间'],
    },
}
