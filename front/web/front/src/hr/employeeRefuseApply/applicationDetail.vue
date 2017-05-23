<script>
    import Vue from 'vue'
    export default {
        props: ['show','msgCfg','detailList'],
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
                //提示消息
                msgconfig:{
                    type:'failure',
                    show:false,
                    content:''
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
                    format:'YYYY-MM-DD'  //YYYY/MM/DD
                },
                approveLogs:'',
                repeatSubmit: false,
                isEdit:false
            }
        },
        computed: {
            applicationData () {
                return this.detailList
            }
        },
        methods: {
            getLogs (param){
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
            commitRefuse (param) {
                if (this.repeatSubmit) return;
                this.repeatSubmit = true;
                this.$http.post(__URL.hr + 'employee/refuse/application/update', param).then(
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
            commit () {
                this.commitRefuse(this.detailList)
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
            hide () {
                this.$emit('refresh')
            },
            pickPerson (data) {
                this.codeModal.show = false;
                this.detailList.employeeCode = data.employeeCode
                this.detailList.employeeName = data.employeeName
                this.detailList.departmentCode = data.departmentCode
                this.detailList.departmentName = data.departmentName
                this.detailList.roleCode = data.roleCode
                this.detailList.roleName = data.roleName
                this.detailList.jubNumber = data.jobNumber
            },
            searchemployee () {
                this.codeModal.show = true
            },
            clearemployeeName () {
                this.applicationData.employeeCode = ''
                this.applicationData.employeeName = ''
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
                    <label><span v-if="isEidt" class="must-point">*</span>辞退员工:</label>
                    <p v-if="!isEidt">{{detailList.employeeName}}</p>
                    <div class="s-input" v-else>
                        <input type="text" readonly v-model="detailList.employeeName">
                        <i class="icon-close__round r2" v-show='detailList.employeeName' @click='clearemployeeName'></i>
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
                    <label class="w-100"><span v-if="isEidt" class="must-point">*</span>申请辞退日期:</label>
                    <p v-if="!isEdit">{{detailList.applicationDate}}</p>
                    <div class="s-input" v-else>
                        <date-picker :config="calendarConfig" :date.sync="detailList.applicationDate"></date-picker>
                    </div>
                </div>
                <div v-if="!isEdit" class="form-group wd-100 align-items__baseline">
                    <label><span v-if="isEidt" class="must-point">*</span>辞退原因:</label>
                    <p class="lh-20">{{detailList.applicationReason}}</p>
                </div>
                <div v-else class="form-group wd-100">
                    <label><span v-if="isEidt" class="must-point">*</span>辞退原因:</label>
                    <div>
                        <input type="text" v-model="detailList.applicationReason">
                    </div>
                </div>
            </div>

            <h2 class="tag">审批记录</h2>

            <div class="inner-item">
                <table class="inner-table">
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
        <button class="btn-xl-def" @click="show=false" v-if="isEdit || detailList.rejectStatus > 0">取消</button>
        <button class="btn-xl-def" @click="show=false" v-else>关闭</button>
        <button class="btn-xl-imp" @click="isEdit=true" v-if="!isEdit && detailList.rejectStatus > 0">重新编辑</button>
        <button class="btn-xl-def" @click="show=false" v-if="isEdit">取消</button>
        <button class="btn-xl-imp" @click="commit" v-if="isEdit">重新提交</button>

    </div>
    <!--提示信息-->
    <warning :config="msgconfig"></warning>
    <refer-employee :config='codeModal' @cb='pickPerson'></refer-employee>
</template>
<style lang='less' scoped>
    /* 此处为自己定义的样式 */
    @import '../../../../../public/css/variable.less';
    .w-100{
        width: 100px;
    }
</style>

