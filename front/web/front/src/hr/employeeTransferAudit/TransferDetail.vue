<script>
    import cfg from './cfg'
    import approvalTable from 'nb/approvalTable/app.vue'

    export default {
        components: {
            approvalTable
        },
        props: ['show','msgCfg','id','isEdit'],
        data() {
            return {
                tabConfig: {
                    type:'page',
                    select: '',
                    tabBarData: [{
                        id: 'tab1',
                        name: '调岗申请',
                        icon: 'icon-teamwork'
                    }]
                },
                flowCfg:{
                    data:[{
                        no:'1',
                        name:'调岗申请',
                        time:'',
                        filed:'',
                        user:'',
                        flag:true,
                    },{
                        no:'2',
                        name:'人资行政主管审核',
                        time:'',
                        filed:'',
                        user:'',
                        flag:false,
                    },{
                        no:'3',
                        name:'人事专员登记',
                        time:'',
                        filed:'',
                        user:'',
                        flag:false,
                    },{
                        no:'4',
                        name:'完成',
                        time:'',
                        filed:'',
                        user:'',
                        flag:false,
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
                warnConfig: {
                    show: false,
                    type: 'success',
                    content: '操作成功'
                },
                dateCfg:{
                    format: 'YYYY-MM-DD',
                    clear:false
                },
                depCfg:{
                    show:false,
                    data:{},
                    param:{}
                },
                epCfg:{
                    show:false,
                },
                detailParam:{
                    jobNumber: '',
                    empCode: '',
                    empName: '',
                    postDeptCode: '',
                    postDeptName: '',
                    postRoleCode: '',
                    postRoleName: '',
                    preDeptCode: '',
                    preDeptName: '',
                    preRoleCode: '',
                    preRoleName: '',
                    transferDate: '',
                    transferReason: '',
                    applyType: 0,
                },
                auditParam:{
                    recordId: '',
                    auditOpinion: '',
                    recordVersion: ''
                },
                opinion:'',
                allRole:{},
                approveLogs:'',
            }
        },
        methods: {
            cancel(){
                this.show = false;
            },
            openDep(){
                this.depCfg.show=true;
            },
            openEp(){
                this.epCfg.show=true;
            },
            openSc(){
                this.scCfg.show=true;
            },
            cdSure(item){
                this.detailParam.postDeptCode=item.code;
                this.detailParam.postDeptCode=item.name;
                this.detailParam.data = item;
                this.getRole({
                    'departmentCode': item.code,
                    "roleCode": ""
                })
            },
            epSure(item){
                this.detailParam.empCode=item.employeeCode;
                this.detailParam.empName=item.employeeName;
                this.detailParam.preDeptCode=item.departmentCode;
                this.detailParam.preDeptName=item.departmentName;
                this.detailParam.preRoleCode=item.roleCode;
                this.detailParam.preRoleName=item.roleName;
            },
            auditOpinionSure(){
                this.auditParam.recordId = this.detailParam.recordId
                this.auditParam.recordVersion = this.detailParam.recordVersion
                this.auditParam.auditOpinion = this.opinion
                this.auditTransfer(this.auditParam)
            },
            auditOpinionClose(){
                this.auditOpinionModCfg.show=false;
            },
            rejectOpinionSure(){
                this.auditParam.recordId = this.detailParam.recordId
                this.auditParam.recordVersion = this.detailParam.recordVersion
                this.auditParam.auditOpinion = this.opinion
                this.rejectTransfer(this.auditParam)
            },
            rejectOpinionClose(){
                this.rejectOpinionModCfg.show=false;
            },
            auditTransfer(param){
                this.$http.post(__URL.hr+'employee/transfer/audit',param).then(
                    res => {
                        if (res.data.success) {
                            this.$emit('refresh')
                            this.msgCfg.show = true
                            this.msgCfg.type = "success"
                            this.msgCfg.content = "审核成功"
                        } else {
                            this.warnConfig.show = true
                            this.warnConfig.type = "failure"
                            this.warnConfig.content = res.data.errMsg
                        }
                    }
                )
            },
            rejectTransfer(param){
                this.$http.post(__URL.hr+'employee/transfer/reject',param).then(
                    res => {
                        if (res.data.success) {
                            this.$emit('refresh')
                            this.msgCfg.show = true
                            this.msgCfg.type = "success"
                            this.msgCfg.content = "驳回成功"
                        } else {
                            this.warnConfig.show = true
                            this.warnConfig.type = "failure"
                            this.warnConfig.content = res.data.errMsg
                        }
                    }
                )
            },
            getLogs(param){
                var url = __URL.doc + 'approve/log/'+param
                this.$http.get(url).then(
                    (res) => {
                        if (res.data.success) {
                            this.approveLogs = res.data.data.dataList;
                        } else {
                            this.warnConfig.show = true;
                            this.warnConfig.content = res.data.errMsg;
                        }
                        this.repeatSubmit = false;
                    }
                )
            },
            detail(){
                this.$http.get(__URL.hr+'employee/transfer/detail/'+this.id).then(
                    res => {
                        if (res.data.success) {
                            this.detailParam = res.data.data
                        } else {
                            this.warnConfig.show = true
                            this.warnConfig.type = "failure"
                            this.warnConfig.content = res.data.errMsg
                        }
                    }
                )
            },
            //获取岗位
            getRole(param){
                var data={
                    "departmentCode": "",
                    "roleCode": ""
                }
                if(param){
                    data=param
                }
                this.$http.get(__URL.service+'role/search/department/name/like',{'params':data}).then(
                    (res) => {
                        if(res.data.success){
                            var _data=res.data.data;
                            this.allRole=[];
                            for(var i=0;i<_data.length;i++){
                                _data[i].roleCode=_data[i].code;
                                _data[i].roleName=_data[i].name;
                                this.allRole.push(_data[i])
                            }
                        }
                    },
                    (err) => {
                        console.log('初始化未能拿到tree数据')
                    }
                )
            },
            //岗位选择影响部门参照
            changeRole(){
                this.depCfg.param={
                    "roleCode": this.detailParam.postRoleCode
                }
                for(let i=0;i<this.allRole.length;i++){
                    if(this.allRole[i].roleCode == this.detailParam.postRoleCode){
                        this.detailParam.postRoleName = this.allRole[i].roleName
                    }
                }
            },
        },
        ready(){
            this.getRole()
            this.detail()
            this.getLogs(this.id)
        }
    }
</script>
<template>
    <div class="inner-wrapper">
        <workflow :config="flowCfg"></workflow>
        <div class="inner-content">

            <h2 class="tag">固定资产档案</h2>

            <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
            <div class="inner-item form-box">
                <div class="form-group">
                    <label>调岗员工:</label>
                    <p>{{detailParam.empName}}</p>
                </div>
                <div class="form-group">
                    <label>调整前部门:</label>
                    <p>{{detailParam.preDeptName}}</p>
                </div>
                <div class="form-group">
                    <label>调整后部门:</label>
                    <p>{{detailParam.postDeptName}}</p>
                </div>
                <div class="form-group">
                    <label>工号:</label>
                    <p>{{detailParam.jobNumber}}</p>
                </div>
                <div class="form-group">
                    <label>调整前岗位:</label>
                    <p>{{detailParam.preRoleName}}</p>
                </div>
                <div class="form-group">
                    <label>调整后岗位:</label>
                    <p>{{detailParam.postRoleName}}</p>
                </div>
                <div class="form-group">
                    <label>生效日期:</label>
                    <p>{{detailParam.transferDate}}</p>
                </div>
            </div>
            <div class="inner-item">
                <div class="form-group wd-100">
                    <label>调岗原因:</label>
                    <p>{{detailParam.transferReason}}</p>
                </div>
            </div>

            <h2 class="tag">审批记录</h2>
            <div class="inner-item">
                <approval-table :table-data="approveLogs"></approval-table>
            </div>
        </div>
    </div>

    <div class="inner-footer">
        <button class="btn-xl-def" @click='cancel' v-if="detailParam.transferStatus == -1 || detailParam.transferStatus == 2">关闭</button>
        <button class="btn-xl-def" @click='cancel' v-else>取消</button>
        <ajax-button class="btn-xl-imp" @click='auditOpinionModCfg.show=true' v-if="detailParam.transferStatus == 0 || detailParam.rejectStatus > 1">通过</ajax-button>
        <ajax-button class="btn-xl-imp" @click='rejectOpinionModCfg.show=true' v-if="detailParam.transferStatus == 0 || detailParam.rejectStatus > 1">驳回</ajax-button>
    </div>
    <warning :config="warnConfig" ></warning>
    <refer-department :config="depCfg" @cb="cdSure"></refer-department>
    <refer-employee :config="epCfg" @cb="epSure"></refer-employee>

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
</template>
<style lang='less' scoped>
    /* 此处为自己定义的样式 */
    @import '../../../../../public/css/variable.less';
    .must-point {
        color: #FF0700;
    }

    .text-group {
        padding: 20px;

        textarea {
            margin: 0px;
            width: 100%;
            height: 120px;
        }
    }

    .wd-100 {
        width: 100%;
    }
</style>
