//noinspection JSAnnotator
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
                name: '计量单位',
                icon: '',
                params: {
                    main: {
                        key: 'unitCode',
                        url: __URL.arc + 'unit/list',
                        words: {
                            title: ['unitName']
                        },
                        param: {
                            "unitCode": ""
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
            hasChild: false,
        }
    },
    /* 
     * table 配置
     */
    tableCfg: {
        serial:false,
        operating: [true, 'config-operate',
            [{
                type: 'normal',
                btn: 'modify',
                text: '编辑'
            }, {
                type: 'normal',
                btn: 'delete',
                text: '删除'
            }]
        ],
        width: [6, 6, 4],
        match: [
            'unitName',
            'unitShortName'
        ],
        head: ['计量单位', '简称单位']
    },

    /*
     * 新增计量单位 配置
     */
    unitCfg:{
        "unitCode":"",
        "unitName":"",
        "unitShortName": "",
        "recordVersion":""
    },
    unitModalCfg: {
        show: false,
        width: '320px',
        height: 'auto',
        header: '添加计量单位',
        btn: [{
            name: '取消',
            emit: 'close',
        }, {
            name: '确定',
            emit: 'sure',
        }]
    },
}
