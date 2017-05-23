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
                name: '待退料',
                icon: '',
                params: {
                    main: {
                        key: 'yearMonth',
                        url: __URL.manufacture + 'warehouse/material/return/yearMonth',
                        words: {
                            title: ['parsedYearMonth'],
                            right: 'countDocNo',
                            sub: []
                        },
                        param: {
                            status:0
                        },
                    },
                    sub: {
                        key: 'processCode',
                        url: __URL.manufacture + 'warehouse/material/return/process',
                        words: {
                            title: ['processName'],
                            right: 'countDocNo',
                            sub: []
                        },
                        param: {
                            'yearMonth': '',
                             status:0
                        }
                    }
                }
            }, {
                id: 'tab2',
                name: '已退料',
                icon: '',
                params: {
                    main: {
                        key: 'yearMonth',
                        url: __URL.manufacture + 'warehouse/material/return/yearMonth',
                        words: {
                            title: ['parsedYearMonth'],
                            right: 'countDocNo',
                            sub: []
                        },
                        param: {
                            status:1
                        },
                    },
                    sub: {
                        key: 'processCode',
                        url: __URL.manufacture + 'warehouse/material/return/process',
                        words: {
                            title: ['processName'],
                            right: 'countDocNo',
                            sub: []
                        },
                        param: {
                            'yearMonth': '',
                            status:1
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
            key: 'productionDocNo',
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
        width: [4, 4, 4, 8], //排除序号，多选，单选，操作栏
        match: [
            {href:true,key:'docNo'},
            'sourceName',
            'employeeName',
            'applyTime'
        ],
        head: ['生产退料单号', '退料类型', '申请人','退料日期']
    },
    prepareTableCfg: {
        serial: true,
        width: [4, 4, 4, 8], //排除序号，多选，单选，操作栏
        match: [
            {href:true,key:'docNo'},
            'sourceName',
            'employeeName',
            'applyTime'
        ],
        head: ['生产退料单号', '退料类型', '申请人','退料日期']
    }
}
