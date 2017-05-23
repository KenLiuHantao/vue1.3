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
                name: '待入库',
                icon: '',
                params: {
                    main: {
                        key: 'supplierCode',
                        url: __URL.warehouse + 'wait/inbound/query/suppliers',
                        words: {
                            title: ['supplierName'],
                            right: 'total',
                            sub: [ ]
                        },
                        param: { },
                    },
                    sub: {
                        key: 'deliveryDate',
                        url: __URL.warehouse + 'wait/inbound/query/delivery/dates',
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
                name: '已入库',
                icon: '',
                params: {
                    main: {
                        key: 'supplierCode',
                        url: __URL.warehouse + 'inbound/query/suppliers',
                        words: {
                            title: ['supplierName'],
                            right: 'total',
                            sub: [ ]
                        },
                        param: { },
                    },
                    sub: {
                        key: 'deliveryDate',
                        url: __URL.warehouse + 'inbound/query/delivery/dates',
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
    waitInboundTableCfg: {
        serial: true,
        width: [3,3,3,3], //排除序号，多选，单选，操作栏
        match: [
            {href:true,key:'srcDocNo'},
            'srcEmployeeName',
            'srcDocTypeStr',
            'warehouseName'
        ],
        head: ['单号','负责人','单据类型','入库仓库']
    },
    inboundTableCfg: {
        serial: true,
        width: [3,3,3,3], //排除序号，多选，单选，操作栏
        match: [
            {href:true,key:'docNo'},
            'employeeName',
            'srcDocTypeStr',
            'warehouseName'
        ],
        head: ['单号','负责人','单据类型','入库仓库']
    }
}
