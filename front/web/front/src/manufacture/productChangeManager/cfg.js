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
                name: '待变更',
                //icon: 'icon-teamwork',
                params: {
                    main: {
                        key: 'docDate',
                        url: __URL.manufacture + 'change/manager/wait/date',
                        words: {
                            title: ['docDate'],
                            right: 'countDocNo'
                        },
                        param: {
                            "pageIndex": 0,
                            "pageSize": 0,
                            "status": 0,
                        },
                    },
                    sub: {
                        key: 'saleOrderDocNo',
                        url: __URL.manufacture + 'change/manager/wait/saleOrder',
                        words: {
                            title: ['saleOrderDocNo'],
                            right: 'countDocNo'
                        },
                        param: {
                            "docDate": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "status": 0
                        }
                    }
                }
            }, {
                id: 'tab2',
                name: '已变更',
                //icon: 'icon-teamwork',
                params: {
                    main: {
                        key: 'yearMonth',
                        url: __URL.manufacture + 'change/manager/confirm/yearMonth',
                        words: {
                            title: ['parsedYearMonth'],
                            right: 'countDocNo'
                        },
                        param: {
                            "pageIndex": 0,
                            "pageSize": 0,
                            "status": 1
                        },
                    },
                    sub: {
                        key: 'saleOrderDocNo',
                        url: __URL.manufacture + 'change/manager/wait/saleOrder',
                        words: {
                            title: ['saleOrderDocNo'],
                            right: 'countDocNo'
                        },
                        param: {
                            "yearMonth": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "status": 1
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
            label: '供应商名称:',
            key: 'supplierName',
            value: '',
            type: 'text',
            placeholder: '请输入供应商'
        }, {
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
            ['inventoryCode', 'inventoryName'],
            'productTime',
            'changeType',
        ],
        head: ['生产订单号', '货品信息', '下达生产时间','变更类型'],
    }

}
