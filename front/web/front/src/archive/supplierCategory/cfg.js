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
                name: '供应商分类',
                icon: '',
                params: {
                    main: {
                        key: 'supplierCategoryCode',
                        url: __URL.arc + 'supplier/category/search',
                        words: {
                            title: ['supplierCategoryName'],
                            // sub: [
                            //     ['二级菜单:', 'weekBeginDate'],
                            //     ['三级菜单:', 'weekEndDate'],
                            // ],
                            // right: 'weekBeginDate'
                        },
                        param: {
                            showAll:1
                        },
                    }
                }
            }]
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
        filterCfg: []
    },
    /* 
     * table 配置
     */
    tableCfg: {
        // checkbox:[true,'idCard'],
        operating: [true,'config-operate',
            [{
                type: 'blue',
                btn: 'edit',
                text: '编辑'
            }, {
                type: 'danger',
                btn: 'delete',
                text: '删除'
            }]],
        // operating: [true, { type: 0 }],
        // radio: [true, 'docNo'],
        serial:true,
        width: [5,15], //排除序号，多选，单选，操作栏
        match: [
            { key: 'supplierCategoryName', href:true },
            'remark',
        ],
        head: ['供应商分类', '备注', ],
    },
}
