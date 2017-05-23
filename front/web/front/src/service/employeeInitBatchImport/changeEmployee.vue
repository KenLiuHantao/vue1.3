<script>
export default {
    data() {
        return {
            departmentCfg:{
                show:false,
                data:{},
                param:{}
            },
            roleSelectConfig: {
                departmentCode: null,
                show: false,
                selectedRoles:[]
            },
            roleList:[],
            dateCfg:{
                format: 'YYYY-MM-DD'
            }
        }
    },
    props: ['detail'],
    ready() {
        //初始化获取岗位信息
        this.getRole({
                'departmentCode':this.newDetail.departmentCode,
                "roleCode": ""
            });
        this.departmentCfg.param={
            "roleCode": this.newDetail.roleCode
        }
    },
    methods: {
        clearDepartment(){
            this.newDetail.departmentCode='';
            this.newDetail.firstDeptName='';
            this.newDetail.secondDeptName='';
            this.departmentCfg.data={};
            this.getRole();
        },
        getDepartment(){
            this.departmentCfg.show=true;
        },
        chioceDepartment(val){
            this.newDetail.departmentCode=val.departmentCode;
            this.newDetail.firstDeptName=val.firstDeptName;
            this.newDetail.secondDeptName=val.secondDeptName;
            this.departmentCfg.data=val;
            this.getRole({
                'departmentCode':val.departmentCode,
                "roleCode": ""
            })
            this.departmentCfg.show=false;
        },
        changeRole(){
            for(var i=0;i<this.roleList.length;i++){
                if(this.roleList[i].roleName==this.newDetail.roleName){
                    this.newDetail.roleCode=this.roleList[i].roleCode
                }
            }
            this.departmentCfg.param={
                "roleCode": this.newDetail.roleCode
            }
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
                        this.roleList=[];
                        for(var i=0;i<_data.length;i++){
                            _data[i].roleCode=_data[i].code;
                            _data[i].roleName=_data[i].name;
                            this.roleList.push(_data[i])
                        }
                    }
                },
                (err) => {
                    console.log('初始化未能拿到tree数据')
                }
            )
        },
    },
    computed:{
        newDetail:function(){
            return this.detail
        }
    }
}
</script>
<template>
    <div class="pd-10 max-height">
        <div class='form-group'>
            <label><span class="must-point">*</span>工号:</label>
            <div class="s-input ic2">
                <input type='text' maxlength='20' placeholder='请输入工号' v-model='newDetail.jobNumber'>
            </div> 
        </div>    
        <div class='form-group'>
            <label><span class="must-point">*</span>姓名:</label>
            <div class="s-input ic2">
                <input type='text'  maxlength='16' placeholder='请输入姓名' v-model='newDetail.employeeName'>
            </div> 
        </div> 
        <div class='form-group'>
            <label><span class="must-point">*</span>性别:</label>
            <div class="s-input ic2">
                <input type='radio' name='sex' value='男' v-model='newDetail.sex'>
                <span style='margin-right:20px;'>男</span>
                <input type='radio' name='sex' value='女' v-model='newDetail.sex'>
                <span>女</span>
            </div> 
        </div>
        <div class='form-group'>
            <label><span class="must-point">*</span>手机号码:</label>
            <div class="s-input ic2">
                <input type='text' maxlength='11' placeholder='请输入手机号码' v-model='newDetail.phone'>
            </div> 
        </div>
        <div class='form-group'>
            <label><span class="must-point">*</span>身份证号码:</label>
            <div class="s-input ic2">
                <input type='text' maxlength='18' placeholder='请输入身份证号码' v-model='newDetail.idCard'>
            </div> 
        </div>
        <div class='form-group'>
            <label>工作邮箱:</label>
            <div class="s-input ic2">
                <input type='text' maxlength='32' placeholder='请输入工作邮箱' v-model='newDetail.email'>
            </div> 
        </div>
        <div class='form-group'>
            <label><span class="must-point">*</span>一级部门:</label>
            <div class="s-input ic2">
                <input type='text' maxlength='32' placeholder='请输入一级部门名称' v-model='newDetail.firstDeptName'>
            </div>
        </div>
        <div class='form-group'>
            <label>二级部门:</label>
            <div class="s-input ic2">
                <input type='text' maxlength='32' placeholder='请输入二级部门名称' v-model='newDetail.secondDeptName'>
            </div>
        </div>
        <div class='form-group'>
            <label><span class="must-point">*</span>岗位:</label>
            <div class="s-input ic2">
                <input type='text' maxlength='32' placeholder='请输入岗位名称' v-model='newDetail.roleName'>
            </div> 
        </div>
        <div class="form-group">
            <label><span class="must-point">*</span>入职时间:</label>
            <div class="s-input ic2">
                <date-picker :config='dateCfg' :date.sync='newDetail.enterDate'></date-picker>
            </div>
        </div>
        <div class="form-group">
            <label>转正日期:</label>
            <div class="s-input ic2">
                <date-picker :config='dateCfg' :date.sync='newDetail.confirmationDate'></date-picker>
            </div>
        </div>
        <div class="form-group" style="padding-top: 10px; border-top: 1px solid #F2F3F3;">
            <label>合同类别:</label>
            <div class="s-input ic2">
                <select v-model='newDetail.employeeContracts[0].employeeForm' >
                    <option value='0'>劳动合同</option>
                    <option value='1'>劳务合同</option>
                    <option value='2'>临时合同</option>
                    <option value='3'>返聘协议</option>
                    <option value='4'>实习协议</option>
                </select>
            </div>
        </div>
        <div class="form-group">
            <label>合同期限:</label>
            <div class="s-input ic2">
                <select v-model='newDetail.employeeContracts[0].contractPeriod' >
                    <option value='0'>6个月</option>
                    <option value='1'>12个月</option>
                    <option value='2'>24个月</option>
                    <option value='3'>36个月</option>
                    <option value='4'>无固定期限合同</option>
                    <option value='5'>其它</option>
                </select>
            </div>
        </div>
        <div class="form-group">
            <label>合同开始时间:</label>
            <div class="s-input ic2">
                <date-picker :config='dateCfg' :date.sync='newDetail.employeeContracts[0].beginDate'></date-picker>
            </div>
        </div>
        <div class="form-group">
            <label>合同结束时间:</label>
            <div class="s-input ic2">
                <date-picker :config='dateCfg' :date.sync='newDetail.employeeContracts[0].endDate'></date-picker>
            </div>
        </div>
    </div>
    <refer-employee-department :config='departmentCfg' @cb='chioceDepartment'></refer-employee-department>
</template>
<style lang='less' scoped>
@import '../../../../../public/css/variable.less';
.pd-10 {
    padding: 10px;
}
.max-height {
    max-height: 500px;
    overflow-y: auto;
}
.filter_body{
    max-height: 400px;
    overflow: auto;
}
.modal-area .form-group label:first-of-type {
    width: 95px;
    padding-left: 10px;
}
</style>
