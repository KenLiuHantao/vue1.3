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
                name: '待补料',
                icon: '',
                params: {
                    main: {
                        key: 'docDate',
                        url: __URL.manufacture + 'production/material/add/date',
                        words: {
                            title: ['docDate'],
                            right: 'countDocNo',
                            sub: []
                        },
                        param: {
                            'status': 0
                        },
                    },
                    sub: {
                        key: 'processCode',
                        url: __URL.manufacture + 'production/material/add/process',
                        words: {
                            title: ['processName'],
                            right: 'countDocNo',
                            sub: []
                        },
                        param: {
                            'docDate': '',
                            'status': 0
                        }
                    }
                }
            }, {
                id: 'tab2',
                name: '已备料',
                icon: '',
                params: {
                    main: {
                        key: 'docDate',
                        url: __URL.manufacture + 'production/material/add/date',
                        words: {
                            title: ['docDate'],
                            right: 'countDocNo',
                            sub: []
                        },
                        param: {
                            'status': 1
                        },
                    },
                    sub: {
                        key: 'processCode',
                        url: __URL.manufacture + 'production/material/add/process',
                        words: {
                            title: ['processName'],
                            right: 'countDocNo',
                            sub: []
                        },
                        param: {
                            'docDate': '',
                            'status': 1
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
                        url: __URL.manufacture + 'production/material/add/yearMonth',
                        words: {
                            title: ['parsedYearMonth'],
                            right: 'countDocNo',
                            sub: []
                        },
                        param: {
                            'status': 2
                        },
                    },
                    sub: {
                        key: 'processCode',
                        url: __URL.manufacture + 'production/material/add/process',
                        words: {
                            title: ['processName'],
                            right: 'countDocNo',
                            sub: []
                        },
                        param: {
                            'yearMonth': '',
                            'status': 2
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
            label: '生产补料单号:',
            key: 'docNo',
            value: '',
            type: 'text',
            placeholder: '请输入生产补料单号'
        }, {
            label: '生产补料开始日期:',
            key: 'startDocDate',
            value: '',
            type: 'date',
            placeholder: '123'
        }, {
            label: '生产补料结束日期:',
            key: 'endDocDate',
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
            'docDate',
            'employeeName'
        ],
        head: ['生产补料单号', '申请时间', '申请人']
    },
    prepareTableCfg: {
        serial: true,
        width: [6, 6, 6], //排除序号，多选，单选，操作栏
        match: [
            {href:true,key:'docNo'},
            'docDate',
            'employeeName',
            'preTime'
        ],
        head: ['生产补料单号', '申请时间', '申请人', '备料时间']
    },
    issueTableCfg: {
        serial: true,
        width: [18], //排除序号，多选，单选，操作栏
        match: [
            {href:true,key:'docNo'},
            'docDate',
            'employeeName'
        ],
        head: ['生产补料单号', '申请时间', '申请人']
    }
}
