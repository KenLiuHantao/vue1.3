export default {
    leftItemCfg: {
        headCfg: {
            add: [true,'上传草稿'],
            filter: false
        },
        /*
         * tab 配置
         */
        tabCfg: {
            select: '',
            tabBarData: [{
                id: 'tab1',
                name: '待正式导入',
                icon: '',
                params: {
                    main: {
                        key: 'firstIndustryCategoryCode',
                        url: __URL.osiu + 'import/init/supplier/industry',
                        words: {
                            title: ['firstIndustryCategoryName'],
                            right:'count'
                        },
                        param: {
                            "entCode": "",
                            "firstIndustryCategoryCode": "",
                            "firstIndustryCategoryName": "",
                            "tabIndex": 0,
                            "pageIndex": 1,
                            "pageSize": 50,
                        },
                    },
                }
            }, {
                id: 'tab2',
                name: '有异常',
                params: {
                    main: {
                        key: 'firstIndustryCategoryCode',
                        url: __URL.osiu + 'import/init/supplier/industry',
                        words: {
                            title: ['firstIndustryCategoryName'],
                            right:'count'
                        },
                        param: {
                            "entCode": "",
                            "firstIndustryCategoryCode": "",
                            "firstIndustryCategoryName": "",
                            "tabIndex": 1,
                            "pageIndex": 1,
                            "pageSize": 50,
                        },
                    },
                }
            }, {
                id: 'tab3',
                name: '已导入',
                params: {
                    main: {
                        key: 'firstIndustryCategoryCode',
                        url: __URL.osiu + 'import/init/supplier/industry',
                        words: {
                            title: ['firstIndustryCategoryName'],
                            right:'count'
                        },
                        param: {
                            "entCode": "",
                            "firstIndustryCategoryCode": "",
                            "firstIndustryCategoryName": "",
                            "tabIndex": 2,
                            "pageIndex": 1,
                            "pageSize": 50,
                        },
                    },
                }
            }]
        },
        /*
         * list 配置
         */
        listCfg: {
            hasNub: false,
            hasChild: false,
        },
        /*
         * filter 配置
         */
        filterCfg: [{
            label: '供应商名称:',
            key: 'supplierName',
            value: '',
            type: 'text',
            placeholder: '请输入供应商名称'
        }, {
            label: '开始时间:',
            key: 'startDocDate',
            value: '',
            type: 'date',
            placeholder: ''
        }, {
            label: '结束时间:',
            key: 'endDocDate',
            value: '',
            type: 'date',
            placeholder: ''
        }, ]
    },
    /*
     * table 配置
     */
    tableCfg1: {
        checkbox: [true, 'id'],
        operating: [true, 'config-operate',
            [{
                type: 'blue',
                btn: 'edit',
                text: '编辑'
            }, {
                type: 'danger',
                btn: 'delete',
                text: '删除'
            }]
        ],
        statusControl:[true,{
            'test': function (val) {
                if (val.status === 0) {
                    return false
                } else if (val.status === 1) {
                    return true
                }
            },
            'title':'分析状态',
            'success':'正常',
            'successStyle':{color:"#61BA5B"},
            'fail':'异常',
            'failStyle':{color:"red"}
        }],
        serial: true,
        width: [5, 3, 3, 3], //排除序号，多选，单选，操作栏
        match: [
            'supplierName',
            'currencyName',
            'employeeName',
            'firstIndustryCategoryName',
        ],
        head: ['供应商名称', '默认交易币种', '采购员', '行业分类',],
    },
    tableCfg2: {
        operating: [true, 'config-operate',
            [{
                type: 'blue',
                btn: 'edit',
                text: '编辑'
            }]
        ],
        statusControl:[true,{
            'test': function (val) {
                return true
            },
            'title':'分析状态',
            'success':'已导入',
            'successStyle':{color:"#61BA5B"},
            'fail':'未导入',
            'failStyle':{color:"red"}
        }],
        serial: true,
        width: [5, 3, 3, 3], //排除序号，多选，单选，操作栏
        match: [
            'supplierName',
            'currencyName',
            'employeeName',
            'firstIndustryCategoryName',
        ],
        head: ['供应商名称', '默认交易币种', '采购员', '行业分类',],
    },
}
