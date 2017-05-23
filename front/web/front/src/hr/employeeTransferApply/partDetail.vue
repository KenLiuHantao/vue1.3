<script>
    import cfg from './cfg'
    import privateRefer from './departmentRole.vue'
    import approvalTable from 'nb/approvalTable/app.vue'

    export default {
        components: {
            privateRefer,
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
                        name: '兼岗申请',
                        icon: 'icon-teamwork'
                    }]
                },
                flowCfg:{
                    data:[{
                        no:'1',
                        name:'兼岗申请',
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
                warnConfig: {
                    show: false,
                    type: 'success',
                    content: '操作成功'
                },
                dateCfg:{
                    format: 'YYYY-MM-DD',
                    clear:false
                },
                epCfg:{
                    show:false,
                },
                ep2Cfg:{
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
                    applyType: 1,
                },
                allRole:{},
                approveLogs:'',
                // 按钮重复点击控制
                clickRepeatStatus: false,
            }
        },
        computed: {
            inputContent () {
                if (this.detailParam.postDeptName && this.detailParam.postRoleName) {
                    return this.detailParam.postDeptName + '-' + this.detailParam.postRoleName
                } else {
                    return ''
                }
            }
        },
        methods: {
            cancel(){
                this.show = false;
            },
            openEp(){
                this.epCfg.show=true;
            },
            openEp2 () {
                this.ep2Cfg.show=true;
            },
            openSc(){
                this.scCfg.show=true;
            },
            epSure(item){
                this.detailParam.jobNumber=item.jobNumber;
                this.detailParam.empCode=item.employeeCode;
                this.detailParam.empName=item.employeeName;
                this.detailParam.preDeptCode=item.departmentCode;
                this.detailParam.preDeptName=item.departmentName;
                this.detailParam.preRoleCode=item.roleCode;
                this.detailParam.preRoleName=item.roleName;
            },
            ep2Sure(item){
                this.detailParam.postDeptCode=item.deptCode;
                this.detailParam.postDeptName=item.deptName;
                this.detailParam.postRoleCode=item.code;
                this.detailParam.postRoleName=item.name;
            },
            updateTransfer(){
                if (this.clickRepeatStatus) return
                this.clickRepeatControl({type: 'lock'})
                this.$http.post(__URL.hr+'employee/transfer/update',this.detailParam).then(
                    res => {
                        if (res.data.success) {
                            this.$emit('refresh')
                            this.msgCfg.show = true
                            this.msgCfg.type = "success"
                            this.msgCfg.content = "保存成功"
                            this.clickRepeatControl({type: 'unlock'})
                        } else {
                            this.warnConfig.show = true
                            this.warnConfig.type = "failure"
                            this.warnConfig.content = res.data.errMsg
                            this.clickRepeatControl({type: 'unlock'})
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
            // 按钮重复点击控制
            clickRepeatControl (cfg) {
                if (!cfg) return
                let {type} = cfg
                if (type === 'lock') {
                    this.clickRepeatStatus = true
                    setTimeout(() => {
                        this.clickRepeatStatus = false
                    }, 1000)
                    return
                }
                if (type === 'unlock') {
                    setTimeout(() => {
                        this.clickRepeatStatus = false
                    }, 500)
                    return
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
                    <label><span v-if="detailParam.transferStatus <= 0 || detailParam.rejectStatus > 1" class="must-point">*</span>员工:</label>
                    <div class="s-input ic2" v-if="detailParam.transferStatus <= 0 || detailParam.rejectStatus > 1">
                        <input type="text" readonly placeholder='请选择' v-model='detailParam.empName'>
                        <i @click='openEp' class="icon-search r1"></i>
                    </div>
                    <p v-else>{{detailParam.empName}}</p>
                </div>
                <div class="form-group">
                    <label>部门:</label>
                    <p>{{detailParam.preDeptName}}</p>
                </div>
                <div class="form-group">
                    <label><span v-if="detailParam.transferStatus <= 0 || detailParam.rejectStatus > 1" class="must-point">*</span>兼岗类别:</label>
                    <select v-if="detailParam.transferStatus <= 0 || detailParam.rejectStatus > 1" v-model='detailParam.applyType'>
                        <option value="1">增加兼任岗位</option>
                        <option value="2">移除兼任岗位</option>
                    </select>
                    <template v-else>
                        <p v-if="detailParam.applyType == 1">增加兼任岗位</p>
                        <p v-if="detailParam.applyType == 2">移除兼任岗位</p>
                    </template>
                </div>
                <div class="form-group">
                    <label>工号:</label>
                    <p>{{detailParam.jobNumber}}</p>
                </div>
                <div class="form-group">
                    <label>岗位:</label>
                    <p>{{detailParam.preRoleName}}</p>
                </div>
                <div class="form-group">
                    <label><span v-if="detailParam.transferStatus <= 0 || detailParam.rejectStatus > 1" class="must-point">*</span>增加兼任岗位:</label>
                    <div v-if="detailParam.transferStatus <= 0 || detailParam.rejectStatus > 1" class="s-input ic2">
                        <input type="text" readonly placeholder='请选择' v-model='inputContent'>
                        <i @click='openEp2' class="icon-search r1"></i>
                    </div>
                    <p v-else>{{inputContent}}</p>
                </div>
                <div class="form-group">
                    <label><span v-if="detailParam.transferStatus <= 0 || detailParam.rejectStatus > 1" class="must-point">*</span>生效日期:</label>
                    <div v-if="detailParam.transferStatus <= 0 || detailParam.rejectStatus > 1">
                        <date-picker :config='dateCfg'  :date.sync='detailParam.transferDate'></date-picker>
                    </div>
                    <p v-else>{{detailParam.transferDate}}</p>
                </div>
            </div>
            <div class="inner-item">
                <div class="form-group">
                    <label><span v-if="detailParam.transferStatus <= 0 || detailParam.rejectStatus > 1" class="must-point">*</span>申请原因:</label>
                    <div v-if="detailParam.transferStatus <= 0 || detailParam.rejectStatus > 1">
                        <input type="text" maxlength='120' placeholder='请输入申请原因' v-model='detailParam.transferReason'>
                    </div>
                    <p v-else>{{detailParam.transferReason}}</p>
                </div>
            </div>

            <h2 class="tag">审批记录</h2>
            <div class="inner-item">
                <approval-table :table-data="approveLogs"></approval-table>
            </div>
        </div>
    </div>

    <div class="inner-footer">
        <button class="btn-xl-def" @click='cancel' v-if="detailParam.transferStatus == 2">关闭</button>
        <button class="btn-xl-def" @click='cancel' v-if="detailParam.transferStatus <= 0 || detailParam.rejectStatus > 1">取消</button>
        <ajax-button class="btn-xl-imp" @click='updateTransfer' v-if="detailParam.transferStatus <= 0 || detailParam.rejectStatus > 1">提交申请</ajax-button>
    </div>

    <warning :config="warnConfig" ></warning>

    <refer-employee :config="epCfg" @cb="epSure"></refer-employee>

    <private-refer :config="ep2Cfg" @cb="ep2Sure"></private-refer>
</template>
<style lang='less' scoped>
    /* 此处为自己定义的样式 */
    @import '../../../../../public/css/variable.less';
    .must-point {
        color: #FF0700;
    }
    .form-group > label {
        width: 90px;
    }
</style>
