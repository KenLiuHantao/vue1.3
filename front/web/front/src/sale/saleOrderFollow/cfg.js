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
                id: 'completion',
                name: '未完工',
                icon: '',
                params: {
                    main: {
                        key: 'yearWeek',
                        url: __URL.sale + 'salesOrderFollowing/findNonCompletionListForWeek',
                        words: {
                            title: ['weekShowName'],
                            right:'orderQuantity'
                        },
                        param: {
                            "customerCode": "",
                            "customerName": "",
                            "customerOrderDocNo": "",
                            "docNo": "",
                            "employeeName": "",
                            "endDeliveryDate": "",
                            "endDocDate": "",
                            "inventoryCode": "",
                            "inventoryName": "",
                            "inventorySpec": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "startDeliveryDate": "",
                            "startDocDate": "",
                            "yearMonth": 0,
                        },
                    },
                    sub: {
                        key: 'customerCode',
                        url: __URL.sale + 'salesOrderFollowing/findNonCompletionListForCustomer',
                        words: {
                            title: ['customerName'],
                            right:'orderQuantity'
                        },
                        param: {
                            "customerCode": "",
                            "customerName": "",
                            "customerOrderDocNo": "",
                            "docNo": "",
                            "employeeName": "",
                            "endDeliveryDate": "",
                            "endDocDate": "",
                            "inventoryCode": "",
                            "inventoryName": "",
                            "inventorySpec": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "startDeliveryDate": "",
                            "startDocDate": "",
                            "yearMonth": 0,
                            "yearWeek": 0
                        }
                    }
                }
            }, {
                id: 'inbound',
                name: '已入库',
                icon: '',
                params: {
                    main: {
                        key: 'yearWeek',
                        url: __URL.sale + 'salesOrderFollowing/findInboundListForWeek',
                        words: {
                            title: ['weekShowName'],
                            right:'orderQuantity'
                        },
                        param: {
                            "customerCode": "",
                            "customerName": "",
                            "customerOrderDocNo": "",
                            "docNo": "",
                            "employeeName": "",
                            "endDeliveryDate": "",
                            "endDocDate": "",
                            "inventoryCode": "",
                            "inventoryName": "",
                            "inventorySpec": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "startDeliveryDate": "",
                            "startDocDate": "",
                            "yearMonth": 0,
                            "yearWeek": 0
                        },
                    },
                    sub: {
                        key: 'customerCode',
                        url: __URL.sale + 'salesOrderFollowing/findInboundListForCustomer',
                        words: {
                            title: ['customerName'],
                            right:'orderQuantity'
                        },
                        param: {
                            "customerCode": "",
                            "customerName": "",
                            "customerOrderDocNo": "",
                            "docNo": "",
                            "employeeName": "",
                            "endDeliveryDate": "",
                            "endDocDate": "",
                            "inventoryCode": "",
                            "inventoryName": "",
                            "inventorySpec": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "startDeliveryDate": "",
                            "startDocDate": "",
                            "yearMonth": 0,
                            "yearWeek": 0
                        }
                    }
                }
            }, {
                id: 'dispatching',
                name: '发货中',
                icon: '',
                params: {
                    main: {
                        key: 'yearWeek',
                        url: __URL.sale + 'salesOrderFollowing/findDispatchingListForWeek',
                        words: {
                            title: ['weekShowName'],
                            right:'orderQuantity'
                        },
                        param: {
                            "customerCode": "",
                            "customerName": "",
                            "customerOrderDocNo": "",
                            "docNo": "",
                            "employeeName": "",
                            "endDeliveryDate": "",
                            "endDocDate": "",
                            "inventoryCode": "",
                            "inventoryName": "",
                            "inventorySpec": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "startDeliveryDate": "",
                            "startDocDate": "",
                            "yearMonth": 0,
                            "yearWeek": 0
                        },
                    },
                    sub: {
                        key: 'customerCode',
                        url: __URL.sale + 'salesOrderFollowing/findDispatchingListForCustomer',
                        words: {
                            title: ['customerName'],
                            right:'orderQuantity'
                        },
                        param: {
                            "customerCode": "",
                            "customerName": "",
                            "customerOrderDocNo": "",
                            "docNo": "",
                            "employeeName": "",
                            "endDeliveryDate": "",
                            "endDocDate": "",
                            "inventoryCode": "",
                            "inventoryName": "",
                            "inventorySpec": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "startDeliveryDate": "",
                            "startDocDate": "",
                            "yearMonth": 0,
                            "yearWeek": 0
                        }
                    }
                }
            }, {
                id: 'dispatched',
                name: '已发货',
                icon: '',
                params: {
                    main: {
                        key: 'yearMonth',
                        url: __URL.sale + 'salesOrderFollowing/findDoneDispatchListForMonth',
                        words: {
                            title: ['monthShowName'],
                            right:'orderQuantity'
                        },
                        param: {
                            "customerCode": "",
                            "customerName": "",
                            "customerOrderDocNo": "",
                            "docNo": "",
                            "employeeName": "",
                            "endDeliveryDate": "",
                            "endDocDate": "",
                            "inventoryCode": "",
                            "inventoryName": "",
                            "inventorySpec": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "startDeliveryDate": "",
                            "startDocDate": "",
                            "yearMonth": 0,
                            "yearWeek": 0
                        },
                    },
                    sub: {
                        key: 'customerCode',
                        url: __URL.sale + 'salesOrderFollowing/findDoneDispatchListForCustomer',
                        words: {
                            title: ['customerName'],
                            right:'orderQuantity'
                        },
                        param: {
                            "customerCode": "",
                            "customerName": "",
                            "customerOrderDocNo": "",
                            "docNo": "",
                            "employeeName": "",
                            "endDeliveryDate": "",
                            "endDocDate": "",
                            "inventoryCode": "",
                            "inventoryName": "",
                            "inventorySpec": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "startDeliveryDate": "",
                            "startDocDate": "",
                            "yearMonth": 0,
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
            label: '客户名称:',
            key: 'customerName',
            value: '',
            type: 'text',
            placeholder: '请输入客户名称'
        }, {
            label: '开始时间:',
            key: 'startDocDate',
            value: '',
            type: 'date',
            placeholder: ''
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
        serial: true,
        width: [5, 15], //排除序号，多选，单选，操作栏
        match: [
            { key: 'docNo', href: true },
            'employeeName',
        ],
        head: ['销售单号', '业务员'],
    },
    
}
