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
                name: '未审核',
                params: {
                    main: {
                        key: 'yearWeek',
                        url: __URL.purchase + 'supplier/quotation/query/weeks/unaudit',
                        words: {
                            title: ['week', '(', 'weekBeginDate', ' ~ ', 'weekEndDate', ')'],
                            right:'count',
                            sub: []
                        },
                        param: { },
                    },
                    sub: {
                        key: 'supplierCode',
                        url: __URL.purchase + 'supplier/quotation/query/suppliers/unaudit',
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
            }, {
                id: 'tab2',
                name: '已审核',
                params: {
                    main: {
                        key: 'yearMonth',
                        url: __URL.purchase + 'supplier/quotation/query/months/audit',
                        words: {
                            title: ['month'],
                            right: 'count',
                            sub: [ ]
                        },
                        param: { },
                    },
                    sub: {
                        key: 'supplierCode',
                        url: __URL.purchase + 'supplier/quotation/query/suppliers/audit',
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
            label: '供应商报价单号:',
            key: 'docNo',
            value: '',
            type: 'text',
            placeholder: '请输入供应商报价单号'
        }, {
            label: '供应商:',
            key: 'supplierName',
            value: '',
            type: 'search',
            emit: 'supplier',
            placeholder: '请选择供应商'
        }, {
            label: '货品编码:',
            key: 'inventoryCode',
            value: '',
            type: 'search',
            emit: 'inventory',
            placeholder: '请选择货品'
        }, {
            label: '货品名称',
            key: 'inventoryName',
            value: '',
            type: 'search',
            emit: 'inventory',
            placeholder: '请选择货品'
        }]
    },

    /* 
     * table 配置
     */
    listParam: {
        'pageIndex': 0,
        'pageSize': 0,
        'docNo': '',
        'startDocDate': '',
        'endDocDate': '',
        'supplierCode': '',
        'employeeCode': '',
        'inventoryId': ''
    },
    tableCfg: {
        serial: true,
        width: [6, 6, 6], //排除序号，多选，单选，操作栏
        match: [
            [{key: 'docNo', href: true}],
            'docDate',
            'employeeName'
        ],
        head: ['供应商报价单号', '报价日期', '采购员'],
    }
}
