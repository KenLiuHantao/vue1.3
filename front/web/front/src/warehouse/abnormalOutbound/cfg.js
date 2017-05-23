export default {
    leftItemCfg: {
        headCfg: {
            add: true,
            filter: false
        },
        /*
         * tab 配置
         */
        tabCfg: {
            select: '',
            tabBarData: [{
                id: 'tab1',
                name: '草稿箱',
                icon: '',
                params: {
                    main: {
                        key: 'yearWeek',
                        url: __URL.warehouse + 'abnormal/outbound/query/weeks/draft',
                        words: {
                            title: ['week', '(', 'weekBeginDate', ' ~ ', 'weekEndDate', ')'],
                            right: 'total'
                        },
                        param: {},
                    },
                    sub: {
                        key: 'warehouseCode',
                        url: __URL.warehouse + 'abnormal/outbound/query/warehouse/draft',
                        words: {
                            title: ['warehouseName'],
                            right: 'total',
                            sub: []
                        },
                        param: {
                            'yearWeek': ''
                        }
                    }
                }
            }, {
                id: 'tab2',
                name: '未审核',
                icon: '',
                params: {
                    main: {
                        key: 'yearWeek',
                        url: __URL.warehouse + 'abnormal/outbound/query/weeks/unaudit',
                        words: {
                            title: ['week', '(', 'weekBeginDate', ' ~ ', 'weekEndDate', ')'],
                            right: 'total'
                        },
                        param: {},
                    },
                    sub: {
                        key: 'warehouseCode',
                        url: __URL.warehouse + 'abnormal/outbound/query/warehouse/unaudit',
                        words: {
                            title: ['warehouseName'],
                            right: 'total',
                            sub: []
                        },
                        param: {
                            'yearWeek': ''
                        }
                    }
                }
            }, {
                id: 'tab3',
                name: '已审核',
                icon: '',
                params: {
                    main: {
                        key: 'yearMonth',
                        url: __URL.warehouse + 'abnormal/outbound/query/months/audit',
                        words: {
                            title: ['month'],
                            right: 'total'
                        },
                        param: {},
                    },
                    sub: {
                        key: 'warehouseCode',
                        url: __URL.warehouse + 'abnormal/outbound/query/warehouse/audit',
                        words: {
                            title: ['warehouseName'],
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
        filterCfg: []
    },
    /*
     * table 配置
     */
    draftTableCfg: {
        serial: true,
        width: [5, 5, 5, 5], //排除序号，多选，单选，操作栏
        match: [
            [{key: 'docNo', href: true}],
            'docDate',
            'ioCategory'
        ],
        head: ['非正常出库单号', '出库日期', '收发类型']
    },
    unauditTableCfg: {
        serial: true,
        width: [5, 5, 5, 5], //排除序号，多选，单选，操作栏
        match: [
            [{key: 'docNo', href: true}],
            'docDate',
            'ioCategory'
        ],
        head: ['非正常出库单号', '出库日期', '收发类型']
    },
    auditTableCfg: {
        serial: true,
        width: [5, 5, 5, 5], //排除序号，多选，单选，操作栏
        match: [
            [{key: 'docNo', href: true}],
            'docDate',
            'ioCategory'
        ],
        head: ['非正常出库单号', '出库日期', '收发类型']
    }
}
