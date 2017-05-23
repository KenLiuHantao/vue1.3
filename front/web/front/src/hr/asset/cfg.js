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
                name: '使用中',
                icon: '',
                params: {
                    main: {
                        key: 'assetCategoryCode',
                        url: __URL.hr + 'asset/category/list',
                        words: {
                            title: ['assetCategoryName'],
                        },
                        param: {
                            "pageIndex": 0,
                            "pageSize": 0,
                            'assetStatus':'1',
                        },
                    }
                }
            }, {
                id: 'tab2',
                name: '闲置',
                icon: '',
                params: {
                    main: {
                        key: 'assetCategoryCode',
                        url: __URL.hr + 'asset/category/list',
                        words: {
                            title: ['assetCategoryName'],
                        },
                        param: {
                            "pageIndex": 0,
                            "pageSize": 0,
                            'assetStatus':'0',
                        },
                    },
                }
            }, {
                id: 'tab3',
                name: '已报废',
                icon: '',
                params: {
                    main: {
                        key: 'assetCategoryCode',
                        url: __URL.hr + 'asset/category/list',
                        words: {
                            title: ['assetCategoryName'],
                        },
                        param: {
                            "pageIndex": 0,
                            "pageSize": 0,
                            'assetStatus':'-1',
                        },
                    },
                }
            } ]
        },
        /*
         * list 配置
         */
        listCfg: {
            hasNub: true,
            hasChild: false,
        },
        /*
         * filter 配置
         */
        filterCfg: [{
            label: '工号:',
            key: 'jobNumber',
            value: '',
            type: 'text',
            placeholder: '请输入工号'
        }, {
            label: '姓名:',
            key: 'employeeName',
            value: '',
            type: 'text',
            placeholder: '请输入员工姓名'
        }, {
            label: '入职日期:',
            key: 'enterDateStart',
            value: '',
            type: 'date',
            config:{
                placeholder:'请输入入职日期'
            }
        },{
            label: '入职日期:',
            key: 'enterDateEnd',
            value: '',
            type: 'date',
            config:{
                placeholder:'请输入入职日期'
            }
        },{
            label: '离职申请日期:',
            key: 'applicationDateStart',
            value: '',
            type: 'date',
            config:{
                placeholder:'请输入离职申请日期'
            }
        },{
            label: '离职申请日期:',
            key: 'applicationDateEnd',
            value: '',
            type: 'date',
            config: {
                placeholder:'请输入离职申请日期'
            }
        },]
    },
    /*
     * table 配置
     */
    tableCfg: {
        // checkbox: [true, 'inventoryId'],
        operating: [true,"config-operate",
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
        // radio: [true, 'docNo'],
        //  operating: [true, { type: 2 }],
        serial:true,
        width: [4, 4, 4, 2, 3, 3], //排除序号，多选，单选，操作栏
        match: [
            [ { key: 'assetName', href: true }, 'spec'],
            // [{ key: 'docNo', href: true }],
            'assetCode',
            'purchaseDate',
            'purchasePrice',
            'employeeName',
            'userName'
        ],
        head: ['资产名称', '资产编号', '购入时间', '金额', '监管人', '使用人'],
    }
}
