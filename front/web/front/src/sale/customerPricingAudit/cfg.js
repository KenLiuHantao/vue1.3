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
                name: '货品',
                //icon: '',
                params: {
                    main: {
                        key: 'inventoryId',
                        url: __URL.sale + 'customer/pricing/inventory/list',
                        words: {
                            title: ['inventoryName']
                        },
                        param: {
                            "pageIndex": 0,
                            "pageSize": 0,
                            "customerName": "",
                            "inventoryCode": "",
                            "inventoryName": "",
                            "employeeName": "",
                            "status": "",
                            "startDate": "",
                            "endDate": "",
                            "startEffectiveDate": "",
                            "endEffectiveDate": "",
                            "startExpiryDate": "",
                            "endExpiryDate": "",
                        }
                    }
                }
            }, {
                id: 'tab2',
                name: '客户',
                //icon: '',
                params: {
                    main: {
                        key: 'yearMonth',
                        url: __URL.sale + 'customer/pricing/month/list',
                        words: {
                            title: ['monthShowName'],
                            sub: []
                        },
                        param: {
                            "pageIndex": 0,
                            "pageSize": 0,
                            "customerName": "",
                            "inventoryCode": "",
                            "inventoryName": "",
                            "employeeName": "",
                            "status": "",
                            "startDate": "",
                            "endDate": "",
                            "startEffectiveDate": "",
                            "endEffectiveDate": "",
                            "startExpiryDate": "",
                            "endExpiryDate": "",
                        }
                    },
                    sub: {
                        key: 'customerCode',
                        url: __URL.sale + 'customer/pricing/month/customer/list',
                        words: {
                            title: ['customerName'],
                            sub: []
                        },
                        param: {
                            "pageIndex": 0,
                            "pageSize": 0,
                            "yearMonth": "",
                            "customerName": "",
                            "inventoryCode": "",
                            "inventoryName": "",
                            "employeeName": "",
                            "status": "",
                            "startDate": "",
                            "endDate": "",
                            "startEffectiveDate": "",
                            "endEffectiveDate": "",
                            "startExpiryDate": "",
                            "endExpiryDate": "",
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
            label: '客户:',
            key: 'customerName',
            value: '',
            type: 'text',
            placeholder: '请输入客户'
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
            label: '业务员:',
            key: 'employeeName',
            value: '',
            type: 'text',
            placeholder: '请输入业务员'
        }, {
            label: '状态:',
            key: 'status',
            value: "",
            type: 'select',
            option: ["all", "unaudited", "audited", "valid", "invalid"]
        }, {
            label: '调价开始时间:',
            key: 'startDate',
            value: '',
            type: 'date',
        }, {
            label: '调价结束时间:',
            key: 'endDate',
            value: '',
            type: 'date',
        }, {
            label: '生效开始时间:',
            key: 'startEffectiveDate',
            value: '',
            type: 'date',
        }, {
            label: '生效结束时间:',
            key: 'endEffectiveDate',
            value: '',
            type: 'date',
        }, {
            label: '失效开始时间:',
            key: 'startExpiryDate',
            value: '',
            type: 'date',
        }, {
            label: '失效结束时间:',
            key: 'endExpiryDate',
            value: '',
            type: 'date',
        }, ]
    },
    /* 
     * table 配置
     */
    tableCfg: {
        // checkbox: [true, 'inventoryId'],
        // operating: [true, { type: 0 }],
        // radio: [true, 'docNo'],
        // operating: [true, { type: 2 }],
        serial: true,
        width: [3, 3, 3, 3, 3, 3], //排除序号，多选，单选，操作栏
        match: [
            [{ key: 'docNo', href: true }],
            'employName', ['inventoryCode', 'inventoryName'],
            'taxUnitPrice', ['lowerLimit', 'upperLimit'],
            ['effectiveDate', 'expiryDate']
        ],
        head: ['价格单号', '业务员', '货品信息', '含税单价', '数量', '生/失效日期'],
        newline: [0],
    },

    pricingCfg: {
        "header": {
            "employeeCode": "",
            "employeeName": "",
            "remark": "",
            "audit": "",
            "attachmentVos":[]
        },
        "dataList": []
    }

}
