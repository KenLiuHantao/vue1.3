export default {
    leftItemCfg: {
        headCfg: {
            add: true,
            filter: true
        },
        /* 
         * tab 配置
         */
        tabCfg: {
            select: '',
            tabBarData: [{
                id: 'tab1',
                name: '开发',
                icon: '',
                params: {
                    main: {
                        key: 'yearWeek',
                        url: __URL.manu + 'iqc/week',
                        words: {
                            title: ['这是第一级', ' - ', '(', 'yearWeek', ')', '周'],
                            sub: [
                                ['二级菜单:', 'weekBeginDate'],
                                ['三级菜单:', 'weekEndDate'],
                            ],
                            right: 'yearWeek'
                        },
                        param: {
                            "entCode": "",
                            "params": {
                                "audit": 0,
                                "beginCreateTime": "",
                                "docNo": "",
                                "endCreateTime": "",
                                "inventoryCode": "",
                                "inventoryName": "",
                                "pageIndex": 0,
                                "pageSize": 0,
                                "supplierCode": "",
                                "supplierName": "",
                                "yearWeek": ""
                            },
                            "userCode": ""
                        },
                    },
                    sub: {
                        key: 'supplierCode',
                        url: __URL.manu + 'iqc/supplier',
                        words: {
                            title: ['第二级标题', ' - ', 'supplierName'],
                            sub: [
                                ['入库数量:', 'sumRecordRows'],
                                ['入库价格:', 'sumQcSampleQty']
                            ],
                            right: 'supplierName'
                        },
                        param: {
                            "entCode": "",
                            "params": {
                                "audit": 0,
                                "beginCreateTime": "",
                                "docNo": "",
                                "endCreateTime": "",
                                "inventoryCode": "",
                                "inventoryName": "",
                                "pageIndex": 0,
                                "pageSize": 0,
                                "supplierCode": "",
                                "supplierName": "",
                                "yearWeek": ""
                            },
                            "userCode": ""
                        }
                    }
                }
            }, {
                id: 'tab2',
                name: '销售',
                icon: '',
                params: {
                    main: {
                        key: 'yearWeek',
                        url: __URL.manu + 'iqc/week',
                        words: {
                            title: ['这是第一级', ' - ', '(', 'yearWeek', ')', '周'],
                            sub: [
                                ['二级菜单:', 'weekBeginDate'],
                                ['三级菜单:', 'weekEndDate'],
                            ],
                            right: 'yearWeek'
                        },
                        param: {
                            "entCode": "",
                            "params": {
                                "audit": 1,
                                "beginCreateTime": "",
                                "docNo": "",
                                "endCreateTime": "",
                                "inventoryCode": "",
                                "inventoryName": "",
                                "pageIndex": 0,
                                "pageSize": 0,
                                "supplierCode": "",
                                "supplierName": "",
                                "yearWeek": ""
                            },
                            "userCode": ""
                        },
                    },
                    sub: {
                        key: 'supplierCode',
                        url: __URL.manu + 'iqc/supplier',
                        words: {
                            title: ['第二级标题', ' - ', 'supplierName'],
                            sub: [
                                ['入库数量:', 'sumRecordRows'],
                                ['入库价格:', 'sumQcSampleQty']
                            ]
                        },
                        param: {
                            "entCode": "",
                            "params": {
                                "audit": 1,
                                "beginCreateTime": "",
                                "docNo": "",
                                "endCreateTime": "",
                                "inventoryCode": "",
                                "inventoryName": "",
                                "pageIndex": 0,
                                "pageSize": 0,
                                "supplierCode": "",
                                "supplierName": "",
                                "yearWeek": ""
                            },
                            "userCode": ""
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
            label: '供应商名称:',
            key: 'supplierName',
            value: '',
            type: 'text',
            placeholder: '请输入供应商'
        }, {
            label: '开始时间:',
            key: 'beginCreateTime',
            value: '',
            type: 'date',
            placeholder: '123'
        }, {
            label: '结束时间:',
            key: 'endCreateTime',
            value: '',
            type: 'date',
            placeholder: ''
        }, ]
    },
    /* 
     * table 配置
     */
    tableCfg: {
        // checkbox: [true, 'inventoryId'],
        operating: [true, { type: 0 }],
        // radio: [true, 'docNo'],
        width: [3, 3, 3, 3, 3, 3], //排除序号，多选，单选，操作栏
        match: [
            'docNo',
            'supplierName',
            { key: 'inventoryCode', href: true },
            'inventoryName', [{ key: 'inventorySpec', href: true }, 'inventorySpec', 'unitName'],
            'unitName'
        ],
        head: ['收货单号', '供应商名称', '货品编码', '货品名称', '规格', '单位'],
    },
}
