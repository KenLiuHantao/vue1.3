<script>
    export default {
        props: ['show','msgCfg'],
        ready(){
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
                //提示消息
                msgconfig:{
                    type:'failure',
                    show:false,
                    content:'',
                },
                applicationData:{
                    applicationDate: '',
                    applicationReason: '',
                    employeeCode: '',
                    employeeName:'',
                    departmentCode:'',
                    departmentName:'',
                    roleCode:'',
                    roleName:'',
                    jobNumber:'',
                },
                //员工弹框
                codeModal: {
                    show: false,
                    width: '800px',
                    height: '400px',
                    header: '请选择业务员',
                    btn: [{
                        name: '关闭',
                        emit: 'codeclose'
                    }, {
                        name: '确认',
                        emit: 'codesure'
                    }]
                },
                calendarConfig:{
                    placeholder:'请选择时间',
                    format:'YYYY-MM-DD' , //YYYY/MM/DD
                },
                repeatSubmit: false,
            }
        },
        methods: {
            commitRefuse(param) {
                if (this.repeatSubmit) return;
                this.repeatSubmit = true;
                param.auditOpinion = this.opinion
                this.$http.post(__URL.hr + 'employee/refuse/application/insert', param).then(
                    res => {
                        if (res.data.success) {
                            this.hide()
                            this.msgCfg.type = "success"
                            this.msgCfg.content = "提交成功"
                            this.msgCfg.show = true
                        } else {
                            this.msgconfig.show = true
                            this.msgconfig.content = res.data.errMsg
                            this.repeatSubmit = false;
                        }
                    }
                )
            },
            commit(){
                this.commitRefuse(this.applicationData)
            },
            hide(){
                this.$emit('refresh')
            },
            pickPerson(data){

                console.log(data)
                this.codeModal.show=false;
                this.applicationData.employeeCode=data.employeeCode;
                this.applicationData.employeeName=data.employeeName;
                this.applicationData.departmentCode = data.departmentCode;
                this.applicationData.departmentName = data.departmentName;
                this.applicationData.roleCode = data.roleCode;
                this.applicationData.roleName = data.roleName;
                this.applicationData.jobNumber = data.jobNumber
            },
            searchemployee:function(){
                this.codeModal.show=true;
            },
            clearemployeeName(){
                this.applicationData.employeeCode='';
                this.applicationData.employeeName='';
            },
        },
    }

</script>
<template>
    <!-- 弹框内置dom结构 -->
    <div class="inner-wrapper">
        <workflow :config="flowCfg"></workflow>
        <div class="inner-content">

            <h2 class="tag">辞退申请信息</h2>

            <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
            <div class="inner-item form-box">
                <div class="form-group">
                    <label><span class="must-point">*</span>离职员工:</label>
                    <div class="s-input">
                        <input type="text" readonly v-model="applicationData.employeeName">
                        <i class="icon-modal__close r2" v-show='applicationData.employeeName' @click='clearemployeeName'></i>
                        <i @click='searchemployee' class="icon-search r1"></i>
                    </div>
                </div>
                <div class="form-group">
                    <label>部门:</label>
                    <p>{{applicationData.departmentName}}</p>
                </div>
                <div class="form-group">
                    <label>离职类型:</label>
                    <p>被动离职</p>
                </div>
                <div class="form-group">
                    <label>工号:</label>
                    <p>{{applicationData.jobNumber}}</p>
                </div>
                <div class="form-group">
                    <label>岗位:</label>
                    <p>{{applicationData.roleName}}</p>
                </div>
                <div class="form-group">
                    <label class="w-100"><span class="must-point">*</span>申请辞退日期:</label>
                    <div class="s-input">
                        <date-picker :config="calendarConfig"
                                     :date.sync="applicationData.applicationDate"></date-picker>
                    </div>
                </div>
                <div class="form-group">
                    <label><span class="must-point">*</span>辞退原因:</label>
                    <div>
                        <input type="text" v-model="applicationData.applicationReason">
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="inner-footer">
        <button class="btn-xl-def" @click="show=false">取消</button>
        <button class="btn-xl-imp" @click="commit">提交申请</button>

    </div>
    <!--提示信息-->
    <warning :config="msgconfig"></warning>

    <refer-employee :config='codeModal' @cb='pickPerson'></refer-employee>
</template>
<style lang='less' scoped>
    /* 此处为自己定义的样式 */
    @import '../../../../../public/css/variable.less';
    .buttom {
        height: 500px;
    }
    .w-100{
        width: 100px;
    }
</style>

