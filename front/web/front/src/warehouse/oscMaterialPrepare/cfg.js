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
                        key: 'yearWeek',
                        url: __URL.purchase + 'outsource/prepare/await/query/weeks',
                        words: {
                            title: ['week', '(', 'weekBeginDate', ' ~ ', 'weekEndDate', ')'],
                            right: 'count',
                            sub: []
                        },
                        param: {},
                    },
                    sub: {
                        key: 'supplierCode',
                        url: __URL.purchase + 'outsource/prepare/await/query/suppliers',
                        words: {
                            title: ['supplierName'],
                            right: 'count',
                            sub: []
                        },
                        param: {
                            'yearWeek': ''
                        }
                    }
                }
            }, {
                id: 'tab2',
                name: '已备料',
                icon: '',
                params: {
                    main: {
                        key: 'yearWeek',
                        url: __URL.warehouse + 'osc/material/prepare/query/weeks',
                        words: {
                            title: ['week', '(', 'weekBeginDate', ' ~ ', 'weekEndDate', ')'],
                            right: 'total',
                            sub: []
                        },
                        param: {},
                    },
                    sub: {
                        key: 'supplierCode',
                        url: __URL.warehouse + 'osc/material/prepare/query/suppliers',
                        words: {
                            title: ['supplierName'],
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
                name: '已发料',
                icon: '',
                params: {
                    main: {
                        key: 'yearWeek',
                        url: __URL.warehouse + 'osc/material/issue/query/weeks',
                        words: {
                            title: ['week', '(', 'weekBeginDate', ' ~ ', 'weekEndDate', ')'],
                            right: 'total',
                            sub: []
                        },
                        param: {},
                    },
                    sub: {
                        key: 'supplierCode',
                        url: __URL.warehouse + 'osc/material/issue/query/suppliers',
                        words: {
                            title: ['supplierName'],
                            right: 'total',
                            sub: []
                        },
                        param: {
                            'yearWeek': ''
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
            label: '委外采购单号:',
            key: 'productionDocNo',
            value: '',
            type: 'text',
            placeholder: '请输入委外采购单号'
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
        //checkbox: [true, 'docNo'],
        // radio: [true, 'docNo'],
        width: [6, 6, 6], //排除序号，多选，单选，操作栏
        match: [
            {href:true,key:'docNo'},
            'docDate',
            'warehouseName'
        ],
        head: ['委外采购订单号', '委外采购日期', '仓库']
    },
    prepareTableCfg: {
        //operating: [true, 'config-operate',
        //    [{
        //        type: 'normal',
        //        btn: 'issue',
        //        text: '确认发料'
        //    }]
        //],
        serial: true,
        width: [6, 6, 6], //排除序号，多选，单选，操作栏
        match: [
            {href:true,key:'docNo'},
            'docDate',
            'warehouseName'
        ],
        head: ['委外备料单号', '委外备料日期', '仓库']
    },
    issueTableCfg: {
        serial: true,
        width: [6, 6, 6], //排除序号，多选，单选，操作栏
        match: [
            {href:true,key:'docNo'},
            'docDate',
            'warehouseName'
        ],
        head: ['委外发料单号', '委外发料日期', '仓库']
    }
}
