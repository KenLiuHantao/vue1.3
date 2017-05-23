export default {
    leftItemCfg: {
        headCfg: {
            filter: false
        },
        /* 
         * tab 配置
         */
        tabCfg: {
            select: '',
            tabBarData: [{
                id: 'tab1',
                name: '待处理',
                //icon: 'icon-teamwork',
                params: {
                    main: {
                        key: 'changeType',
                        url: __URL.manufacture + 'change/deal/type',
                        words: {
                            title: ['changeDesc'],
                            right: 'countDocNo'
                        },
                        param: {
                            "pageIndex": 0,
                            "pageSize": 0,
                            "docDate": "",
                            "status":0
                        },
                    },
                    sub: {
                        key: 'docDate',
                        url: __URL.manufacture + 'change/deal/date',
                        words: {
                            title: ['docDate'],
                            right: 'countDocNo'
                        },
                        param: {
                            "changeType": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "docDate": "",
                            "status":0
                        }
                    }
                }
            }, {
                id: 'tab2',
                name: '已处理',
                //icon: 'icon-teamwork',
                params: {
                    main: {
                        key: 'changeType',
                        url: __URL.manufacture + 'change/deal/type',
                        words: {
                            title: ['changeDesc'],
                            right: 'countDocNo'
                        },
                        param: {
                            "pageIndex": 0,
                            "pageSize": 0,
                            "docDate": "",
                            "status":1
                        },
                    },
                    sub: {
                        key: 'docDate',
                        url: __URL.manufacture + 'change/deal/date',
                        words: {
                            title: ['docDate'],
                            right: 'countDocNo'
                        },
                        param: {
                            "changeType": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "docDate": "",
                            "status":1
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
            hasChild: true,
        },
        /* 
         * filter 配置
         */
        filterCfg: [{
            label: '开始时间:',
            key: 'beginCreateTime',
            value: '',
            type: 'date',
            placeholder: '123'
        }, {
            label: '结束时间:',
            key: 'endCreateTime',
            value: '',
            type: 'date',
            placeholder: ''
        }, ]
    },
    /* 
     * table 配置
     */
    tableCfg: {
        serial: true,
        width: [4, 4, 4, 4, 4], //排除序号，多选，单选，操作栏
        match: [
            { key: 'demandDocNo', href: true },
            ['inventoryCode','inventoryName'],
            'processName',
            'productTime',
            'status'
        ],
        head: ['生产订单号', '货品信息','工序', '下达生产时间','任务状态'],
    },
    tableCfg2: {
        serial: true,
        width: [4, 3, 3, 3, 4, 3], //排除序号，多选，单选，操作栏
        match: [
            { key: 'demandDocNo', href: true },
            ['inventoryCode','inventoryName'],
            'processName',
            'productTime',
            'status',
            'completeTime'
        ],
        head: ['生产订单号', '货品信息','工序', '下达生产时间','任务状态','完成时间'],
    }
}
