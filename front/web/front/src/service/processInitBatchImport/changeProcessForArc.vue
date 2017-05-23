<script>
import vue from 'vue'
import refDept from '../../archive/process/departmentMulit.vue'
export default {
    components:{
        refDept:refDept
    },
    data() {
        return {
            deptList:[],
            dateCfg:{
                format: 'YYYY-MM-DD'
            },
            msgconfig:{
                show:false,
                content:'',
                type:'warning'
            },
            depCfg:{
                show:false,
                data:[],
                param:{}
            },
            departmentShow:'',
            displayAreaData:[]
        }
    },
    props: ['detail'],
    ready() {
        this.getDetail()
    },
    methods: {
        getDetail(){
            var param={
                "pageIndex": 0,
                "pageSize": 0,
                "processCode": this.newDetail.processCode,
                "recordStatus": 1
            }
            this.$http.post(__URL.arc + 'process/detail', param).then(
                (res) => {
                    if(res.data.success){
                        this.detail = res.data.data;
                        //处理成显示时的另一个tree结构
                        this.showDepartment(this.newDetail.departmentVos);
                        //处理编辑时输入框的显示值
                        this.getDisplayAreaData()
                        //格式化成提交时，后台所需参数格式
                        this.evalData(this.newDetail.departmentVos)
                    }else{
                        this.msgconfig.show=true
                        this.msgconfig.content=res.data.errMsg
                    }
                }
            )
        },
        //部门
        openDep(){
            this.depCfg.show=true;
            this.depCfg.data=this.newDetail.departmentVos;
        },
        pickDep(item){
            this.newDetail.departmentVos = [];
            for (let i = 0 ;i < item.length;i++){
                let  departmentVo = {
                    code: item[i].code,
                    name: item[i].name,
                    departmentEmployeeCode: item[i].manager,
                    departmentEmployeeName: item[i].managerName,
                }
                this.newDetail.departmentVos.push(departmentVo)
            }

            this.departmentShow = '';
            this.showDept(item);
            this.depCfg.data = [].concat(this.newDetail.departmentVos)
        },
        showDepartment(item){
            var test={};
            for(var i = 0;i < item.length;i++){
                if(!test[item[i].parentName]){
                    test[item[i].parentName]=[];
                    test[item[i].parentName].push(item[i].departmentName)
                }else{
                    test[item[i].parentName].push(item[i].departmentName)
                }
            }

            for( var j in test){
                this.departmentShow+=j+'/';
                for(var k=0;k<test[j].length;k++){
                    if(k!=test[j].length-1){
                        this.departmentShow+=test[j][k]+'、'
                    }else{
                        this.departmentShow+=test[j][k]+'; '
                    }
                }
            }
        },
        showDept(item){
            var test={};
            for(var i = 0;i < item.length;i++){
                if(!test[item[i].parentName]){
                    test[item[i].parentName]=[];
                    test[item[i].parentName].push(item[i].name)
                }else{
                    test[item[i].parentName].push(item[i].name)
                }
            }

            for( var j in test){
                this.departmentShow+=j+'/';
                for(var k=0;k<test[j].length;k++){
                    if(k!=test[j].length-1){
                        this.departmentShow+=test[j][k]+'、'
                    }else{
                        this.departmentShow+=test[j][k]+'; '
                    }
                }
            }
        },
        //处理成保存数据的参数格式
        evalData(val){
            let item = val
            this.newDetail.departmentVos = []
            for (let i = 0 ;i < item.length;i++){
                let  departmentVo = {
                    code: item[i].departmentCode,
                    name: item[i].departmentName,
                    departmentEmployeeCode: item[i].departmentEmployeeCode,
                    departmentEmployeeName: item[i].departmentEmployeeName,
                }
                this.newDetail.departmentVos.push(departmentVo)
            }
        },
        getDisplayAreaData () {
            const origin = [].concat(this.newDetail.departmentVos)
            const result = []
            origin.forEach(val => {
                let newValue = Object.assign({},val)
                let i = result.map(val => val.parentCode).indexOf(val.parentCode)
                if (i === -1) {
                    let arr = []
                    arr.push(newValue)
                    val.children = arr
                    vue.set(val, 'show', false)
                    result.push(val)
                } else {
                    result[i].children.push(newValue)
                }
            })
            this.displayAreaData = result
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
        <div class='form-group wd-100'>
            <label><span class="must-point">*</span>工序:</label>
            <div class="s-input">
                <input type='text' v-model='newDetail.processName' placeholder='请输入工序名称'>
            </div>
        </div>
        <div class='form-group wd-100'>
            <label><span class="must-point">*</span>车间:</label>
            <div class="s-input ic2">
                <input placeholder='请选择车间'  readonly type="text" v-model='departmentShow'>
                <i @click='openDep' class="icon-search r1"></i>
            </div>
        </div>
        <div class="form-group wd-100">
            <label>附件:</label>
            <div class='annexBox'>
                <upfile-group :config ='upfileCfg' :data="newDetail.attachments" edit="ture"></upfile-group>
            </div>
        </div>
        <div class="form-group wd-100">
            <label>备注:</label>
            <div class="s-input">
            <input type="text" maxlength='120' v-model='newDetail.remark'>
            </div>
        </div>
        <!-- <button @click='test'>123</button> -->
    </div>
    <ref-dept :config="depCfg" @cb="pickDep"></ref-dept>
    <warning :config='msgconfig'></warning> 
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
