<script>

    import cfg from './cfg'
    export default {
        props: ['show','msgCfg'],
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
                newParam:{
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
                allRole:{},
                // 按钮重复点击控制
                clickRepeatStatus: false,
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
                this.newParam.postDeptCode=item.code;
                this.newParam.postDeptName=item.name;
                this.newParam.data = item;
                this.getRole({
                    'departmentCode':item.code,
                    "roleCode": ''
                })
            },
            epSure(item){
                this.newParam.jobNumber=item.jobNumber;
                this.newParam.empCode=item.employeeCode;
                this.newParam.empName=item.employeeName;
                this.newParam.preDeptCode=item.departmentCode;
                this.newParam.preDeptName=item.departmentName;
                this.newParam.preRoleCode=item.roleCode;
                this.newParam.preRoleName=item.roleName;
            },
            saveTransfer(){
                if (this.clickRepeatStatus) return
                this.clickRepeatControl({type: 'lock'})
                this.$http.post(__URL.hr + 'employee/transfer/insert', this.newParam).then(
                    res => {
                        if (res.data.success) {
                            this.msgCfg.show = true
                            this.msgCfg.type = "success"
                            this.msgCfg.content = "保存成功"
                            this.$emit('refresh')
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
                    "roleCode": this.newParam.postRoleCode
                }
                let info = this.allRole.filter(item=>{
                    return item.roleCode == this.newParam.postRoleCode
                })
                this.newParam.postRoleName = info[0].roleName
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
        }
    }
</script>
<template>
    <div class="inner-wrapper">
        <workflow :config="flowCfg"></workflow>
        <div class="inner-content">

            <h2 class="tag">调岗申请信息</h2>

            <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
            <div class="inner-item form-box">
                <div class="form-group">
                    <label><span class="must-point">*</span>调岗员工:</label>
                    <div class="s-input ic2">
                        <input type="text" readonly placeholder='请选择' v-model='newParam.empName'>
                        <i @click='openEp' class="icon-search r1"></i>
                    </div>
                </div>
                <div class="form-group">
                    <label>调整前部门:</label>
                    <p>{{newParam.preDeptName}}</p>
                </div>
                <div class="form-group">
                    <label><span class="must-point">*</span>调整后部门:</label>
                    <div class="s-input ic2">
                        <input type="text" readonly placeholder='请选择' v-model='newParam.postDeptName'>
                        <i @click='openDep' class="icon-search r1"></i>
                    </div>
                </div>
                <div class="form-group">
                    <label>工号:</label>
                    <p>{{newParam.jobNumber}}</p>
                </div>
                <div class="form-group">
                    <label>调整前岗位:</label>
                    <p>{{newParam.preRoleName}}</p>
                </div>
                <div class="form-group">
                    <label><span class="must-point">*</span>调整后岗位:</label>
                    <select v-model='newParam.postRoleCode' @change='changeRole'>
                        <option v-for='item in allRole' :value='item.roleCode'>{{item.roleName}}</option>
                    </select>
                </div>
                <div class="form-group">
                    <label><span class="must-point">*</span>生效日期:</label>
                    <date-picker :config='dateCfg' :date.sync='newParam.transferDate'></date-picker>
                </div>
            </div>
            <div class="inner-item">
                <div class="form-group">
                    <label><span class="must-point">*</span>调岗原因:</label>
                    <input type="text" maxlength='120' placeholder='请输入调岗原因' v-model='newParam.transferReason'>
                </div>
            </div>
        </div>
    </div>

    <div class="inner-footer">
        <button class="btn-xl-def" @click='cancel'>取消</button>
        <ajax-button class="btn-xl-imp" @click='saveTransfer'>提交申请</ajax-button>
    </div>
    <warning :config="warnConfig" ></warning>
    <refer-department :config="depCfg" @cb="cdSure"></refer-department>
    <refer-employee :config="epCfg" @cb="epSure"></refer-employee>
</template>
<style lang='less' scoped>
    /* 此处为自己定义的样式 */
    @import '../../../../../public/css/variable.less';
    .must-point {
        color: #FF0700;
    }
</style>
