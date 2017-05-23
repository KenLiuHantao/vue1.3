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
                name: '销售报价',
                params: {
                    main: {
                        key: 'inventoryCategorySupperCode',
                        url: __URL.sale + 'pricing/first/category/list',
                        words: {
                            title: ['inventoryCategorySupperName']
                        },
                        param: {
                            "pageIndex": 0,
                            "pageSize": 0,
                            "inventoryCategorySupperCode":"",
                            "inventoryCategoryCode":"",
                            "tabIndex":"1",
                        }
                    },
                    sub: {
                        key: 'inventoryCategorySupperCode',
                        url: __URL.sale + 'pricing/second/category/list',
                        words: {
                            title: ['inventoryCategoryName'],
                            right: 'total',
                            sub: []
                        },
                        param: {
                            "inventoryCategorySupperCode":"",
                            "inventoryCategoryCode":"",
                            "tabIndex":"1",

                        }
                    }
                }
            }, {
                id: 'tab2',
                name: '失效报价',
                //icon: '',
                params: {
                    main: {
                        key: 'inventoryCategorySupperCode',
                        url: __URL.sale + 'pricing/first/category/list',
                        words: {
                            title: ['inventoryCategorySupperName']
                        },
                        param: {
                            "pageIndex": 0,
                            "pageSize": 0,
                            "inventoryCategorySupperCode":"",
                            "inventoryCategoryCode":"",
                            "tabIndex":"2",
                        }
                    },
                    sub: {
                        key: 'inventoryCategorySupperCode',
                        url: __URL.sale + 'pricing/second/category/list',
                        words: {
                            title: ['inventoryCategoryName'],
                            right: 'total',
                            sub: []
                        },
                        param: {
                            "inventoryCategorySupperCode":"",
                            "inventoryCategoryCode":"",
                            "tabIndex":"2",

                        }
                    }
                }
            },{
                id: 'tab3',
                name: '货品价目',
                //icon: '',
                params: {
                    main: {
                        key: 'inventoryCategorySupperCode',
                        url: __URL.sale + 'pricing/first/category/list',
                        words: {
                            title: ['inventoryCategorySupperName']
                        },
                        param: {
                            "pageIndex": 0,
                            "pageSize": 0,
                            "inventoryCategorySupperCode":"",
                            "inventoryCategoryCode":"",
                            "tabIndex":"3",
                        }
                    },
                    sub: {
                        key: 'inventoryCategorySupperCode',
                        url: __URL.sale + 'pricing/second/category/list',
                        words: {
                            title: ['inventoryCategoryName'],
                            right: 'total',
                            sub: []
                        },
                        param: {
                            "inventoryCategorySupperCode":"",
                            "inventoryCategoryCode":"",
                            "tabIndex":"3",

                        }
                    }
                }
            },{
                id: 'tab4',
                name: '失效价目',
                //icon: '',
                params: {
                    main: {
                        key: 'inventoryCategorySupperCode',
                        url: __URL.sale + 'pricing/first/category/list',
                        words: {
                            title: ['inventoryCategorySupperName']
                        },
                        param: {
                            "pageIndex": 0,
                            "pageSize": 0,
                            "inventoryCategorySupperCode":"",
                            "inventoryCategoryCode":"",
                            "tabIndex":"4"
                        }
                    },
                    sub: {
                        key: 'inventoryCategorySupperCode',
                        url: __URL.sale + 'pricing/second/category/list',
                        words: {
                            title: ['inventoryCategoryName'],
                            right: 'total',
                            sub: []
                        },
                        param: {
                            "inventoryCategorySupperCode":"",
                            "inventoryCategoryCode":"",
                            "tabIndex":"4"
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
tableCfg1: {
    // checkbox: [true, 'inventoryId'],
    // operating: [true, { type: 0 }],
    // radio: [true, 'docNo'],
    // operating: [true, { type: 2 }],
    serial: true,
        width: [3, 3, 3, 3], //排除序号，多选，单选，操作栏
        match: [
        ['inventoryCode','inventoryName'],
        [{ key: 'docNo', href: true }],
        'customerName',
        'employeeName'
    ],
        head: [ '货品信息', '报价单号', '客户', '业务员'],
        newline: [0],
},
    tableCfg2: {
        // checkbox: [true, 'inventoryId'],
        // operating: [true, { type: 0 }],
        // radio: [true, 'docNo'],
        // operating: [true, { type: 2 }],
        serial: true,
        width: [3, 3, 3], //排除序号，多选，单选，操作栏
        match: [
                [{ key: 'inventoryCode', href: true }],
            'inventoryName',
            'inventorySpec'
        ],
        head: [ '货品编码', '货品名称', '规格型号'],
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
