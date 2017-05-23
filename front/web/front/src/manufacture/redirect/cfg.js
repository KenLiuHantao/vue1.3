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
                    name: '待流转',
                    //icon: 'icon-teamwork',
                    params: {
                        main: {
                            key: 'yearWeek',
                            url: __URL.manufacture + 'redirect/weeks',
                            words: {
                                title: ['parsedYearWeek', '', '（', 'weekBeginDate', ' ~ ', 'weekEndDate', ')'],
                                right:'countDocNo',
                                sub: []
                            },
                            param: {
                                "processCode":'',
                                "yearWeek": '',
                                "status":0,
                                "pageIndex": 0,
                                "pageSize": 0
                            },
                        },
                        sub: {
                            key: 'processCode',
                            url: __URL.manufacture + 'redirect/processes',
                            words: {
                                title: ['processName'],
                                right:'countDocNo',
                                sub: []
                            },
                            param: {
                                "processCode":'',
                                "yearWeek": '',
                                "status":0,
                                "pageIndex": 0,
                                "pageSize": 0
                            }
                        }
                    }
                },
                {
                    id: 'tab2',
                    name: '已流转',
                    //icon: 'icon-teamwork',
                    params: {
                        main: {
                            key: 'yearWeek',
                            url: __URL.manufacture + 'redirect/weeks',
                            words: {
                                title: ['parsedYearWeek', '', '（', 'weekBeginDate', ' ~ ', 'weekEndDate', ')'],
                                right: 'countDocNo',
                                sub: []
                            },
                            param: {
                                "processCode": '',
                                "yearWeek": '',
                                "status": 1,
                                "pageIndex": 0,
                                "pageSize": 0
                            },
                        },
                        sub: {
                            key: 'processCode',
                            url: __URL.manufacture + 'redirect/processes',
                            words: {
                                title: ['processName'],
                                right: 'countDocNo',
                                sub: []
                            },
                            param: {
                                "processCode": '',
                                "yearWeek": '',
                                "status": 1,
                                "pageIndex": 0,
                                "pageSize": 0
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
        /* 
         * filter 配置
         */
        filterCfg: [
            {
                label: '生产单号:',
                key: 'docNo',
                value: '',
                type: 'text',
                placeholder: '请输入采购单号'
            }
        ]
    },

    /* 
     * table 配置
     */
    listParam: {
        "processCode":'',
        "yearWeek": '',
        "status":'',
        "pageIndex": 0,
        "pageSize": 0
    },
    tableCfg: {
        serial: true,
        width: [2,4,4,4,4,4], //排除序号，多选，单选，操作栏
        match: [
            function(item){
                var html=''
                if(item.changeType && item.changeType > 0) {
                    html += '<button class="button-danger" disabled="disabled">变更</button>'
                }
                return html
            },
            {key:'docNo',href:true},
            ['inventoryCode','inventoryName'],
            'productQty',
            'redirectQty',
            'fromProcessName',
        ],
        head: ['','生产订单号', '货品信息','生产数量','待流转数量','转出单位'],
    },
    newTableCfg: {
        serial: true,
        width: [2,4,4,4,4,4], //排除序号，多选，单选，操作栏
        match: [
            function(item){
                var html=''
                if(item.changeType && item.changeType > 0) {
                    html += '<button class="button-danger" disabled="disabled">变更</button>'
                }
                return html
            },
            {key:'docNo',href:true},
            ['inventoryCode','inventoryName'],
            'productQty',
            'redirectedQty',
            'fromProcessName',
        ],
        head: ['','生产订单号', '货品信息','生产数量','已流转数量','转出单位'],
    },
}
