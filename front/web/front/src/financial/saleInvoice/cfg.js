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
            tabBarData: [
                {
                    id: 'tab1',
                    name: '待收票',
                    icon: '',
                    params: {
                        main: {
                            key: 'yearMonth',
                            url: __URL.financial + 'sales/invoice/month',
                            words: {
                                title: ['year','年','month','月'],
                                sub: []
                            },
                            param: {
                                "pageIndex": 0,
                                "pageSize": 0,
                                "recordStatus": 3,
                                "customerCode": "",
                            },
                        },
                        sub: {
                            key: 'customerCode',
                            url: __URL.financial + 'sales/invoice/customer',
                            words: {
                                title: ['customerName'],
                                right:'currencyAndTaxAmounts',
                                sub: []
                            },
                            param: {
                                "pageIndex": 0,
                                "pageSize": 0,
                                "recordStatus": 3,
                                "yearMonth": ""
                            }
                        }
                    }
                },
                {
                    id: 'tab2',
                    name: '待处理',
                    icon: '',
                    params: {
                        main: {
                            key: 'yearMonth',
                            url: __URL.financial + 'sales/invoice/month',
                            words: {
                                title: ['year','年','month','月'],
                                sub: []
                            },
                            param: {
                                "pageIndex": 0,
                                "pageSize": 0,
                                "recordStatus": 0,

                            },
                        },
                        sub: {
                            key: 'customerCode',
                            url: __URL.financial + 'sales/invoice/customer',
                            words: {
                                title: ['customerName'],
                                right:'currencyAndTaxAmounts',
                                sub: []
                            },
                            param: {
                                "pageIndex": 0,
                                "pageSize": 0,
                                "recordStatus": 0,
                                "yearMonth": ""
                            }
                        }
                    }
                },
                {
                    id: 'tab3',
                    name: '未审核',
                    icon: '',
                    params: {
                        main: {
                            key: 'yearMonth',
                            url: __URL.financial + 'sales/invoice/month',
                            words: {
                                title: ['year','年','month','月'],
                                sub: []
                            },
                            param: {
                                "pageIndex": 0,
                                "pageSize": 0,
                                "recordStatus": 1,
                            },
                        },
                        sub: {
                            key: 'customerCode',
                            url: __URL.financial + 'sales/invoice/customer',
                            words: {
                                title: ['customerName'],
                                right:'currencyAndTaxAmounts',
                                sub: []
                            },
                            param: {
                                "pageIndex": 0,
                                "pageSize": 0,
                                "recordStatus": 1,
                                "yearMonth": ""
                            }
                        }
                    }
                },
                {
                    id: 'tab4',
                    name: '已审核',
                    icon: '',
                    params: {
                        main: {
                            key: 'yearMonth',
                            url: __URL.financial + 'sales/invoice/month',
                            words: {
                                title: ['year','年','month','月'],
                                sub: []
                            },
                            param: {
                                "pageIndex": 0,
                                "pageSize": 0,
                                "recordStatus": 2,
                            },
                        },
                        sub: {
                            key: 'customerCode',
                            url: __URL.financial + 'sales/invoice/customer',
                            words: {
                                title: ['customerName'],
                                right:'currencyAndTaxAmounts',
                                sub: []
                            },
                            param: {
                                "pageIndex": 0,
                                "pageSize": 0,
                                "recordStatus": 2,
                                "yearMonth": ""
                            }
                        }
                    }
                }
            ]
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
        filterCfg: [

        ]
    },

    /* 
     * table 配置
     */
    listParam: {
        "pageIndex": 0,
        "pageSize": 0,
        "recordStatus": 0,
        "customerCode": "",
        "yearMonth": ""
    },

    tab1TableCfg: {
        checkbox: [true, 'docNo'],
        width: [4,4,4,4,4], //排除序号，多选，单选，操作栏
        review: [true, 'dispatch', [{
            val: false,
            icon: 'icon-success',
            style: [{
                color: 'red'
            }],
        }]],
        match: [
            {key:'docNo',href:true},
            'docDate',
            'currencyName',
            'exchangeRate',
            'showTaxAmounts',
        ],
        head: ['发货单号', '发货日期','币种','汇率','价税合计']
    },

    tab2TableCfg:{
        review: [true, 'invoiceCategoryCode', [{
            val: '002',
            icon: 'icon-success',
            style: [{
                color: 'red'
            }],
        }]],
        width: [1,5,5,5,5], //排除序号，多选，单选，操作栏
        match: [
            (val)=>{
                if(val.invoiceCategoryCode=="002") {
                    return '<span style="padding: 2px;border-radius: 1px;display:inline-block;background:#ff5104;color:white">退票</span>'
                }else{
                    return "<span><span>"
                }
            },
            {key:'docNo',href:true},
            'docDate',
            'customerName',
            'taxAmounts'
        ],
        head: ['','发票单号', '开票日期','客户名称','价税合计']
    },
    tab3TableCfg: {
        width: [1,5,5,5,5], //排除序号，多选，单选，操作栏
        review: [true, 'invoiceCategoryCode', [{
            val: '002',
            icon: 'icon-success',
            style: [{
                color: 'red'
            }],
        }]],
        match: [
            (val)=>{
                if(val.invoiceCategoryCode=="002") {
                    return '<span style="padding: 2px;border-radius: 1px;display:inline-block;background:#ff5104;color:white">退票</span>'
                }else{
                    return "<span><span>"
                }
            },
            {key:'docNo',href:true},
            // 'docNo',
            'docDate',
            'customerName',
            'taxAmounts'
        ],
        head: ['','发票单号', '开票日期','客户名称','价税合计']
    },
    tab4TableCfg: {
        // operating: [true, 'config-operate',
        //     [{
        //         type: 'normal',
        //         btn: 'returnTicket',
        //         text: '退票',
        //         func:function (data) {
        //             if(data.invoiceCategoryCode=="002"){
        //                 return false;
        //             }else{
        //                 return true;
        //             }
        //         }
        //     }]
        // ],
        review: [true, 'invoiceCategoryCode', [{
            val: '002',
            icon: 'icon-success',
            style: [{
                color: 'red'
            }],
        }]],
        width: [1,5,5,5,5], //排除序号，多选，单选，操作栏
        match: [
            (val)=>{
                if(val.invoiceCategoryCode=="002") {
                    return '<span style="padding: 2px;border-radius: 1px;display:inline-block;background:#ff5104;color:white">退票</span>'
                }else{
                    return "<span><span>"
                }
            },
            {key:'docNo',href:true},
            //'docNo',
            'docDate',
            'customerName',
            'taxAmounts'
        ],
        head: ['','发票单号', '开票日期','客户名称','价税合计']
    }
}
