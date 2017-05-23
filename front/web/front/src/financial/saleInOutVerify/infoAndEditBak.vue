<script>
    import cfg from './cfg.js'
    export default{
        props: ['add', 'edit', 'itemArr', 'type', 'show'],
        data(){
            return {
                flowCfg: {
                    data: [{
                        no: '1',
                        name: '创建收款核销单',
                        flag: true,
                    }, {
                        no: '2',
                        name: '待审核',
                        flag: false,
                    }, {
                        no: '3',
                        name: '已审核',
                        flag: false,
                    }, {
                        no: '4',
                        name: '完成',
                        flag: false,
                    }]
                },
                warnCfg: {
                    show: false,
                    type: 'success',
                    content: ''
                },
                alertCfg: {
                    show: false,
                    msg: '确认要删除该数据吗',
                    type: 'failure'
                },
                allInfoData: cfg.allInfoModal,
                pushData: '',
                //表单状态
                docStatus: '',
                //提交状态
                repealStatus: '',
                //输入状态
                inputStatus: true,
                headCount: 0,
                footCount: 0,
                //数据精度
                decimal: 2
            }
        },
        ready(){
            //新增时通过AddDraft 获取数据
            if (this.add && this.type === 'draft') {
                this.getInfo()
                //其实时候，通过Detail获取数据
            } else {
                this.getInfoOthers()
            }
        },
        methods: {
            /*
             * 获取表单数据系列   ------------------------------------------------
             * */
            getInfo(){
                //已选择的单据列表
                let noArr = this.itemArr.map(item => {
                    return item.cashierDocNo
                });
                let param = {
                    "dataList": noArr,
                    "header": {
                        "currencyCode": "",
                        "currencyName": "",
                        "currencySymbol": "",
                        "customerCode": "",
                        "customerName": "",
                        "verifyDocNo": "",
                    }
                };
                //拿到单所列表的第一项，取出所需的header参数值
                Object.keys(param.header).forEach(key => {
                    param.header[key] = this.itemArr[0][key] === '' ? '1' : this.itemArr[0][key]
                });
                this.$http.post(__URL.financial + 'verify/receivable/addSaveDraft', param).then(
                    res => {
                        if (res.data.success) {
                            this.allInfoData = res.data.data
                            //改变表单状态
                            this.docStatus = this.allInfoData.header.docStatus === '' ? -1 : this.allInfoData.header.docStatus;
                            //合并数据
                            this.operatData()
                            this.auditInputCount()
                        }
                    }
                )
            },
            //获取详情
            getInfoOthers(){
                this.$http.get(__URL.financial + 'verify/receivable/detail/' + this.itemArr[0].docNo).then(
                    res => {
                        if (res.data.success) {
                            this.allInfoData = res.data.data;
                            this.docStatus = res.data.data.header.docStatus;
                            this.repealStatus = res.data.data.header.repeal === '' ? false : res.data.data.header.repeal;
                            this.operatData()
                        }
                        for (let i = 0; i <= this.allInfoData.header.workflowStatus; i++) {
                            this.flowCfg.data[i].flag = true
                        }
                    }
                )
            },


            /*
             * 获取数据后，进行处理 系列   ------------------------------------------------
             * */
            //合并操作数据
            operatData(){
                this.allInfoData.footList.forEach(item => {
                    let modal = {
                        "availableAmount": '',
                        "dispatchDocNo": 0,
                        "showTaxAmounts": 0,
                        "showTotalRevAmount": 0,
                        "showCurrentAmount": 0,
                        "dispatch": true,
                        "initDocDate": '',
                        "recordVersion": '',
                        "oldCurrentAmount": '',
                        "init": true
                    };
                    modal.initDocDate = item.initDocDate;
                    modal.recordVersion = item.recordVersion;
                    modal.oldCurrentAmount = item.oldCurrentAmount;
                    modal.availableAmount = item.availableAmount;
                    modal.dispatchDocNo = item.initDocNo;
                    modal.showTaxAmounts = item.recAmount;
                    modal.showTotalRevAmount = item.totalRevAmount;
                    modal.showCurrentAmount = item.currentAmount;
                    this.allInfoData.dataList.push(modal)
                })
            },

            //将之前合并的footList数据，分离出来重新放入footList里面
            backFootData(){
                this.pushData = Object.assign({}, this.allInfoData);
                let foot = this.pushData.dataList.filter(item => {
                    return item.inventoryId === undefined
                });
                this.pushData.dataList = this.pushData.dataList.filter(item => {
                    return item.inventoryId !== undefined
                });
                foot.forEach(item => {
                    item.initDocNo = item.dispatchDocNo;
                    item.recAmount = item.showTaxAmounts;
                    item.totalRevAmount = item.showTotalRevAmount;
                    item.currentAmount = item.showCurrentAmount
                });
                this.pushData.footList = foot
            },


            /*
             * 初始化表单填充值系列--------------------------------------
             * */

            /*
             * 校验【出纳】、【发退期初】的总值
             * 当【出纳】或【发退期初】，有一个的总值小于0时，则初始化填充为可核销额
             * 当两个的总值都大于0时，则以最小的总值进行填充
             */
            auditInputCount(){
                if (this.headInputCount() < 0 || this.contentFootInputCount() < 0) {
                    this.setHeadInitData()
                    this.setFootInitData()
                } else {
                    if (this.headInputCount() > this.contentFootInputCount()) {
                        this.headCount = this.contentFootInputCount()
                        this.computedData(this.allInfoData.headList,'headCount')
                        this.setFootInitData()
                    } else {
                        this.footCount = this.headInputCount()
                        this.computedData(this.allInfoData.dataList,'footCount')
                        this.setHeadInitData()
                    }
                }

            },

            //作减法
            subtraction(a, b, c = 6){
                let A = Number(a) * Math.pow(10, c),
                    B = Number(b) * Math.pow(10, c);
                return (A - B) / Math.pow(10, c)
            },

            //作加法
            addition(a, b, c = 6){
                let A = Number(a) * Math.pow(10, c),
                    B = Number(b) * Math.pow(10, c);
                return (A + B) / Math.pow(10, c)
            },

            //计算【发退期初】可核销额总数
            contentFootInputCount(){
                let count = 0;
                this.allInfoData.dataList.forEach(item => {
                    if (!item.dispatch) {
                        count = this.subtraction(count, item.availableAmount)
                    } else {
                        count = this.addition(count, item.availableAmount)
                    }
                });
                return count
            },

            //计算【出纳】可核销总数
            headInputCount(){
                let count = 0;
                this.allInfoData.headList.forEach(item => {
                    if (item.cashierDocType == 3) {
                        count = this.subtraction(count, item.availableAmount)
                    } else {
                        count = this.addition(count, item.availableAmount)
                    }
                });
                return count
            },

            //将所有可填值填充为【可核销金额】
            setHeadInitData(){
                this.allInfoData.headList.forEach(item => {
                    item.showCurrentAmount = item.availableAmount
                })
            },
            setFootInitData(){
                this.allInfoData.dataList.forEach(item => {
                    item.showCurrentAmount = item.availableAmount
                })
            },

            /*
             * 1、将所有为【负】的值都先填充好,并从将填充的值加到可核销总额中去
             * 1、再依次填充【正】的每一栏的核销值，并从可核销总额减去已填充的值
             * 2、从下往上，直到【可核销值】为0的时候就不再填充
             */
            computedData(data,context){
                data.forEach(item=>{
                    if((item.dispatch != undefined && !item.dispatch)|| item.cashierDocType == 3){
                        item.showCurrentAmount = item.availableAmount
                        this[context] =this.addition(this[context],item.showCurrentAmount)
                    }
                })
                for(let i = data.length-1;i>=0;i--){
                    if(this[context] != 0){
                        if(data[i].dispatch || data[i].cashierDocType != 3){
                            if(this[context] > data[i].availableAmount){
                                data[i].showCurrentAmount = data[i].availableAmount
                            }else{
                                data[i].showCurrentAmount = this[context]
                            }
                            this[context] = this.subtraction(this[context],data[i].showCurrentAmount)
                        }
                    }else{
                        return
                    }
                }
            },



            /*
             * 编辑，提交数据，审核 系列--------------------------------------
             * */
            goToEdit(){
                this.edit = true;
                this.docStatus = -1
            },
            goToDetail(){
                this.edit = false;
                this.add = false;
                this.docStatus = 0
            },
            goToDel(){
                this.alertCfg.show = true
            },
            delData(){
                this.sendData('verify/receivable/delete/', '删除成功', this.itemArr[0].docNo)
            },
            saveToDraft(val){
                this.backFootData();
                let url = __URL.financial + 'verify/receivable/add';
                if (this.edit) {
                    this.allInfoData.header.verifyDocNo = this.itemArr[0].docNo;
                    url = __URL.financial + 'verify/receivable/update'
                }
                this.$http.post(url, this.pushData).then(
                    res => {
                        if (res.data.success) {
                            //如果val为false 只提交不提交审核
                            if (!val) {
                                let tips = '新增成功';
                                if (this.edit) tips = '更新成功';
                                if (this.add) this.itemArr[0].docNo = res.data.data;
                                this.$emit('refreshonly');
                                this.setWarningSuccess('success', tips);
                                this.goToDetail();
                                this.getInfoOthers();
                                //如果val为true 则保存成功后再提交审核
                            } else {
                                this.sendData('verify/receivable/submit/', '提交审核成功', res.data.data)
                            }
                        } else {
                            this.setWarningSuccess('failure', res.data.errMsg)
                        }
                    }
                )
            },
            pushAudit(){
                //如果当前状态为-1，则是新增时，保存并提交审核
                if (this.edit || this.add) {
                    this.backFootData()
                    let url = __URL.financial + 'verify/receivable/save/submit';
                    if (this.edit) {
                        this.allInfoData.header.verifyDocNo = this.itemArr[0].docNo
                    }
                    this.$http.post(url, this.pushData).then(
                        res => {
                            if (res.data.success) {
                                //this.edit = this.add = false
                                let tips = '提交审核成功';
                                this.$emit('refresh', 'success', tips)
                            } else {
                                this.setWarningSuccess('failure', res.data.errMsg)
                            }
                        }
                    )
                } else {
                    this.sendData('verify/receivable/submit/', '提交审核成功', this.itemArr[0].docNo)
                }
            },
            didAudit(){
                this.sendData('verify/receivable/audit/', '审核成功', this.itemArr[0].docNo)
            },
            giveUpAudit(){
                this.sendData('verify/receivable/unaudit/', '弃审成功', this.itemArr[0].docNo)
            },
            agreeGiveUpAudit(){
                this.sendData('verify/receivable/repeal/submit/', '同意撤销提交审核成功', this.itemArr[0].docNo)
            },
            repealPush(){
                this.sendData('verify/receivable/repeal/', '撤销提交审核成功，等待主管同意', this.itemArr[0].docNo)
            },
            sendData(url, tips, id){
                this.$http.get(__URL.financial + url + id).then(
                    res => {
                        if (res.data.success) {
                            this.$emit('refresh', 'success', tips)
                        } else {
                            this.setWarningSuccess('failure', res.data.errMsg)
                        }
                    }
                )
            },
            //设置提示信息
            setWarningSuccess(type, data){
                this.warnCfg.show = true
                this.warnCfg.content = data
                this.warnCfg.type = type
            },
            setZero(key, i, name){
                if (this.allInfoData[key][i][name] == '') {
                    this.allInfoData[key][i][name] = 0
                }
            }
        },
    }
</script>
<template>
    <!-- 弹框内置dom结构 -->
    <div class="inner-wrapper">
        <workflow :config="flowCfg"></workflow>
        <div class="inner-content">
            <h2 class="tag">销售收款与退款核销</h2>

            <div class="inner-item form-box">
                <div class="form-box">
                    <label>客户名称:</label>
                    <p>{{allInfoData.header.customerName}}</p>
                </div>
            </div>

            <div class="inner-item">
                <div class="title">出纳收/退款单</div>
                <table class="inner-table mt-15">
                    <thead>
                    <tr>
                        <th width="15%">单号</th>
                        <th width="15%">收/退款日期</th>
                        <th width="15%">结算方式</th>
                        <th width="15%">币种</th>
                        <th width="15%">收/退款金额</th>
                        <th width="10%">已核销金额</th>
                        <th width="15%">本次核销金额</th>
                    </tr>
                    </thead>
                    <tbody>
                    <template v-for="item in allInfoData.headList">
                        <tr :class="{'red':item.cashierDocType == 3}">
                            <td>{{item.cashierDocNo}}</td>
                            <td>{{item.cashierDocDate}}</td>
                            <td>{{item.paymentName}}</td>
                            <td>{{item.currencyName}}</td>
                            <td>{{item.showRecReturnAmount}}</td>
                            <td>{{item.showTotalRevAmount}}</td>
                            <td v-if="add || edit">
                                <input :class="{'red':item.cashierDocType == 3}" type="text" maxlength="16"
                                       v-model="item.showCurrentAmount"
                                       onkeyup="this.value=(this.value.match(/\d+(\.\d{0,4})?/)||[''])[0]"
                                       onblur="this.value=(this.value.match(/\d+(\.\d{0,4})?/)||[''])[0]">
                            </td>
                            <td v-else>
                                {{item.showCurrentAmount}}


                            </td>
                        </tr>
                    </template>
                    </tbody>
                </table>
            </div>

            <div class="inner-item">
                <div class="title">发/退货单详情</div>
                <table class="inner-table">
                    <thead>
                    <tr>
                        <th width="5%">序号</th>
                        <th width="15%">发/退货单号</th>
                        <th width="10%">货品信息</th>
                        <th width="10%">单位</th>
                        <th width="10%">数量</th>
                        <th width="10%">单价</th>
                        <th width="15%">应收金额</th>
                        <th width="10%">已核销金额</th>
                        <th width="15%">本次核销金额</th>
                    </tr>
                    </thead>
                    <tbody>
                    <template v-for="item in allInfoData.dataList">
                        <tr :class="{'red':!item.dispatch}">
                            <td>{{$index + 1}}</td>
                            <td>
                                <span v-show="item.init"
                                      style="padding: 2px;border-radius: 1px;display:inline-block;background:#008af5;color:white">期初</span>
                                <span v-show="!item.dispatch"
                                      style="padding: 2px;border-radius: 1px;display:inline-block;background:#ff5104;color:white">退货</span>
                                &nbsp;{{item.dispatchDocNo}}
                            </td>
                            <td>
                                <div class="show-wrap">
                                    <p>{{item.inventoryCode}}</p>
                                    <p>{{item.inventoryName}}</p>
                                    <p>{{item.inventorySpec}}</p>
                                </div>
                            </td>
                            <td>{{item.unitName}}</td>
                            <td>{{item.showQuantity}}</td>
                            <td>{{item.unitPrice}}</td>
                            <td>{{item.showTaxAmounts}}</td>
                            <td>{{item.showTotalRevAmount}}</td>
                            <td v-if="add || edit">
                                <input :class="{'red':!item.dispatch}"
                                       type="text"
                                       maxlength="16"
                                       v-model="item.showCurrentAmount"
                                       onkeyup="this.value=(this.value.match(/\d+(\.\d{0,2})?/)||[''])[0]"
                                       onblur="this.value=(this.value.match(/\d+(\.\d{0,2})?/)||[''])[0]">
                            </td>
                            <td v-else>
                                {{item.showCurrentAmount}}


                            </td>
                        </tr>
                    </template>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div class="inner-footer">
        <button v-if="add || edit" class="btn-xl-def" @click="show.show = false">取消</button>
        <button v-else class="btn-xl-def" @click="show.show = false">关闭</button>
        <slot v-if="allInfoData.header.docStatus == 0 || allInfoData.header.docStatus == -1">
            <button class="btn-xl-imp" v-if="!add && !edit" @click="goToEdit">修改</button>
            <ajax-button class="btn-xl-danger" v-if="!add && !edit" @click="goToDel">删除</ajax-button>
            <ajax-button class="btn-xl-imp" v-if="add || edit" @click="saveToDraft(false)">暂存到待处理</ajax-button>
            <ajax-button class="btn-xl-imp" @click="pushAudit">提交审核</ajax-button>
        </slot>
        <slot v-if="allInfoData.header.docStatus == 1">
            <ajax-button class="btn-xl-danger" v-if="allInfoData.header.repeal==0" @click="repealPush">撤销提交审核
            </ajax-button>
        </slot>
    </div>
    <!--状态消息提示-->
    <warning :config="warnCfg"></warning>
    <!--删除状态-->
    <alert :config="alertCfg" @cb="delData"></alert>
</template>
<style lang="less" scoped>
    /* 此处为自己定义的样式 */
    @import '../../../../../public/css/variable.less';

    .title {
        margin-bottom: 20px;
    }

    .red {
        color: red;

        input {
            color: red;
        }
    }
</style>

