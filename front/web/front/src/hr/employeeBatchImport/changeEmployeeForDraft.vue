<script>
export default {
    props:['detail', 'config', 'activeTab'],
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
//            flowCfg:{
//                data:[{
//                    no:'1',
//                    name:'新增员工档案',
//                    time:this.detail.createTime,
//                    filed:'',
//                    user:'',
//                    flag:true,
//                },{
//                    no:'2',
//                    name:'管理员授权',
//                    time:'',
//                    filed:'',
//                    user:'',
//                    flag:false,
//                },{
//                    no:'3',
//                    name:'完成',
//                    time:'',
//                    filed:'',
//                    user:'',
//                    flag:false,
//                }]
//            },
            newEmployee:this.detail,
            allpost:[],
            ajaxlock:true,
            isEdit:false,
            depCfg:{
                show:false,
                data:{},
                param:{}
            },
            uCfg:{
                limit:6,
                maxwidth:240
            },
            dateCfg:{
                format: 'YYYY-MM-DD'
            },
            // 按钮重复点击控制
            clickRepeatStatus: false,
        }
    },
    computed: {
        deptName () {
            return this.newEmployee.secondDeptName || this.newEmployee.firstDeptName
        },
    },
    methods: {
        edit(){
            this.isEdit = true
            this.changeRole()
        },
        saveEmployee () {
            let url
            if (this.activeTab !== 2) {
                url = __URL.osiu + 'import/employee/update'
            } else if (this.activeTab === 2) {
                url = __URL.hr + 'employee/update'
            }
            if (this.clickRepeatStatus) return
            this.clickRepeatControl({type: 'lock'})
            this.$http.post(url, this.newEmployee).then(
                (res) => {
                    if(res.data.success){
                        this.config.show=false;
                        this.$emit('refresh','保存成功')
                        this.clickRepeatControl({type: 'unlock'})
                    }else{
                        this.$warning({'type':'warning', 'message': res.data.errMsg})
                        this.clickRepeatControl({type: 'unlock'})
                    }
                }
            )
        },
        cancel(){
            this.config.show = false
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
                    } else {
                        this.$warning({'type': 'warning','message': '初始化未能拿到tree数据'})
                    }
                }
            )
        },
        //部门
        openDep(){
            this.depCfg.show=true;
        },
        clearDep(){
            this.newEmployee.firstDeptName='';
            this.newEmployee.secondDeptName='';
            this.depCfg.data={};
            this.getRole();
        },
        sure(item){
            if (item.parentName) {
                this.newEmployee.firstDeptName = item.parentName
                this.newEmployee.firstDeptCode = item.parentCode
                this.newEmployee.secondDeptName = item.departmentName
                this.newEmployee.secondDeptCode = item.departmentCode
            } else {
                this.newEmployee.firstDeptName = item.departmentName
                this.newEmployee.firstDeptCode = item.departmentCode
                this.newEmployee.secondDeptName = ''
                this.newEmployee.secondDeptCode = ''
            }
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
            const arr = this.allpost.filter(val => {
                if (val.roleCode === this.newEmployee.roleCode) {
                    return true
                } else {
                    return false
                }
            })
            if (arr.length) {
                this.newEmployee.roleName = arr[0].roleName
            }
        },
        deleteemployeeContracts(index){
            this.newEmployee.employeeContracts.splice(index,1)
        },
        addemployeeContracts(){
            this.newEmployee.employeeContracts.push({
                "beginDate": "",
                "confirmationDate": "",
                "contractPeriod": '',
                "contractStatus": 1,
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
            })
            this.newEmployee.isContract++
        },
        //附件
        success(val){
            let ucloud = this.newEmployee.employeeContracts.files;
            let imgItem = val
            if(ucloud.length>=6){
                this.$warning({'type': true, 'message': '附件最多上传6个'})
                return
            }
            ucloud.push(imgItem)
        },
        deleteImg(index1,index2){
            this.newEmployee.employeeContracts.files.splice(index, 1)
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
        this.getRole({
            "departmentCode": this.newEmployee.departmentCode,
            "roleCode": ""
        })
        this.depCfg.param={
            "roleCode": this.newEmployee.roleCode
        }
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
                    <label><span v-show='isEdit' class="must-point">*</span>工号:</label>
                    <!-- 如果要加验证请加外层dom -->
                    <div v-if="isEdit">
                        <input type='text' maxlength='20' placeholder='请输入员工工号' v-model='newEmployee.jobNumber'>
                    </div>
                    <p v-else>{{newEmployee.jobNumber}}</p>
                </div>
                <div class="form-group">
                    <label><span v-show='isEdit' class="must-point">*</span>性别:</label>
                    <div class='s-input' v-if="isEdit">
                        <input type="radio" name='sex' value='男' v-model='newEmployee.sex'>男
                        <input type="radio" name='sex' value='女' v-model='newEmployee.sex'>女
                    </div>
                    <p v-else>{{newEmployee.sex}}</p>
                </div>
                <div class="form-group">
                    <label><span v-show='isEdit' class="must-point">*</span>入职时间:</label>
                    <div v-if="isEdit">
                        <date-picker :config='dateCfg' :date.sync='newEmployee.enterDate'></date-picker>
                    </div>
                    <p v-else>{{newEmployee.enterDate}}</p>
                </div>
                <div class="form-group">
                    <label><span v-show='isEdit' class="must-point">*</span>姓名:</label>
                    <div v-if="isEdit">
                        <input type="text" maxlength='16' placeholder='请输入员工姓名' v-model='newEmployee.employeeName'>
                    </div>
                    <p v-else>{{newEmployee.employeeName}}</p>
                </div>
                <div class="form-group">
                    <label><span v-show='isEdit' class="must-point">*</span>身份证号码:</label>
                    <div v-if="isEdit">
                        <input type="text" maxlength='18' placeholder='请输入身份证号码' v-model='newEmployee.idCard'>
                    </div>
                    <p v-else>{{newEmployee.idCard}}</p>
                </div>
                <!--<div class="form-group">-->
                    <!--<label><span v-show='isEdit' class="must-point">*</span>聘用形式:</label>-->
                    <!--<div v-if="isEdit">-->
                        <!--<select v-model='newEmployee.officeForm' >-->
                            <!--<option value='0'>非正式</option>-->
                            <!--<option value='1'>正式</option>-->
                        <!--</select>-->
                    <!--</div>-->
                    <!--<div v-else>-->
                        <!--<p v-show='newEmployee.officeForm==0'>非正式</p>-->
                        <!--<p v-show='newEmployee.officeForm==1'>正式</p>-->
                    <!--</div>-->
                <!--</div>-->
                <div class="form-group">
                    <label><span v-show='isEdit' class="must-point">*</span>转正日期:</label>
                    <div v-if="isEdit">
                        <date-picker :config='dateCfg'  :date.sync='newEmployee.confirmationDate'></date-picker>
                    </div>
                    <p v-else>{{newEmployee.confirmationDate}}</p>
                </div>
                <div class="form-group">
                    <label><span v-show='isEdit' class="must-point">*</span>部门:</label>
                    <div class="s-input ic2" v-if="isEdit">
                        <input placeholder='请选择'  readonly type="text" v-model='deptName'>
                        <i @click='clearDep' v-show='deptName' class="icon-close__round r2" ></i>
                        <i @click='openDep' class="icon-search r1"></i>
                    </div>
                    <p v-else>{{deptName}}</p>
                </div>
                <div class="form-group">
                    <label><span v-show='isEdit' class="must-point">*</span>手机号码:</label>
                    <div v-if="isEdit">
                        <input type="text" maxlength='11' placeholder='请输入有效手机号码' v-model='newEmployee.phone'>
                    </div>
                    <p v-else>{{newEmployee.phone}}</p>
                </div>
                <div class="form-group">

                </div>
                <div class="form-group">
                    <label><span v-show='isEdit' class="must-point">*</span>岗位:</label>
                    <div v-if="isEdit">
                        <select v-model='newEmployee.roleCode' @change='changeRole'>
                            <option :value='item.roleCode' v-for='item in allpost'>{{item.roleName}}</option>
                        </select>
                    </div>
                    <p v-else>{{newEmployee.roleName}}</p>
                </div>
                <div class="form-group">
                    <label>工作邮箱:</label>
                    <div v-if="isEdit">
                        <input type="text" maxlength='32' placeholder='请输入邮箱地址' v-model='newEmployee.email'>
                    </div>
                    <p v-else>{{newEmployee.email}}</p>
                </div>
            </div>
                <div class="inner-item">
                    <tab-bar :config.sync='tabConfig'></tab-bar>
                    <tab-container :active.sync='tabConfig.select'>
                        <tab-item id='tab1'>
                            <table class='inner-table mt-15'>
                                <thead>
                                    <tr>
                                        <th style='width:10%'><span v-show='isEdit' class="must-point">*</span>合同类别</th>
                                        <th style='width:10%'><span v-show='isEdit' class="must-point">*</span>合同期限</th>
                                        <th style='width:15%'><span v-show='isEdit' class="must-point">*</span>合同开始时间</th>
                                        <th style='width:15%'><span v-show='isEdit' class="must-point">*</span>合同结束时间</th>
                                        <th style='width:20%'>合同文件</th>
                                        <th style='width:10%'>备注</th>
                                        <th style='width:5%'>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr  v-for='(index1,item) in newEmployee.employeeContracts'>
                                        <td>
                                            <div v-if="isEdit">
                                                <select v-model='item.employeeForm'>
                                                    <option value='0'>劳动合同</option>
                                                    <option value='1'>劳务合同</option>
                                                    <option value='2'>临时合同</option>
                                                    <option value='3'>返聘协议</option>
                                                    <option value='4'>实习协议</option>
                                                </select>
                                            </div>
                                            <div v-if="!isEdit">
                                                <p v-show='item.employeeForm==0'>劳动合同</p>
                                                <p v-show='item.employeeForm==1'>劳务合同</p>
                                                <p v-show='item.employeeForm==2'>临时合同</p>
                                                <p v-show='item.employeeForm==3'>返聘协议</p>
                                                <p v-show='item.employeeForm==4'>实习协议</p>
                                            </div>
                                        </td>
                                        <td>
                                            <div v-if="isEdit">
                                                <select v-model='item.contractPeriod'>
                                                    <option value='0'>6个月</option>
                                                    <option value='1'>12个月</option>
                                                    <option value='2'>24个月</option>
                                                    <option value='3'>36个月</option>
                                                    <option value='4'>无固定期限合同</option>
                                                    <option value='5'>其它</option>
                                                </select>
                                            </div>
                                            <div v-if="!isEdit">
                                                <p v-show='item.contractPeriod==0'>6个月</p>
                                                <p v-show='item.contractPeriod==1'>12个月</p>
                                                <p v-show='item.contractPeriod==2'>24个月</p>
                                                <p v-show='item.contractPeriod==3'>36个月</p>
                                                <p v-show='item.contractPeriod==4'>无固定期限合同</p>
                                                <p v-show='item.contractPeriod==5'>其它</p>
                                            </div>
                                        </td>
                                        <td>
                                            <date-picker v-show='isEdit' :config='dateCfg' :date.sync='item.beginDate'></date-picker>
                                            <p v-show='!isEdit'>{{item.beginDate}}</p>
                                        </td>
                                        <td>
                                            <date-picker v-show='isEdit' :config='dateCfg'  :date.sync='item.endDate'></date-picker>
                                            <p v-show='!isEdit'>{{item.endDate}}</p>
                                        </td>
                                        <td>
                                            <upfile-group :config ='uCfg' :edit='isEdit' :data="item.files"></upfile-group>
                                        </td>
                                        <td v-show='isEdit'>
                                            <input v-model='item.remark' type='text' maxlength='120' placeholder='请输入备注信息'>
                                        </td>
                                        <td v-show='!isEdit' class="text-left">
                                            <p class="lh-20">{{item.remark}}</p>
                                        </td>
                                        <td>
                                            <button v-show='isEdit' class="button-danger" @click='deleteemployeeContracts(index1)'>删除</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <div v-show="newEmployee.isContract < 1 && isEdit" class="add-wrap">
                                <button @click='addemployeeContracts'><i class="icon icon-contract"></i>&nbsp;签约</button>
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
                                <tbody>
                                    <tr v-for='item in newEmployee.employeeResumes'>
                                        <td>
                                            <p v-show='item.resume==0'>入职</p>
                                            <p v-show='item.resume==1'>转正</p>
                                            <p v-show='item.resume==2'>调岗</p>
                                            <p v-show='item.resume==3'>离职</p>
                                        </td>
                                        <td>
                                            <p>{{item.resumeDate}}</p>
                                        </td>
                                        <td>
                                            <p>{{item.roleName}}</p>
                                        </td>
                                        <td>
                                            <p>{{item.remark}}</p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </tab-item>
                    </tab-container>
                </div>
        </div>
    </div>

    <div class="inner-footer">
        <button class="btn-xl-def" @click='cancel'>取消</button>
        <button class="btn-xl-imp" @click='edit' v-if="!isEdit">编辑</button>
        <ajax-button class="btn-xl-imp" @click='saveEmployee' v-if="isEdit">保存</ajax-button>
    </div>

    <refer-employee-department :config="depCfg" @cb="sure"></refer-employee-department>
</template>
<style lang='less' scoped>
/* 此处为自己定义的样式 */
@import '../../../../../public/css/variable.less';
.must-point {
    color: #FF0700;
}
</style>
