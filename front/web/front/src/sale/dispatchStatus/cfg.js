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
                id: 'tab1',
                name: '未审核',
                icon: '',
                params: {
                    main: {
                        key: 'yearWeek',
                        url: __URL.sale + 'salesDispatch/findUnauditListForWeek',
                        words: {
                            title: ['weekShowName'],
                            right:'orderQuantity',
                            sub: []
                        },
                        param: {
                            "pageIndex": 0,
                            "pageSize": 0,
                            "customerName":"",
                            "docNo":"",
                            "salesOrderDocNo":"",
                            "inventoryCode":"",
                            "inventoryName":"",
                            "startDocDate":"",
                            "endDocDate":"",
                        },
                    },
                    sub: {
                        key: 'customerCode',
                        url: __URL.sale + 'salesDispatch/findUnauditListForCustomer',
                        words: {
                            title: ['customerName'],
                            right:'orderQuantity',
                            sub: []
                        },
                        param: {
                            "pageIndex": 0,
                            "pageSize": 0,
                            "yearWeek": "",
                            "customerName":"",
                            "docNo":"",
                            "salesOrderDocNo":"",
                            "inventoryCode":"",
                            "inventoryName":"",
                            "startDocDate":"",
                            "endDocDate":"",
                        }
                    }
                }
            }, {
                id: 'tab2',
                name: '发货中',
                icon: '',
                params: {
                    main: {
                        key: 'yearWeek',
                        url: __URL.sale + 'salesDispatch/findProcessListForWeek',
                        words: {
                            title: ['weekShowName'],
                            right:'orderQuantity',
                            sub: []
                        },
                        param: {
                            "pageIndex": 0,
                            "pageSize": 0,
                            "customerName":"",
                            "docNo":"",
                            "salesOrderDocNo":"",
                            "inventoryCode":"",
                            "inventoryName":"",
                            "startDocDate":"",
                            "endDocDate":"",
                        },
                    },
                    sub: {
                        key: 'customerCode',
                        url: __URL.sale + 'salesDispatch/findProcessListForCustomer',
                        words: {
                            title: ['customerName'],
                            right:'orderQuantity',
                            sub: []
                        },
                        param: {
                            "pageIndex": 0,
                            "pageSize": 0,
                            "yearWeek": "",
                            "customerName":"",
                            "docNo":"",
                            "salesOrderDocNo":"",
                            "inventoryCode":"",
                            "inventoryName":"",
                            "startDocDate":"",
                            "endDocDate":"",
                        }
                    }
                }
            },
                {
                    id: 'tab3',
                    name: '已发货',
                    icon: '',
                    params: {
                        main: {
                            key: 'yearMonth',
                            url: __URL.sale + 'salesDispatch/findDoneListForMonth',
                            words: {
                                title: ['monthShowName'],
                                right:'orderQuantity',
                                sub: []
                            },
                            param: {
                                "pageIndex": 0,
                                "pageSize": 0,
                                "customerName":"",
                                "docNo":"",
                                "salesOrderDocNo":"",
                                "inventoryCode":"",
                                "inventoryName":"",
                                "startDocDate":"",
                                "endDocDate":"",
                            },
                        },
                        sub: {
                            key: 'customerCode',
                            url: __URL.sale + 'salesDispatch/findDoneListForCustomer',
                            words: {
                                title: ['customerName'],
                                right:'orderQuantity',
                                sub: []
                            },
                            param: {
                                "pageIndex": 0,
                                "pageSize": 0,
                                "yearMonth": "",
                                "customerName":"",
                                "docNo":"",
                                "salesOrderDocNo":"",
                                "inventoryCode":"",
                                "inventoryName":"",
                                "startDocDate":"",
                                "endDocDate":"",
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
            label: '客户:',
            key: 'customerName',
            value: '',
            type: 'text',
            placeholder: '请输入客户'
        }, {
            label: '发货单号:',
            key: 'docNo',
            value: '',
            type: 'text',
            placeholder: '请输入发货单号'
        }, {
            label: '销售单号:',
            key: 'salesOrderDocNo',
            value: '',
            type: 'text',
            placeholder: '请输入销售单号'
        }, {
            label: '货品编码:',
            key: 'inventoryCode',
            value: '',
            type: 'text',
            placeholder: '请输入货品编码'
        }, {
            label: '货品名称:',
            key: 'inventoryName',
            value: '',
            type: 'text',
            placeholder: '请输入货品名称'
        }, {
            label: '发货开始时间:',
            key: 'startDocDate',
            value: '',
            type: 'date'
        }, {
            label: '发货结束时间',
            key: 'endDocDate',
            value: '',
            type: 'date'
        },]
    },
    /* 
     * table 配置
     */
    tableCfg: {
        // checkbox: [true, 'inventoryId'],
        // operating: [true, { type: 0 }],
        // radio: [true, 'docNo'],
        //  operating: [true, { type: 2 }],
        serial: true,
        width: [3, 3, 3, 3, 3, 3], //排除序号，多选，单选，操作栏
        match: [
            [{key: 'docNo', href: true}],
            'employeeName'
        ],
        head: ['发货单号', '业务员'],
        newline: [0],
    },

    dispatchDocCfg: {
        "header": {},
        "detailList": []
    }

}
