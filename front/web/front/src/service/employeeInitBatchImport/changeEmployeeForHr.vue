<script>
export default {
    props:['employeeDetail'],
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
            newEmployee:this.employeeDetail,
            allpost:[],
            ajaxlock:true,
            msgconfig:{
                type:'warning',
                show:false,
                content:''
            },
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
        calcDate () {
            if (this.newEmployee.employeeContracts.length) {
                this.newEmployee.employeeContracts.forEach((val, i) => {
                    let {contractPeriod, beginDate} = this.newEmployee.employeeContracts[i]
                    if (contractPeriod && beginDate) {
                        let beginDateArr = beginDate.split('-')
                        let addTimeType = parseInt(contractPeriod)
                        if (addTimeType > 3) {
                            this.newEmployee.employeeContracts[i].endDate = ''
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
                        this.newEmployee.employeeContracts[i].endDate = beginDateArr.join('-')
                    }
                })
                return 'done'
            }
        },
    },
    methods: {
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
            var data=this.newEmployee;
            this.ajaxlock=false;
            if (this.clickRepeatStatus) return
            this.clickRepeatControl({type: 'lock'})
            this.$http.post(__URL.hr + 'employee/update', data).then(
                (res) => {
                    this.ajaxlock=true;
                    if(res.data.success){
                        this.show=false;
                        this.$emit('refresh', '修改成功')
                        this.clickRepeatControl({type: 'unlock'})
                    }else{
                        this.msgconfig.show=true
                        this.msgconfig.content=res.data.errMsg
                        this.clickRepeatControl({type: 'unlock'})
                    }
                },
                (err) => {
                    this.ajaxlock=true;
                    console.log(err)
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
                    console.log('初始化未能拿到tree数据')
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
        deleteEmployeeContract(index){
            if(!this.newEmployee.employeeContracts[index].oldBeginDate){
                this.newEmployee.employeeContracts.splice(index,1)
                return
            }
            if(this.newEmployee.employeeContracts[index].oldBeginDate.length>0){
                var timeArr=this.newEmployee.employeeContracts[index].oldBeginDate.split('-')
                var beginDate=Date.UTC(timeArr[0],timeArr[1],timeArr[2])
                if(beginDate<Date.parse(new Date())){
                    this.msgconfig.show=true
                    this.msgconfig.content='该合同已生效不能删除！'
                    return
                }else{
                    this.newEmployee.employeeContracts.splice(index,1)
                }
            }else{
                this.newEmployee.employeeContracts.splice(index,1)
            }
        },
        addEmployeeContract(){
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
                "files": [],
                "id": '', 
                "recordId": "", 
                "recordStatus": '', 
                "recordVersion": '', 
                "remark": "", 
                "updateTime": "",
                "updator": ""
            })
        },
        //附件
        success(val){
            let ucloud = this.newEmployee.employeeContract.files;
            let imgItem = val
            if(ucloud.length>=6){
                this.msgconfig.show=true
                this.msgconfig.content='附件最多上传6个'
                return
            }
            ucloud.push(imgItem)
        },
        deleteImg(index1,index2){
            this.newEmployee.employeeContract.files.splice(index, 1)
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
    },
}
</script>
<template>
    <div class="inner-wrapper">
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
                            <input type="radio" name='sex' value='男' v-model='newEmployee.sex'>男
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
                        <!--<select v-model='newEmployee.officeForm'>-->
                            <!--<option value='0'>非正式</option>-->
                            <!--<option value='1'>正式</option>-->
                        <!--</select>-->
                    <!--</div>-->
                    <div class="form-group">
                        <label><span class="must-point">*</span>转正日期:</label>
                        <date-picker :config='dateCfg' :date.sync='newEmployee.confirmationDate'></date-picker>
                    </div>
                    <div class="form-group">
                        <label>部门:</label>
                        <p>{{newEmployee.departmentName}}</p>
                    </div>
                    <div class="form-group">
                        <label><span class="must-point">*</span>手机号码:</label>
                        <input type="text" maxlength='11' placeholder='请输入有效手机号码' v-model='newEmployee.phone'>
                    </div>
                    <div class="form-group">

                    </div>
                    <div class="form-group">
                        <label>岗位:</label>
                        <p>{{newEmployee.roleName}}</p>
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
                                        <th style='width:15%'><span class="must-point">*</span>合同结束时间</th>
                                        <th style='width:20%'>合同文件</th>
                                        <th style='width:10%'>备注</th>
                                        <th style='width:5%'>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr  v-for='(index1,item) in newEmployee.employeeContracts'>
                                        <td>
                                            <select v-model='item.employeeForm' v-show='item.contractStatus==1'>
                                                <option value='0'>劳动合同</option>
                                                <option value='1'>劳务合同</option>
                                                <option value='2'>临时合同</option>
                                                <option value='3'>返聘协议</option>
                                                <option value='4'>实习协议</option>
                                            </select>
                                            <p v-show='item.contractStatus==0 && item.employeeForm==0'>劳动合同</p>
                                            <p v-show='item.contractStatus==0 && item.employeeForm==1'>劳务合同</p>
                                            <p v-show='item.contractStatus==0 && item.employeeForm==2'>临时合同</p>
                                            <p v-show='item.contractStatus==0 && item.employeeForm==3'>返聘协议</p>
                                            <p v-show='item.contractStatus==0 && item.employeeForm==4'>实习协议</p>
                                        </td>
                                        <td>
                                            <select v-model='item.contractPeriod' v-show='item.contractStatus==1'>
                                                <option value='0'>6个月</option>
                                                <option value='1'>12个月</option>
                                                <option value='2'>24个月</option>
                                                <option value='3'>36个月</option>
                                                <option value='4'>无固定期限合同</option>
                                                <option value='5'>其它</option>
                                            </select>
                                            <p v-show='item.contractStatus==0 && item.contractPeriod==0'>6个月</p>
                                            <p v-show='item.contractStatus==0 && item.contractPeriod==1'>12个月</p>
                                            <p v-show='item.contractStatus==0 && item.contractPeriod==2'>24个月</p>
                                            <p v-show='item.contractStatus==0 && item.contractPeriod==3'>36个月</p>
                                            <p v-show='item.contractStatus==0 && item.contractPeriod==4'>无固定期限合同</p>
                                            <p v-show='item.contractStatus==0 && item.contractPeriod==5'>其它</p>
                                        </td>
                                        <td>
                                            <date-picker v-show='item.contractStatus==1' :config='dateCfg' :date.sync='item.beginDate'></date-picker>
                                            <p v-show='item.contractStatus==0'>{{item.beginDate}}</p>
                                        </td>
                                        <td>
                                            <!-- 以下这个 div 是为了启用计算属性来更替 endDate -->
                                            <div hidden>{{ calcDate }}</div>
                                            <date-picker v-show='item.contractStatus==1' :config='dateCfg' :date.sync='item.endDate'></date-picker>
                                            <p v-show='item.contractStatus==0'>{{item.endDate}}</p>
                                        </td>
                                        <td>
                                            <upfile-group :config ='uCfg' :edit='item.contractStatus==1' :data="item.files"></upfile-group>
                                        </td>
                                        <td v-show='item.contractStatus==1'>
                                            <input v-model='item.remark' type='text' maxlength='120' placeholder='请输入备注信息'>
                                        </td>
                                        <td v-show='item.contractStatus==0' class="text-left">
                                            <p class="lh-20">{{item.remark}}</p>
                                        </td>
                                        <td>
                                            <a v-show='item.contractStatus==1' @click='deleteEmployeeContract(index1)' class="delete">删除</a>
                                            <p v-show='item.contractStatus==0' class="delete">删除</p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <div v-show="newEmployee.employeeContracts.length < 1" class="add-wrap">
                                <button @click='addEmployeeContract'><i class="icon icon-contract"></i>&nbsp;签约</button>
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
        <ajax-button class="btn-xl-imp" @click='saveEmployee'>保存</ajax-button>
    </div>

    <refer-employee-department :config="depCfg" @cb="sure"></refer-employee-department>

    <warning :config="msgconfig" ></warning>
</template>
<style lang='less' scoped>
/* 此处为自己定义的样式 */
@import '../../../../../public/css/variable.less';
.must-point {
    color: #FF0700;
}
.pd-10 {
    padding: 10px;
}
.form-group {
    > label {
        width: 100px;
    }
}
</style>
