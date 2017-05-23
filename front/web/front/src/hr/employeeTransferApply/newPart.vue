<script>

    import cfg from './cfg'
    import privateRefer from './departmentRole.vue'

    export default {
        components: {
            privateRefer
        },
        props: ['show','msgCfg'],
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
                    applyType: 1,
                },
                allRole:{},
                // 按钮重复点击控制
                clickRepeatStatus: false,
                // 切换兼任岗位的输入框为 select 时获取到的原始数据和选中项
                roleFrameOriginData: [],
                roleFrameIndex: '',
            }
        },
        computed: {
            inputContent () {
                if (this.newParam.postDeptName && this.newParam.postRoleName) {
                    return this.newParam.postDeptName + '-' + this.newParam.postRoleName
                } else {
                    return ''
                }
            },
            roleFrameData () {
                this.roleFrameIndex = 0
                this.returnRoleResult()
                return this.roleFrameOriginData.map(val => `${val.departmentName}-${val.roleName}`)
            },
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
                this.newParam.jobNumber=item.jobNumber;
                this.newParam.empCode=item.employeeCode;
                this.newParam.empName=item.employeeName;
                this.newParam.preDeptCode=item.departmentCode;
                this.newParam.preDeptName=item.departmentName;
                this.newParam.preRoleCode=item.roleCode;
                this.newParam.preRoleName=item.roleName;
                this.switchRoleFrame()
            },
            ep2Sure(item){
                this.newParam.postDeptCode=item.deptCode;
                this.newParam.postDeptName=item.deptName;
                this.newParam.postRoleCode=item.code;
                this.newParam.postRoleName=item.name;
            },
            saveTransfer(){
                if (this.clickRepeatStatus) return
                this.clickRepeatControl({type: 'lock'})
                this.$http.post(__URL.hr + 'employee/transfer/insert', this.newParam).then(
                    res => {
                        if (res.data.success) {
                            this.$warning({'type':'success', 'message':'保存成功'})
                            this.$emit('refresh')
                            this.clickRepeatControl({type: 'unlock'})
                        } else {
                            this.$warning({'type':'failure', 'message':res.data.errMsg})
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
            // 切换兼任岗位的输入框类型
            switchRoleFrame () {
                if (this.newParam.applyType == 2) {
                    if (this.clickRepeatStatus) return
                    this.clickRepeatControl({type: 'lock'})
                    const param = {
                        params: {
                            employeeCode: this.newParam.empCode
                        }
                    }
                    this.$http.post(__URL.hr + 'employee/transfer/role/ref', null, param).then(
                        res => {
                            if (res.data.success) {
                                this.roleFrameOriginData = res.data.data.dataList
                                this.clickRepeatControl({type: 'unlock'})
                            } else {
                                this.$warning({'type':'failure', 'message':res.data.errMsg})
                                this.clickRepeatControl({type: 'unlock'})
                            }
                        }
                    )
                }
            },
            // 返回获得的选项
            returnRoleResult () {
                if (!this.roleFrameOriginData.length) return
                const item = this.roleFrameOriginData[this.roleFrameIndex]
                this.newParam.postDeptCode=item.departmentCode
                this.newParam.postDeptName=item.departmentName
                this.newParam.postRoleCode=item.roleCode
                this.newParam.postRoleName=item.roleName
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

            <h2 class="tag">兼岗申请信息</h2>

            <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
            <div class="inner-item form-box">
                <div class="form-group">
                    <label><span class="must-point">*</span>员工:</label>
                    <div class="s-input ic2">
                        <input type="text" readonly placeholder='请选择' v-model='newParam.empName'>
                        <i @click='openEp' class="icon-search r1"></i>
                    </div>
                </div>
                <div class="form-group">
                    <label>部门:</label>
                    <p>{{newParam.preDeptName}}</p>
                </div>
                <div class="form-group">
                    <label><span class="must-point">*</span>兼岗类别:</label>
                    <select @change="switchRoleFrame" v-model='newParam.applyType'>
                        <option value="1">增加兼任岗位</option>
                        <option value="2">移除兼任岗位</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>工号:</label>
                    <p>{{newParam.jobNumber}}</p>
                </div>
                <div class="form-group">
                    <label>岗位:</label>
                    <p>{{newParam.preRoleName}}</p>
                </div>
                <div class="form-group">
                    <label><span class="must-point">*</span>兼任岗位:</label>
                    <div v-show="newParam.applyType == 1" class="s-input ic2">
                        <input type="text" readonly placeholder='请选择' v-model='inputContent'>
                        <i @click='openEp2' class="icon-search r1"></i>
                    </div>
                    <select @change="returnRoleResult" v-show="newParam.applyType == 2" v-model='roleFrameIndex'>
                        <option v-for="(index, item) in roleFrameData" :value="index">{{ item }}</option>
                    </select>
                </div>
                <div class="form-group">
                    <label><span class="must-point">*</span>生效日期:</label>
                    <date-picker :config='dateCfg'  :date.sync='newParam.transferDate'></date-picker>
                </div>
            </div>
            <div class="inner-item">
                <div class="form-group">
                    <label><span class="must-point">*</span>申请原因:</label>
                    <input type="text" maxlength='120' placeholder='请输入申请原因' v-model='newParam.transferReason'>
                </div>
            </div>
        </div>
    </div>

    <div class="inner-footer">
        <button class="btn-xl-def" @click='cancel'>取消</button>
        <ajax-button class="btn-xl-imp" @click='saveTransfer'>提交申请</ajax-button>
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
