<script>
    import cfg from './cfg.js'
    import newBank from './newBank'
    import editBank from './editBank'
    export default {
        components: {
            newBank,
            editBank,
        },
        ready() {

            this.init();
            this.choiceTab(0);
        },
        data() {
            return {
                tableData: [],
                listDetail: [],
                editBankConfig: {
                    show: false,
                    width: '410px',
                    height: 'auto',
                    header: '编辑银行',
                    btn: [{
                        name: '取消',
                        emit: 'close'
                    }, {
                        name: '确定',
                        emit: 'sure'
                    }],
                },
                dig: {
                    "code": "",
                    "name": "",
                    "decimal": '',
                    "length": '',
                    "decFormatter": "",
                    "recordVersion": 0
                },
                parameterDigitalModalConfig: {
                    show: false,
                    width: '410px',
                    height: 'auto',
                    header: '修改数据格式',
                    btn: [{
                        name: '取消',
                        emit: 'close',
                    }, {
                        name: '确定',
                        emit: 'sure',
                    }],
                },
                taxRateData: {},
                ckdCode: '',
                openCode: '',
                activeTab: 1,
                wCfg: {
                    show: false,
                    content: '',
                    type: 'warning'
                },
                currencyConfig: {
                    show: false,
                    width: '700px',
                    height: '500px',
                    header: '币种设置',
                    btn: [{
                        name: '取消',
                        emit: 'codeclose'
                    }, {
                        name: '确定',
                        emit: 'codesure'
                    }]
                },
                ajaxlock: true,
                selectTable: '',
                addShow: false,
                exchangeModalConfig: {
                    show: false,
                    width: '410px',
                    height: 'auto',
                    header: '汇率维护',
                    btn: [{
                        name: '取消',
                        emit: 'close',
                    }, {
                        name: '确定',
                        emit: 'sure',
                    }]
                },
                taxRateModalConfig: {
                    show: false,
                    width: '410px',
                    height: 'auto',
                    header: '新增税率',
                    btn: [{
                        name: '取消',
                        emit: 'close',
                    }, {
                        name: '确定',
                        emit: 'sure',
                    }]
                },
                paymentCfg: {},
                recModalCfg: {
                    show: false,
                    width: '410px',
                    height: 'auto',
                    header: '新增收付款协议',
                    btn: [{
                        name: '取消',
                        emit: 'close',
                    }, {
                        name: '确定',
                        emit: 'sure',
                    }]
                },
                paymentModalCfg: {
                    show: false,
                    width: '410px',
                    height: 'auto',
                    header: '新增结算方式',
                    btn: [{
                        name: '取消',
                        emit: 'close',
                    }, {
                        name: '确定',
                        emit: 'sure',
                    }]
                },
                way: [
                    {format: "zero", method: "不足位补零", selected: false},
                    {format: "zeroless", method: "不足位去零", selected: false}
                ],
                taxRateEdit: false,
                payModalCfg: {
                    show: false,
                    width: '410px',
                    height: 'auto',
                    header: '新增收付款协议',
                    btn: [{
                        name: '取消',
                        emit: 'close',
                    }, {
                        name: '确定',
                        emit: 'sure',
                    }]
                },
                bankDetail: {},
                currencySelectShow: false,
                warehouseModalCfg: {
                    show: false,
                    width: '410px',
                    height: 'auto',
                    header: '新增仓库',
                    btn: [{
                        name: '取消',
                        emit: 'close',
                    }, {
                        name: '确定',
                        emit: 'sure',
                    }]
                },
                checkedCurrency: [],
                yearList: [],
                unitModalCfg: {
                    show: false,
                    width: '410px',
                    height: 'auto',
                    header: '新增计量单位',
                    btn: [{
                        name: '取消',
                        emit: 'close',

                    }, {
                        name: '确定',
                        emit: 'sure',
                    }]
                },
                addBankConfig: {
                    show: false,
                    width: '410px',
                    height: 'auto',
                    header: '新增银行',
                    btn: [{
                        name: '取消',
                        emit: 'quite'
                    }, {
                        name: '确定',
                        emit: 'sure'
                    }],
                },
                recInitialDay: ["出库日期", "出库月末日期", ""],

                payInitialDay: ["入库日期", "入库月末日期", ""],

                warehouseData: [{
                    "warehouseCategoryName": "货品仓库",
                    "warehouseCategoryCode": "001"
                }, {
                    "warehouseCategoryName": "行政仓库",
                    "warehouseCategoryCode": "002"
                }],

                warehouseSaveCfg: {
                    "warehouseCategoryName": "",
                    "warehouseCategoryCode": "",
                    "warehouseCode": "",
                    "warehouseName": "",
                    "status": "",
                },

                unitSaveCfg: {
                    "unitCode": "",
                    "unitName": "",
                    "unitShortName": "",
                },

                recSaveCfg: {
                    "recAgreementCode": "",
                    "recAgreementName": "",
                    "initialDay": "",
                    "deviationDay": "",
                    "remark": "",
                },

                paySaveCfg: {
                    "payAgreementCode": "",
                    "payAgreementName": "",
                    "initialDay": "",
                    "deviationDay": "",
                    "remark": "",
                },
            }
        },
        methods: {
            /* 公用方法 */
            assign(base, target) {
                let tk = Object.keys(target)

                for (let i in base) {
                    if (tk.indexOf(i) != -1) {
                        target[i] = base[i]
                    }
                }
            },

            init(){
                this.firstDetail = [{
                    id: "parameterDigital",
                    name: "数据格式设置",
                    children: [],
                    url: __URL.arc + 'parameter/digital/list',
                    param: {}
                },
                    {id: "currency", name: "币种与汇率设置", children: [], url: __URL.arc + 'currency/list', param: {}},
                    {id: "bank", name: "银行设置", children: [], url: __URL.arc + '/bankaccount/bank/list', param: {}},
                    {id: "payment", name: "结算方式设置", url: __URL.arc + 'payment/list', children: [], param: {}},
                    {id: "taxRate", name: "税率设置", url: __URL.arc + 'taxrate/list', param: {}, children: []},
                ];

                this.secondDetail = [{
                    id: "recAgreement",
                    name: "销售收款协议设置",
                    children: [],
                    url: __URL.arc + 'rec/agreement/detail/list',
                    param: {}
                }, {
                    id: "payAgreement",
                    name: "采购付款协议设置",
                    children: [],
                    url: __URL.arc + 'pay/agreement/detail/list',
                    param: {}
                }, {
                    id: "warehouse",
                    name: "仓库设置",
                    children: [{
                        id: "inventoryWarehouse",
                        secondName: "货品仓库",
                        url: __URL.arc + 'warehouse/list',
                        param: {
                            'warehouseCategoryCode': '001',
                            'warehouseCode': ''
                        }
                    }, {
                        id: "adminWarehouse", secondName: "行政仓库",
                        url: __URL.arc + 'warehouse/list',
                        param: {
                            'warehouseCategoryCode': '002',
                            'warehouseCode': ''
                        }
                    }],
                    url: '',
                    param: {}
                }, {
                    id: "unit", name: "计量单位设置",
                    url: __URL.arc + 'unit/list',
                    children: [],
                    param: {}
                },
                ];

                this.thirdDetail = []
                this.getCurrencyAccYear();
                this.getBankData();

            },

            // table返回的操作参数
            operate(type, item) {
                switch (type) {
                    case 'parameterDigitalModify':
                        this.assign(item, this.dig);
                        this.parameterDigitalModalConfig.show = true;
                        return;
                    case 'currencyModify':
                        this.exchangeRateData = item;
                        this.exchangeRateData.accYear = this.accYear;
                        this._exchangeRateData =  JSON.parse(JSON.stringify(this.exchangeRateData));
                        this.exchangeModalConfig.show = true;
                        return;
                    case 'bankModify':
                        var params = JSON.parse(JSON.stringify(item));
                        params.isDefault = params.isDefault == '默认账户' ? true : false;
                        this.bankDetail = params;
                        this.editBankConfig.show = true;
                        return;
                    case 'bankDisable':
                        this.updateUsing(item,0);
                        return;
                    case 'bankEnable':
                        this.updateUsing(item,1);
                        return;
                    case 'paymentModify':
                        this.paymentModalCfg.header = '修改结算方式';
                        this.$http.get(__URL.arc + 'payment/detail/' + item.paymentCode).then(
                            (res) => {
                                this.paymentCfg = res.data.data;
                                this.paymentModalCfg.show = true;
                            }
                        );
                        return;
                    case 'taxRateModify':
                        this.taxRateData = item;
                        this.taxRateModalConfig.header = '修改税率';
                        this.taxRateModalConfig.show = true;
                        this.taxRateEdit = true;
                        return;
                    case 'recAgreementModify':
                        this.recModalCfg.header = '修改收付款协议';
                        this.$http.get(__URL.arc + 'rec/agreement/detail/' + item.recAgreementCode).then(
                            (res) => {
                                this.recSaveCfg = res.data.data;
                                this.recModalCfg.show = true;
                                console.log(this.recSaveCfg)
                            }
                        );
                        return;

                    case 'payAgreementModify':
                        this.payModalCfg.header = '修改收付款协议';
                        this.$http.get(__URL.arc + 'pay/agreement/detail/' + item.payAgreementCode).then(
                            (res) => {
                                this.paySaveCfg = res.data.data;
                                this.payModalCfg.show = true;
                            }
                        );
                        return;

                    case 'warehouseModify':
                        this.warehouseModalCfg.header = '修改仓库';
                        this.$http.get(__URL.arc + 'warehouse/detail/' + item.warehouseCode).then(
                            (res) => {
                                this.warehouseSaveCfg = res.data.data;
                                this.warehouseModalCfg.show = true;
                            }
                        );
                        return;

                    case 'unitModify':
                        this.unitModalCfg.header = '修改计量单位';
                        this.$http.get(__URL.arc + 'unit/detail/' + item.unitCode).then(
                            (res) => {
                                this.unitSaveCfg = res.data.data;
                                this.unitModalCfg.show = true;
                            }
                        );
                        return;

                    case 'warehouseEnable':
                        this.warehouseUpdateStatus(item, 1);
                        return;

                    case 'warehouseDisable':
                        this.warehouseUpdateStatus(item, 0);
                        return;

                }
            },

            warehouseUpdateStatus(item, status){
                let updateStatus = {
                    "warehouseCode": item.warehouseCode,
                    "recordVersion": item.recordVersion,
                    "recordStatus": status
                }
                this.$http.post(__URL.arc + 'warehouse/update/status', updateStatus).then(
                    (res) => {
                        if (res.data.success) {
                            this.wCfg.show = true;
                            this.wCfg.type = "success";
                            if (status == 1) {
                                this.wCfg.content = "启用成功";
                                item.status = '已启用'
                            } else {
                                this.wCfg.content = "停用成功";
                                item.status = '已停用'
                            }
                        } else {
                            this.wCfg.show = true;
                            this.wCfg.type = "failure";
                            this.wCfg.content = res.data.errMsg;
                        }
                    }
                );
            },

            href(item, type) {
                //银行设置默认银行
                this.$http.get(__URL.arc + 'bankaccount/update/default/' + item.bankAccountCode).then(
                    res => {
                        if (res.data.success) {
                            this.refresh("success", "设置成功");
                        } else {
                            this.wCfg.type = "failure";
                            this.wCfg.content = res.data.errMsg;
                            this.wCfg.show = true;
                        }
                    }
                )
            },

            getCurrencyData(){
                //币种特殊处理
                this.$http.post(__URL.arc + 'currency/list', {}).then(
                    res => {
                        if (res.data.success) {
                            this.firstDetail[1].children = res.data.data.dataList;
                            for (var i = 0; i < this.firstDetail[1].children.length; i++) {
                                this.firstDetail[1].children[i].secondName = this.firstDetail[1].children[i].currencyName
                                this.firstDetail[1].children[i].url = __URL.arc + "exchangeRate/detail/list";
                                this.firstDetail[1].children[i].id = this.firstDetail[1].children[i].currencyCode;
                                this.firstDetail[1].children[i].param = {
                                    accYear: this.accYear,
                                    currencyCode: this.firstDetail[1].children[i].currencyCode
                                }
                            }
                        } else {
                            this.wCfg.show = true
                            this.wCfg.content = res.data.errMsg
                        }
                    }
                );

            },
            getBankData(){
                //币种特殊处理
                this.$http.post(__URL.arc + '/bankaccount/bank/list', {}).then(
                    res => {
                        if (res.data.success) {
                            this.firstDetail[2].children = res.data.data.dataList;
                            for (var i = 0; i < this.firstDetail[2].children.length; i++) {
                                this.firstDetail[2].children[i].secondName = this.firstDetail[2].children[i].bankName
                                this.firstDetail[2].children[i].url = __URL.arc + "bankaccount/list";
                                this.firstDetail[2].children[i].id = this.firstDetail[2].children[i].bankCode;
                                this.firstDetail[2].children[i].param = {
                                    bankCode: this.firstDetail[2].children[i].bankCode
                                }
                            }
                        } else {
                            this.wCfg.type = "failure";
                            this.wCfg.content = res.data.errMsg;
                            this.wCfg.show = true;
                        }
                    }
                );

            },
            currencyCb(obj){
                this.checkedCurrency = [];
                for (var i = 0; i < obj.length; i++) {
                    this.checkedCurrency.push(obj[i].currencyCode);
                }
                this.$http.post(__URL.arc + 'currency/save', {"codes": this.checkedCurrency}).then(
                    (res) => {
                        if (res.data.success) {
                            this.currencyConfig.show = false;
                            this.wCfg.show = true
                            this.refresh('success','保存成功' );
                        } else {
                            this.currencyConfig.show = true;
                            this.wCfg.show = true;
                            this.wCfg.type=""
                            this.wCfg.content = res.data.errMsg
                        }
                    }
                )
            },
            getCurrencyAccYear(){
                this.$http.post(__URL.arc + 'accountingPeriod/year').then(
                    (res) => {
                        this.yearList = res.data.data
                        this.accYear = this.yearList[0]
                        this.getCurrencyData();
                    }
                )
            },

            //新增按钮事件
            addNew(item, index){
                switch (this.selectTable) {
                    case 'recAgreement':
                        this.recSaveCfg = '';
                        this.recModalCfg.header = '新增收付款协议';
                        this.recModalCfg.show = true;
                        return;
                    case 'payAgreement':
                        this.paySaveCfg = '';
                        this.payModalCfg.header = '新增收付款协议';
                        this.payModalCfg.show = true;
                        return;
                    case 'warehouse':
                        this.warehouseSaveCfg = '';
                        this.warehouseModalCfg.header = '新增仓库';
                        this.warehouseModalCfg.show = true;
                        return;
                    case 'unit':
                        this.unitSaveCfg = '';
                        this.unitModalCfg.header = '新增计量单位';
                        this.unitModalCfg.show = true;
                        return;
                    case 'bank' :
                        this.addBankConfig.show = true;
                        return;
                    case 'payment' :
                        this.paymentCfg = '';
                        this.paymentModalCfg.header = '新增结算方式';
                        this.paymentModalCfg.show = true;
                        return;
                    case 'taxRate' :
                        this.taxRateModalConfig.header = '新增税率';
                        this.taxRateModalConfig.show = true;
                        this.taxRateEdit = false
                        this.taxRateData = {
                            taxTypeCode: '',
                            taxTypeName: '',
                        }
                        return;
                }
            },
            currencyAddNew(){
                this.currencyConfig.show = true;
            },
            //刷新外页
            refresh(type,text){
                if (type && text) {
                    this.wCfg.type = type;
                    this.wCfg.content = text;
                    this.wCfg.show = true;
                }
                this.reset();
            },

            reset() {
                this.init();
                this.choiceTab(this.activeTab);
                this.tableData = []
            },

            //保存按钮事件
            savePayment(){
                //保存前校验
                if (this.paymentCfg.paymentName == undefined || this.paymentCfg.paymentName == '') {
                    this.wCfg.content = '结算方式名称不能为空'
                    this.wCfg.show = true;
                    return;
                }
                let url = __URL.arc + 'payment/insert';
                if (undefined != this.paymentCfg.paymentCode && this.paymentCfg.paymentCode != '') {
                    url = __URL.arc + 'payment/update';
                }
                this.$http.post(url, this.paymentCfg).then(
                    (res) => {
                        if (res.data.success) {
                            this.paymentModalCfg.show = false;
                            this.wCfg.show = true
                            this.refresh('success','保存成功' );
                        } else {
                            this.paymentModalCfg.show = true;
                            this.wCfg.show = true
                            this.wCfg.type = "failure";
                            this.wCfg.content = res.data.errMsg
                        }
                    }
                )

            },
            saveTaxRate() {
                let url = __URL.arc + 'taxrate/insert';
                if (this.taxRateEdit) {
                    url = __URL.arc + 'taxrate/update';
                }
                this.$http.post(url, this.taxRateData).then(
                    (res) => {
                        if (res.data.success) {
                            this.taxRateModalConfig.show = false;
                            this.wCfg.show = true
                            this.refresh('success','保存成功' );
                        } else {
                            this.taxRateModalConfig.show = true;
                            this.wCfg.show = true
                            this.wCfg.type = "failure";
                            this.wCfg.content = res.data.errMsg
                        }
                    }
                )
            },
            //银行启用停用
            updateUsing(item,status){
                item.isUsing = !item.isUsing;
                this.$http.post(__URL.arc + 'bankaccount/update/using', item).then(
                    res => {
                        if (res.data.success) {
                            this.wCfg.show = true;
                            this.wCfg.type = "success";
                            if (status == 1) {
                                this.wCfg.content = "启用成功";
                                item.isUsing = true
                            } else {
                                this.wCfg.content = "停用成功";
                                item.isUsing = false
                            }
                        } else {
                            this.wCfg.show = true;
                            this.wCfg.type = "failure";
                            this.wCfg.content = res.data.errMsg;
                        }
                    }
                )
            },

            //数据精度设置修改确认
            saveParameterDigital(){
                this.$http.post(__URL.arc + 'parameter/digital/update', this.dig).then(
                    (res) => {
                        if (res.data.success) {
                            this.parameterDigitalModalConfig.show = false;
                            this.wCfg.show = true
                            this.refresh('success','保存成功' );
                        } else {
                            this.parameterDigitalModalConfig.show = true;
                            this.wCfg.show = true
                            this.wCfg.type = "failure";
                            this.wCfg.content = res.data.errMsg
                        }
                    }
                )
            },
            //保存币种汇率
            saveExchange(){
                this.$http.post(__URL.arc + 'exchangeRate/update', this._exchangeRateData).then(
                    (res) => {
                        if (res.data.success) {
                            this.exchangeModalConfig.show = false;
                            this.wCfg.show = true
                            this.refresh('success','保存成功' );
                        } else {
                            this.exchangeModalConfig.show = true;
                            this.wCfg.show = true
                            this.wCfg.type = "failure";
                            this.wCfg.content = res.data.errMsg
                        }
                    }
                )
            },

            choiceTab(index){

                this.activeTab = index;
                this.openCode = ''
                this.ckdCode = ''
                this.tableData = []
                switch (index) {
                    case 0:
                        this.listDetail = this.firstDetail
                        //银行和币种有2级菜单
                        break
                    case 1:
                        this.listDetail = this.secondDetail
                        break
                    case 2:
                        this.listDetail = this.thirdDetail
                        break
                }
            },

            //点击一级
            openFirst(item, index) {
                //选中事件
                this.ckdCode = item.id;
                this.tableData = []
                //展开事件
                if (this.openCode == item.id) {
                    this.openCode = ''
                } else {
                    this.openCode = item.id
                }
                if (item.children.length == 0) {
                    this.getTable(item)
                }
                this.selectTable = item.id
                if (item.id == 'currency') {
                    this.currencySelectShow = true;
                } else {
                    this.currencySelectShow = false;
                }
            },

            choiceSec(first, sec) {
                this.tableData = []
                this.ckdCode = first.id.toString() + sec.id.toString();
                this.getTable(sec, first.id);
                this.selectTable = first.id
            },

            getTable(item, type){
                var param = item.param;
                this.$http.post(item.url, param).then(
                    (res) => {
                        if (res.data.success) {
                            var data = res.data.data.dataList;
                            if (type == "bank") {
                                for (var i = 0; i < data.length; i++) {
                                    data[i].isDefault = data[i].isDefault ? "默认账户" : "设为默认";
                                }
                            }
                            this.tableData = data;
                        } else {
                            this.wCfg.show = true
                            this.wCfg.type = "failure";
                            this.wCfg.content = res.data.errMsg
                        }
                    }
                )
            },

            saveRecAgreement(){
                if (undefined == this.recSaveCfg.recAgreementName || this.recSaveCfg.recAgreementName == '') {
                    this.wCfg.content = '收款协议名称不能为空'
                    this.wCfg.show = true;
                    return;
                }
                let url = __URL.arc + 'rec/agreement/insert';
                if (undefined != this.recSaveCfg.recAgreementCode && this.recSaveCfg.recAgreementCode != '') {
                    url = __URL.arc + 'rec/agreement/update';
                }
                this.$http.post(url, this.recSaveCfg).then(
                    (res) => {
                        if (res.data.success) {
                            this.recModalCfg.show = false;
                            this.wCfg.show = true
                            this.refresh('success','保存成功' );
                        } else {
                            this.recModalCfg.show = true;
                            this.wCfg.type = "failure";
                            this.wCfg.show = true
                            this.wCfg.content = res.data.errMsg
                        }
                    }
                )
            },
            savePayAgreement(){
                if (undefined == this.paySaveCfg.payAgreementName || this.paySaveCfg.payAgreementName == '') {
                    this.wCfg.content = '付款协议名称不能为空'
                    this.wCfg.show = true;
                    return;
                }
                let url = __URL.arc + 'pay/agreement/insert';
                if (undefined != this.paySaveCfg.payAgreementCode && this.paySaveCfg.payAgreementCode != '') {
                    url = __URL.arc + 'pay/agreement/update';
                }
                this.$http.post(url, this.paySaveCfg).then(
                    (res) => {
                        if (res.data.success) {
                            this.payModalCfg.show = false;
                            this.wCfg.show = true
                            this.refresh('success','保存成功' );
                        } else {
                            this.payModalCfg.show = true;
                            this.wCfg.show = true
                            this.wCfg.type = "failure";
                            this.wCfg.content = res.data.errMsg
                        }
                    }
                )
            },
            saveWarehouse() {
                if (undefined == this.warehouseSaveCfg.warehouseCategoryCode || this.warehouseSaveCfg.warehouseCategoryCode == '') {
                    this.wCfg.content = '请选择仓库类别'
                    this.wCfg.show = true;
                    return;
                }
                if (undefined == this.warehouseSaveCfg.warehouseName || this.warehouseSaveCfg.warehouseName == '') {
                    this.wCfg.content = '仓库名称不能为空'
                    this.wCfg.show = true;
                    return;
                }
                for (var i = 0; i < this.warehouseData.length; i++) {
                    if (this.warehouseSaveCfg.warehouseCategoryCode == this.warehouseData[i].warehouseCategoryCode) {
                        this.warehouseSaveCfg.warehouseCategoryName = this.warehouseData[i].warehouseCategoryName
                    }
                }
                let url = __URL.arc + 'warehouse/insert';
                if (undefined != this.warehouseSaveCfg.warehouseCode && this.warehouseSaveCfg.warehouseCode != '') {
                    url = __URL.arc + 'warehouse/update';
                }
                this.$http.post(url, this.warehouseSaveCfg).then(
                    (res) => {
                        if (res.data.success) {
                            this.warehouseModalCfg.show = false;
                            this.wCfg.show = true
                            this.refresh('success','保存成功' );
                        } else {
                            this.warehouseModalCfg.show = true;
                            this.wCfg.show = true
                            this.wCfg.type = "failure";
                            this.wCfg.content = res.data.errMsg
                        }
                    }
                )
            },
            saveUnit() {
                if (undefined == this.unitSaveCfg.unitName || this.unitSaveCfg.unitName == '') {
                    this.wCfg.content = '计量单位名称不能为空'
                    this.wCfg.show = true;
                    return;
                }
                let url = __URL.arc + 'unit/insert';
                if (undefined != this.unitSaveCfg.unitCode && this.unitSaveCfg.unitCode != '') {
                    url = __URL.arc + 'unit/update';
                }
                this.$http.post(url, this.unitSaveCfg).then(
                    (res) => {
                        if (res.data.success) {
                            this.unitModalCfg.show = false;
                            this.wCfg.show = true
                            this.refresh('success','保存成功' );
                        } else {
                            this.unitModalCfg.show = true;
                            this.wCfg.show = true
                            this.wCfg.type = "failure";
                            this.wCfg.content = res.data.errMsg
                        }
                    }
                )
            },
        },
        computed: {
            /* 参数获取 */
            tableCfg() {
                switch (this.selectTable) {
                    case 'parameterDigital':
                        this.addShow = false;
                        return cfg.parameterDigitalTableCfg;
                    case 'currency':
                        this.addShow = false;
                        return cfg.currencyTableCfg;
                    case 'bank' :
                        this.addShow = true;
                        return cfg.bankTableCfg;
                    case 'payment':
                        this.addShow = true;
                        return cfg.paymentTableCfg;
                    case 'taxRate':
                        this.addShow = true;
                        return cfg.taxRateTableCfg;
                    case 'recAgreement':
                        this.addShow = true;
                        return cfg.recAgreementTableCfg;
                    case 'payAgreement':
                        this.addShow = true;
                        return cfg.payAgreementTableCfg;
                    case 'warehouse':
                        this.addShow = true;
                        return cfg.warehouseTableCfg;
                    case 'unit':
                        this.addShow = true;
                        return cfg.unitTableCfg;
                }
                return cfg.parameterDigitalTableCfg
            },
        }
    }
</script>
<template>
    <container>
        <warning :config="wCfg"></warning>
        <div class="body_item">
            <div class="left_item">
                <div class="item_head between">

                </div>
                <div class="item_body">
                    <div class='list_div'>
                        <div class='list_tab'>
                            <a href="javascript:;" @click='choiceTab(0)' :class="{ckd:0==activeTab}">
                                财务相关
                            </a>
                            <a href="javascript:;" @click='choiceTab(1)' :class="{ckd:1==activeTab}">
                                业务相关
                            </a>
                            <a href="javascript:;" @click='choiceTab(2)' :class="{ckd:2==activeTab}">
                                人资相关
                            </a>
                        </div>
                        <div class='list_content'>

                            <ul class='listbox'>
                                <li class='first_li' v-for='(index,firstLv) in listDetail'>
                                    <a :class='{ckd:firstLv.id==ckdCode}' @click='openFirst(firstLv,index)'
                                       href="javascript:;">
                                        <i v-show='firstLv.children.length>0 && firstLv.id!=openCode'
                                           class='icon-hp_list__right'></i>
                                        <i v-show='firstLv.children.length>0&& firstLv.id==openCode'
                                           class='icon-hp_list__dropdown'
                                           :class='{childchoice:firstLv.id!=ckdCode && firstLv.id==openCode}'></i>
                                        <p :class='{childchoice:firstLv.id!=ckdCode&&firstLv.id==openCode}'
                                           class='main'>{{firstLv.name}}</p>
                                        <span class='tip_number'>{{firstLv.employeeCount}}</span>
                                        <p v-show="firstLv.id == 'currency'" class="currencyAdd"
                                           @click.stop="currencyAddNew(secLv,index)"><i class="icon-add"></i>新增</p>
                                    </a>
                                    <ul v-if='firstLv.children.length>0' v-show='firstLv.id==openCode' class='sec_ul'>
                                        <li @click.stop='choiceSec(firstLv,secLv)' class='sec_li'
                                            :class='{hasnumber:firstLv.hasNumber,ckd:firstLv.id.toString()+secLv.id.toString()==ckdCode}'
                                            v-for='(index,secLv) in firstLv.children'>
                                            <!-- <div v-if='firstLv.hasNumber' class='number-title'>{{index+1}}</div> -->
                                            <p class='main'>{{secLv.secondName}}</p>
                                            <span v-show="firstLv.id == 'bank'"
                                                  class='tip_number'>{{secLv.isDefault}}</span>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="right_item">
                <div class="item_head btn-ic">
                    <a v-show="addShow" href="javascript:;" @click="addNew">
                        <i class='icon-hp_list__add'></i>新增
                    </a>
                    <select v-show="currencySelectShow" v-model="accYear" @change="getCurrencyData"
                            v-for="year in yearList">
                        <option value="{{year}}">{{year}}</option>
                    </select>
                </div>
                <div class="item_body">
                    <vtable :config='tableCfg' :data='tableData' @op='operate' @link='href'>
                    </vtable>
                </div>
            </div>
        </div>
    </container>

    <!-- 数据格式设置 -->
    <modal :config.sync='parameterDigitalModalConfig' @sure='saveParameterDigital'
           @close='this.parameterDigitalModalConfig.show = false'>
        <div class="modal-cfg">
            <div class='form-group wd-100'>
                <label>数据类型:</label>
                <p>{{dig.name}}</p>
            </div>
            <div class='form-group wd-100'>
                <label>数据总长度:</label>
                <div class="s-input">
                    <input type='text' maxlength="2" v-model='dig.length'
                           onkeyup="value=value.replace(/[^\d]/g,'')" placeholder='请输入数据总长度'>
                </div>
            </div>
            <div class='form-group wd-100'>
                <label>小数位长度:</label>
                <div class="s-input">
                    <input type='text' maxlength="2" v-model='dig.decimal'
                           onkeyup="value=value.replace(/[^\d]/g,'')" placeholder='请输入小数位长度'>
                </div>
            </div>
            <div class='form-group wd-100'>
                <label>小数位处理方式:</label>
                <div class="s-input">
                    <select v-model='dig.decFormatter'>
                        <option :value='item.format' :selected="" v-for='item in way'>{{item.method}}</option>
                    </select>
                </div>
            </div>
        </div>
    </modal>

    <!--币种新增 -->
    <refer-currency :config='currencyConfig' @cb='currencyCb'></refer-currency>

    <!-- 币种汇率 -->
    <modal :config.sync='exchangeModalConfig' @sure='saveExchange' @close='this.exchangeModalConfig.show = false'>
        <div class='form-group wd-100'>
            <label>起始日期:</label>
            <p>{{_exchangeRateData.startDate}}</p>
        </div>
        <div class='form-group wd-100'>
            <label><span class="must-point">*</span>汇率:</label>
            <div class="s-input">
                <input type='number' v-model='_exchangeRateData.rate' placeholder='请输入汇率'>
            </div>
        </div>
    </modal>

    <!-- 新增结算方式 -->
    <modal :config.sync='paymentModalCfg' @sure='savePayment' @close='this.paymentModalCfg.show = false'>
        <div class='form-group wd-100'>
            <label><span class="must-point">*</span>结算方式:</label>
            <div class="s-input">
                <input type='text' maxlength="20" v-model='paymentCfg.paymentName' placeholder='请输入结算方式'>
            </div>
        </div>
        <div class='form-group wd-100'>
            <label>备注:</label>
            <div class="s-input">
                <input type='text' maxlength="100" v-model='paymentCfg.remark' placeholder='请输入备注'>
            </div>
        </div>
    </modal>

    <!-- 税率设置 -->
    <modal :config.sync='taxRateModalConfig' @sure='saveTaxRate' @close='taxRateModalConfig.show = false;'>
        <div class='form-group'>
            <label>税率(%):</label>
            <div class="s-input ic2">
                <input-number :code.sync="taxRateData.taxRate" key="exchangeRate" placeholder="请输入税率"></input-number>
            </div>
        </div>
        <div class='form-group'>
            <label>税种:</label>
            <div class="s-input ic2">
                <select v-model="taxRateData.taxTypeCode">
                    <option value="001">增值税</option>
                </select>
            </div>
        </div>
    </modal>

    <!-- 收款协议 -->
    <modal :config.sync='recModalCfg' @sure='saveRecAgreement' @close='this.recModalCfg.show = false'>
        <div class='form-group wd-100'>
            <label>协议类型:</label>
            <P>收款协议</P>
        </div>
        <div class='form-group wd-100'>
            <label><span class="must-point">*</span>名称:</label>
            <div class="s-input">
                <input type='text' maxlength="20" v-model='recSaveCfg.recAgreementName' placeholder='请输入名称'>
            </div>
        </div>
        <div class='form-group wd-100'>
            <label>起算日:</label>
            <div class="s-input">
                <select v-model='recSaveCfg.initialDay'>
                    <option :value='item' v-for='item in recInitialDay'>{{item}}</option>
                </select>
            </div>
        </div>
        <div class='form-group wd-100'>
            <label>账期:</label>
            <div class="s-input">
                <input type='text' maxlength="20" v-model='recSaveCfg.deviationDay' placeholder='请输入账期'>
            </div>
        </div>
        <div class='form-group wd-100'>
            <label>备注:</label>
            <div class="s-input">
                <input type='text' maxlength="100" v-model='recSaveCfg.remark' placeholder='请输入备注'>
            </div>
        </div>
    </modal>

    <!-- 付款协议 -->
    <modal :config.sync='payModalCfg' @sure='savePayAgreement' @close='this.payModalCfg.show = false'>
        <div class='form-group wd-100'>
            <label>协议类型:</label>
            <p>付款协议</p>
        </div>
        <div class='form-group wd-100'>
            <label><span class="must-point">*</span>名称:</label>
            <div class="s-input">
                <input type='text' maxlength="20" v-model='paySaveCfg.payAgreementName' placeholder='请输入名称'>
            </div>
        </div>
        <div class='form-group wd-100'>
            <label>起算日:</label>
            <div class="s-input">
                <select v-model='paySaveCfg.initialDay'>
                    <option :value='item' v-for='item in payInitialDay'>{{item}}</option>
                </select>
            </div>
        </div>
        <div class='form-group wd-100'>
            <label>账期:</label>
            <div class="s-input">
                <input type='text' maxlength="20" v-model='paySaveCfg.deviationDay' placeholder='请输入账期'>
            </div>
        </div>
        <div class='form-group wd-100'>
            <label>备注:</label>
            <div class="s-input">
                <input type='text' maxlength="100" v-model='paySaveCfg.remark' placeholder='请输入备注'>
            </div>
        </div>
    </modal>

    <!-- 仓库 -->
    <modal :config.sync='warehouseModalCfg' @sure='saveWarehouse' @close='this.warehouseModalCfg.show = false'>
        <div class='form-group wd-100'>
            <label><span class="must-point">*</span>仓库类别:</label>
            <div class="s-input">
                <select v-model='warehouseSaveCfg.warehouseCategoryCode'>
                    <option :value='item.warehouseCategoryCode' v-for='item in warehouseData'>
                        {{item.warehouseCategoryName}}
                    </option>
                </select>
            </div>
        </div>
        <div class='form-group wd-100'>
            <label><span class="must-point">*</span>仓库名称:</label>
            <div class="s-input">
                <input type='text' maxlength="20" v-model='warehouseSaveCfg.warehouseName' placeholder='请输入仓库名称'>
            </div>
        </div>
    </modal>

    <!-- 计量单位 -->
    <modal :config.sync='unitModalCfg' @sure='saveUnit' @close='this.unitModalCfg.show = false'>
        <div class='form-group wd-100'>
            <label><span class="must-point">*</span>计量单位:</label>
            <div class="s-input">
                <input type='text' maxlength="20" v-model='unitSaveCfg.unitName' placeholder='请输入计量单位'>
            </div>
        </div>
        <div class='form-group wd-100'>
            <label>简称单位:</label>
            <div class="s-input">
                <input type='text' maxlength="20" v-model='unitSaveCfg.unitShortName' placeholder='请输入简称单位'>
            </div>
        </div>
    </modal>

    <!-- 银行编辑-->
    <edit-bank :bank-detail.sync="bankDetail" :detail.sync="editBankConfig" @refresh='refresh'></edit-bank>
    <new-bank :detail.sync="addBankConfig" @refresh='refresh'></new-bank>
</template>

<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';

    .item_head:hover {
        cursor: pointer;
    }

    .reset_password {
        text-align: center;

    img {
        width: 50px;
        height: 50px;
        margin-top: 20px;
    }

    .main {
        padding: 10px 30px;
        color: #212121;
        font-size: 12px;
    }

    .minor {
        padding: 10px;
        padding-bottom: 30px;
        color: #757575;
        font-size: 12px;
    }

    }
    .list_div {
        width: 383px;
        line-height: 1;

    .leftbtn {
        display: inline-block;
        float: left;
        margin-left: 30px;
        height: 46px;
        line-height: 46px;
        position: relative;
    }

    .currencyAdd {
        float: right;
    }

    .rightbtn {
        display: inline-block;
        float: right;
        margin-right: 15px;
        height: 46px;
        line-height: 46px;
        position: relative;
    }

    p {
        font-size: 14px;
        color: #212121;
        margin: 0;
    }

    p:hover {
        cursor: pointer;
        color: #008AF5
    }

    .list_tab {
        display: flex;
        font-size: 0;
        border-bottom: 1px solid @border-color;

    a {
        display: inline-block;
        padding: 18px 0;
        width: 50%;
        text-align: center;
        font-size: 14px;
        color: #212121;
        margin-top: -1px;
        margin-bottom: -1px;
        border-bottom: 2px solid transparent;
        text-decoration: none;
        position: relative;

    .redtips {
        display: inline-block;
        width: 4px;
        height: 4px;
        background: red;
        border-radius: 2px;
        position: absolute;
        top: 22px;
        margin-left: -8px;
    }

    }
    .ckd {
        color: #008af4;
        border-color: #008af4;
    }

    }
    .list_content {

    ul {
        list-style: none;
        padding: 0;
        margin: 0;
        font-size: 0;
    }

    a {
        text-decoration: none;
        position: relative;

    p,
    span {
        color: #212121;
    }

    }
    .listbox {
        position: absolute;
        width: 100%;
        top: 51px;
        bottom: 0;
        overflow: scroll;
        overflow-x: hidden;
        text-align: left;
        font-size: 0;

    .first_li {
        position: relative;
        width: 100%;

    >
    a {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 0 20px 0 32px;
        font-size: 0;
        border-left: 3px solid transparent;
        border-bottom: 1px solid @border-color;

    >
    i {
        font-size: 12px;
        position: absolute;
        top: 18px;
        left: 10px;
        color: #212121;
    }

    .main {
        display: inline-block;
        max-width: 230px;
        white-space: nowrap;
        text-overflow: ellipsis;
        word-break: break-all;
        overflow: hidden;
        font-size: 14px;
        color: #212121;
        margin: 16px 0;
    }

    .minor {
        max-width: 328px;
        white-space: nowrap;
        text-overflow: ellipsis;
        word-break: break-all;
        overflow: hidden;
        font-size: 12px;
        color: #757575;
        margin: 0 0 8px 0;
    }

    .tip_number {
        position: absolute;
        display: inline-block;
        right: 20px;
        top: 16px;
        font-size: 14px;
        color: #212121;
        max-width: 80px;
        white-space: nowrap;
        text-overflow: ellipsis;
        word-break: break-all;
        overflow: hidden;
    }

    .mt16 {
        margin-bottom: 16px;
    }

    }
    .childchoice {
        color: #008AF5 !important;
    }

    >
    a:hover {
        background: #f0f9fd;
    }

    >
    .sec_ul {
        font-size: 0;

    >
    .sec_li {
        width: 383px;
        padding: 0 20px 0 42px;
        font-size: 0;
        border-left: 3px solid transparent;
        border-bottom: 1px solid @border-color;
        background: #FAFAFA;
        position: relative;
        height: 100%;

    .main {
        display: inline-block;
        max-width: 230px;
        white-space: nowrap;
        text-overflow: ellipsis;
        word-break: break-all;
        overflow: hidden;
        font-size: 14px;
        color: #212121;
        margin: 16px 0;
    }

    .minor {
        max-width: 328px;
        white-space: nowrap;
        text-overflow: ellipsis;
        word-break: break-all;
        overflow: hidden;
        font-size: 12px;
        color: #757575;
        margin: 0 0 8px 0;
    }

    .tip_number {
        position: absolute;
        display: inline-block;
        right: 20px;
        top: 16px;
        font-size: 14px;
        color: #212121;
        max-width: 80px;
        white-space: nowrap;
        text-overflow: ellipsis;
        word-break: break-all;
        overflow: hidden;
    }

    .mt16 {
        margin-bottom: 16px;
    }

    .number-title {
        display: inline-block;
        position: absolute;
        /*height: 14px;*/
        min-width: 15px;
        border: 1px #212121 solid;
        line-height: 14px;
        border-radius: 2px;
        text-align: center;
        left: 35px;
        top: 15px;
        transition: all .2s ease;
        color: #212121;
        font-size: 12px;
        transform: scale(.9)
    }

    }
    >
    .sec_li:hover {
        cursor: pointer;
        background: #f0f9fd;
    }

    .hasnumber {
        /*width: 300px;*/
        padding-left: 60px;

    .main {
        max-width: 205px;
    }

    .minor {
        max-width: 300px;
    }

    }
    }
    }
    }
    .ckd {
        border-left: 3px #03a9f4 solid !important;
        background: #f0f9fd !important;

    >
    p {
        color: #008AF5 !important;
    }

    >
    .number-title {
        color: #008AF5 !important;
        border-color: #008AF5 !important;
    }

    i {
        color: #008AF5 !important;
    }

    }
    }
    .list_loadmore {
        height: 46px;
        text-align: center;
        position: absolute;
        width: 100%;
        bottom: 0;
        font-size: 14px;
        padding: 16px 0;
        border-bottom: 1px solid @border-color;
        border-top: 1px solid @border-color;
        background: white;
    }

    .list_loadmore:hover {
        cursor: pointer;
    }

    }

    .icon-add {
        display: inline-block;
        padding: 4px;
        margin-right: 0;
        border: 2px solid;
        border-radius: 50%;
        transform: scale(.6);
    }
    .modal-cfg {
        label {
            width: 105px;
        }
        .s-input {
            width: calc(~"100% - 135px") !important;
        }
    }
</style>
