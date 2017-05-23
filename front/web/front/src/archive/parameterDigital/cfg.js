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
                    name: '数据格式',
                    icon: '',
                    params: {
                        main: {
                            key: 'code',
                            url: __URL.arc + 'parameter/digital/list',
                            words: {
                                title: ['name']
                            },
                            param: {}
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
            hasChild: false,
        }
    },
    digitalCfg: {
        "code": ""
    },
    tableCfg: {
        // checkbox: [true, 'recordId'],
        // operating: [true, {type: 0}],
        // radio: [true, 'docNo'],
        serial: false,
        width: [5, 4, 4, 4, 3], //排除序号，多选，单选，操作栏
        match: [
            'name',
            'length',
            'decimal',
            function (item) {
                if (item.decFormatter == 'zero') {
                    return '不足位补零'
                }
                if (item.decFormatter == 'zeroless') {
                    return '不足位去零'
                }
                return '';
            },
            [{key: 'operate', href: true}]
        ],
        head: ['数据格式', '数据总长度', '小数位长度', '小数位处理方式', '操作'],
    },
}
