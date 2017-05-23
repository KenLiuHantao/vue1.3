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
                name: '待退收',
                icon: '',
                params: {
                    main: {
                        key: 'supplierCode',
                        url: __URL.warehouse + 'wait/return/receive/query/suppliers',
                        words: {
                            title: ['supplierName'],
                            right: 'total',
                            sub: [ ]
                        },
                        param: { },
                    },
                    sub: {
                        key: 'date',
                        url: __URL.warehouse + 'wait/return/receive/query/dates',
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
                name: '已退收',
                icon: '',
                params: {
                    main: {
                        key: 'supplierCode',
                        url: __URL.warehouse + 'return/receive/query/suppliers',
                        words: {
                            title: ['supplierName'],
                            right: 'total',
                            sub: []
                        },
                        param: {

                        }
                    },
                    sub: {
                        key: 'date',
                        url: __URL.warehouse + 'return/receive/query/date',
                        words: {
                            title: ['date'],
                            right: 'total',
                            sub: [ ]
                        },
                        param: {
                            supplierCode:''
                        },
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
            label: '采购退收单号:',
            key: 'docNo',
            value: '',
            type: 'text',
            placeholder: '请输入退收单号'
        }, {
            label: '采购退收开始日期:',
            key: 'startDocDate',
            value: '',
            type: 'date',
            placeholder: '123'
        }, {
            label: '采购退收结束日期:',
            key: 'endDocDate',
            value: '',
            type: 'date',
            placeholder: ''
        }, {
            label: '采购单号:',
            key: 'purchaseDocNo',
            value: '',
            type: 'text',
            placeholder: '请输入采购单号'
        }, {
            label: '采购开始日期:',
            key: 'purchaseStartDocDate',
            value: '',
            type: 'date',
            placeholder: '123'
        }, {
            label: '采购结束日期:',
            key: 'purchaseEndDocDate',
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
    waitReturnReceiptTableCfg: {
        serial: true,
        operating: [true, 'config-operate',
            [{
                type: 'blue',
                btn: 'back',
                text: '详情'
            }]
        ],
        //radio:[true,'docNo'],
        width: [5,5,5,5], //排除序号，多选，单选，操作栏
        match: [
            'docNo',
            'srcEmployeeName',
            'srcDocTypeStr',
            'warehouseName'
        ],
        head: ['单号','负责人','单据类型','入库仓库']
    },
    returnReceiptTableCfg: {
        radio:true,
        serial: true,
        width: [5,5,5], //排除序号，多选，单选，操作栏
        match: [
            {key: 'docNo', href: true },
            'employeeName',
            'srcDocTypeStr',
            'warehouseName'
        ],
        head: ['采购退收单号','退收人','单据类型','入库仓库']
    }
}
