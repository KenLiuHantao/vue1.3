<script>
export default {
    data() {
        return {
            departmentCfg:{
                show:false,
                data:{}
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
        this.$http.post(__URL.hr+'employee/role/ref',{}).then(
            (res) => {
                if(res.data.success){
                    var _data=res.data.data.dataList;
                    this.roleList=[];
                    for(var i=0;i<_data.length;i++){
                        this.roleList.push(_data[i])
                    }
                }
            },
            (err) => {
                console.log('初始化未能拿到tree数据')
            }
        )
    },
    methods: {
        clearDepartment(){
            this.newDetail.departmentName=''
        },
        getDepartment(){
            this.departmentCfg.show=true;
        },
        chioceDepartment(val){
            this.departmentCfg.show=false;
            this.newDetail.departmentName=val.departmentName;
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
    <div class="pd-10">
        <div class='form-group'>
            <label><span class="must-point">*</span>工号:</label>
            <div class="s-input ic2">
                <input type='text' maxlength='20' placeholder='请输入工号' v-model='newDetail.jobNumber'>
            </div> 
        </div>    
        <div class='form-group'>
            <label><span class="must-point">*</span>姓名:</label>
            <div class="s-input ic2">
                <input type='text'  maxlength='16' placeholder='请输入姓名' v-model='newDetail.name'>
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
            <label><span style='visibility:hidden' class="must-point">*</span>工作邮箱:</label>
            <div class="s-input ic2">
                <input type='text' maxlength='32' placeholder='请输入工作邮箱' v-model='newDetail.email'>
            </div> 
        </div>
        <div class='form-group'>
            <label><span class="must-point">*</span>部门:</label>
            <div class="s-input ic2">
                <input placeholder='请选择部门'  disabled type="text" v-model='newDetail.departmentName'>
                <i @click='clearDepartment' v-show='newDetail.departmentName' class="icon-close__round r2" ></i>
                <i @click='getDepartment' class="icon-search r1"></i>
            </div> 
        </div>
        <div class='form-group'>
            <label><span class="must-point">*</span>岗位:</label>
            <div class="s-input ic2">
                <select v-model='newDetail.roleName'>
                    <option :value='item.roleName' v-for='item in roleList'>{{item.roleName}}</option>
                </select>
            </div> 
        </div>
        <div class="form-group">
            <label><span class="must-point">*</span>入职时间:</label>
            <div class="s-input ic2">
                <date-picker :config='dateCfg' :date.sync='newDetail.enterDate'></date-picker>
            </div>
        </div>
        <!-- <button @click='test'>123</button> -->
    </div>
    <refer-department :config='departmentCfg' @cb='chioceDepartment'></refer-department>
</template>
<style lang='less' scoped>
@import '../../../../../public/css/variable.less';
.pd-10 {
    padding: 10px;
}
.filter_body{
    max-height: 400px;
    overflow: auto;
}
</style>
