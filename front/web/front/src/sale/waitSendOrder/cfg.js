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
                name: '周排序',
                icon: '',
                params: {
                    main: {
                        key: 'yearWeek',
                        url: __URL.sale + 'salesSuspenseDispatch/findForWeek',
                        words: {
                            title: ['weekShowName'],
                            right:'orderQuantity',
                            sub: []
                        },
                        param: {
                            "customerName": "",
                            "customerCode": "",
                            "docNo": "",
                            "endDeliveryDate": "",
                            "inventoryCode": "",
                            "inventoryName": "",
                            "inventorySpec": "",
                            "startDeliveryDate": "",
                            "yearWeek": "",
                            "pageIndex": 0,
                            "pageSize": 0
                        },
                    },
                    sub: {
                        key: 'customerCode',
                        url: __URL.sale + 'salesSuspenseDispatch/findForCustomer',
                        words: {
                            title: ['customerName'],
                            right:'orderQuantity',
                            sub: []
                        },
                        param: {
                            "customerName": "",
                            "customerCode": "",
                            "docNo": "",
                            "endDeliveryDate": "",
                            "inventoryCode": "",
                            "inventoryName": "",
                            "inventorySpec": "",
                            "startDeliveryDate": "",
                            "yearWeek": "",
                            "pageIndex": 0,
                            "pageSize": 0
                        }
                    }
                }
            }, {
                id: 'tab2',
                name: '客户排序',
                icon: '',
                params: {
                    main: {
                        key: 'customerCode',
                        url: __URL.sale + 'salesSuspenseDispatch/findForCustomer',
                        words: {
                            title: ['customerName'],
                            right:'orderQuantity',
                            sub: []
                        },
                        param: {
                            "customerName": "",
                            "customerCode": "",
                            "docNo": "",
                            "endDeliveryDate": "",
                            "inventoryCode": "",
                            "inventoryName": "",
                            "inventorySpec": "",
                            "startDeliveryDate": "",
                            "yearWeek": "",
                            "pageIndex": 0,
                            "pageSize": 0
                        },
                    },
                    sub: {
                        key: 'yearWeek',
                        url: __URL.sale + 'salesSuspenseDispatch/findForWeek',
                        words: {
                            title: ['weekShowName'],
                            right:'orderQuantity',
                            sub: []
                        },
                        param: {
                            "customerName": "",
                            "customerCode": "",
                            "docNo": "",
                            "endDeliveryDate": "",
                            "inventoryCode": "",
                            "inventoryName": "",
                            "inventorySpec": "",
                            "startDeliveryDate": "",
                            "yearWeek": "",
                            "pageIndex": 0,
                            "pageSize": 0
                        }
                    }
                }
            }]
        },
        /* 
         * list 配置
         */
        listCfg: {
            hasNub: false,
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
            placeholder: '请输入客户名称'
        }, {
            label: '销售订单号:',
            key: 'docNo',
            value: '',
            type: 'text',
            placeholder: '请输入销售订单号'
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
        }, {
            label: '发货开始时间:',
            key: 'startDeliveryDate',
            value: '',
            type: 'date',
            placeholder: '开始时间'
        }, {
            label: '发货结束时间',
            key: 'endDeliveryDate',
            value: '',
            type: 'date',
            placeholder: '结束时间'
        },]
    },
    /* 
     * table 配置
     */
    tableCfg: {
        firstItemTextAlignLeft: true,
        checkbox: [true, 'recordId'],
        width: [4, 16], //排除序号，多选，单选，操作栏
        match: [
            [{key: 'docNo', href: true}],
            'employeeName',
        ],
        head: ['销售单号', '业务员'],
    },

    quotationCfg: {
        "header": {},
        "detailList": []
    },

}
