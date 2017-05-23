<script>
    import cfg from './cfg.js'
    export default{
        props: ['add', 'edit', 'itemArr', 'type', 'show'],
        data(){
            return {
                flowCfg: {
                    data: [{
                        no: '1',
                        name: '创建付款核销单',
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
                leftCount: 0,
                //数据精度
                decimal:2
            }
        },
        ready(){
            //新增时通过AddDraft 获取数据
            if (this.add && this.type == 'draft') {
                this.getInfo()
                //其实时候，通过Detail获取数据
            } else {
                this.getInfoOthers()
            }
            //获取金额的小数位数
            this.$http.post(__URL.arc+'parameter/digital/list',{}).then(
                res =>{
                    if(res.data.success){
                        let dataList=res.data.data.dataList;
                        for(let i=0;i<dataList.length;i++){
                            if(dataList[i].code=="amount"){
                                this.decimal=dataList[i].decimal
                            }
                        }
                    }
                }
            )
        },
        methods: {
            getInfo(){
                let noArr = this.itemArr.map(item => {
                    return item.cashierDocNo
                })
                let param = {
                    "dataList": [],
                    "header": {
                        "currencyCode": "",
                        "currencyName": "",
                        "currencySymbol": "",
                        "supplierCode": "",
                        "supplierName": "",
                        "verifyDocNo": "",
                    }
                }
                Object.keys(param.header).forEach(key => {
                    param.header[key] = this.itemArr[0][key] == '' ? '1' : this.itemArr[0][key]
                })
                //param.header.supplierCode = this.itemArr[0].supplierCode
                //param.header.supplierName = this.itemArr[0].supplierName
                param.dataList = noArr
                this.$http.post(__URL.financial + 'verify/payable/addSaveDraft', param).then(
                    res => {
                        if (res.data.success) {
                            this.allInfoData = res.data.data

                            this.docStatus = this.allInfoData.header.docStatus == '' ? -1 : this.allInfoData.header.docStatus
                            this.operatData()
                            for(let i = 0;i < this.allInfoData.headList.length;i++){
                                this.allInfoData.headList[i].showCurrentAmount = this.allInfoData.headList[i].availableAmount
                                this.computedVerifyValue(this.allInfoData.headList[i].showCurrentAmount, i)
                            }
                        }
                    }
                )

            },
            //获取详情
            getInfoOthers(){
                this.$http.get(__URL.financial + 'verify/payable/detail/' + this.itemArr[0].docNo).then(
                    res => {
                        if (res.data.success) {
                            this.allInfoData = res.data.data
                            this.docStatus = res.data.data.header.docStatus
                            this.repealStatus = res.data.data.header.repeal == '' ? false : res.data.data.header.repeal
                            this.operatData()
                        }
                        for (var i = 0; i <= this.allInfoData.header.workflowStatus; i++){
                            this.flowCfg.data[i].flag = true
                        }
                    }
                )
            },
            operatData(){
                this.allInfoData.footList.forEach(item => {
                    let modal = {
                        "availableAmount": '',
                        "inboundDocNo": 0,
                        "showTaxAmounts": 0,
                        "showTotalPayAmount": 0,
                        "showCurrentAmount": 0,
                        "inbound": true,
                        "initDocDate": '',
                        "recordVersion": '',
                        "oldCurrentAmount": ''
                    }
                    modal.initDocDate = item.initDocDate
                    modal.recordVersion = item.recordVersion
                    modal.oldCurrentAmount = item.oldCurrentAmount
                    modal.availableAmount = item.availableAmount
                    modal.inboundDocNo = item.initDocNo
                    modal.showTaxAmounts = item.payAmount
                    modal.showTotalPayAmount = item.totalPayAmount
                    modal.showCurrentAmount = item.currentAmount
                    this.allInfoData.dataList.push(modal)
                })
            },
            backFootData(){
                this.pushData = Object.assign({}, this.allInfoData)
                let foot = this.pushData.dataList.filter(item => {
                    return item.inventoryId == undefined
                })
                this.pushData.dataList = this.pushData.dataList.filter(item => {
                    return item.inventoryId != undefined
                })
                foot.forEach(item => {
                    item.initDocNo = item.inboundDocNo
                    item.payAmount = item.showTaxAmounts
                    item.totalPayAmount = item.showTotalPayAmount
                    item.currentAmount = item.showCurrentAmount
                })
                this.pushData.footList = foot
            },
            setContentInitToZero(){
                this.allInfoData.dataList.forEach(item => {
                    item.showCurrentAmount = 0
                })
            },
            //收/退货详情单可核销额总数
            contentFootInputCout(){
                let count = 0
                this.allInfoData.dataList.forEach(item => {
                    if (item.inbound) {
                        count += parseFloat(item.availableAmount)
                    } else {
                        count -= parseFloat(item.availableAmount)
                    }
                })
                this.allInfoData.footList.forEach(item => {
                    count += parseFloat(item.availableAmount)
                })
                return count
            },
            //销信收款与退款核销可输总数
            headInputCount(){
                let count = 0
                this.allInfoData.headList.forEach(item => {
                    if (item.inbound) {
                        count += parseFloat(item.availableAmount)
                    } else {
                        count -= parseFloat(item.availableAmount)
                    }
                })
                return count
            },
            computedVerifyValue(number, index){
                this.headCount = 0
                let val = this.allInfoData
                val.headList[index].showCurrentAmount = number
                for (let i = 0, l = val.headList.length; i < l; i++) {
                    //如果头部有一值为空，则详情单不可输
                    if (val.headList[i].showCurrentAmount == '') {
                        this.inputStatus = true
                        this.setContentInitToZero()
                        return val.headList[index].showCurrentAmount
                    } else {
                        //计算头部总共可核销金额
                        let n = parseFloat(val.headList[i].showCurrentAmount)
                        //如果输入的值大于可输入的值，则默认改为最大值
                        if (n > val.headList[i].availableAmount) {
                            val.headList[i].showCurrentAmount = val.headList[i].availableAmount
                        }
                        if (val.headList[i].cashierDocType == 2) {
                            this.headCount += n
                        } else {
                            this.headCount -= n
                        }
                    }
                }
                //将头部可核销金额赋给详情部分可核销值,如果大于0则可输，如果小于0，则详情单不可输核销金额
                this.leftCount = this.headCount
                if (this.headCount > 0) {
                    this.inputStatus = false
                    this.computedVal(val, val.dataList.length)
                } else {
                    this.inputStatus = true
                    this.setContentInitToZero()
                }
                return val.headList[index].showCurrentAmount
            },
            computInfoVerifyValue(number, index){
                let val = this.allInfoData
                let haveSetCount = 0
                //判断输入的值是否超过可输的范围
                number = number == '' ? 0 : number
                if(parseFloat(number) >= parseFloat(val.dataList[index].availableAmount)){
                    val.dataList[index].showCurrentAmount=val.dataList[index].availableAmount
                }else{
                    val.dataList[index].showCurrentAmount=number
                }
                //计算已经填写的核销总额
                for (let s = val.dataList.length - 1; s >= index; s--) {
                    if (val.dataList[s].inbound) {
                        haveSetCount = haveSetCount + parseFloat(val.dataList[s].showCurrentAmount)
                    } else {
                        haveSetCount = haveSetCount - parseFloat(val.dataList[s].showCurrentAmount)
                    }
                }
                //更新可核销值
                this.leftCount = this.headCount - haveSetCount
                this.computedVal(val, index)

                return val.dataList[index].showCurrentAmount
            },
            computedVal(val, index){
                for (let i = index - 1; i >= 0; i--) {
                    if (this.leftCount != 0) {
                        //如果是加数项
                        if (val.dataList[i].inbound) {
                            //当可核销值大于0时
                            if (this.leftCount > 0) {
                                //如果可输值 > 可核销值，则分配可核销值给它
                                //如果可输值 < 可核销值，则分配最大可输值给它
                                //更新可核销值
                                if (val.dataList[i].availableAmount > this.leftCount) {
                                    val.dataList[i].showCurrentAmount = this.leftCount
                                } else {
                                    val.dataList[i].showCurrentAmount = val.dataList[i].availableAmount
                                }
                                this.leftCount = this.leftCount - parseFloat(val.dataList[i].showCurrentAmount)
                                // 当可核销值小于0时
                            } else {
                                val.dataList[i].showCurrentAmount = 0
                            }
                            //减数项
                        } else {
                            //当可核销值大于0时
                            if (this.leftCount > 0) {
                                val.dataList[i].showCurrentAmount = 0
                            } else {
                                //当可核销值小于0时
                                //如果可输值 > 可核销的绝对值 ,则分配可核销值给它
                                //如果可输值 < 可核销的绝对值 ,则分配最大可输值给它
                                //更新可核销值
                                if (val.dataList[i].availableAmount > Math.abs(this.leftCount)) {
                                    val.dataList[i].showCurrentAmount = Math.abs(this.leftCount)
                                } else {
                                    val.dataList[i].showCurrentAmount = val.dataList[i].availableAmount
                                }
                                this.leftCount = this.leftCount + parseFloat(val.dataList[i].showCurrentAmount)
                            }
                        }
                    } else {
                        val.dataList[i].showCurrentAmount = 0
                    }
                }
            },
            goToEdit(){
                this.edit = true
                this.docStatus = -1
            },
            goToDetail(){
                this.edit = false
                this.add = false
                this.docStatus = 0
            },
            goToDel(){
                this.alertCfg.show = true
            },
            delData(){
                this.sendData('verify/payable/delete/', '删除成功', this.itemArr[0].docNo)
            },
            saveToDraft(val){
                this.backFootData()
                let url = __URL.financial + 'verify/payable/add'
                if (this.edit) {
                    this.allInfoData.header.verifyDocNo = this.itemArr[0].docNo
                    url = __URL.financial + 'verify/payable/update'
                }
                this.$http.post(url, this.pushData).then(
                    res => {
                        if (res.data.success) {
                            //如果val为false 只提交不提交审核
                            if (!val) {
                                let tips = '新增成功'
                                if (this.edit) tips = '更新成功'
                                if (this.add) this.itemArr[0].docNo = res.data.data
                                this.$emit('refreshonly')
                                this.setWarningSuccess('success', tips)
                                this.goToDetail()
                                this.getInfoOthers();
                                //如果val为true 则保存成功后再提交审核
                            } else {
                                this.sendData('verify/payable/updateaudit/', '提交审核成功', res.data.data)
                            }
                        } else {
                            this.setWarningSuccess('failure', res.data.errMsg)
                        }
                    }
                )
            },
            pushAudit(){
                //如果当前状态为-1，则是新增时，保存并提交审核
                if (this.add ||this.edit) {
                    this.backFootData()
                    let url = __URL.financial + 'verify/payable/submitaudit'
                    if (this.edit) {
                        url = __URL.financial + 'verify/payable/updateaudit'
                        this.allInfoData.header.verifyDocNo = this.itemArr[0].docNo
                    }
                    this.$http.post(url, this.pushData).then(
                        res => {
                            if (res.data.success) {
                                //this.edit = this.add = false
                                let tips = '提交审核成功'
                                this.$emit('refresh', 'success', tips)
                            } else {
                                this.setWarningSuccess('failure', res.data.errMsg)
                            }
                        }
                    )
                } else {
                    this.sendData('verify/payable/submit/', '提交审核成功', this.itemArr[0].docNo)
                }
            },
            didAudit(){
                this.sendData('verify/payable/audit/', '审核成功', this.itemArr[0].docNo)
            },
            giveUpAudit(){
                this.sendData('verify/payable/unaudit/', '弃审成功', this.itemArr[0].docNo)
            },
            agreeGiveUpAudit(){
                this.sendData('verify/payable/repeal/submit/', '同意撤销提交审核成功', this.itemArr[0].docNo)
            },
            repealPush(){
                this.sendData('verify/payable/repeal/', '撤销提交审核成功，等待主管同意', this.itemArr[0].docNo)
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
        },
        filters: {
            setHead: {
                write(val, oldval, index){
                    if (val != oldval) {
                        val = this.computedVerifyValue(val, index)
                    }
                    return val
                },
                read(val,oldval){
                    return Number(val).toFixed(this.decimal)
                }
            },
            setConten: {
                write(val, oldval, index){
                    if (val != oldval) {
                        val = this.computInfoVerifyValue(val, index)
                    }
                    return val
                },
                read(val,oldval){
                    return Number(val).toFixed(this.decimal)
                }
            }
        }
    }
</script>
<template>
    <!-- 弹框内置dom结构 -->
    <div class="inner-wrapper">
        <!--<pre class="show">
            {{allInfoData | json}}
        </pre>-->
        <workflow :config="flowCfg"></workflow>
        <div class="inner-content">

            <h2 class="tag two-tag">采购付款与退款核销</h2>

            <!-- inner-itemArr这个dom节点可以增加自己的类名为了方便展示下级排版 -->
            <div class="inner-item form-box">
                <div class="form-box">
                    <label>供应商名称:</label>
                    <p>{{allInfoData.header.supplierName}}</p>
                </div>
            </div>

            <div class="inner-item">
                <div class="title">出纳付/退款单</div>
                <table class="inner-table mt-15">
                    <thead>
                    <tr>
                        <th width="15%">单号</th>
                        <th width="15%">付/退款日期</th>
                        <th width="15%">结算方式</th>
                        <th width="15%">币种</th>
                        <th width="15%">付/退款金额</th>
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
                            <td>{{item.showPayReturnAmount}}</td>
                            <td>{{item.showTotalPayAmount}}</td>
                            <td v-if="add || edit">
                                <input :class="{'red':item.cashierDocType == 3}" type="number" v-model.sync="item.showCurrentAmount | setHead $index">
                                <!--<inp  :code.sync="item.showCurrentAmount | setHead" :key="price"></inp>-->
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
                <div class="title">入库/退库单详情</div>
                <table class="inner-table">
                    <thead>
                    <tr>
                        <th width="5%">序号</th>
                        <th width="15%">入库/退库单号</th>
                        <th width="10%">货品信息</th>
                        <th width="10%">单位</th>
                        <th width="10%">数量</th>
                        <th width="10%">单价</th>
                        <th width="15%">应付金额</th>
                        <th width="10%">已核销金额</th>
                        <th width="15%">本次核销金额</th>
                    </tr>
                    </thead>
                    <tbody>
                    <template v-for="item in allInfoData.dataList">
                        <tr :class="{'red':!item.inbound}">
                            <td>{{$index+1}}</td>
                            <td>
                                <span v-show="item.init" style="padding: 2px;border-radius: 1px;display:inline-block;background:#008af5;color:white">期初</span>
                                <span v-show="!item.inbound" style="padding: 2px;border-radius: 1px;display:inline-block;background:#ff5104;color:white">退货</span>
                                &nbsp;{{item.inboundDocNo}}
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
                            <td>{{item.showTotalPayAmount}}</td>
                            <td v-if="add || edit">
                                <input :class="{'red':!item.inbound}" :disabled="inputStatus" type="number"
                                       v-model.sync="item.showCurrentAmount | setConten $index">
                                <!-- <inp :disabled="inputStatus" :code.sync="item.showCurrentAmount" :key="price"></inp>-->
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
        <button v-if="allInfoData.header.docStatus != 2" class="btn-xl-def" @click="show.show = false">取消</button>
        <button v-else class="btn-xl-def" @click="show.show = false">关闭</button>
        <slot v-if="allInfoData.header.docStatus == 0 || allInfoData.header.docStatus == -1">
            <button class="btn-xl-danger" v-if="!add && !edit" @click="goToDel">删除</button>
            <button class="btn-xl-imp" v-if="!add && !edit" @click="goToEdit">编辑</button>
            <ajax-button class="btn-xl-imp" v-if="add || edit" @click="saveToDraft(false)">暂存到待处理</ajax-button>
            <ajax-button class="btn-xl-imp" @click="pushAudit">提交审核</ajax-button>
        </slot>
        <slot v-if="allInfoData.header.docStatus == 1">
            <button class="btn-xl-danger" v-if="allInfoData.header.repeal==0" @click="repealPush">撤销提交审核</button>
        </slot>
        <!-- <slot v-if="allInfoData.header.repeal">
             <button class="btn-xl-imp" @click="agreeGiveUpAudit">同意撤销提交</button>
         </slot>
         <slot v-if="allInfoData.header.docStatus == 1">
             <button class="btn-xl-imp" @click="didAudit">审核</button>
         </slot>
         <slot v-if="allInfoData.header.docStatus == 2">
             <button class="btn-xl-imp" @click="giveUpAudit">弃审</button>
         </slot>-->
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
</style>

