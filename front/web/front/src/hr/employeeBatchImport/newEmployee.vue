<script>
import cfg from './cfg'
export default {
    data() {
        return {
            valiVal: '',
            tabConfig: {
                type:'page',
                select: '',
                tabBarData: [{
                    id: 'tab1',
                    name: '合同信息',
                    icon: 'icon-contract__msg'
                },{
                    id: 'tab2',
                    name: '任职履历',
                    icon: 'icon-resume'
                }]
            },
            flowCfg:{
                data:[{
                    no:'1',
                    name:'新增员工档案',
                    time:'',
                    filed:'',
                    user:'',
                    flag:true,
                },{
                    no:'2',
                    name:'管理员授权',
                    time:'',
                    filed:'',
                    user:'',
                    flag:false,
                },{
                    no:'3',
                    name:'完成',
                    time:'',
                    filed:'',
                    user:'',
                    flag:false,
                }]
            },
            newEmployee:JSON.parse(JSON.stringify(cfg.employeeCfg)),
            allpost:[],
            ajaxlock:true,
            depCfg:{
                show:false,
                data:{},
                param:{}
            },
            dateCfg:{
                format: 'YYYY-MM-DD',
                clear:false
            },
            hasEmployeeContract:false,
            uCfg:{
                limit:6,
                maxwidth:240
            },
            saveSuccessAlertCfg: {
                show: false,
                type: 'success',
                msg: '保存成功！',
                subMsg: '',
                qname: '继续新增',
                sure: false,
            },
            // 按钮重复点击控制
            clickRepeatStatus: false,
        }
    },
    computed: {
        // 合同时间的自动计算
        calcDate () {
            const obj = this.newEmployee.employeeContract
            if (obj) {
                let {contractPeriod, beginDate} = obj
                if (contractPeriod && beginDate) {
                    let beginDateArr = beginDate.split('-')
                    let addTimeType = parseInt(contractPeriod)
                    if (addTimeType > 3) {
                        obj.endDate = ''
                        return 'done'
                    }
                    let [year, month] = [parseInt(beginDateArr[0]), parseInt(beginDateArr[1])]
                    switch (addTimeType) {
                        case 0:
                            if (month <= 6) {
                                month += 6
                            } else {
                                year += 1
                                month -= 6
                            }
                            break
                        case 1:
                            year += 1
                            break
                        case 2:
                            year += 2
                            break
                        case 3:
                            year += 3
                            break
                    }
                    [beginDateArr[0], beginDateArr[1]] = [year, month]
                    obj.endDate = beginDateArr.join('-')
                }
                return 'done'
            }
        },
    },
    methods: {
        //保存
        saveEmployee(){
            if(!this.ajaxlock){
                return
            }
            //根据岗位code添加name
            if(this.newEmployee.roleCode!=''){
                for(var i=0;i<this.allpost.length;i++){
                    if(this.newEmployee.roleCode==this.allpost[i].roleCode){
                        this.newEmployee.roleName=this.allpost[i].roleName
                    }
                }
            }
            //根据签约状态判断是否清空employeeContract属性
            if(!this.hasEmployeeContract){
                this.newEmployee.isContract=0;
            }else{
                this.newEmployee.isContract=1;
            }
            var data=this.newEmployee;
            this.ajaxlock=false;
            if (this.clickRepeatStatus) return
            this.clickRepeatControl({type: 'lock'})
            this.$http.post(__URL.hr + 'employee/add', data).then(
                (res) => {
                    this.ajaxlock=true;
                    if(res.data.success){
                        this.newEmployee = {}
                        this.saveSuccessAlertCfg.show = true
                        this.clickRepeatControl({type: 'unlock'})
                    }else{
                        this.$warning({'type': 'warning','message': res.data.errMsg})
                        this.clickRepeatControl({type: 'unlock'})
                    }
                },
                (err) => {
                    this.ajaxlock=true
                    this.$warning({'type': 'warning','message': err})
                    this.clickRepeatControl({type: 'unlock'})
                }
            )
        },
        // 保存成功后的弹窗事件
        saveSuccessAlertClose () {
            this.$emit('refresh')
        },
        //保存至草稿箱
        saveDraft(){
            if(!this.ajaxlock){
                return
            }
            //根据岗位code添加name
            if(this.newEmployee.roleCode!=''){
                for(var i=0;i<this.allpost.length;i++){
                    if(this.newEmployee.roleCode==this.allpost[i].roleCode){
                        this.newEmployee.roleName=this.allpost[i].roleName
                    }
                }
            }
            //根据签约状态判断是否清空employeeContract属性
            if(!this.hasEmployeeContract){
                this.newEmployee.isContract=0;
            }else{
                this.newEmployee.isContract=1;
            }
            var data=this.newEmployee;
            this.ajaxlock=false;
            if (this.clickRepeatStatus) return
            this.clickRepeatControl({type: 'lock'})
            this.$http.post(__URL.osiu + 'import/employee/insert', data).then(
                (res) => {
                    this.ajaxlock=true;
                    if(res.data.success){
                        this.show=false;
                        this.$emit('refresh', '新增成功')
                        this.clickRepeatControl({type: 'unlock'})
                    }else{
                        this.$warning({'type': 'warning','message': res.data.errMsg})
                        this.clickRepeatControl({type: 'unlock'})
                    }
                },
                (err) => {
                    this.ajaxlock=true;
                    this.$warning({'type': 'warning','message': err})
                    this.clickRepeatControl({type: 'unlock'})
                }
            )
        },
        cancel(){
            this.$emit('refresh')
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
                        this.allpost=[];
                        for(var i=0;i<_data.length;i++){
                            _data[i].roleCode=_data[i].code;
                            _data[i].roleName=_data[i].name;
                            this.allpost.push(_data[i])
                        }
                    }
                },
                (err) => {
                    this.$warning({'type': 'warning','message': '初始化未能拿到tree数据'})
                }
            )
        },
        //部门
        openDep(){
            this.depCfg.show=true;
        },
        clearDep(){
            this.newEmployee.departmentCode='';
            this.newEmployee.departmentName='';
            this.depCfg.data={};
            this.getRole();
        },
        sure(item){
            this.newEmployee.departmentCode=item.departmentCode;
            this.newEmployee.departmentName=item.departmentName;
            this.depCfg.data=item;
            this.getRole({
                'departmentCode':item.departmentCode,
                "roleCode": ""
            })
        },
        //岗位选择影响部门参照
        changeRole(){
            this.depCfg.param={
                "roleCode": this.newEmployee.roleCode
            }
        },
        //附件
        success(val){
            let ucloud = this.newEmployee.employeeContract.files;
            let imgItem = val
            if(ucloud.length>=6){
                this.$warning({'type': 'warning','message': '附件最多上传6个'})
                return
            }
            ucloud.push(imgItem)
        },
        deleteImg(index){
            this.newEmployee.employeeContract.files.splice(index, 1)
        },
        deleteEmployeeContract(){
            this.hasEmployeeContract=false;
            this.newEmployee.employeeContract={
                "beginDate": "",
                "confirmationDate": "",
                "contractPeriod": '',
                "contractStatus": '',
                "createTime": "",
                "creator": "",
                "employeeCode": "",
                "employeeForm": "",
                "endDate": "",
                "entCode": "",
                "files": [ 
                ],
                "id": '', 
                "recordId": "", 
                "recordStatus": '', 
                "recordVersion": '', 
                "remark": "", 
                "updateTime": "",
                "updator": ""
            }
        },
        addEmployeeContract(){
            this.hasEmployeeContract=true;
            this.newEmployee.employeeContract={
                "beginDate": "",
                "confirmationDate": "",
                "contractPeriod": '',
                "contractStatus": '',
                "createTime": "",
                "creator": "",
                "employeeCode": "",
                "employeeForm": "",
                "endDate": "",
                "entCode": "",
                "files": [ 
                ],
                "id": '', 
                "recordId": "", 
                "recordStatus": '', 
                "recordVersion": '', 
                "remark": "", 
                "updateTime": "",
                "updator": ""
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
    }
}
</script>
<template>
    <div class="inner-wrapper">
        <workflow :config="flowCfg"></workflow>
        <div class="inner-content">

            <h2 class="tag">员工档案</h2>

                <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
                <div class="inner-item form-box">
                    <div class="form-group">
                        <label><span class="must-point">*</span>工号:</label>
                        <!-- 如果要加验证请加外层dom -->
                        <input type='text' maxlength='20' placeholder='请输入员工工号' v-model='newEmployee.jobNumber'>
                    </div>
                    <div class="form-group">
                        <label><span class="must-point">*</span>性别:</label>
                        <div class='s-input'>
                            <input type="radio" name='sex' value='男' v-model='newEmployee.sex' checked>男
                            <input type="radio" name='sex' value='女' v-model='newEmployee.sex'>女
                        </div>
                    </div>
                    <div class="form-group">
                        <label><span class="must-point">*</span>入职时间:</label>
                        <date-picker :config='dateCfg'  :date.sync='newEmployee.enterDate'></date-picker>
                    </div>
                    <div class="form-group">
                        <label><span class="must-point">*</span>姓名:</label>
                        <input type="text" maxlength='16' placeholder='请输入员工姓名' v-model='newEmployee.name'>
                    </div>
                    <div class="form-group">
                        <label><span class="must-point">*</span>身份证号码:</label>
                        <input type="text" maxlength='18' placeholder='请输入身份证号码' v-model='newEmployee.idCard'>
                    </div>
                    <!--<div class="form-group">-->
                        <!--<label><span class="must-point">*</span>聘用形式:</label>-->
                        <!--<select v-model='newEmployee.officeForm' >-->
                            <!--<option value='0'>非正式</option>-->
                            <!--<option value='1'>正式</option>-->
                        <!--</select>-->
                    <!--</div>-->
                    <div class="form-group">
                        <label><span class="must-point">*</span>转正日期:</label>
                        <date-picker :config='dateCfg'  :date.sync='newEmployee.confirmationDate'></date-picker>
                    </div>
                    <div class="form-group">
                        <label><span class="must-point">*</span>部门:</label>
                        <div class="s-input ic2">
                            <input placeholder='请选择'  readonly type="text" v-model='newEmployee.departmentName'>
                            <i @click='clearDep' v-show='newEmployee.departmentName' class="icon-close__round r2" ></i>
                            <i @click='openDep' class="icon-search r1"></i>
                        </div>
                    </div>
                    <div class="form-group">
                        <label><span class="must-point">*</span>手机号码:</label>
                        <input type="text" maxlength='11' placeholder='请输入有效手机号码' v-model='newEmployee.phone'>
                    </div>
                    <div class="form-group">

                    </div>
                    <div class="form-group">
                        <label><span class="must-point">*</span>岗位:</label>
                        <select v-model='newEmployee.roleCode' @change='changeRole'>
                            <option :value='item.roleCode' v-for='item in allpost'>{{item.roleName}}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>工作邮箱:</label>
                        <input type="text" maxlength='32' placeholder='请输入邮箱地址' v-model='newEmployee.email'>
                    </div>
                </div>

                <div class="inner-item">
                    <tab-bar :config.sync='tabConfig'></tab-bar>
                    <tab-container :active.sync='tabConfig.select'>
                        <tab-item id='tab1'>
                            <table class='inner-table mt-15'>
                                <thead>
                                    <tr>
                                        <th style='width:10%'><span class="must-point">*</span>合同类别</th>
                                        <th style='width:10%'><span class="must-point">*</span>合同期限</th>
                                        <th style='width:15%'><span class="must-point">*</span>合同开始时间</th>
                                        <th v-if="newEmployee.employeeContract.contractPeriod != 4" style='width:15%'><span class="must-point">*</span>合同结束时间</th>
                                        <th style='width:20%'>合同文件</th>
                                        <th style='width:10%'>备注</th>
                                        <th style='width:5%'>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-show='hasEmployeeContract'>
                                        <td>
                                            <select v-model='newEmployee.employeeContract.employeeForm'>
                                                <option value='0'>劳动合同</option>
                                                <option value='1'>劳务合同</option>
                                                <option value='2'>临时合同</option>
                                                <option value='3'>返聘协议</option>
                                                <option value='4'>实习协议</option>
                                            </select>
                                        </td>
                                        <td>
                                            <select v-model='newEmployee.employeeContract.contractPeriod'>
                                                <option value='0'>6个月</option>
                                                <option value='1'>12个月</option>
                                                <option value='2'>24个月</option>
                                                <option value='3'>36个月</option>
                                                <option value='4'>无固定期限合同</option>
                                                <option value='5'>其它</option>
                                            </select>
                                        </td>
                                        <td>
                                            <date-picker :config='dateCfg' :date.sync='newEmployee.employeeContract.beginDate'></date-picker>
                                        </td>
                                        <td v-if="newEmployee.employeeContract.contractPeriod != 4">
                                            <!-- 以下这个 div 是为了启用计算属性来更替 endDate -->
                                            <div hidden>{{ calcDate }}</div>
                                            <date-picker :config='dateCfg' :date.sync='newEmployee.employeeContract.endDate'></date-picker>
                                        </td>
                                        <td>
                                            <upfile-group :config ='uCfg' :edit='true' :data="newEmployee.employeeContract.files"></upfile-group>
                                        </td>
                                        <td>
                                            <input type='text' maxlength='120' v-model='newEmployee.employeeContract.remark' placeholder='请输入备注信息'>
                                        </td>
                                        <td>
                                            <button class="button-danger" @click='deleteEmployeeContract'>删除</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <div v-show="!hasEmployeeContract" class="add-wrap">
                                <button @click='addEmployeeContract'><i class="icon icon-contract"></i>签约</button>
                            </div>

                        </tab-item>
                        <tab-item id='tab2'>
                            <table class='inner-table mt-15'>
                                <thead>
                                    <tr>
                                        <th style='width:10%'>履历</th>
                                        <th style='width:10%'>时间</th>
                                        <th style='width:10%'>岗位</th>
                                        <th style='width:70%'>说明</th>
                                    </tr>
                                </thead>
                            </table>
                        </tab-item>
                    </tab-container>
                </div>
        </div>
    </div>

    <div class="inner-footer">
        <button class="btn-xl-def" @click='cancel'>取消</button>
        <ajax-button class="btn-xl-imp" @click='saveDraft'>保存草稿</ajax-button>
        <ajax-button class="btn-xl-imp" @click='saveEmployee'>提交</ajax-button>
    </div>

    <refer-employee-department :config="depCfg" @cb="sure"></refer-employee-department>

    <!-- 保存成功后提示是否继续添加 -->
    <alert :config='saveSuccessAlertCfg' @close="saveSuccessAlertClose"></alert>
</template>

<style lang='less' scoped>
@import '../../../../../public/css/variable.less';
.must-point {
    color: #FF0700;
}
.icon.icon-contract {
    vertical-align: inherit;
}
</style>
