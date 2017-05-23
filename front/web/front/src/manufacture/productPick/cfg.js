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
                    name: '待领料',
                    //icon: 'icon-teamwork',
                    params: {
                        main: {
                            key: 'processCode',
                            url: __URL.manufacture + 'waitPick/process',
                            words: {
                                title: ['processName'],
                                right: 'countDocNo',
                                sub: []
                            },
                            param: {
                                "productDocNo": '',
                                "processCode": '',
                                "inventoryCode": "",
                                "beginDeliveryDate": "",
                                "endDeliveryDate": "",
                                "yearWeek": '',
                                "pageIndex": 0,
                                "pageSize": 0
                            },
                        },
                        sub: {
                            key: 'yearWeek',
                            url: __URL.manufacture + 'waitPick/yearWeek',
                            words: {
                                title: ['parsedYearWeek', '', '（', 'weekBeginDate', ' ~ ', 'weekEndDate', ')'],
                                right: 'countDocNo',
                                sub: []
                            },
                            param: {
                                "productDocNo": '',
                                "processCode": '',
                                "inventoryCode": "",
                                "beginDeliveryDate": "",
                                "endDeliveryDate": "",
                                "yearWeek": '',
                                "pageIndex": 0,
                                "pageSize": 0
                            }
                        }
                    }
                },
                {
                    id: 'tab2',
                    name: '可领料',
                    //icon: 'icon-teamwork',
                    params: {
                        main: {
                            key: 'processCode',
                            url: __URL.warehouse + 'wait/picking/query/processes',
                            words: {
                                title: ['processName'],
                                right: 'total',
                                sub: []
                            },
                            param: {
                                "pageIndex": 0,
                                "pageSize": 0
                            },
                        },
                        sub: {
                            key: 'yearWeek',
                            url: __URL.warehouse + 'wait/picking/query/weeks',
                            words: {
                                title: ['week', '', '（', 'weekBeginDate', ' ~ ', 'weekEndDate', ')'],
                                right: 'total',
                                sub: []
                            },
                            param: {
                                "processCode": '',
                                "yearWeek":'',
                                "pageIndex": 0,
                                "pageSize": 0
                            }
                        }
                    }
                },
                {
                    id: 'tab3',
                    name: '已领料',
                    //icon: 'icon-teamwork',
                    params: {
                        main: {
                            key: 'processCode',
                            url: __URL.manufacture + 'picked/process',
                            words: {
                                title: ['processName'],
                                right: 'countDocNo',
                                sub: []
                            },
                            param: {
                                "pageIndex": 0,
                                "pageSize": 0
                            },
                        },
                        sub: {
                            key: 'yearWeek',
                            url: __URL.manufacture + 'picked/yearWeek',
                            words: {
                                title: ['parsedYearWeek', '', '（', 'weekBeginDate', ' ~ ', 'weekEndDate', ')'],
                                right: 'countDocNo',
                                sub: []
                            },
                            param: {
                                "productDocNo": '',
                                "processCode": '',
                                "inventoryCode": "",
                                "beginDeliveryDate": "",
                                "endDeliveryDate": "",
                                "yearWeek": '',
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
                label: '采购单号:',
                key: 'docNo',
                value: '',
                type: 'text',
                placeholder: '请输入采购单号'
            }, {
                label: '请购时间(从):',
                key: 'beginApplyDate',
                value: '',
                config: {
                    format: "YYYY-MM-DD"
                },
                type: 'date',
                placeholder: '请选择开始时间'
            }, {
                label: '请购时间(到):',
                key: 'endApplyDate',
                value: '',
                config: {
                    format: "YYYY-MM-DD"
                },
                type: 'date',
                placeholder: '请选择结束时间'
            },
            {
                label: '客户单号:',
                key: 'customerNo',
                value: '',
                type: 'text',
                placeholder: '请输入客户单号'
            }
        ]
    },

    /* 
     * table 配置
     */
    listParam: {
        "processCode": '',
        "inventoryCode": "",
        "beginDeliveryDate": "",
        "endDeliveryDate": "",
        "yearWeek": '',
        "pageIndex": 0,
        "pageSize": 0
    },
    waitTableCfg: {
        serial: true,
        width: [2, 5, 5], //排除序号，多选，单选，操作栏
        match: [
            function(item){
                var html=''
                if(item.changeType && item.changeType > 0) {
                    html += '<button class="button-danger" disabled="disabled">变更</button>'
                }
                return html
            },
            {key: 'srcDocNo', href: true},
            'productTime',
        ],
        head: ['', '单号', '时间信息'],
    },
    canTableCfg: {
        serial: true,
        width: [5, 5, 5, 5], //排除序号，多选，单选，操作栏
        match: [
            {key: 'docNo', href: true},
            'docTime',
            {key: 'srcDocNo', href: true},
            'srcDocDate'
        ],
        head: ['备料单号', '备料时间','生产单/补料单号', '下单时间' ],
    },
    pickedTableCfg: {
        serial: true,
        width: [5, 5, 5, 5], //排除序号，多选，单选，操作栏
        match: [
            {key: 'pickDocNo', href: true},
            'pickTime',
            {key: 'srcDocNo', href: true},
            'productTime',
        ],
        head: ['领料单号', '领料时间', '生产单/补料单号', '下单时间'],
    },
}
