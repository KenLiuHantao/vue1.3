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
                    name: '待变更',
                    icon: '',
                    params: {
                        main: {
                            key: 'date',
                            url: __URL.purchase + 'outsource/change/await/query/days',
                            words: {
                                title: ['date'],
                                right:'total',
                                sub: []
                            },
                            param: { },
                        },
                        sub: {
                            key: 'saleOrderDocNo',
                            url: __URL.purchase + 'outsource/change/await/query/docnos',
                            words: {
                                title: ['saleOrderDocNo'],
                                right:'total',
                                sub: []
                            },
                            param: {
                                'date': ''
                            }
                        }
                    }
                }, {
                    id: 'tab2',
                    name: '已变更',
                    icon: '',
                    params: {
                        main: {
                            key: 'yearMonth',
                            url: __URL.purchase + 'outsource/change/query/months',
                            words: {
                                title: ['month'],
                                right:'total',
                                sub: []
                            },
                            param: { },
                        },
                        sub: {
                            key: 'supplierCode',
                            url: __URL.purchase + 'outsource/change/query/suppliers',
                            words: {
                                title: ['supplierName'],
                                right:'total',
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
            label: '委外采购单号:',
            key: 'docNo',
            value: '',
            type: 'text',
            placeholder: '请输入委外采购单号'
        }, {
            label: '委外采购日期(从):',
            key: 'beginDocDate',
            value: '',
            type: 'date',
            placeholder: '请选择开始日期',
            config: {
                format: 'YYYY-MM-DD'
            }
        }, {
            label: '委外采购日期(到):',
            key: 'endDocDate',
            value: '',
            type: 'date',
            placeholder: '请选择结束日期',
            config: {
                format: 'YYYY-MM-DD'
            }
        }, {
            label: '供应商:',
            key: 'supplierName',
            value: '',
            type: 'search',
            emit: 'supplier',
            placeholder: '请选择供应商'
        }, {
            label: '变更日期(从):',
            key: 'beginChangeDate',
            value: '',
            type: 'date',
            placeholder: '请选择开始时间',
            config: {
                format: 'YYYY-MM-DD'
            }
        }, {
            label: '变更日期(到):',
            key: 'endChangeDate',
            value: '',
            type: 'date',
            placeholder: '请选择结束时间',
            config: {
                format: 'YYYY-MM-DD'
            }
        }, {
            label: '需求日期(从):',
            key: 'beginDemandDate',
            value: '',
            type: 'date',
            placeholder: '请选择开始日期',
            config: {
                format: 'YYYY-MM-DD'
            }
        }, {
            label: '需求日期(到):',
            key: 'endDemandDate',
            value: '',
            type: 'date',
            placeholder: '请选择结束日期',
            config: {
                format: 'YYYY-MM-DD'
            }
        }, {
            label: '交期(从):',
            key: 'beginDeliveryDate',
            value: '',
            type: 'date',
            placeholder: '请选择开始日期',
            config: {
                format: 'YYYY-MM-DD'
            }
        }, {
            label: '交期(到):',
            key: 'endDeliveryDate',
            value: '',
            type: 'date',
            placeholder: '请选择结束日期',
            config: {
                format: 'YYYY-MM-DD'
            }
        }, {
            label: '客户单号:',
            key: 'customerDocNo',
            value: '',
            type: 'text',
            placeholder: '请输入客户单号'
        }]
    },

    /* 
     * table 配置
     */
    listParam: {
        'pageIndex': 0,
        'pageSize': 0,
        'docNo': '',
        'beginDocDate': '',
        'endDocDate': '',
        'supplierCode': '',
        'beginChangeDate': '',
        'endChangeDate': '',
        'beginDemandDate': '',
        'endDemandDate': '',
        'beginDeliveryDate': '',
        'endDeliveryDate': '',
        'inventoryId': '',
        'saleOrderDocNo': '',
        'customerDocNo': '',
        'yearWeek': ''
    },
    awaitTableCfg: {
        serial: true,
        width: [5, 5, 5, 4], //排除序号，多选，单选，操作栏
        match: [
            {key: 'docNo', href: true},
            'docDate',
            'supplierName',
            'changeInfo'
        ],
        head: ['委外采购单号', '委外采购日期', '供应商', '销售订单变更信息'],
    },
    changeTableCfg: {
        operating: [true, 'config-operate',
            [{
                type: 'normal',
                btn: 'operate',
                text: '跟单备注'
            }]
        ],
        serial: true,
        width: [5, 15], //排除序号，多选，单选，操作栏
        match: [
            {key: 'docNo', href: true},
            'changeDate'
        ],
        head: ['委外采购单号', '变更日期'],
    },
}
