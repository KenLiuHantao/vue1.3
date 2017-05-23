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
                id: 'week',
                name: '周排序',
                icon: '',
                params: {
                    main: {
                        key: 'yearWeek',
                        url: __URL.sale + 'salesUnfinishedOrder/findForWeek',
                        words: {
                            title: ['weekShowName'],
                        },
                        param: {
                            "customerCode": "",
                            "customerName": "",
                            "endDocDate": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "startDocDate": "",
                            "yearWeek": 0
                        },
                    },
                    sub: {
                        key: 'customerCode',
                        url: __URL.sale + 'salesUnfinishedOrder/findForCustomer',
                        words: {
                            title: ['customerName'],
                        },
                        param: {
                            "customerCode": "",
                            "customerName": "",
                            "endDocDate": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "startDocDate": "",
                            "yearWeek": 0
                        }
                    }
                }
            },{
                id: 'customer',
                name: '客户排序',
                icon: '',
                params: {
                    main: {
                        key: 'customerCode',
                        url: __URL.sale + 'salesUnfinishedOrder/findForCustomer',
                        words: {
                            title: ['customerName'],
                        },
                        param: {
                            "customerCode": "",
                            "customerName": "",
                            "endDocDate": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "startDocDate": "",
                            "yearWeek": 0
                        },
                    },
                    sub: {
                        key: 'yearWeek',
                        url: __URL.sale + 'salesUnfinishedOrder/findForWeek',
                        words: {
                            title: ['weekShowName'],
                        },
                        param: {
                            "customerCode": "",
                            "customerName": "",
                            "endDocDate": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "startDocDate": "",
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
            hasNub: false,
            hasChild: true,
        },
        /* 
         * filter 配置
         */
        filterCfg: [{
            label: '客户名称:',
            key: 'customerName',
            value: '',
            type: 'text',
            placeholder: '请输入客户名称'
        }, {
            label: '结束时间:',
            key: 'endDocDate',
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
        //operating: [true, { type: 0 }],
        // radio: [true, 'docNo'],
        serial:true,
        width: [2, 4, 3, 3, 3, 3, 3], //排除序号，多选，单选，操作栏
        match: [
            { key: 'feRemark', href: true },
            { key: 'docNo', href: true },
            'employeeName',
            ['inventoryName','inventorySpec'],
            'quantity',
            [{prefix: '即时:', key: 'stockQuantity'}, {prefix: '可用:', key: 'abledStockQty'}],
            'deliveryDate',
        ],
        head: ['跟单','销售单号', '业务员', '货品信息', '数量', '库存', '交货日期'],
        newline: [1],
    },
}
