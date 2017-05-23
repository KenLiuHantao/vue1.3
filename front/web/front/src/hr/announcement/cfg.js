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
                id: 'no',
                name: '未发布',
                params: {
                    main: {
                        key: 'yearMonth',
                        url: __URL.hr + 'announcement/yearMonth/list',
                        words: {
                            title: ['showYearMonth'],
                        },
                        param: {
                            "endDate": "",
                            "name": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "announcementStatus": 0,
                            "startDate": "",
                            "yearMonth": ""
                        },
                    },
                }
            }, {
                id: 'yes',
                name: '已发布',
                params: {
                    main: {
                        key: 'yearMonth',
                        url: __URL.hr + 'announcement/yearMonth/list',
                        words: {
                            title: ['showYearMonth'],
                        },
                        param: {
                            "endDate": "",
                            "name": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "announcementStatus": 1,
                            "startDate": "",
                            "yearMonth": ""
                        },
                    },
                }
            }, {
                id: 'stop',
                name: '已停用',
                params: {
                    main: {
                        key: 'yearMonth',
                        url: __URL.hr + 'announcement/yearMonth/list',
                        words: {
                            title: ['showYearMonth'],
                        },
                        param: {
                            "endDate": "",
                            "name": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "announcementStatus": -1,
                            "startDate": "",
                            "yearMonth": ""
                        },
                    },
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
    },
}
