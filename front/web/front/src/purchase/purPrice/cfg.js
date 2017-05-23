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
                name: '供应商报价',
                params: {
                    main: {
                        key: 'firstInventoryCategoryCode',
                        url: __URL.purchase + 'price/first/inventory/category/valid/quotation',
                        words: {
                            title: ['firstInventoryCategoryName'],
                        },
                        param: {
                            firstInventoryCategoryCode:'',
                            secondInventoryCategoryCode:'',
                        },
                    },
                    sub: {
                        key: 'secondInventoryCategoryCode',
                        url: __URL.purchase + 'price/second/inventory/category/valid/quotation',
                        words: {
                            title: ['secondInventoryCategoryName'],
                            right:'count',
                        },
                        param: {
                            firstInventoryCategoryCode:'',
                            secondInventoryCategoryCode:'',
                        }
                    }
                }
            }, {
                id: 'tab2',
                name: '失效报价',
                params: {
                    main: {
                        key: 'firstInventoryCategoryCode',
                        url: __URL.purchase + 'price/first/inventory/category/invalid/quotation',
                        words: {
                            title: ['firstInventoryCategoryName'],
                            right:'count',
                            sub: []
                        },
                        param: {
                            firstInventoryCategoryCode:'',
                            secondInventoryCategoryCode:'',
                        },
                    },
                    sub: {
                        key: 'secondInventoryCategoryName',
                        url: __URL.purchase + 'price/second/inventory/category/invalid/quotation',
                        words: {
                            title: ['secondInventoryCategoryName'],
                            right:'count',
                            sub: []
                        },
                        param: {
                            firstInventoryCategoryCode:'',
                            secondInventoryCategoryCode:'',
                        }
                    }
                }
            }, {
                id: 'tab3',
                name: '货品价目',
                params: {
                    main: {
                        key: 'firstInventoryCategoryCode',
                        url: __URL.purchase + 'price/first/inventory/category/valid',
                        words: {
                            title: ['firstInventoryCategoryName'],
                            right:'count',
                            sub: []
                        },
                        param: {
                            firstInventoryCategoryCode:'',
                            secondInventoryCategoryCode:'',
                        },
                    },
                    sub: {
                        key: 'secondInventoryCategoryCode',
                        url: __URL.purchase + 'price/second/inventory/category/valid',
                        words: {
                            title: ['secondInventoryCategoryName'],
                            right:'count',
                            sub: []
                        },
                        param: {
                            firstInventoryCategoryCode:'',
                            secondInventoryCategoryCode:'',
                        }
                    }
                }
            }, {
                id: 'tab4',
                name: '失效价目',
                params: {
                    main: {
                        key: 'firstInventoryCategoryCode',
                        url: __URL.purchase + 'price/first/inventory/category/invalid',
                        words: {
                            title: ['firstInventoryCategoryName'],
                            right:'count',
                            sub: []
                        },
                        param: {
                            firstInventoryCategoryCode:'',
                            secondInventoryCategoryCode:'',
                        },
                    },
                    sub: {
                        key: 'secondInventoryCategoryCode',
                        url: __URL.purchase + 'price/second/inventory/category/invalid',
                        words: {
                            title: ['secondInventoryCategoryName'],
                            right:'count',
                            sub: []
                        },
                        param: {
                            firstInventoryCategoryCode:'',
                            secondInventoryCategoryCode:'',
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
    supplierTableCfg: {
        serial: true,
        width: [6, 6, 6, 6], //排除序号，多选，单选，操作栏
        match: [
            ['inventoryCode', 'inventoryName'],
            [{key: 'docNo', href: true}],
            'supplierName',
            'employeeName'
        ],
        head: ['货品信息', '供应商报价单号', '供应商', '采购员'],
    },
    inventoryTableCfg: {
        serial: true,
        width: [6, 6, 6], //排除序号，多选，单选，操作栏
        match: [
            {key: 'inventoryCode', href: true},
            'inventoryName',
            'inventorySpec'
        ],
        head: ['货品编码', '货品名称', '规格型号'],
    }
}
