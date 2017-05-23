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
                name: '待发货',
                icon: '',
                params: {
                    main: {
                        key: 'docDate',
                        url: __URL.sale + 'salesSuspenseOutbound/findForDay',
                        words: {
                            title: ['dayShowName'],
                            right: 'orderQuantity',
                            sub: []
                        },
                        param: {

                        }
                    },
                    sub: {
                        key: 'customerCode',
                        url: __URL.sale + 'salesSuspenseOutbound/findForCustomer',
                        words: {
                            title: ['customerName'],
                            right: 'orderQuantity',
                            sub: [ ]
                        },
                        param: {
                            'docDate': ''
                        },
                    }
                }
            }, {
                id: 'tab2',
                name: '发货确认',
                icon: '',
                params: {
                    main: {
                        key: 'yearMonth',
                        url: __URL.warehouse + 'outbound/query/months/confirm',
                        words: {
                            title: ['month'],
                            right: 'total',
                            sub: [ ]
                        },
                        param: { },
                    },
                    sub: {
                        key: 'customerCode',
                        url: __URL.warehouse + 'outbound/query/customers/confirm',
                        words: {
                            title: ['customerName'],
                            right: 'total',
                            sub: []
                        },
                        param: {
                            'yearMonth': ''
                        }
                    }
                }
            }, {
                id: 'tab3',
                name: '已发货',
                icon: '',
                params: {
                    main: {
                        key: 'yearMonth',
                        url: __URL.warehouse + 'outbound/query/months/shipped',
                        words: {
                            title: ['month'],
                            right: 'total',
                            sub: [ ]
                        },
                        param: { },
                    },
                    sub: {
                        key: 'customerCode',
                        url: __URL.warehouse + 'outbound/query/customers/shipped',
                        words: {
                            title: ['customerName'],
                            right: 'total',
                            sub: []
                        },
                        param: {
                            'yearMonth': ''
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
            label: '发货单号:',
            key: 'dispatchDocNo',
            value: '',
            type: 'text',
            placeholder: '请输入发货单号'
        }, {
            label: '发货开始日期:',
            key: 'startDocDate',
            value: '',
            type: 'date',
            placeholder: '123'
        }, {
            label: '发货开始日期:',
            key: 'endDocDate',
            value: '',
            type: 'date',
            placeholder: ''
        }, {
            label: '客户:',
            key: 'customerName',
            value: '',
            type: 'text',
            placeholder: '请输入客户'
        }, {
            label: '销售单号:',
            key: 'salesOrderDocNo',
            value: '',
            type: 'text',
            placeholder: '请输入销售单号'
        }, {
            label: '客户单号:',
            key: 'customerDocNo',
            value: '',
            type: 'text',
            placeholder: '请输入客户单号'
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
            label: '规格型号:',
            key: 'inventorySpec',
            value: '',
            type: 'text',
            placeholder: '请输入规格型号'
        }]
    },
    /* 
     * table 配置
     */
    waitDispatchTableCfg: {
        //checkbox: [true, 'recordId'],
        serial: true,
        width: [4, 4, 4, 4, 4], //排除序号，多选，单选，操作栏
        match: [
            {href:true,key:'docNo'},
            'docDate',
            'customerName',
            'warehouseName',
            'salesOrderDocNo'
        ],
        head: ['发货单号', '发货日期', '客户', '仓库', '销售单号']
    },
    confirmDispatchTableCfg: {
        //operating: [true, 'config-operate',
        //    [{
        //        type: 'normal',
        //        btn: 'confirm',
        //        text: '发货确认'
        //    }]
        //],
        serial: true,
        width: [5, 5, 5, 5, 5], //排除序号，多选，单选，操作栏
        match: [
            {href:true,key:'dispatchDocNo'},
            'dispatchDocDate',
            'customerName',
            'warehouseName',
            'salesOrderDocNo'
        ],
        head: ['发货单号', '发货日期', '客户', '仓库', '销售单号']
    },
    shippedDispatchTableCfg: {
        serial: true,
        width: [5, 5, 5, 5, 5], //排除序号，多选，单选，操作栏
        match: [
            {href:true,key:'dispatchDocNo'},
            'dispatchDocDate',
            'customerName',
            'warehouseName',
            'salesOrderDocNo'
        ],
        head: ['发货单号', '发货日期', '客户', '仓库', '销售单号']
    }
}
