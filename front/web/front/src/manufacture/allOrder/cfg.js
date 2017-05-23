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
                name: '待排产',
                //icon: 'icon-teamwork',
                params: {
                    main: {
                        key: 'yearWeek',
                        url: __URL.manufacture + 'productOrder/wait/week/list',
                        words: {
                            title: ['parsedYearWeek', '(', 'weekBeginDate', '~', 'weekEndDate', ')'],
                            right: 'countDocNo'
                        },
                        param: {
                            "customerCode": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "status": 0,
                            "yearWeek": 0
                        },
                    },
                    sub: {
                        key: 'customerCode',
                        url: __URL.manufacture + 'productOrder/wait/week/customer/list',
                        words: {
                            title: ['customerName'],
                            right: 'countDocNo',
                        },
                        param: {
                            "customerCode": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "status": 0,
                            "yearWeek": 0
                        }
                    }
                }
            }, {
                id: 'tab2',
                name: '生产中',
                //icon: 'icon-teamwork',
                params: {
                    main: {
                        key: 'yearWeek',
                        url: __URL.manufacture + 'productOrder/in/product/week/list',
                        words: {
                            title: ['parsedYearWeek', '(', 'weekBeginDate', '~', 'weekEndDate', ')'],
                            right: 'countDocNo'
                        },
                        param: {
                            "customerCode": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "status": 1,
                            "yearWeek": 0
                        },
                    },
                    sub: {
                        key: 'customerCode',
                        url: __URL.manufacture + 'productOrder/in/product/week/customer/list',
                        words: {
                            title: ['customerName'],
                            right: 'countDocNo'
                        },
                        param: {
                            "customerCode": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "status": 1,
                            "yearWeek": 0
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
                            url: __URL.manufacture + 'productOrder/complete/week/list',
                            words: {
                                title: ['parsedYearWeek', '(', 'weekBeginDate', '~', 'weekEndDate', ')'],
                                right: 'countDocNo'
                            },
                            param: {
                                "customerCode": "",
                                "pageIndex": 0,
                                "pageSize": 0,
                                "status": 2,
                                "yearWeek": 0
                            },
                        },
                        sub: {
                            key: 'customerCode',
                            url: __URL.manufacture + 'productOrder/complete/week/customer/list',
                            words: {
                                title: ['customerName'],
                                right: 'countDocNo'
                            },
                            param: {
                                "customerCode": "",
                                "pageIndex": 0,
                                "pageSize": 0,
                                "status": 2,
                                "yearWeek": 0
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
    listParam: {
        "customerCode": '',
        "yearWeek": '',
        "pageIndex": 0,
        "pageSize": 0,
        "tabIndex": 0
    },

    /* 
     * table 配置
     */
    tableCfg: {
        serial: true,
        width: [4, 4, 4, 4, 4], //排除序号，多选，单选，操作栏
        match: [
            { key: 'demandDocNo', href: true },
            ['inventoryCode', 'inventoryName'],
            'waitProductQuantity',
            'readyQuantity',
            [{prefix:'下单: ',key:'createTime'},{prefix:'交期: ',key:'deliveryDate'}]
        ],
        head: ['生产订单号', '货品信息', '待排产数量','齐料数量', '时间信息'],
    },
    tableCfg2: {
        serial: true,
        width: [2, 4, 4, 4, 4], //排除序号，多选，单选，操作栏
        match: [
            function(item){
                var html=''
                if(item.changeType && item.changeType > 0) {
                    html += '<button class="button-danger" disabled="disabled">变更</button>'
                }
                return html
            },
            { key: 'demandDocNo', href: true },
            ['inventoryCode', 'inventoryName'],
            'productQuantity',
            [{prefix:'下单: ',key:'createTime'},{prefix:'交期: ',key:'deliveryDate'}]
        ],
        head: ['', '生产订单号', '货品信息', '生产数量', '时间信息'],
    },
    tableCfg3: {
        serial: true,
        width: [2, 4, 4, 4, 4], //排除序号，多选，单选，操作栏
        match: [
            function(item){
                var html=''
                if(item.changeType && item.changeType > 0) {
                    html += '<button class="button-danger" disabled="disabled">变更</button>'
                }
                return html
            },
            { key: 'demandDocNo', href: true },
            ['inventoryCode', 'inventoryName'],
            [{prefix:'生产: ',key:'productQuantity'},{prefix:'登数: ',key:'registerQuantity'}],
            [{prefix:'交期: ',key:'deliveryDate'},{prefix:'完工: ',key:'completeDate'}]
        ],
        head: ['', '生产订单号', '货品信息', '数量信息', '时间信息'],
    }
}
