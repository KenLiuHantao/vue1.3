export default {

    parameterDigitalTableCfg: {
        serial: true,
        operating: [true, 'config-operate',
            [{
                type: 'blue',
                btn: 'parameterDigitalModify',
                text: '编辑'
            }]
        ],
        width: [3, 3, 3, 11], //排除序号，多选，单选，操作栏
        firstItemTextAlignLeft: true,
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
            }
        ],
        head: ['数据格式', '数据总长度', '小数位长度', '小数位处理方式'],
    },

    currencyTableCfg: {
        serial: true,
        operating: [true, 'config-operate',
            [{
                type: 'blue',
                btn: 'currencyModify',
                text: '编辑',
                func: function (val) {
                    return val.opt;
                }
            }]
        ],
        width: [3, 3, 3, 11], //排除序号，多选，单选，操作栏
        firstItemTextAlignLeft: true,
        match: [
            'accMonth',
            'startDate',
            'endDate',
            'rate',
        ],
        head: ['会计月份', '开始日期', '结束日期', '汇率'],
    },

    bankTableCfg: {
        serial: true,
        operating: [true, 'config-operate',
            [{
                type: 'blue',
                btn: 'bankModify',
                text: '编辑',
                func: function (val) {
                    return val.isUsing;
                }
            }, {
                type: 'danger',
                btn: 'bankDisable',
                text: '停用',
                func: function (val) {
                    return val.isUsing;
                }
            }, {
                type: 'blue',
                btn: 'bankEnable',
                text: '启用',
                func: function (val) {
                    return !val.isUsing;
                }
            }]
        ],
        width: [5, 5, 5, 2, 3], //排除序号，多选，单选，操作栏
        firstItemTextAlignLeft: true,
        match: [
            'account',
            'accountBranch',
            'accountNumber',
            function (val) {
                return val.isUsing ? "已启用" : "已停用";
            },
            {href: true, key: 'isDefault'}

        ],
        head: ['账号名', '开户银行网点', '开户账号', '状态', '默认账户'],
    },

    paymentTableCfg: {
        serial: true,
        operating: [true, 'config-operate',
            [{
                type: 'blue',
                btn: 'paymentModify',
                text: '编辑'
            }]
        ],
        width: [4, 16], //排除序号，多选，单选，操作栏
        firstItemTextAlignLeft: true,
        match: [
            'paymentName',
            'remark'
        ],
        head: ['结算方式', '备注'],
    },

    taxRateTableCfg: {
        serial: true,
        operating: [true, "config-operate",
            [{
                type: 'blue',
                btn: 'taxRateModify',
                text: '编辑'
            }]
        ],
        width: [4, 16], //排除序号，多选，单选，操作栏
        firstItemTextAlignLeft: true,
        match: [
            'taxRate',
            'taxTypeName'
        ],
        head: ['税率%', '税种']
    },

    recAgreementTableCfg: {
        serial: true,
        operating: [true, 'config-operate',
            [{
                type: 'blue',
                btn: 'recAgreementModify',
                text: '编辑'
            }]
        ],
        width: [4, 4, 6, 2], //排除序号，多选，单选，操作栏
        firstItemTextAlignLeft: true,
        match: [
            'recAgreementName',
            'initialDay',
            'deviationDay',
            'remark'
        ],
        head: ['名称', '起算日', '账期日', '备注'],
    },

    payAgreementTableCfg: {
        serial: true,
        operating: [true, 'config-operate',
            [{
                type: 'blue',
                btn: 'payAgreementModify',
                text: '编辑'
            }]
        ],
        width: [4, 4, 6, 2], //排除序号，多选，单选，操作栏
        firstItemTextAlignLeft: true,
        match: [
            'payAgreementName',
            'initialDay',
            'deviationDay',
            'remark'
        ],
        head: ['名称', '起算日', '账期日', '备注'],
    },

    warehouseTableCfg: {
        serial: true,
        operating: [true, 'config-operate',
            [{
                type: 'blue',
                btn: 'warehouseModify',
                text: '编辑'
            }, {
                type: 'danger',
                btn: 'warehouseDisable',
                text: '停用',
                func: function (val) {
                    return val.status.trim() == "已启用";
                }
            }, {
                type: 'blue',
                btn: 'warehouseEnable',
                text: '启用',
                func: function (val) {
                    return val.status.trim() == "已停用";
                }
            }]
        ],
        width: [4, 16], //排除序号，多选，单选，操作栏
        firstItemTextAlignLeft: true,
        match: [
            'warehouseName',
            ''
        ],
        statusControl:[true,{
            'test': function (val) {
                if (val.status !== '已启用') {
                    return false
                } else if (val.status === '已启用') {
                    return true
                }
            },
            'title':'状态',
            'success':'已启用',
            'successStyle':{color:"#61BA5B"},
            'fail':'未启用',
            'failStyle':{color:"red"}
        }],
        head: ['名称', '']
    },

    unitTableCfg: {
        serial: true,
        operating: [true, 'config-operate',
            [{
                type: 'blue',
                btn: 'unitModify',
                text: '编辑'
            }]
        ],
        width: [4, 16],
        firstItemTextAlignLeft: true,
        match: [
            'unitName',
            'unitShortName'
        ],
        head: ['计量单位', '简称单位']
    },

    bankCfg: {
        "account": "",
        "bankCode": "",
        "bankName": "",
        "accountBranch": "",
        "currencyCode": "",
        "currencyName": "",
        "accountNumber": ""
    }

}
