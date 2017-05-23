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
                name: '待收货',
                icon: '',
                params: {
                    main: {
                        key: 'supplierCode',
                        url: __URL.warehouse + 'wait/receive/query/suppliers',
                        words: {
                            title: ['supplierName'],
                            right: 'total',
                            sub: [ ]
                        },
                        param: { },
                    },
                    sub: {
                        key: 'deliveryDate',
                        url: __URL.warehouse + 'wait/receive/query/delivery/dates',
                        words: {
                            title: ['deliveryDate'],
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
                name: '未品检',
                icon: '',
                params: {
                    main: {
                        key: 'supplierCode',
                        url: __URL.warehouse + 'receive/query/suppliers',
                        words: {
                            title: ['supplierName'],
                            right: 'total',
                            sub: []
                        },
                        param: {},
                    },
                    sub: {
                        key: 'deliveryDate',
                        url: __URL.warehouse + 'receive/query/delivery/dates',
                        words: {
                            title: ['deliveryDate'],
                            right: 'total',
                            sub: []
                        },
                        param: {
                            'supplierCode': ''
                        }
                    }
                }
            }, {
                id: 'tab3',
                name: '已品检',
                icon: '',
                params: {
                    main: {
                        key: 'supplierCode',
                        url: __URL.warehouse + 'quality/check/query/suppliers',
                        words: {
                            title: ['supplierName'],
                            right: 'total',
                            sub: [ ]
                        },
                        param: { },
                    },
                    sub: {
                        key: 'deliveryDate',
                        url: __URL.warehouse + 'quality/check/query/delivery/dates',
                        words: {
                            title: ['deliveryDate'],
                            right: 'total',
                            sub: []
                        },
                        param: {
                            'supplierCode': ''
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
    waitReceiveTableCfg: {
        // checkbox: [true, 'inventoryId'],
        // radio: [true, 'docNo'],
        // operating: [true, 'config-operate',
        //     [{
        //         type: 'normal',
        //         btn: 'receive',
        //         text: '点收',
        //     }]
        // ],
        serial: true,
        width: [3,3,3,3], //排除序号，多选，单选，操作栏
        match: [
            {href:true,key:'docNo'},
            'srcEmployeeName',
            'docTypeStr',
            'warehouseName'
        ],
        head: ['单号','负责人','单据类型','入库仓库']
    },
    waitQualityCheckTableCfg: {
        serial: true,
        width: [3,3,3,3], //排除序号，多选，单选，操作栏
        match: [
            {href:true,key:'docNo'},
            'srcEmployeeName',
            'docTypeStr',
            'warehouseName'
        ],
        head: ['单号','负责人','单据类型','入库仓库']
    },
    qualityCheckTableCfg: {
        serial: true,
        width: [3,3,3,3], //排除序号，多选，单选，操作栏
        match: [
            {href:true,key:'docNo'},
            'srcEmployeeName',
            'srcDocTypeStr',
            'warehouseName'
        ],
        head: ['单号','负责人','单据类型','入库仓库']
    },
    receiveModalCfg: {
        show: false,
        width: '600px',
        height: 'auto',
        header: '点收',
        btn: [{
            name: '取消',
            emit: 'close',
        }, {
            name: '确定',
            emit: 'sure',
        }]
    }
}
