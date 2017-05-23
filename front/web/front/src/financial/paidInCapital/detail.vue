<script>
    import moment from 'moment'

    export default {
        components: {},
        props: ['id', 'backcfg', 'add', 'back', 'edit', 'show'],
        data() {
            return {
                flowCfg: {
                    data: [{
                        no: '1',
                        name: '新增实收资本',
                        time: '',
                        filed: '',
                        user: '',
                        flag: true,
                    }, {
                        no: '2',
                        name: '待审核',
                        time: '',
                        filed: '',
                        user: '',
                        flag: false,
                    }, {
                        no: '3',
                        name: '已审核',
                        time: '',
                        filed: '',
                        user: '',
                        flag: false,
                    }, {
                        no: '4',
                        name: '完成',
                        time: '',
                        filed: '',
                        user: '',
                        flag: false,
                    }]
                },
                //当前页面状态
                isEdit: false,
                capitalTypeListData: [
                    {capitalType: 1, capitalName: "现金投资--非股份公司"},
                ],
                currencyListData: '',

                dateCfg: {
                    placeholder: "请选择制单时间",
                    format: 'YYYY-MM-DD',
                    minDate: new Date(),
                    maxDate: '2100-12-31',
                    clear: false
                },
                isHold: false,

                docStatus: 0,

                infoModal:{},
                //table数据模型
                tableModel: {
                    "docType": 2,
                    "docNo": "",
                    "docDate": "",
                    "currencyCode": "",
                    "currencyName": "",
                    "currencySymbol": "",

                },

                //warming配置
                wCfg: {
                    show: false,
                    content: '',
                    type: 'warning'
                },
                delCfg: {
                    show: false,
                    msg: '确认要删除该数据吗',
                    type: 'failure'
                },
                submitCfg: {
                    show: false,
                    msg: '确认要提交审核该数据吗',
                    type: 'failure'
                },
                repealCfg: {
                    show: false,
                    msg: '确认要撤销审核该数据吗',
                    type: 'failure'
                },

                revokeCb: true,

            }
        },
        ready(){
            this.getSelectList()
            if (this.id) {
                if (this.edit) {
                    this.isHold = false;
                } else {
                    this.isHold = true;
                }
                this.getInfo()
            }
            if (this.add) {
                this.tableModel.docDate = moment(Date.parse(new Date)).format('YYYY-MM-DD');
            }
            //默认选中第一个
            this.tableModel.capitalType = this.capitalTypeListData[0].capitalType;
        },
        methods: {
            //获取详情信息
            getInfo(){
                this.$http.get(__URL.financial + 'paidincapital/querydetail/' + this.id).then(
                    res => {
                        if (res.data.success) {
                            this.infoModal = res.data.data;
                            this.tableModel = res.data.data;
                            for (var i = 0; i <= this.infoModal.workflowStatus; i++) {
                                this.flowCfg.data[i].flag = true
                            }
                        }
                    }
                )
            },
            //获取表头选择默认数据
            getSelectList(){
                this.getInitSelectData(__URL.arc + 'currency/local', 'currencyListData')
            },
            getInitSelectData(url, val){
                this.$http.post(url).then(
                    (res) => {
                        if (res.data.success) {
                            this[val] = res.data.data
                        } else {
                            console.log('网络出错:' + res.data.errMsg)
                        }
                    }
                )
            },

            modify(){
                this.edit = true
                this.add = false
                this.isHold = false
            },

            //保存


            save(){
                //检测必填数据是否已填
                if (!this.check()) {
                    this.wCfg.show = true
                    return false
                }
                if (this.add) {
                    this.saveData(__URL.financial + 'paidincapital/add', this.tableModel)
                }
                if (this.edit) {
                    this.saveData(__URL.financial + 'paidincapital/update', this.tableModel)
                }
            },

            saveData(url, param){
                if (this.revokeCb == false)return
                this.revokeCb = false
                this.$http.post(url, param).then(
                    res => {
                        if (res.data.success) {
                            if (this.add) {
                                this.id = res.data.data
                            }
                            //切换页面状态
                            this.edit = false
                            this.add = false
                            this.isHold = true
                            this.setWarningSuccess("success", "保存成功！")
                            this.infoModal.docStatus = 0;
                        } else {
                            this.setWarningSuccess("failure", res.data.errMsg);
                        }
                        this.revokeCb = true;
                        this.getInfo();
                    }
                )
            },

            setWarningSuccess(type, data){
                this.wCfg.show = true
                this.wCfg.content = data
                this.wCfg.type = type
            },
            delete(){
                this.delCfg.show = true;
            },

            submit(){
                this.submitCfg.show = true
            },
            doSubmit(){
                if (this.revokeCb == false)return
                this.revokeCb = false
                //编辑或新增状态，先保存在提交审核
                if (!this.check()) {
                    this.wCfg.show = true
                    return false
                }
                if (this.add) {
                    this.$http.post(__URL.financial + 'paidincapital/addsubmitaudit', this.tableModel).then(
                        res => {
                            if (res.data.success) {
                                this.$emit('refresh', 'success', "提交审核成功！")
                            } else {
                                this.setWarningSuccess('failure', res.data.errMsg)
                            }
                            this.revokeCb = true;
                        }
                    )
                } else if (this.edit) {
                    this.$http.post(__URL.financial + 'paidincapital/submiteditaudit' ,  this.tableModel).then(
                        res => {
                            if (res.data.success) {
                                this.$emit('refresh', 'success', "提交审核成功！")
                            } else {
                                this.setWarningSuccess('failure', res.data.errMsg)
                            }
                            this.revokeCb = true;
                        }
                    )
                }
                else {
                    this.$http.get(__URL.financial + 'paidincapital/submitaudit/' + this.tableModel.docNo + "/" + this.tableModel.recordVersion).then(
                        res => {
                            if (res.data.success) {
                                this.$emit('refresh', 'success', "提交审核成功！")
                            } else {
                                this.setWarningSuccess('failure', res.data.errMsg)
                            }
                            this.revokeCb = true;
                        }
                    )
                }
            },

            doDel(){
                if (this.revokeCb == false)return
                this.revokeCb = false
                this.$http.get(__URL.financial + 'paidincapital/delete/' + this.id).then(
                    res => {
                        if (res.data.success) {
                            this.$emit('refresh', 'success', "删除成功！")
                        } else {
                            this.setWarningSuccess('failure', res.data.errMsg)
                        }
                        this.revokeCb = true;
                    }
                )
            },


            doRepeal(){
                if (this.revokeCb == false)return
                this.revokeCb = false
                this.$http.get(__URL.financial + 'paidincapital/repeal/' + this.id+"/"+this.tableModel.recordVersion).then(
                    res => {
                        if (res.data.success) {
                            this.$emit('refresh', 'success', "撤销提交审核成功，等待主管同意！")
                        } else {
                            this.setWarningSuccess('failure', res.data.errMsg)
                        }
                        this.revokeCb = true;
                    }
                )
            },
            //必填字段校验
            check(){
                let submit = true

                if (this.tableModel.investor.trim() == '') {
                    submit = false
                    this.wCfg.content = '投资人不能为空'
                    return submit
                }
                if ((this.tableModel.investmentAmount +"").length > 16) {
                    submit = false
                    this.wCfg.content = '投资金额长度超过限制'
                    return submit
                }
                if ((this.tableModel.paidInCapital +'').length > 16) {
                    submit = false
                    this.wCfg.content = '其中:实收资本长度超过限制'
                    return submit
                }

                if (this.tableModel.investmentAmount <= 0) {
                    submit = false
                    this.wCfg.content = '投资金额必须大于0'
                    return submit
                }
                if (this.tableModel.paidInCapital <= 0) {
                    submit = false
                    this.wCfg.content = '其中:实收资本必须大于0'
                    return submit
                }
                if(this.tableModel.investmentAmount - this.tableModel.paidInCapital <= 0){
                    submit = false
                    this.wCfg.content = '其中:资本公积必须大于0'
                    return submit
                }

                for( let i = 0; i < this.currencyListData.length;i++){
                    if(this.tableModel.currencyCode == this.currencyListData[i].currencyCode){
                        this.tableModel.currencyName = this.currencyListData[i].currencyName;
                        this.tableModel.currencySymbol = this.currencyListData[i].currencySymbol;
                    }
                }

                return submit
            },
        },
    }

</script>
<template>
    <!--&lt;!&ndash; 弹框内置dom结构 &ndash;&gt;-->
    <div class="inner-wrapper">
        <Workflow :config="flowCfg"></Workflow>
        <div class="inner-content">

            <h2 class="tag">实收资本信息</h2>


            <!--&lt;!&ndash; inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 &ndash;&gt;-->
            <div class="inner-item form-box">
                <div class="form-group">
                    <label><span v-if="edit || add" class="must-point">*</span>制单日期:</label>
                    <div v-if="edit || add" class="check-input">
                        <date-picker :config="dateCfg"
                                     :date.sync='tableModel.docDate'></date-picker>
                    </div>
                    <p v-else>{{tableModel.docDate}}</p>
                </div>
                <div class="form-group">
                    <label><span v-if="edit || add" class="must-point">*</span>投资类型:</label>
                    <select disabled v-if="edit || add" v-model='tableModel.capitalType'>
                        <option :value='item.capitalType' v-for='item in capitalTypeListData'>
                            {{item.capitalName}}
                        </option>
                    </select>
                    <p v-else>现金投资--非股份公司</p>
                </div>
                <div class="form-group">
                    <label><span v-if="edit || add" class="must-point">*</span>投资人:</label>
                    <div v-if="edit || add" class="check-input">
                        <input type="text" v-model="tableModel.investor">
                    </div>
                    <p v-else>{{tableModel.investor}}</p>
                </div>
                <div class="form-group">
                    <label><span v-if="edit || add" class="must-point">*</span>币种:</label>
                    <div v-if="edit || add">
                        <select v-model="tableModel.currencyCode">
                            <option v-for="item in currencyListData" :value="item.currencyCode">{{item.currencyName}}
                            </option>
                        </select>
                    </div>
                    <p v-else>{{tableModel.currencyName}}</p>
                </div>
                <div class="form-group">
                    <label><span v-if="edit || add" class="must-point">*</span>投资金额:</label>
                    <input v-if="edit || add" type="number"
                           v-model="tableModel.investmentAmount">
                    <p v-else>{{tableModel.investmentAmount}}</p>
                </div>
                <div class="form-group">
                    <label><span v-if="edit || add" class="must-point">*</span>其中:实收资本:</label>
                    <input v-if="edit || add" type="number"
                           v-model="tableModel.paidInCapital">
                    <p v-else>{{tableModel.paidInCapital}}</p>
                </div>
                <div class="form-group">
                    <label><span v-if="edit || add" class="must-point">*</span>其中:资本公积:</label>
                    <input readonly v-if="edit || add" type="number"
                           :value="(tableModel.investmentAmount-tableModel.paidInCapital).toFixed(2)">
                    <p v-else>{{tableModel.capitalReserve}}</p>
                </div>
                <div class="form-group">
                    <label>备注:</label>
                    <div v-if="edit || add">
                        <input type="text" v-model="tableModel.remark">
                    </div>
                    <p v-else>{{tableModel.remark}}</p>
                </div>

            </div>
        </div>
    </div>

    <div class="inner-footer">
        <slot v-if="add || edit">
            <button class="btn-xl-def" @click="show.show=false">取消</button>
            <ajax-button class="btn-xl-imp" @click="save">暂存到待处理</ajax-button>
            <ajax-button class="btn-xl-imp" @click="doSubmit">提交审核</ajax-button>
        </slot>
        <slot v-if="isHold">
            <button class="btn-xl-imp" @click="modify" v-if="infoModal.docStatus==-2">修改</button>
            <ajax-button class="btn-xl-danger" @click="delete" v-if="infoModal.docStatus==-2">删除</ajax-button>
            <ajax-button class="btn-xl-imp" @click="doSubmit" v-if="infoModal.docStatus==-2">提交审核</ajax-button>
            <ajax-button class="btn-xl-danger" @click="doRepeal" v-if="infoModal.docStatus==1 && infoModal.repeal==0">撤销提交审核
            </ajax-button>
        </slot>
    </div>

    <warning :config="wCfg"></warning>

    <alert :config="delCfg" @cb="doDel"></alert>

    <alert :config="submitCfg" @cb="doSubmit"></alert>

</template>
<style lang='less' scoped>
    /* 此处为自己定义的样式 */
    @import '../../../../../public/css/variable.less';
</style>
