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
                name: '待入库',
                icon: '',
                params: {
                    main: {
                        key: 'supplierCode',
                        url: __URL.warehouse + 'product/receipt/query/suppliers',
                        words: {
                            title: ['supplierName'],
                            right: 'total',
                            sub: [ ]
                        },
                        param: { },
                    },
                    sub: {
                        key: 'yearWeek',
                        url: __URL.warehouse + 'product/receipt/query/weeks',
                        words: {
                            title: ['week', '(', 'weekBeginDate', ' ~ ', 'weekEndDate', ')'],
                            right: 'total',
                            sub: []
                        },
                        param: {
                            'supplierCode': ''
                        }
                    }
                }
            }, {
                id: 'tab2',
                name: '已入库',
                icon: '',
                params: {
                    main: {
                        key: 'yearMonth',
                        url: __URL.warehouse + 'product/inbound/query/months',
                        words: {
                            title: ['month'],
                            right: 'total',
                            sub: [ ]
                        },
                        param: { },
                    },
                    sub: {
                        key: 'supplierCode',
                        url: __URL.warehouse + 'product/inbound/query/suppliers',
                        words: {
                            title: ['supplierName'],
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
            label: '入库单号:',
            key: 'docNo',
            value: '',
            type: 'text',
            placeholder: '请输入入库单号'
        }, {
            label: '入库开始日期:',
            key: 'startDocDate',
            value: '',
            type: 'date',
            placeholder: '123'
        }, {
            label: '入库结束日期:',
            key: 'endDocDate',
            value: '',
            type: 'date',
            placeholder: ''
        }, {
            label: '入库员:',
            key: 'employeeCode',
            value: '',
            type: 'text',
            placeholder: '请输入入库员'
        }, {
            label: '来源单号:',
            key: 'srcDocNo',
            value: '',
            type: 'text',
            placeholder: '请输入来源单号'
        }, {
            label: '来源单开始日期:',
            key: 'startSrcDocDate',
            value: '',
            type: 'date',
            placeholder: '123'
        }, {
            label: '来源单结束日期:',
            key: 'endSrcDocDate',
            value: '',
            type: 'date',
            placeholder: ''
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
    waitInboundTableCfg: {
        checkbox: [true, 'docNo'],
        width: [20], //排除序号，多选，单选，操作栏
        match: [
            [{key: 'docNo', href: true }]
        ],
        head: ['来源单号']
    },
    inboundTableCfg: {
        serial: true,
        width: [20], //排除序号，多选，单选，操作栏
        match: [
            [{key: 'docNo', href: true }]
        ],
        head: ['入库单号']
    }
}
