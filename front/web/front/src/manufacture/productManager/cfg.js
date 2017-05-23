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
                    name: '待生产',
                    //icon: 'icon-teamwork',
                    params: {
                        main: {
                            key: 'yearWeek',
                            url: __URL.manufacture + 'production/manager/findWeekList',
                            words: {
                                title: ['text'],
                                right: 'orderCount',
                                sub: []
                            },
                            param: {
                                "productDocNo": '',
                                "processCode": '',
                                "inventoryCode": "",
                                "deliveryBeginDate": "",
                                "deliveryEndDate": "",
                                "yearWeek": '',
                                "pageIndex": 0,
                                "pageSize": 0,
                                "tabIndex": 0
                            },
                        },
                        sub: {
                            key: 'processCode',
                            url: __URL.manufacture + 'production/manager/findProcessList',
                            words: {
                                title: ['processName'],
                                right: 'orderCount',
                                sub: []
                            },
                            param: {
                                "productDocNo": '',
                                "processCode": '',
                                "inventoryCode": "",
                                "deliveryBeginDate": "",
                                "deliveryEndDate": "",
                                "yearWeek": '',
                                "pageIndex": 0,
                                "pageSize": 0,
                                "tabIndex": 0
                            }
                        }
                    }
                },
                {
                    id: 'tab2',
                    name: '生产中',
                    //icon: 'icon-teamwork',
                    params: {
                        main: {
                            key: 'yearWeek',
                            url: __URL.manufacture + 'production/manager/findWeekList',
                            words: {
                                title: ['text'],
                                right: 'orderCount',
                                sub: []
                            },
                            param: {
                                "productDocNo": '',
                                "processCode": '',
                                "inventoryCode": "",
                                "deliveryBeginDate": "",
                                "deliveryEndDate": "",
                                "yearWeek": '',
                                "pageIndex": 0,
                                "pageSize": 0,
                                "tabIndex": 1
                            },
                        },
                        sub: {
                            key: 'processCode',
                            url: __URL.manufacture + 'production/manager/findProcessList',
                            words: {
                                title: ['processName'],
                                right: 'orderCount',
                                sub: []
                            },
                            param: {
                                "productDocNo": '',
                                "processCode": '',
                                "inventoryCode": "",
                                "deliveryBeginDate": "",
                                "deliveryEndDate": "",
                                "yearWeek": '',
                                "pageIndex": 0,
                                "pageSize": 0,
                                "tabIndex": 1
                            }
                        }
                    }
                },
                {
                    id: 'tab3',
                    name: '已完工',
                    //icon: 'icon-teamwork',
                    params: {
                        main: {
                            key: 'yearWeek',
                            url: __URL.manufacture + 'production/manager/findWeekList',
                            words: {
                                title: ['text'],
                                right: 'orderCount',
                                sub: []
                            },
                            param: {
                                "productDocNo": '',
                                "processCode": '',
                                "inventoryCode": "",
                                "deliveryBeginDate": "",
                                "deliveryEndDate": "",
                                "yearWeek": '',
                                "pageIndex": 0,
                                "pageSize": 0,
                                "tabIndex": 2
                            },
                        },
                        sub: {
                            key: 'processCode',
                            url: __URL.manufacture + 'production/manager/findProcessList',
                            words: {
                                title: ['processName'],
                                right: 'orderCount',
                                sub: []
                            },
                            param: {
                                "productDocNo": '',
                                "processCode": '',
                                "inventoryCode": "",
                                "deliveryBeginDate": "",
                                "deliveryEndDate": "",
                                "yearWeek": '',
                                "pageIndex": 0,
                                "pageSize": 0,
                                "tabIndex": 2
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
                label: '生产订单号:',
                key: 'docNo',
                value: '',
                type: 'text',
                placeholder: '请输入生产单号'
            }, {
                label: '交期(从):',
                key: 'deliveryBeginDate',
                value: '',
                config: {
                    format: "YYYY-MM-DD"
                },
                type: 'date',
                placeholder: '请选择开始时间'
            }, {
                label: '交期(到):',
                key: 'deliveryEndDate',
                value: '',
                config: {
                    format: "YYYY-MM-DD"
                },
                type: 'date',
                placeholder: '请选择结束时间'
            },
            {
                label: '工序:',
                key: 'processName',
                value: '',
                type: 'search',
                placeholder: '请选择工序'
            },
            {
                label: '货品编码:',
                key: 'inventoryCode',
                value: '',
                type: 'search',
                placeholder: '请选择货品'
            },
            {
                label: '货品名称:',
                key: 'inventoryName',
                value: '',
                type: 'search',
                placeholder: '请选择货品'
            }
        ]
    },

    /* 
     * table 配置
     */
    listParam: {
        "productDocNo": '',
        "processCode": '',
        "inventoryCode": "",
        "deliveryBeginDate": "",
        "deliveryEndDate": "",
        "yearWeek": '',
        "pageIndex": 0,
        "pageSize": 0,
        "tabIndex": 0
    },
    waitTableCfg: {
        serial: true,
        width: [2, 4, 4, 4, 6], //排除序号，多选，单选，操作栏
        match: [
            function(item){
                var html=''
                if(item.changeType && item.changeType > 0) {
                    html += '<button class="button-danger" disabled="disabled">变更</button>'
                }
                return html
            },
            {key: 'docNo', href: true},
            ['inventoryCode', 'inventoryName'],
            'quantity',
            'docDate',
        ],
        statusControl:[true,{
            'test': function (val) {
                if (val.status === '未备料') {
                    return false
                } else if (val.status === '可领料') {
                    return true
                } else {
                    return ''
                }
            },
            'title':'状态',
            'success':'可领料',
            'successStyle':{color:"#61BA5B"},
            'fail':'未备料',
            'failStyle':{color:"red"},
            other (val) {
                if (val.status === '已领料') {
                    return true
                } else {
                    return false
                }
            },
            otherText: '已领料',
            otherStyle: {color: '#61BA5B'},
        }],
        head: ['', '生产订单号', '货品信息', '生产数量', '下达生产时间'],
    },
    proTableCfg: {
        serial: true,
        width: [2, 4, 4, 4, 6], //排除序号，多选，单选，操作栏
        match: [
            function(item){
                var html=''
                if(item.changeType && item.changeType > 0) {
                    html += '<button class="button-danger" disabled="disabled" >变更</button>'
                }
                return html
            },
            {key: 'docNo', href: true},
            ['inventoryCode', 'inventoryName'],
            'quantity',
            [{prefix: '下达生产:', key: 'createTime'}, {prefix: '客户交期:', key: 'deliveryDate'}],
        ],
        head: ['','生产订单号', '货品信息', '生产数量', '时间信息'],
    },
    completeTableCfg: {
        serial: true,
        width: [2, 4, 4, 4, 6], //排除序号，多选，单选，操作栏
        match: [
            function(item){
                var html=''
                if(item.changeType && item.changeType > 0) {
                    html += '<button class="button-danger" disabled="disabled">变更</button>'
                }
                return html
            },
            {key: 'docNo', href: true},
            ['inventoryCode', 'inventoryName'],
            [{prefix: '生产数量:', key: 'quantity'}, {prefix: '登数:', key: 'registerQuantity'}],
            [{prefix: '客户交期:', key: 'deliveryDate'}, {prefix: '生产完工:', key: 'completeTime'}],

        ],
        head: ['','生产订单号', '货品信息', '数量信息', '时间信息',],
    },
}
