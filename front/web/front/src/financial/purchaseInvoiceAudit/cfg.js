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
                    id: 'tab3',
                    name: '待审核',
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
        "recordStatus": "",
        "supplierCode": "",
        "yearMonth": ""
    },
    tab3TableCfg: {
        serial: true,
        width: [1,5,5,5,5], //排除序号，多选，单选，操作栏
        // operating: [true, 'config-operate',
        //     [{
        //         type: 'normal',
        //         btn: 'audit',
        //         text: '审核'
        //     }]
        // ],
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
        //         btn: 'unaudit',
        //         text: '弃审'
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
            'supplierName',
            'taxAmounts'
        ],
        head: ['','发票单号', '开票日期','供应商名称','价税合计']
    }
}
