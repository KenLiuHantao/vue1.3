<script>
    import selectInput from './selectInput.vue'

    export default {
        components: {
            selectInput
        },
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
                parentDeptCode: {
                    children:[]
                },
                departmentCode: '',
                departmentName: '',
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
                    return item.code === this.parentDeptCode
                })
                let param = {
                    parentDeptCode: f[0].code,
                    parentDeptName: f[0].name,
                    departmentCode: this.departmentCode,
                    departmentName: this.departmentName,
                }
                this.$emit('cb',param)
            },
            close(){
                this.config.show = false
            },
            returnItem (item) {
                this.departmentCode = item.code || ''
                this.departmentName = item.name || ''

            },
        },
        computed:{
            modalCfg(){
                let c = {
                    show: this.config.show,
                    width: '410px',
                    height: 'auto',
                    header: '正式导入',
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
            parentDeptCode:{
                handler(val){
                    let l  = this.initData.filter(item=>{
                        return item.code == val
                    })
                    if(l[0]){
                        this.initSecData = l[0].children
                        if(l[0].children.length == 0){
                            this.departmentCode = ''
                        }
                    }

                },
                deep:true
            },
            detail:{
                handler(val){
                    this.parentDeptCode = val.firstDeptCode
                    this.departmentCode = val.secondDeptCode
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
                <label><span class="must-point">*</span>生产部门:</label>
                <div class="s-input ic2">
                    <select v-model='parentDeptCode'>
                        <option v-for="item in initData" :value="item.code">{{ item.name }}</option>
                    </select>
                </div>
            </div>
            <div class='form-group'>
                <label><span class="must-point">*</span>生产班组:</label>
                <div class="s-input ic2">
                    <select-input @return-item="returnItem" :select-data="initSecData" :item-content="'name'"></select-input>
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
