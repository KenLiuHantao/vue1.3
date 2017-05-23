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
                name: '待备料',
                icon: '',
                params: {
                    main: {
                        key: 'docDate',
                        url: __URL.manufacture + 'production/prepare/findDayList',
                        words: {
                            title: ['docDate'],
                            right: 'countDocNo',
                            sub: []
                        },
                        param: {},
                    },
                    sub: {
                        key: 'processCode',
                        url: __URL.manufacture + 'production/prepare/findProcessList',
                        words: {
                            title: ['processName'],
                            right: 'countDocNo',
                            sub: []
                        },
                        param: {
                            'docDate': ''
                        }
                    }
                }
            }, {
                id: 'tab2',
                name: '已备料',
                icon: '',
                params: {
                    main: {
                        key: 'date',
                        url: __URL.warehouse + 'material/prepare/query/dates',
                        words: {
                            title: ['date'],
                            right: 'total',
                            sub: []
                        },
                        param: {},
                    },
                    sub: {
                        key: 'processCode',
                        url: __URL.warehouse + 'material/prepare/query/processes',
                        words: {
                            title: ['processName'],
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
                name: '已发料',
                icon: '',
                params: {
                    main: {
                        key: 'yearMonth',
                        url: __URL.manufacture + 'prepare/yearMonth',
                        words: {
                            title: ['parsedYearMonth'],
                            right: 'countDocNo',
                            sub: []
                        },
                        param: {},
                    },
                    sub: {
                        key: 'processCode',
                        url: __URL.manufacture + 'prepare/process',
                        words: {
                            title: ['processName'],
                            right: 'countDocNo',
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
            label: '备料/发料单号:',
            key: 'docNo',
            value: '',
            type: 'text',
            placeholder: '请输入备料/发料单号'
        }, {
            label: '备料/发料开始日期:',
            key: 'startDocDate',
            value: '',
            type: 'date',
            placeholder: '123'
        }, {
            label: '备料/发料结束日期:',
            key: 'endDocDate',
            value: '',
            type: 'date',
            placeholder: ''
        }, {
            label: '备料/发料员:',
            key: 'employeeCode',
            value: '',
            type: 'text',
            placeholder: '请输入备料/发料员'
        }, {
            label: '生产单号:',
            key: 'srcDocNo',
            value: '',
            type: 'text',
            placeholder: '请输入生产单号'
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
    waitPrepareTableCfg: {
        serial: true,
        width: [6, 6, 6], //排除序号，多选，单选，操作栏
        match: [
            {href:true,key:'docNo'},
            'warehouseName',
            'docDate'
        ],
        head: ['生产订单号', '仓库', '下达生产时间']
    },
    prepareTableCfg: {
        serial: true,
        width: [6, 6, 6], //排除序号，多选，单选，操作栏
        match: [
            {href:true,key:'docNo'},
            'docDate',
            'warehouseName'
        ],
        head: ['生产备料单号', '生产备料日期', '仓库']
    },
    issueTableCfg: {
        serial: true,
        width: [18], //排除序号，多选，单选，操作栏
        match: [
            {href:true,key:'docNo'},
            'docDate',
            'warehouseName'
        ],
        head: ['生产发料单号', '生产发料日期', '仓库']
    }
}
