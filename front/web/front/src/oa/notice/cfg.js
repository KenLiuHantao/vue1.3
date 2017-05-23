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
                id: 'no',
                name: '未读',
                params: {
                    main: {
                        key: 'yearMonth',
                        url: __URL.hr + 'announcement/yearMonth/list/oa',
                        words: {
                            title: ['showYearMonth'],
                        },
                        param: {
                            "endDate": "",
                            "isRead":0,
                            "name": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "recordStatus": 1,
                            "startDate": "",
                            "yearMonth": ""
                        },
                    },
                }
            }, {
                id: 'yes',
                name: '已读',
                params: {
                    main: {
                        key: 'yearMonth',
                        url: __URL.hr + 'announcement/yearMonth/list/oa',
                        words: {
                            title: ['showYearMonth'],
                        },
                        param: {
                            "endDate": "",
                            "isRead":1,
                            "name": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "recordStatus": 1,
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
        /* 
         * filter 配置
         */
        filterCfg: [{
            label: '公告主题:',
            key: 'name',
            value: '',
            type: 'text',
            placeholder: ''
        }, {
            label: '开始时间:',
            key: 'startDate',
            value: '',
            type: 'date',
            placeholder: ''
        }, {
            label: '结束时间:',
            key: 'endDate',
            value: '',
            type: 'date',
            placeholder: ''
        }, ]
    },
    /* 
     * table 配置
     */
    tableCfg: {
        // checkbox: [true, 'inventoryId'],
        operating: [true, { type: 0 }],
        serial:true,
        // radio: [true, 'docNo'],
        width: [8, 6, 6,], //排除序号，多选，单选，操作栏
        match: [
            'announcementName',
            'updateTime',
            'updator',
        ],
        head: [ '公告主题',  '发布时间', '发布人'],
    },
}
