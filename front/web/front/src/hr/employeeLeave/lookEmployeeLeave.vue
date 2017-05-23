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
                    name:'人事主管审批',
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
                    flag:true
                }]
            },
            tipsCfg:{
              type:'warning',
              show:false
            },
            newEmployeeLeave:JSON.parse(JSON.stringify(cfg.employeeLeaveCfg)),
            approveLogs: []
        }
    },
    methods: {
        cancel(val) {
            this.$emit('refresh', val);
        }
    },
    ready(){
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
                    <p>{{newEmployeeLeave.departmentName}}</p>
                </div>
                <div class="form-group">
                    <label>离职类型:</label>
                    <p>{{newEmployeeLeave.leaveTypeName}}</p>
                </div>
                <div class="form-group">
                    <label>工号:</label>
                    <p>{{newEmployeeLeave.jobNumber}}</p>
                </div>
                <div class="form-group">
                    <label>岗位:</label>
                    <p>{{newEmployeeLeave.roleName}}</p>
                </div>
                <div class="form-group">
                    <label>离职日期:</label>
                    <p>{{newEmployeeLeave.leaveDate}}</p>
                </div>
                <div class="form-group wd-100 align-items__baseline">
                    <label>离职原因:</label>
                    <p class="lh-20">{{newEmployeeLeave.leaveReason}}</p>
                </div>
            </div>

            <div class="inner-item">
                <div class="form-group">
                    <label>附件:</label>
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
        <button class="btn-xl-def" @click='cancel'>关闭</button>
    </div>
    <warning :config="tipsCfg"></warning>
</template>
<style lang='less' scoped>
    /* 此处为自己定义的样式 */
    @import '../../../../../public/css/variable.less';
</style>
