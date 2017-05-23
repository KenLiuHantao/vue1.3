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
                id: 'unaudit',
                name: '未审核',
                icon: '',
                params: {
                    main: {
                        key: 'yearWeek',
                            url: __URL.sale + 'salesReturn/findUnauditListForWeek',
                        words: {
                            title: ['weekShowName'],
                            right:'orderQuantity',
                            sub: []
                        },
                        param: {
                            "pageIndex": 0,
                            "pageSize": 0,
                            'customerName':'',
                            'inventoryCode':'',
                            'inventoryName':'',
                            'inventorySpec':'',
                            'startDocDate':'',
                            'endDocDate':''
                        },
                    },
                    sub: {
                        key: 'customerCode',
                        url: __URL.sale + 'salesReturn/findUnauditListForCustomer',
                        words: {
                            title: ['customerName'],
                            right:'orderQuantity',
                            sub: [ ]
                        },
                        param: {
                            "pageIndex": 0,
                            "pageSize": 0,
                            "yearWeek": "",
                            'customerName':'',
                            'inventoryCode':'',
                            'inventoryName':'',
                            'inventorySpec':'',
                            'startDocDate':'',
                            'endDocDate':''
                        }
                    }
                }
            }, {
                id: 'reject',
                name: '已驳回',
                icon: '',
                params: {
                    main: {
                        key: 'yearWeek',
                        url: __URL.sale + 'salesReturn/findRejectListForWeek',
                        words: {
                            title: ['weekShowName'],
                            right:'orderQuantity',
                            sub: [ ]
                        },
                        param: {
                            "pageIndex": 0,
                            "pageSize": 0,
                            'customerName':'',
                            'inventoryCode':'',
                            'inventoryName':'',
                            'inventorySpec':'',
                            'startDocDate':'',
                            'endDocDate':''
                        },
                    },
                    sub: {
                        key: 'customerCode',
                        url: __URL.sale + 'salesReturn/findRejectListForCustomer',
                        words: {
                            title: ['customerName'],
                            right:'orderQuantity',
                            sub: []
                        },
                        param: {
                            "pageIndex": 0,
                            "pageSize": 0,
                            "yearMonth":"",
                            'customerName':'',
                            'inventoryCode':'',
                            'inventoryName':'',
                            'inventorySpec':'',
                            'startDocDate':'',
                            'endDocDate':''
                        }
                    }
                }
            },{
                id: 'wait_receive',
                name: '待退收',
                icon: '',
                params: {
                    main: {
                        key: 'yearWeek',
                        url: __URL.sale + 'salesReturn/findWaitReceiveListForWeek',
                        words: {
                            title: ['weekShowName'],
                            right:'orderQuantity',
                            sub: []
                        },
                        param: {
                            "pageIndex": 0,
                            "pageSize": 0,
                            'customerName':'',
                            'inventoryCode':'',
                            'inventoryName':'',
                            'inventorySpec':'',
                            'startDocDate':'',
                            'endDocDate':''
                        },
                    },
                    sub: {
                        key: 'customerCode',
                        url: __URL.sale + 'salesReturn/findWaitReceiveListForCustomer',
                        words: {
                            title: ['customerName'],
                            right:'orderQuantity',
                            sub: []
                        },
                        param: {
                            "pageIndex": 0,
                            "pageSize": 0,
                            "yearMonth":"",
                            'customerName':'',
                            'inventoryCode':'',
                            'inventoryName':'',
                            'inventorySpec':'',
                            'startDocDate':'',
                            'endDocDate':''
                        }
                    }
                }
            } ,{
                id: 'receive_done',
                name: '已退收',
                icon: '',
                params: {
                    main: {
                        key: 'yearMonth',
                        url: __URL.sale + 'salesReturn/findReceiveDoneListForMonth',
                        words: {
                            title: ['monthShowName'],
                            right:'orderQuantity',
                            sub: [ ]
                        },
                        param: {
                            "pageIndex": 0,
                            "pageSize": 0,
                            'customerName':'',
                            'inventoryCode':'',
                            'inventoryName':'',
                            'inventorySpec':'',
                            'startDocDate':'',
                            'endDocDate':''
                        },
                    },
                    sub: {
                        key: 'customerCode',
                        url: __URL.sale + 'salesReturn/findReceiveDoneListForCustomer',
                        words: {
                            title: ['customerName'],
                            right:'orderQuantity',
                            sub: []
                        },
                        param: {
                            "pageIndex": 0,
                            "pageSize": 0,
                            "yearMonth":"",
                            'customerName':'',
                            'inventoryCode':'',
                            'inventoryName':'',
                            'inventorySpec':'',
                            'startDocDate':'',
                            'endDocDate':''
                        }
                    }
                }
            }  ]
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
            label: '客户',
            key: 'customerName',
            value: '',
            type: 'text',
            placeholder: ''
        },
        //     {
        //     label: '退货单号:',
        //     key: 'docNo',
        //     value: '',
        //     type: 'text',
        //     placeholder: ''
        // },
            {
            label: '货品编码:',
            key: 'inventoryCode',
            value: '',
            type: 'text',
            placeholder: ''
        },{
            label: '货品名称:',
            key: 'inventoryName',
            value: '',
            type: 'text',
            placeholder: ''
        },{
            label: '规格型号:',
            key: 'inventorySpec',
            value: '',
            type: 'text',
            placeholder: ''
        },{
            label: '退货日期-开始时间:',
            key: 'startDocDate',
            value: '',
            type: 'date',
            placeholder: '开始时间',
        }, {
            label: '退货日期-结束时间',
            key: 'endDocDate',
            value: '',
            type: 'date',
            placeholder: '结束时间'
        }, ]
    },
    /* 
     * table 配置
     */
    tableCfg: {
        // checkbox: [true, 'inventoryId'],
        // operating: [true, { type: 0 }],
        // radio: [true, 'docNo'],
        //  operating: [true, { type: 2 }],
        serial:true,
        width: [5, 3, 4, 5, 3], //排除序号，多选，单选，操作栏
        match: [
            [{ key: 'docNo', href: true }],
            'salesDispatchDocNo',
            'employeeName',
            'docDate'
        ],
        head: ['退货单号', '发货单号', '业务员', '退货日期'],
    }
}
