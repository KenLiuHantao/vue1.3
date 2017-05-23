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
                name: '待退货',
                icon: '',
                params: {
                    main: {
                        key: 'dayShowName',
                        url: __URL.sale + 'salesSuspenseInbound/findForDay',
                        words: {
                            title: ['dayShowName'],
                            right: 'orderQuantity',
                            sub: [ ]
                        },
                        param: { },
                    },
                    sub: {
                        key: 'customerCode',
                        url: __URL.sale + 'salesSuspenseInbound/findForCustomer',
                        words: {
                            title: ['customerName'],
                            right: 'orderQuantity',
                            sub: []
                        },
                        param: {
                            'docDate': ''
                        }
                    }
                }
            }, {
                id: 'tab2',
                name: '已完成',
                icon: '',
                params: {
                    main: {
                        key: 'yearMonth',
                        url: __URL.warehouse + 'return/outbound/query/months',
                        words: {
                            title: ['month'],
                            right: 'total',
                            sub: [ ]
                        },
                        param: { },
                    },
                    sub: {
                        key: 'customerCode',
                        url: __URL.warehouse + 'return/outbound/query/customer',
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
            label: '退货单号:',
            key: 'docNo',
            value: '',
            type: 'text',
            placeholder: '请输入退货单号'
        }, {
            label: '退货开始日期:',
            key: 'startDocDate',
            value: '',
            type: 'date',
            placeholder: '123'
        }, {
            label: '退货结束日期:',
            key: 'endDocDate',
            value: '',
            type: 'date',
            placeholder: ''
        }, {
            label: '供应商:',
            key: 'supplierName',
            value: '',
            type: 'text',
            placeholder: '请输入供应商'
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
    waitReturnOutboundTableCfg: {
        serial: true,
        width: [5,5,5,5], //排除序号，多选，单选，操作栏
        match: [
            [{key: 'docNo', href: true }],
            'warehouseName','',''
        ],
        head: ['退货通知单号','仓库','','']
    },
    returnOutboundTableCfg: {
        serial: true,
        width: [5,5,5,5], //排除序号，多选，单选，操作栏
        match: [
            [{key:'srcDocNo',href:true},],
            'warehouseName','',''
        ],
        head: ['退货通知单号','仓库','','']
    }
}
