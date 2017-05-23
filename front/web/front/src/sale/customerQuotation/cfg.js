export default {
    leftItemCfg: {
        headCfg: {
            add: true,
            filter: false
        },
        /* 
         * tab 配置
         */
        tabCfg: {
            select: '',
            tabBarData: [{
                id: 'tab1',
                name: '草稿箱',
                //icon: '',
                params: {
                    main: {
                        key: 'yearWeek',
                        url: __URL.sale + 'customer/quotation/findDraftListForWeek',
                        words: {
                            title: ['weekShowName'],
                            right: ['orderQuantity'],
                            sub: []
                        },
                        param: {
                            "status": -1,
                            "pageIndex": 0,
                            "pageSize": 0,
                            "supplierName":"",
                            "employName":"",
                            "docNo":"",
                            "inventoryCode":"",
                            "inventoryName":"",
                            "beginCreateTime":"",
                            "endCreateTime":"",
                        },
                    },
                    sub: {
                        key: 'customerCode',
                        url: __URL.sale + 'customer/quotation/findDraftListForCustomer',
                        words: {
                            title: ['customerName'],
                            right: ['orderQuantity'],
                            sub: [ ]
                        },
                        param: {
                            "status": -1,
                            "pageIndex": 0,
                            "yearWeek": "",
                            "supplierName":"",
                            "employName":"",
                            "docNo":"",
                            "inventoryCode":"",
                            "inventoryName":"",
                            "beginCreateTime":"",
                            "endCreateTime":"",
                        }
                    }
                }
            },
                {
                    id: 'tab2',
                    name: '未审核',
                    //icon: '',
                    params: {
                        main: {
                            key: 'yearWeek',
                            url: __URL.sale + 'customer/quotation/findUnauditListForWeek',
                            words: {
                                title: ['weekShowName'],
                                right: ['orderQuantity'],
                                sub: []
                            },
                            param: {
                                "status": 0,
                                "pageIndex": 0,
                                "pageSize": 0,
                                "supplierName":"",
                                "employName":"",
                                "docNo":"",
                                "inventoryCode":"",
                                "inventoryName":"",
                                "beginCreateTime":"",
                                "endCreateTime":"",
                            },
                        },
                        sub: {
                            key: 'customerCode',
                            url: __URL.sale + 'customer/quotation/findUnauditListForCustomer',
                            words: {
                                title: ['customerName'],
                                right: ['orderQuantity'],
                                sub: [ ]
                            },
                            param: {
                                "status": 0,
                                "pageIndex": 0,
                                "yearWeek": "",
                                "supplierName":"",
                                "employName":"",
                                "docNo":"",
                                "inventoryCode":"",
                                "inventoryName":"",
                                "beginCreateTime":"",
                                "endCreateTime":"",
                            }
                        }
                    }
                },
                {
                    id: 'tab3',
                    name: '已驳回',
                    //icon: '',
                    params: {
                        main: {
                            key: 'yearWeek',
                            url: __URL.sale + 'customer/quotation/findRejectListForWeek',
                            words: {
                                title: ['weekShowName'],
                                right: ['orderQuantity'],
                                sub: []
                            },
                            param: {
                                "status": 2,
                                "pageIndex": 0,
                                "pageSize": 0,
                                "supplierName":"",
                                "employName":"",
                                "docNo":"",
                                "inventoryCode":"",
                                "inventoryName":"",
                                "beginCreateTime":"",
                                "endCreateTime":"",
                            },
                        },
                        sub: {
                            key: 'customerCode',
                            url: __URL.sale + 'customer/quotation/findRejectListForCustomer',
                            words: {
                                title: ['customerName'],
                                right: ['orderQuantity'],
                                sub: [ ]
                            },
                            param: {
                                "status": 2,
                                "pageIndex": 0,
                                "yearWeek": "",
                                "supplierName":"",
                                "employName":"",
                                "docNo":"",
                                "inventoryCode":"",
                                "inventoryName":"",
                                "beginCreateTime":"",
                                "endCreateTime":"",
                            }
                        }
                    }
                },
                {
                id: 'tab4',
                name: '已审核',
                //icon: '',
                params: {
                    main: {
                        key: 'yearMonth',
                        url: __URL.sale + 'customer/quotation/findAuditListForMonth',
                        words: {
                            title: ['monthShowName'],
                            right: ['orderQuantity'],
                            sub: [ ]
                        },
                        param: {
                            "status": 1,
                            "pageIndex": 0,
                            "pageSize": 0,
                            "supplierName":"",
                            "employName":"",
                            "docNo":"",
                            "inventoryCode":"",
                            "inventoryName":"",
                            "beginCreateTime":"",
                            "endCreateTime":"",
                        },
                    },
                    sub: {
                        key: 'customerCode',
                        url: __URL.sale + 'customer/quotation/findAuditListForCustomer',
                        words: {
                            title: ['customerName'],
                            right: ['orderQuantity'],
                            sub: []
                        },
                        param: {
                            "status": 1,
                            "pageIndex": 0,
                            "pageSize": 0,
                            "yearMonth":"",
                            "supplierName":"",
                            "employName":"",
                            "docNo":"",
                            "inventoryCode":"",
                            "inventoryName":"",
                            "beginCreateTime":"",
                            "endCreateTime":"",
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
        },{
                label: '业务员:',
                key: 'employName',
                value: '',
                type: 'text',
                placeholder: '请输入业务员'
            },{
                label: '报价单号:',
                key: 'docNo',
                value: '',
                type: 'text',
                placeholder: '请输入报价单号'
            },{
            label: '货品编码:',
            key: 'inventoryCode',
            value: '',
            type: 'text',
            placeholder: '请输入货品编码'
        },{
            label: '货品名称:',
            key: 'inventoryName',
            value: '',
            type: 'text',
            placeholder: '请输入货品名称'
        },{
            label: '报价开始时间:',
            key: 'beginCreateTime',
            value: '',
            type: 'date',
            placeholder: '开始时间'
        }, {
            label: '报价结束时间',
            key: 'endCreateTime',
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
        //  radio: [true, 'docNo'],
      //  operating: [true, { type: 2 }],
        serial:true,
        width: [3, 3, 3, 3, 3, 3], //排除序号，多选，单选，操作栏
        match: [
            [{ key: 'docNo', href: true }],
            'employName'
        ],
        head: ['报价单号', '业务员'],
        newline: [0],
    },

    quotationCfg:{
        "header":{
            "customerCategoryCode":"",
            "customerCategoryName":"",
            "customerCode":"",
            "customerName":"",
            "employeeCode":"",
            "employeeName":"",
            "currencyCode":"",
            "currencyName":"",
            "currencySymbol":"",
            "audit":"",
            "taxRate":"",
            "attachmentVos":[]
        },
        "dataList":[

        ]
    }
}
