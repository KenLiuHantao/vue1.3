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
                    name: '待入库',
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
                                "tabIndex": 100
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
                                "tabIndex": 100
                            }
                        }
                    }
                },
                {
                    id: 'tab2',
                    name: '已入库',
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
                                "tabIndex": 200
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
                                "tabIndex": 200
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
    canTableCfg: {
        serial: true,
        width: [2, 5, 5, 5, 5], //排除序号，多选，单选，操作栏
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
            'waitInboundQuantity',

        ],
        head: ['', '生产订单号', '货品信息', '生产数量', '待入数量'],
        newline: [0],
    },
    pickedTableCfg: {
        serial: true,
        width: [2, 5, 5, 5, 5], //排除序号，多选，单选，操作栏
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
            'alreadyInboundQuantity',
        ],
        head: ['', '生产订单号', '货品信息', '生产数量', '已入数量'],
        newline: [0],
    },
}
