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
                    name: '待下单',
                    icon: '',
                    params: {
                        main: {
                            key: 'yearWeek',
                            url: __URL.purchase + 'order/await/query/weeks',
                            words: {
                                title: ['week', '(', 'weekBeginDate', ' ~ ', 'weekEndDate', ')'],
                                right:'count',
                                sub: []
                            },
                            param: { },
                        },
                        sub: {
                            key: 'supplierCode',
                            url: __URL.purchase + 'order/await/query/suppliers',
                            words: {
                                title: ['supplierName'],
                                right:'count',
                                sub: []
                            },
                            param: {
                                'yearWeek': ''
                            }
                        }
                    }
                },
                {
                    id: 'tab2',
                    name: '待交货',
                    icon: '',
                    params: {
                        main: {
                            key: 'yearWeek',
                            url: __URL.purchase + 'order/unfinished/query/weeks',
                            words: {
                                title: ['week', '(', 'weekBeginDate', ' ~ ', 'weekEndDate', ')'],
                                right:'count',
                                sub: []
                            },
                            param: { },
                        },
                        sub: {
                            key: 'supplierCode',
                            url: __URL.purchase + 'order/unfinished/query/suppliers',
                            words: {
                                title: ['supplierName'],
                                right:'count',
                                sub: []
                            },
                            param: {
                                'yearWeek': ''
                            }
                        }
                    }
                },
                {
                    id: 'tab3',
                    name: '已完成',
                    icon: '',
                    params: {
                        main: {
                            key: 'yearWeek',
                            url: __URL.purchase + 'order/finished/query/weeks',
                            words: {
                                title: ['week', '(', 'weekBeginDate', ' ~ ', 'weekEndDate', ')'],
                                right:'count',
                                sub: []
                            },
                            param: { },
                        },
                        sub: {
                            key: 'supplierCode',
                            url: __URL.purchase + 'order/finished/query/suppliers',
                            words: {
                                title: ['supplierName'],
                                right:'count',
                                sub: []
                            },
                            param: {
                                'yearWeek': ''
                            }
                        }
                    }
                }
            ]
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
            key: 'docNo',
            value: '',
            type: 'text',
            placeholder: '请输入采购单号'
        }, {
            label: '采购日期(从):',
            key: 'beginDocDate',
            value: '',
            type: 'date',
            placeholder: '请选择开始日期',
            config: {
                format: 'YYYY-MM-DD'
            }
        }, {
            label: '采购日期(到):',
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
            label: '请购时间(从):',
            key: 'beginApplyDate',
            value: '',
            type: 'date',
            placeholder: '请选择开始时间',
            config: {
                format: 'YYYY-MM-DD'
            }
        }, {
            label: '请购时间(到):',
            key: 'endApplyDate',
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
        'beginApplyDate': '',
        'endApplyDate': '',
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
            'saleOrderDocNo',
            function(item) {
                return '<label style="color:red">' + item['remark'] + '</label>';
            }
        ],
        head: ['请购单号', '请购时间', '销售单号', '备注'],
    },
    awaitCheckTableCfg: {
        checkbox: [true, 'docDate'],
        serial: true,
        width: [5, 5, 5, 4], //排除序号，多选，单选，操作栏
        match: [
            {key: 'docNo', href: true},
            'docDate',
            'saleOrderDocNo',
            function(item) {
                return '<label style="color:red">' + item['remark'] + '</label>';
            }
        ],
        head: ['请购单号', '请购时间', '销售单号', '备注'],
    },
    unfinishedTableCfg: {
        operating: [true, 'config-operate',
            [{
                type: 'normal',
                btn: 'operate',
                text: '跟单备注'
            }]
        ],
        width: [5, 15], //排除序号，多选，单选，操作栏
        serial: true,
        match: [
            {key: 'docNo', href: true},
            'docDate'
        ],
        head: ['采购单', '采购日期'],
    },
    finishedTableCfg: {
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
            'docDate'
        ],
        head: ['采购单', '采购日期'],
    },
}
