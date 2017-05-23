/**
 * Created by SkyeTang on 2017/2/21.
 */
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
                id: 'customer',
                name: '业务员',
                icon: '',
                params: {
                    main: {
                        key: 'employeeCode',
                        url: __URL.arc + 'customer/upload/employee',
                        words: {
                            title: ['employeeName'],
                        },
                        param: {
                            "customerCategoryCode": "",
                            "employeeCode": "",
                            "pageIndex": 0,
                            "pageSize": 0
                        },
                    },
                }
            }, {
                id: 'employee',
                name: '客户分类',
                params: {
                    main: {
                        key: 'customerCategoryCode',
                        url: __URL.arc + 'customer/upload/category',
                        words: {
                            title: ['customerCategoryName'],
                        },
                        param: {
                            "customerCategoryCode": "",
                            "employeeCode": "",
                            "pageIndex": 0,
                            "pageSize": 0
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
            label: '客户名称:',
            key: 'customerName',
            value: '',
            type: 'text',
            placeholder: '请输入客户名称'
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
    tableCfg: {
        checkbox: [true, 'recordId'],
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
        // radio: [true, 'docNo'],
        serial: true,
        width: [5, 3, 3, 3, 3,3], //排除序号，多选，单选，操作栏
        match: [
            { key: 'customerName', href: true },
            'employeeName',
            'contactName',
            'contactDuty',
            'contactPhone',
            (val)=>{
                if(val.recordStatus == 0){
                    return '<span style="color:red">未通过</span>'
                }else if(val.recordStatus == 1){
                    return '已通过'
                }
            }
        ],
        head: ['名称', '业务员', '联系人', '职务', '联系电话','分析状态'],
    },

}
