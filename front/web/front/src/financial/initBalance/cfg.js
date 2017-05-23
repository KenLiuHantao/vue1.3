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
            tabBarData: [
                {
                    id: 'tab1',
                    name: '待处理',
                    //icon: 'icon-teamwork',
                    params: {
                        main: {
                            key: 'balanceCategoryCode',
                            url: __URL.financial + 'init/balance/category',
                            words: {
                                title: ['balanceCategoryName'],
                                sub: []
                            },
                            param: {
                                "balanceCategoryCode":"",
                                "currencyCode":"",
                                "bankAccount":"",
                                "recordStatus":"0",
                                "pageIndex": 0,
                                "pageSize": 0
                            },
                        },
                        sub: {
                            key: 'currencyCode',
                            url: __URL.financial + 'init/balance/currency',
                            words: {
                                title: ['currencyName'],
                                right:'balance',
                                sub: []
                            },
                            param: {
                                "balanceCategoryCode":"",
                                "bankAccount":"",
                                "currencyCode":"",
                                "recordStatus":"0",
                                "pageIndex": 0,
                                "pageSize": 0
                            }
                        }
                    }
                },
                {
                    id: 'tab2',
                    name: '待审核',
                    //icon: 'icon-teamwork',
                    params: {
                        main: {
                            key: 'balanceCategoryCode',
                            url: __URL.financial + 'init/balance/category',
                            words: {
                                title: ['balanceCategoryName'],
                                sub: []
                            },
                            param: {
                                "balanceCategoryCode":"",
                                "bankAccount":"",
                                "currencyCode":"",
                                "recordStatus":"1",
                                "pageIndex": 0,
                                "pageSize": 0
                            },
                        },
                        sub: {
                            key: 'currencyCode',
                            url: __URL.financial + 'init/balance/currency',
                            words: {
                                title: ['currencyName'],
                                right:'balance',
                                sub: []
                            },
                            param: {
                                "balanceCategoryCode":"",
                                "bankAccount":"",
                                "currencyCode":"",
                                "recordStatus":"1",
                                "pageIndex": 0,
                                "pageSize": 0
                            }
                        }
                    }
                },
                {
                    id: 'tab3',
                    name: '已审核',
                    //icon: 'icon-teamwork',
                    params: {
                        main: {
                            key: 'balanceCategoryCode',
                            url: __URL.financial + 'init/balance/category',
                            words: {
                                title: ['balanceCategoryName'],
                                sub: []
                            },
                            param: {
                                "balanceCategoryCode":"",
                                "bankAccount":"",
                                "currencyCode":"",
                                "recordStatus":"2",
                                "pageIndex": 0,
                                "pageSize": 0
                            },
                        },
                        sub: {
                            key: 'currencyCode',
                            url: __URL.financial + 'init/balance/currency',
                            words: {
                                title: ['currencyName'],
                                right:'balance',
                                sub: []
                            },
                            param: {
                                "balanceCategoryCode":"",
                                "bankAccount":"",
                                "currencyCode":"",
                                "recordStatus":"2",
                                "pageIndex": 0,
                                "pageSize": 0
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
        "balanceCategoryCode":"",
        "bankAccount":"",
        "currencyCode":"",
        "recordStatus":"",
        "pageIndex": 0,
        "pageSize": 0
    },
    cashTableCfg1: {
        serial:true,
        // operating: [true, 'config-operate',
        //     [
        //         {
        //             type: 'normal',
        //             btn: 'modify',
        //             text: '编辑'
        //         }, {
        //             type: 'normal',
        //             btn: 'delete',
        //             text: '删除'
        //         }, {
        //             type: 'normal',
        //             btn: 'submit',
        //             text: '提交'
        //         }
        //     ]
        // ],
        width: [4, 3, 3, 3, 3], //排除序号，多选，单选，操作栏
        match: [
            [{ key: 'docNo', href: true }],
            'docDate',
            'balanceCategoryName',
            'currencyName',
            'balance'
        ],
        head: ['单号', '单据日期', '余额类型', '币种','金额'],
    },
    cashTableCfg2: {
        serial:true,
        // operating: [true, 'config-operate',
        //     [
        //        {
        //             type: 'normal',
        //             btn: 'cancel',
        //             text: '撤销审核',
        //             func:function (data) {
        //                if(data.repeal==0){
        //                    return true;
        //                }else{
        //                    return false;
        //                }
        //            }
        //         }
        //     ]
        // ],
        width: [4, 3, 3, 3, 3], //排除序号，多选，单选，操作栏
        match: [
            [{ key: 'docNo', href: true }],
            'docDate',
            'balanceCategoryName',
            'currencyName',
            'balance'
        ],
        head: ['单号', '单据日期', '余额类型', '币种','金额'],
    },
    cashTableCfg3: {
        serial:true,
        width: [4, 3, 3, 3, 3], //排除序号，多选，单选，操作栏
        match: [
            [{ key: 'docNo', href: true }],
            'docDate',
            'balanceCategoryName',
            'currencyName',
            'balance'
        ],
        head: ['单号', '单据日期', '余额类型', '币种','金额'],
    },
    bankTableCfg1: {
        serial:true,
        // operating: [true, 'config-operate',
        //     [{
        //         type: 'normal',
        //         btn: 'modify',
        //         text: '编辑'
        //     }, {
        //         type: 'normal',
        //         btn: 'delete',
        //         text: '删除'
        //     }, {
        //         type: 'normal',
        //         btn: 'submit',
        //         text: '提交'
        //     }]
        // ],
        width: [4, 3, 3, 3, 3,3,3], //排除序号，多选，单选，操作栏
        match: [
            [{ key: 'docNo', href: true }],
            'docDate',
            'bankAccount',
            'bankNumber',
            'balanceCategoryName',
            'currencyName',
            'balance'
        ],
        head: ['单号', '单据日期', '银行账户', '银行账号','余额类型', '币种','金额'],
    },
    bankTableCfg2: {
        serial:true,
        // operating: [true, 'config-operate',
        //     [
        //      {
        //         type: 'normal',
        //         btn: 'cancel',
        //         text: '撤销审核',
        //          func:function (data) {
        //              if(data.repeal==0){
        //                  return true;
        //              }else{
        //                  return false;
        //              }
        //          }
        //     }
        //     ]
        // ],
        width: [4, 3, 3, 3, 3,3,3], //排除序号，多选，单选，操作栏
        match: [
            [{ key: 'docNo', href: true }],
            'docDate',
            'bankAccount',
            'bankNumber',
            'balanceCategoryName',
            'currencyName',
            'balance'
        ],
        head: ['单号', '单据日期', '银行账户', '银行账号','余额类型', '币种','金额'],
    },
    bankTableCfg3: {
        serial:true,
        width: [4, 3, 3, 3, 3,3,3], //排除序号，多选，单选，操作栏
        match: [
            [{ key: 'docNo', href: true }],
            'docDate',
            'bankAccount',
            'bankNumber',
            'balanceCategoryName',
            'currencyName',
            'balance'
        ],
        head: ['单号', '单据日期', '银行账户', '银行账号','余额类型', '币种','金额'],
    },
}
