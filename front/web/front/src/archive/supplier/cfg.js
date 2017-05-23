export default {
    leftItemCfg: {
        headCfg: {
            add: true,
            // addList:[{
            //     name:'新增',
            //     icon:'icon-hp_list__add'
            // },{
            //     name:'批量导入',
            //     icon:'icon-import'
            // }],
            filter: false
        },
        /* 
         * tab 配置
         */
        tabCfg: {
            select: '',
            tabBarData: [{
                id: 'tab1',
                name: '采购员',
                icon: '',
                params: {
                    main: {
                        key: 'employeeCode',
                        url: __URL.arc + 'supplier/employee',
                        words: {
                            title: ['employeeName']
                        },
                        param: {
                            "employeeName": "",
                            "keyWord": "",
                            "pageIndex": 1,
                            "pageSize": 0,
                            "supplierName": ""
                        },
                    }
                }
            }, {
                id: 'tab2',
                name: '供应商分类',
                icon: '',
                params: {
                    main: {
                        key: 'supplierCategoryCode',
                        url: __URL.arc + 'supplier/category',
                        words: {
                            title: ['supplierCategoryName']
                        },
                        param: {
                            "employeeName": "",
                            "keyWord": "",
                            "pageIndex": 1,
                            "pageSize": 0,
                            "supplierName": ""
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
        // checkbox: [true, 'inventoryId'],
        // operating: [true, { type: 0 }],
        // radio: [true, 'docNo'],
        serial:true,
        width: [3, 3, 3, 3, 3, 3], //排除序号，多选，单选，操作栏
        match: [
            { key:'supplierName',href:true},
            'employeeName',
            'payAgreementName',
            'payment',
            'contact'
        ],
        head: ['供应商名称', '采购员', '付款条件', '结算方式', '默认订单联系人'],
    },

    /* 
     * 新增供应商档案 配置
     */
    supplierCfg:{
        // "address": "",//地址 没了
        "attachments": [//附件
          // {
          //   "downloadUrl": "",//附件地址
          //   "fileId": "",//附件id
          //   "fileName": ""//附件名字
          // }
          // {
          //   eTag:'',
          //   ext:'',
          //   fileId:'',
          //   fileName:'',
          //   fileSize:'',
          //   mimeType:'',
          //   url:''
          // }
        ],
        // "code": "",//不管
        "contacts": [
            // {
                // "address": "string",
                // "contactCode": "string",
                // "contactName": "string",
                // "duty": "string",
                // "email": "string",
                // "major": true,
                // "phone": "string",
                // "recordVersion": 0
            // }
        ],//联系人
        // "currencyList": [//货币列表 没了
          // {
            // "code": "",//币种code  必填
            // "createTime": "",//不管
            // "creator": "",//不管
            // "entCode": "",//不管
            // "id": 0,//不管
            // "name": "",//名称 必填
            // "recordId": "",// 不管
            // "recordStatus": 0,//不管
            // "recordVersion": 0,//不管
            // "symbol": "",//不管
            // "updateTime": "",//不管
            // "updator": ""//不管
          // }
        // ],
        // "currencyStr": "",//所有币种用／连起来的字符串 没了
        "supplierCategoryCode": "",//供应商分类code  必填
        // "customerCategoryId": "",//供应商分类id 必填 没了
        "supplierCategoryName": "",//供应商分类名称 必填
        // "customerId": "",//新增不管 修改必填 没了
        "currencyCode": "",//默认币种 code必填
        "currencyName": "",//默认币种名称 必填
        // "email": "",//邮件 没了
        "employeeCode": "",// 跟单员 code 必填
        "employeeName": "",//跟单员 名称 必填
        "entCode": "",//不管
        "supplierName": "",//供应商名称 必填
        // "phone": "",//电话 没了
        // "recordVersion": 0,
        // "regionCode": "",//地区末级code
        // "regionName": "",//地区不管
        "remark": "",//备注
        "taxRate": "",//增值税率
        // "ucloudFileIds": "",//附件id ,连接
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
