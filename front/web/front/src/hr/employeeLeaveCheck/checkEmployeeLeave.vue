<script>
import cfg from './cfg'
import approvalTable from 'nb/approvalTable/app.vue'

export default {
    components: {
        approvalTable
    },
    data() {
        return {
            flowCfg:{
                data:[{
                    no:'1',
                    name:'离职登记',
                    time:'',
                    filed:'',
                    user:'',
                    flag:true
                },{
                    no:'2',
                    name:'人资行政主管审核',
                    time:'',
                    filed:'',
                    user:'',
                    flag:true
                },{
                    no:'3',
                    name:'完成',
                    time:'',
                    filed:'',
                    user:'',
                    flag:false
                }]
            },
            tipsCfg: {
                type: 'success',
                show: false,
                content: ''
            },
            repeatSubmit: false,
            newEmployeeLeave:JSON.parse(JSON.stringify(cfg.employeeLeaveCfg)),
            passModalCfg: {
                show: false,
                width: '420px',
                height: 'auto',
                header: '通过审批',
                btn: [{
                    name: '取消',
                    emit: 'close',
                }, {
                    name: '确定',
                    emit: 'sure',
                }]
            },
            rejectModalCfg: {
                show: false,
                width: '420px',
                height: 'auto',
                header: '驳回审批',
                btn: [{
                    name: '取消',
                    emit: 'close',
                }, {
                    name: '确定',
                    emit: 'sure',
                }]
            },
            approveLogs: [],
            employeeObject: {}
        }
    },
    methods: {
        getEmployee(employeeCode){
            var url = __URL.hr + "employee/find/code/" + employeeCode;
            this.$http.get(url, {}).then(
                res => {
                if (res.data.success) {
                    this.employeeObject = res.data.data;
                } else {
                    this.tipsCfg.show = true;
                    this.tipsCfg.content = res.data.errMsg;
                }
            }
        );
        },
        closeRefresh(val) {
            this.$emit('refresh', val);
        },
        cancel(){
            this.$emit('refresh', '');
        },
        showPassEmployeeLeave(){
            this.passModalCfg.show = true;
        },
        showRejectEmployeeLeave(){
            this.rejectModalCfg.show = true;
        },
        savePassEmployeeLeave(){
            if (this.repeatSubmit) return;
            this.repeatSubmit = true;
            var url = __URL.hr + 'employee/dimission/procedure/success';
            this.$http.post(url, this.newEmployeeLeave).then(
                (res) => {
                    if (res.data.success) {
                        this.closeRefresh(res.data.data);
                    } else {
                        this.tipsCfg.type = "failure";
                        this.tipsCfg.show = true;
                        this.tipsCfg.content = res.data.errMsg;
                    }
                    this.repeatSubmit = false;
                }
            );
        },
        saveRejectEmployeeLeave(){
            if (this.repeatSubmit) return;
            this.repeatSubmit = true;
            var url = __URL.hr + 'employee/dimission/procedure/reject';
            this.$http.post(url, this.newEmployeeLeave).then(
                (res) => {
                    if (res.data.success) {
                        this.cancel(res.data.data);
                    } else {
                        this.tipsCfg.type = "failure";
                        this.tipsCfg.show = true;
                        this.tipsCfg.content = res.data.errMsg;
                    }
                    this.repeatSubmit = false;
                }
            );
        },
        closePassModalDialog(){
            this.passModalCfg.show = false;
        },
        closeRejectModalCfg(){
            this.rejectModalCfg.show = false;
        }
    },
    ready(){
        this.getEmployee(this.newEmployeeLeave.employeeCode);
        var url = __URL.doc + 'approve/log/'+this.newEmployeeLeave.recordId;
        this.$http.get(url).then(
            (res) => {
                if (res.data.success) {
                    this.approveLogs = res.data.data.dataList;
                } else {
                    this.tipsCfg.type = "failure";
                    this.tipsCfg.show = true;
                    this.tipsCfg.content = res.data.errMsg;
                }
                this.repeatSubmit = false;
            }
        );
    }
}

</script>
<template>
    <div class="inner-wrapper">
        <workflow :config="flowCfg"></workflow>
        <div class="inner-content">

            <h2 class="tag">离职登记</h2>

            <div class="inner-item form-box">
                <div class="form-group">
                    <label>离职员工:</label>
                    <p>{{newEmployeeLeave.employeeName}}</p>
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
                    <label>离职日期:</label>
                    <p>{{newEmployeeLeave.leaveDate}}</p>
                </div>
                <div class="form-group wd-100 align-items__baseline">
                    <label>离职原因:</label>
                    <p class="lh-20">{{newEmployeeLeave.leaveReason}}</p>
                </div>
                <div class="form-group">
                    <label>离职资料:</label>
                    <upfile-group :data="newEmployeeLeave.files" edit=''></upfile-group>
                </div>
            </div>

            <h2 class="tag">审批记录</h2>

            <div class="inner-item">
                <approval-table :table-data="approveLogs"></approval-table>
            </div>
        </div>
    </div>
    <div class="inner-footer">
        <button class="btn-xl-def" @click='cancel'>取消</button>
        <ajax-button class="btn-xl-def" @click='showRejectEmployeeLeave'>驳回</ajax-button>
        <ajax-button class="btn-xl-imp" @click='showPassEmployeeLeave'>通过</ajax-button>
    </div>
    <warning :config="tipsCfg"></warning>

    <modal :config.sync='passModalCfg' @sure='savePassEmployeeLeave' @close='closePassModalDialog'>
        <div class="modal-input-wrap">
            <textarea class="text-style" maxlength="100" placeholder='请输入通过意见' v-model='newEmployeeLeave.auditReason'></textarea>
        </div>
    </modal>

    <modal :config.sync='rejectModalCfg' @sure='saveRejectEmployeeLeave' @close='closeRejectModalCfg'>
        <div class="modal-input-wrap">
            <div class="modal-input-wrap">
                <textarea class="text-style" maxlength="100" placeholder='请输入驳回意见'  v-model='newEmployeeLeave.auditReason'></textarea>
            </div>
        </div>
    </modal>
</template>
<style lang='less' scoped>
    /* 此处为自己定义的样式 */
    @import '../../../../../public/css/variable.less';
    .text-style{
        width:100%;
        height: 80px;
        font-size: 12px;
    }
</style>
