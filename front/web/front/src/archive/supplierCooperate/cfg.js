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
                name: '未合作',
                icon: '',
                params: {
                    main: {
                        key: 'firstIndustryCategoryName',
                        url: __URL.arc + 'supplier/firstIndustryGroup',
                        words: {
                            title: ['firstIndustryCategoryName']
                        },
                        param: {
                            "employeeName": "",
                            "firstIndustryCategoryCode":'',
                            "keyWord": "",
                            "pageIndex": 1,
                            "pageSize": 0,
                            "supplierName": "",
                            "supplierStatus":'A'
                        },
                    }
                }
            }, {
                id: 'tab2',
                name: '合作中',
                icon: '',
                params: {
                    main: {
                        key: 'firstIndustryCategoryName',
                        url: __URL.arc + 'supplier/firstIndustryGroup',
                        words: {
                            title: ['firstIndustryCategoryName']
                        },
                        param: {
                            "employeeName": "",
                            "firstIndustryCategoryCode":'',
                            "keyWord": "",
                            "pageIndex": 1,
                            "pageSize": 0,
                            "supplierName": "",
                            "supplierStatus":'B'
                        },
                    }
                }
            },{
                id: 'tab3',
                name: '冻结中',
                icon: '',
                params: {
                    main: {
                        key: 'firstIndustryCategoryName',
                        url: __URL.arc + 'supplier/firstIndustryGroup',
                        words: {
                            title: ['firstIndustryCategoryName']
                        },
                        param: {
                            "employeeName": "",
                            "firstIndustryCategoryCode":'',
                            "keyWord": "",
                            "pageIndex": 1,
                            "pageSize": 0,
                            "supplierName": "",
                            "supplierStatus":'C'

                        },
                    }
                }
            },{
                id: 'tab4',
                name: '已终止',
                icon: '',
                params: {
                    main: {
                        key: 'firstIndustryCategoryName',
                        url: __URL.arc + 'supplier/firstIndustryGroup',
                        words: {
                            title: ['firstIndustryCategoryName']
                        },
                        param: {
                            "employeeName": "",
                            "firstIndustryCategoryCode":'',
                            "keyWord": "",
                            "pageIndex": 1,
                            "pageSize": 0,
                            "supplierName": "",
                            "supplierStatus":'D'

                        },
                    }
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
            label: '采购员:',
            key: 'employeeName',
            value: '',
            type: 'text',
            placeholder: '请输入采购员'
        }, ]
    },
    /*
     * table 配置
     */
    tableCfg: {
        serial:true,
        width: [3, 3, 3, 3, 3, 3], //排除序号，多选，单选，操作栏
        match: [
            { key:'supplierName',href:true},
            'employeeName',
            'payAgreementName',
            'paymentName',
            'contact'
        ],
        head: ['供应商名称', '采购员', '付款条件', '结算方式', '默认订单联系人'],
    },

    /*
     * 新增供应商档案 配置
     */
    supplierCfg:{
        "attachments": [
        ],
        "contacts": [
        ],
        "supplierCategoryCode": "",//供应商分类code  必填
        "supplierCategoryName": "",//供应商分类名称 必填
        "currencyCode": "",//默认币种 code必填
        "currencyName": "",//默认币种名称 必填
        "employeeCode": "",// 跟单员 code 必填
        "employeeName": "",//跟单员 名称 必填
        "entCode": "",//不管
        "supplierName": "",//供应商名称 必填
        "remark": "",//备注
        "taxRate": "",//增值税率
        "payAgreementCode": "",//付款条件条件code
        "payAgreementName": "",//付款条件name
        "paymentCode": "",//结算方式code
        "paymentName": "",//结算方式name
        "firstIndustryCategoryCode":"",//行业分类code
        "firstIndustryCategoryName":"",//行业分类name
        "secondIndustryCategoryCode":"",//行业分类code
        "secondIndustryCategoryName":"",//行业分类name
    },
    /*
     * 附件 配置
     */
    upfileCfg:{
        extensions: 'txt, doc, docx, xls, xlsx, ppt, pptx, wps, rtf, pdf, xmind, rp,rar, zip, gz, z, 7z,bmp, gif, jpg, jpeg, pic, png, tif,ai, psd, cdr,svg',
        max:6
    },
}
