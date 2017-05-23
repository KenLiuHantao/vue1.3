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
                name: '未审核',
                icon: '',
                params: {
                    main: {
                        key: 'yearWeek',
                        url: __URL.warehouse + 'transfer/query/weeks/unaudit',
                        words: {
                            title: ['week', '(', 'weekBeginDate', ' ~ ', 'weekEndDate', ')'],
                            right: 'total'
                        },
                        param: { },
                    }
                }
            }, {
                id: 'tab2',
                name: '已审核',
                icon: '',
                params: {
                    main: {
                        key: 'yearMonth',
                        url: __URL.warehouse + 'transfer/query/months/audit',
                        words: {
                            title: ['month'],
                            right: 'total'
                        },
                        param: { },
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
        filterCfg: [{
            label: '调拨单号:',
            key: 'docNo',
            value: '',
            type: 'text',
            placeholder: '请输入调拨单号'
        }, {
            label: '调拨开始日期:',
            key: 'startDocDate',
            value: '',
            type: 'date',
            placeholder: '123'
        }, {
            label: '调拨结束日期:',
            key: 'endDocDate',
            value: '',
            type: 'date',
            placeholder: ''
        }, {
            label: '调出仓库:',
            key: 'outWarehouseCode',
            value: '',
            type: 'text',
            placeholder: '请输入调出仓库'
        }, {
            label: '调入仓库:',
            key: 'inWarehouseCode',
            value: '',
            type: 'text',
            placeholder: '请输入调入仓库'
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
        }]
    },
    /* 
     * table 配置
     */
    unauditTableCfg: {
        serial: true,
        width: [5, 5, 5, 5], //排除序号，多选，单选，操作栏
        match: [
            [{key: 'docNo', href: true }],
            'docDate',
            'outWarehouseName',
            'inWarehouseName'
        ],
        head: ['调拨单号', '调拨日期', '调出仓库', '调入仓库']
    },
    auditTableCfg: {
        serial: true,
        width: [5, 5, 5, 5], //排除序号，多选，单选，操作栏
        match: [
            [{key: 'docNo', href: true }],
            'docDate',
            'outWarehouseName',
            'inWarehouseName'
        ],
        head: ['调拨单号', '调拨日期', '调出仓库', '调入仓库']
    }
}
