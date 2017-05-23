<script>
export default {
    data() {
        return {
            msgconfig:{
                show:false,
                content:'',
                type:'warning'
            },
            //一级菜单数据
            initData: [],
            //二级菜单数据
            initSecData:[],
            processName: '',
            firstDeptCode: {
                children:[]
            },
            secondDeptCode: '',
        }
    },
    props: ['config','detail'],
    ready() {
        this.getInitData()
    },
    methods: {
        //获取初始数据
        getInitData() {
            this.$http.post(__URL.service + 'department/enabled-list', {}).then(
                (res) => {
                    this.initData = res.data.data
                }
            )
        },
        sure(){
            let f = this.initData.filter(item=>{
                return item.code == this.firstDeptCode
            })
            let s = this.initSecData.filter(item=>{
                return item.code == this.secondDeptCode
            })
            let param ={
                id:this.detail.id,
                processName:this.processName,
                firstDeptCode:f[0].code,
                firstDeptName:f[0].name,
                secondDeptCode:s[0] == undefined ? '' : s[0].code ,
                secondDeptName:s[0] == undefined ? '' : s[0].name ,
            }
            this.$emit('cb',param)
        },
        close(){
            this.config.show = false
        }
    },
    computed:{
        newDetail(){
            return this.detail
        },
        modalCfg(){
            let c = {
                show: this.config.show,
                width: '410px',
                height: 'auto',
                header: '编辑修改',
                btn: [{
                    name: '关闭',
                    emit: 'close',
                }, {
                    name: '确定',
                    emit: 'sure',
                }],
            }
            return c
        }
    },
    watch:{
        firstDeptCode:{
          handler(val){
              let l  = this.initData.filter(item=>{
                  return item.code == val
              })
              if(l[0]){
                  this.initSecData = l[0].children
                  if(l[0].children.length == 0){
                      this.secondDeptCode = ''
                  }
              }

          },
          deep:true
        },
        detail:{
            handler(val){
                this.processName = val.processName
                this.firstDeptCode = val.firstDeptCode
                this.secondDeptCode = val.secondDeptCode
            },
            deep:true
        }
    }
}
</script>
<template>
    <modal :config="modalCfg" @sure="sure" @close="close">
        <div class="pd-10">
            <div class='form-group'>
                <label><span class="must-point">*</span>工序名称:</label>
                <div class="s-input ic2">
                    <input type='text'  maxlength='16' placeholder='请输入工序名称' v-model='processName'>
                </div>
            </div>
            <div class='form-group'>
                <label><span class="must-point">*</span>生产部门:</label>
                <div class="s-input ic2">
                    <select v-model='firstDeptCode'>
                        <option v-for="item in initData" :value="item.code">{{ item.name }}</option>
                    </select>
                </div>
            </div>
            <div class='form-group'>
                <label><span class="must-point">*</span>生产班组:</label>
                <div class="s-input ic2">
                    <select v-model='secondDeptCode'>
                        <option v-for="item in initSecData" :value="item.code">{{ item.name }}</option>
                    </select>
                </div>
            </div>
        </div>
    </modal>

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
