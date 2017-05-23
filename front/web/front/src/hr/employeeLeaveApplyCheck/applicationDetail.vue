<script>
    import approvalTable from 'nb/approvalTable/app.vue'

    export default {
        components: {
            approvalTable
        },
        props: ['show','msgCfg','detailList','applicationStatus'],
        ready(){
            this.getEmployee(this.detailList.employeeCode);
            this.getLogs(this.detailList.recordId)
            if(this.detailList.applicationStatus == 2 && this.detailList.rejectStatus == 0){
                this.flowCfg.data[0].flag = true
                this.flowCfg.data[1].flag = true
                this.flowCfg.data[2].flag = false
                this.flowCfg.data[3].flag = false
            } else if(this.detailList.applicationStatus == 0 && this.detailList.rejectStatus > 0){
                this.flowCfg.data[0].flag = false
                this.flowCfg.data[1].flag = false
                this.flowCfg.data[2].flag = false
                this.flowCfg.data[3].flag = false
            } else if(this.detailList.applicationStatus == 3 && this.detailList.rejectStatus == 0){
                this.flowCfg.data[0].flag = true
                this.flowCfg.data[1].flag = true
                this.flowCfg.data[2].flag = true
                this.flowCfg.data[3].flag = true
            }
        },
        data() {
            return {
                flowCfg: {
                    data: [{
                        no: '1',
                        name: '离职申请',
                        time:'',
                        filed: '',
                        user: '',
                        flag: true,
                    }, {
                        no: '2',
                        name: '部门主管审核',
                        time:'',
                        filed: '',
                        user: '',
                        flag: true,
                    }, {
                        no: '3',
                        name: '人资行政主管审核',
                        time:'',
                        filed: '',
                        user: '',
                        flag: false,
                    }, {
                        no: '4',
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
                repeatSubmit: false,
                employeeObject: {}
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
            getEmployee(employeeCode){
                var url = __URL.hr + "employee/find/code/" + employeeCode;
                this.$http.get(url, {}).then(
                    res => {
                    if (res.data.success) {
                        this.employeeObject = res.data.data;
                    } else {
                        this.msgconfig.show = true;
                        this.msgconfig.content = res.data.errMsg;
                    }
                }
            );
            },
            auditDimission(param) {
                if (this.repeatSubmit) return;
                this.repeatSubmit = true;
                param.auditOpinion = this.opinion
                this.$http.post(__URL.hr + 'employee/dimission/application/reaudit', param).then(
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
                this.$http.post(__URL.hr + 'employee/dimission/application/reject', param).then(
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
                    <p>{{employeeObject.departmentName}}</p>
                </div>
                <div class="form-group">
                    <label>离职类型:</label>
                    <p>主动离职</p>
                </div>
                <div class="form-group">
                    <label>工号:</label>
                    <p>{{employeeObject.jobNumber}}</p>
                </div>
                <div class="form-group">
                    <label>岗位:</label>
                    <p>{{employeeObject.roleName}}</p>
                </div>
                <div class="form-group">
                    <label>申请离职日期:</label>
                    <p>{{detailList.createTime}}</p>
                </div>
                <div class="form-group wd-100 align-items__baseline">
                    <label>离职原因:</label>
                    <p class="lh-20">{{detailList.applicationReason}}</p>
                </div>
            </div>

            <h2 class="tag">审批记录</h2>

            <div class="inner-item">
                <approval-table :table-data="approveLogs"></approval-table>
            </div>
        </div>
    </div>
    <div class="inner-footer">
        <button class="btn-xl-def" @click="show=false" v-if="applicationStatus == 2">取消</button>
        <button class="btn-xl-def" @click="show=false" v-else>关闭</button>
        <ajax-button class="btn-xl-def" @click="rejectOpinionModCfg.show=true" v-if="applicationStatus == 2">驳回</ajax-button>
        <ajax-button class="btn-xl-imp" @click="auditOpinionModCfg.show=true" v-if="applicationStatus == 2 ">通过</ajax-button>

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

    .searchBox {
        display: flex;
        flex-wrap: wrap;
    }


    .text-group {
        padding: 20px;

        textarea {
            margin: 0px;
            width: 100%;
            height: 120px;
        }

    }

</style>
