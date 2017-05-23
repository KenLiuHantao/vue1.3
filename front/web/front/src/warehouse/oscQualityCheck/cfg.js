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
                name: '未收货',
                icon: '',
                params: {
                    main: {
                        key: 'supplierCode',
                        url: __URL.warehouse + 'wait/receive/query/suppliers/for/osc',
                        words: {
                            title: ['supplierName'],
                            right: 'total',
                            sub: [ ]
                        },
                        param: { },
                    },
                    sub: {
                        key: 'date',
                        url: __URL.warehouse + 'wait/receive/query/dates/for/osc',
                        words: {
                            title: ['date'],
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
                name: '待品检',
                icon: '',
                params: {
                    main: {
                        key: 'date',
                        url: __URL.warehouse + 'receive/query/dates/for/osc',
                        words: {
                            title: ['date'],
                            right: 'total',
                            sub: []
                        },
                        param: {},
                    },
                    sub: {
                        key: 'supplierCode',
                        url: __URL.warehouse + 'receive/query/suppliers/for/osc',
                        words: {
                            title: ['supplierName'],
                            right: 'total',
                            sub: []
                        },
                        param: {
                            'date': ''
                        }
                    }
                }
            }, {
                id: 'tab3',
                name: '已通过',
                icon: '',
                params: {
                    main: {
                        key: 'month',
                        url: __URL.warehouse + 'osc/quality/check/query/month',
                        words: {
                            title: ['month'],
                            right: 'total',
                            sub: [ ]
                        },
                        param: { },
                    },
                    sub: {
                        key: 'supplierCode',
                        url: __URL.warehouse + 'osc/quality/check/query/suppliers',
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
            },{
                id: 'tab4',
                name: '判退收',
                icon: '',
                params: {
                    main: {
                        key: 'date',
                        url: __URL.warehouse + 'wait/return/receive/query/dates/for/osc',
                        words: {
                            title: ['date'],
                            right: 'total',
                            sub: [ ]
                        },
                        param: { },
                    },
                    sub: {
                        key: 'supplierCode',
                        url: __URL.warehouse + 'wait/return/receive/query/suppliers/for/osc',
                        words: {
                            title: ['supplierName'],
                            right: 'total',
                            sub: []
                        },
                        param: {
                            'date': ''
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
            label: '采购单号:',
            key: 'purchaseDocNo',
            value: '',
            type: 'text',
            placeholder: '请输入采购单号'
        }, {
            label: '采购开始日期:',
            key: 'startDocDate',
            value: '',
            type: 'date',
            placeholder: '123'
        }, {
            label: '采购结束日期:',
            key: 'endDocDate',
            value: '',
            type: 'date',
            placeholder: ''
        }, {
            label: '采购员:',
            key: 'purchaseEmployeeCode',
            value: '',
            type: 'text',
            placeholder: '请输入采购员'
        }, {
            label: '供应商:',
            key: 'supplierName',
            value: '',
            type: 'text',
            placeholder: '请输入供应商'
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
    waitReceiveTableCfg: {
        serial: true,
        width: [18], //排除序号，多选，单选，操作栏
        match: [
            [{ key: 'docNo', href: true }]
        ],
        head: ['委外采购单号']
    },
    waitQualityCheckTableCfg: {
        // operating: [true, 'config-operate',
        //     [{
        //         type: 'normal',
        //         btn: 'check',
        //         text: '品检'
        //     }]
        // ],
        serial: true,
        width: [20], //排除序号，多选，单选，操作栏
        match: [
            [{ key: 'purchaseDocNo', href: true }]
        ],
        head: ['委外采购单号']
    },
    qualityCheckTableCfg: {
        serial: true,
        width: [18], //排除序号，多选，单选，操作栏
        match: [
            [{ key: 'docNo', href: true }]
        ],
        head: ['品质检验单号']
    },
    waitReturnReceiveTableCfg: {
        serial: true,
        width: [18], //排除序号，多选，单选，操作栏
        match: [
            [{ key: 'docNo', href: true }]
        ],
        head: ['品质检验单号']
    }
}
