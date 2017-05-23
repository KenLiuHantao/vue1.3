<script>
    import Vue from 'vue'
    export default {
        props: ['show','msgCfg','detailList','applicationStatus','rejectStatus'],
        ready(){
            this.getLogs(this.detailList.recordId)
            this.getDetail(this.detailList.employeeCode)
            if(this.detailList.applicationStatus == 2 && this.detailList.rejectStatus == 0){
                this.flowCfg.data[0].flag = true
                this.flowCfg.data[1].flag = false
                this.flowCfg.data[2].flag = false
            } else if(this.detailList.applicationStatus == 2 && this.detailList.rejectStatus > 0){
                this.flowCfg.data[0].flag = false
                this.flowCfg.data[1].flag = false
                this.flowCfg.data[2].flag = false
            } else if(this.detailList.applicationStatus == 3 && this.detailList.rejectStatus == 0){
                this.flowCfg.data[0].flag = true
                this.flowCfg.data[1].flag = true
                this.flowCfg.data[2].flag = true
            }
        },
        data() {
            return {
                flowCfg: {
                    data: [{
                        no: '1',
                        name: '辞退申请',
                        time:'',
                        filed: '',
                        user: '',
                        flag: true,
                    }, {
                        no: '2',
                        name: '人事主管审批',
                        time:'',
                        filed: '',
                        user: '',
                        flag: false,
                    }, {
                        no: '3',
                        name: '完成',
                        time:'',
                        filed: '',
                        user: '',
                        flag: false,
                    }]
                },
                auditOpinionModCfg:{
                    show: false,
                    width: '400px',
                    height: 'auto',
                    header: '通过审批',
                    btn: [{
                        name: '取消',
                        emit: 'close',
                    }, {
                        name: '确定',
                        emit: 'sure',
                    }],
                },
                rejectOpinionModCfg:{
                    show: false,
                    width: '400px',
                    height: 'auto',
                    header: '驳回审批',
                    btn: [{
                        name: '取消',
                        emit: 'close',
                    }, {
                        name: '确定',
                        emit: 'sure',
                    }],
                },
                //提示消息
                msgconfig:{
                    type:'failure',
                    show:false,
                    content:''
                },
                searchParams: {
                    "customerName": "",
                    "employeeName": "",
                    "inventoryCode": "",
                    "salesOrderDocNo": "",
                    "salesDispatchDocDate": "",
                    "pageIndex": 0,
                    "pageSize": 0,
                },
                paramData: {
                    "remark": "",
                    "returnReason": "",
                    "salesReturnAddDetailReqVos": [],
                },
                auditData:{
                    recordId:'',
                    recordVersion:''
                },
                approveLogs:'',
                opinion:'',
                repeatSubmit:false
            }
        },
        methods: {
            getLogs(param){
                var url = __URL.doc + 'approve/log/'+param
                this.$http.get(url).then(
                    (res) => {
                        if (res.data.success) {
                            this.approveLogs = res.data.data.dataList;
                        } else {
                            this.msgconfig.show = true;
                            this.msgconfig.content = res.data.errMsg;
                        }
                        this.repeatSubmit = false;
                    }
                )
            },
            auditDimission(param) {
                if (this.repeatSubmit) return;
                this.repeatSubmit = true;
                param.auditOpinion = this.opinion
                this.$http.post(__URL.hr + 'employee/refuse/application/audit', param).then(
                    res => {
                        if (res.data.success) {
                            this.msgCfg.type = "success"
                            this.msgCfg.content = "审核成功"
                            this.msgCfg.show = true
                            this.rejectOpinionModCfg.show=false;
                            this.hide()
                        } else {
                            this.msgconfig.show = true
                            this.msgconfig.content = res.data.errMsg
                            this.repeatSubmit = false
                        }
                    }
                )
            },
            rejectDimission(param) {
                if (this.repeatSubmit) return;
                this.repeatSubmit = true;
                param.auditOpinion = this.opinion
                this.$http.post(__URL.hr + 'employee/refuse/application/reject', param).then(
                    res => {
                        if (res.data.success) {
                            this.msgCfg.type = "success"
                            this.msgCfg.content = "驳回成功"
                            this.msgCfg.show = true
                            this.rejectOpinionModCfg.show=false;
                            this.hide()
                        } else {
                            this.msgconfig.show = true
                            this.msgconfig.content = res.data.errMsg
                            this.repeatSubmit = false
                        }
                    }
                )
            },
            getDetail (code) {
                this.$http.get(__URL.hr + 'employee/find/code/'+ code).then(
                    res => {
                        if (res.data.success) {
                            Vue.set(this.detailList,'departmentCode',res.data.data.departmentCode)
                            Vue.set(this.detailList,'departmentName',res.data.data.departmentName)
                            Vue.set(this.detailList,'roleCode',res.data.data.roleCode)
                            Vue.set(this.detailList,'roleName',res.data.data.roleName)
                            Vue.set(this.detailList,'jobNumber',res.data.data.jobNumber)
                        } else {
                            this.msgconfig.show = true
                            this.msgconfig.content = res.data.errMsg
                        }
                    }
                )
            },
            audit(){
                this.auditData.recordId = this.detailList.recordId
                this.auditData.recordVersion = this.detailList.recordVersion
                this.auditDimission(this.auditData)
            },
            reject(){
                this.auditData.recordId = this.detailList.recordId
                this.auditData.recordVersion = this.detailList.recordVersion
                this.auditData.applicationStatus = this.applicationStatus
                this.rejectDimission(this.auditData)
            },
            hide(){
                this.$emit('refresh')
            },
            auditOpinionSure(){
                this.audit()
            },
            auditOpinionClose(){
                this.auditOpinionModCfg.show=false;
            },
            rejectOpinionSure(){
                this.reject()
            },
            rejectOpinionClose(){
                this.rejectOpinionModCfg.show=false;
            },
        },
    }

</script>
<template>
    <!-- 弹框内置dom结构 -->
    <div class="inner-wrapper">
        <workflow :config="flowCfg"></workflow>
        <div class="inner-content">

            <h2 class="tag">离职申请信息</h2>

            <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
            <div class="inner-item form-box">
                <div class="form-group">
                    <label>离职员工:</label>
                    <p>{{detailList.employeeName}}</p>
                </div>
                <div class="form-group">
                    <label>部门:</label>
                    <p>{{detailList.departmentName}}</p>
                </div>
                <div class="form-group">
                    <label>离职类型:</label>
                    <p>{{detailList.leaveType}}</p>
                </div>
                <div class="form-group">
                    <label>工号:</label>
                    <p>{{detailList.jobNumber}}</p>
                </div>
                <div class="form-group">
                    <label>岗位:</label>
                    <p>{{detailList.roleName}}</p>
                </div>
                <div class="form-group">
                    <label>申请辞退日期:</label>
                    <p>{{detailList.applicationDate}}</p>
                </div>
                <div class="form-group wd-100 align-items__baseline">
                    <label>辞退原因:</label>
                    <p class="lh-20">{{detailList.applicationReason}}</p>
                </div>
            </div>

            <h2 class="tag">审批记录</h2>

            <div class="inner-item">
                <table class="inner-table ">
                    <thead>
                    <tr>
                        <th>批注</th>
                        <th>操作人</th>
                        <th>操作时间</th>
                        <th>处理结果</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for='log in approveLogs'>
                        <td>{{log.reason}}</td>
                        <td>{{log.userName}}</td>
                        <td>{{log.createTime}}</td>
                        <td>{{log.statusDesc}}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div class="inner-footer">
        <button class="btn-xl-def" @click="show=false" v-if="applicationStatus == 3 || rejectStatus == 1">关闭</button>
        <button class="btn-xl-def" @click="show=false" v-else>取消</button>
        <button class="btn-xl-def" @click="rejectOpinionModCfg.show=true"
                v-if="applicationStatus == 2 && rejectStatus == 0">驳回
        </button>
        <button class="btn-xl-imp" @click="auditOpinionModCfg.show=true"
                v-if="applicationStatus == 2 && rejectStatus == 0">通过
        </button>


    </div>
    <!--审批意见-->
    <modal :config='auditOpinionModCfg' @sure='auditOpinionSure' @close='auditOpinionClose'>
        <div class='text-group'>
            <textarea type="text" maxlength="200" placeholder="可填写审批意见" v-model="opinion"></textarea>
        </div>
    </modal>
    <!--驳回意见-->
    <modal :config='rejectOpinionModCfg' @sure='rejectOpinionSure' @close='rejectOpinionClose'>
        <div class='text-group'>
            <textarea type="text" maxlength="200" placeholder="可填写驳回意见" v-model="opinion"></textarea>
        </div>
    </modal>
    <!--提示信息-->
    <warning :config="msgconfig"></warning>
</template>
<style lang='less' scoped>
    /* 此处为自己定义的样式 */
    @import '../../../../../public/css/variable.less';

    .text-group {
        padding: 20px;

        textarea {
            margin: 0px;
            width: 100%;
            height: 120px;
        }

    }


</style>

