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
                            url: __URL.financial + 'purchase/invoice/month',
                            words: {
                                title: ['year','年','month','月'],

                                sub: []
                            },
                            param: {
                                "pageIndex": 0,
                                "pageSize": 0,
                                "recordStatus": 3,
                                "supplierCode": "",
                            },
                        },
                        sub: {
                            key: 'supplierCode',
                            url: __URL.financial + 'purchase/invoice/supplier',
                            words: {
                                title: ['supplierName'],
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
                            url: __URL.financial + 'purchase/invoice/month',
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
                            key: 'supplierCode',
                            url: __URL.financial + 'purchase/invoice/supplier',
                            words: {
                                title: ['supplierName'],
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
                            url: __URL.financial + 'purchase/invoice/month',
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
                            key: 'supplierCode',
                            url: __URL.financial + 'purchase/invoice/supplier',
                            words: {
                                title: ['supplierName'],
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
                            url: __URL.financial + 'purchase/invoice/month',
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
                            key: 'supplierCode',
                            url: __URL.financial + 'purchase/invoice/supplier',
                            words: {
                                title: ['supplierName'],
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
        "supplierCode": "",
        "yearMonth": ""
    },

    tab1TableCfg: {
        checkbox: [true, 'docNo'],
        width: [4,4,4,4,4], //排除序号，多选，单选，操作栏
        match: [
            {key:'docNo',href:true},
            'docDate',
            'currencyName',
            'exchangeRate',
            'taxAmounts',
        ],
        head: ['入库单号', '发货日期','币种','汇率','价税合计']
    },

    tab2TableCfg:{
        serial: true,
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
         //   'docNo',
            'docDate',
            'supplierName',
            'taxAmounts'
        ],
        head: ['','发票单号', '开票日期','供应商名称','价税合计']
    },
    tab3TableCfg: {
        serial: true,
        width: [1,5,5,5,5], //排除序号，多选，单选，操作栏
        // operating: [true, 'config-operate',
        //     [{
        //         type: 'normal',
        //         btn: 'cancelSubmit',
        //         text: '撤销提交',
        //         func:function (data) {
        //             if(data.repeal==0){
        //                 return true;
        //             }else{
        //                 return false;
        //             }
        //         }
        //     }]
        // ],
        // review: [true, 'invoiceCategoryCode', [{
        //     val: '002',
        //     // icon: 'icon-begin__period',
        //     style: [{
        //         color: 'red'
        //     }],
        // }]],
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
            'supplierName',
            'taxAmounts'
        ],
        head: ['','发票单号', '开票日期','供应商名称','价税合计']
    },
    tab4TableCfg: {
        serial: true,
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
        // review: [true, 'invoiceCategoryCode', [{
        //     val: '002',
        //     icon: 'icon-success',
        //     style: [{
        //         color: 'red'
        //     }],
        // }]],
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
            'supplierName',
            'taxAmounts'
        ],
        head: ['','发票单号', '开票日期','供应商名称','价税合计']
    }
}
