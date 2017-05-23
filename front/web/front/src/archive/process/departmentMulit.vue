<script>
    export default {
        props:{
            config:{
                type:Object
            },
            originData:''
        },
        data(){
            return {
                listData:[],
                //是否全选
                all:false,
                currentIndex:-1,

                //选中的全部信息
                chooseInfo:[],
                chooseArr:[],

                //多选部门弹框配置
                modalCfg: {
                    show: this.config.show || false,
                    width: '400px',
                    height: 'auto',
                    header: '选取班组',
                    btn: [{
                        name: '取消',
                        emit: 'quite'
                    }, {
                        name: '确定',
                        emit: 'sure'
                    }],
                },
                //默认带入不能取消的东西
                //defaultArr:[]
            }
        },
        ready(){
            this.getInitData()
        },
        methods:{
            //获取初始数据
            getInitData() {
                this.$http.post(__URL.service+'department/enabled-list', {}).then(
                    (res) => {
                        this.listData = []
                        var data=res.data.data;
                        for(let i=0;i<data.length;i++){
                            if(data[i].children.length>0){
                                this.listData.push(data[i])
                            }
                        }
                        if(this.haveAllCheck()){
                            this.all = true
                        }
                    }
                )
            },
            //全选
            checkAll(){
                 if(this.all){
                    this.chooseArr = []
                }else{
                    this.chooseArr = []
                    this.listData.forEach((item)=>{
                        if(item.children.length){
                            item.children.forEach(it=>{
                                this.chooseArr.push(it.code)
                            })
                        }
                    })
                }
                this.all = !this.all
            },
             //判断是否有未被选中的 true 全选中 false 未全选中
            haveAllCheck(){
                let c = true
                this.chooseInfo = []
                if(this.listData.length > 0){
                    this.listData.forEach((item)=>{
                      if(item.children.length > 0){
                           item.children.forEach(item=>{
                               if(this.chooseArr.indexOf(item.code) < 0){
                                    c = false
                              }else{
                                this.chooseInfo.push(item)
                              }
                           })
                      }
                    })
                }else{
                    c = false
                }
                return c
            },
            //选中当前列
            checkThisLink(val){
                if(this.currentIndex == val){
                    this.currentIndex = -1
                }else{
                    this.currentIndex = val
                }
            },
            sure() {
                this.config.show = false
                this.$emit('cb',this.chooseInfo)
            },
            quite() {
                this.config.show = false
            },
            isDefault(code){
                var flag=false;
                for(let i=0;i<this.originData.length;i++){
                    if(code == this.originData[i].departmentCode){
                        flag=true;
                    }
                }
                return flag
            }
        },
        watch:{
            config:{
                 handler: function (val, oldVal) {
                    this.modalCfg.show = val.show
                    if(val.show == true && this.config && this.config.data){
                            this.chooseArr=[]
                            //this.defaultArr = []
                            this.config.data.forEach(item => {
                                if(item.code){
                                    this.chooseArr.push(item.code)
                                    //this.defaultArr.push(item.code)
                                }else{
                                    this.chooseArr.push(item.departmentCode)
                                    //this.defaultArr.push(item.departmentCode)
                                }
                            })
                    }
                 },
                 deep: true
            },
            chooseArr:{
                handler:function(val,oldval){
                    if(this.haveAllCheck()){
                        this.all = true
                    }else{
                        this.all = false
                    }
                },
                deep:true
            }
        }
    }
</script>
<template>
    <modal :config="modalCfg" @quite="quite" @sure="sure" @close="config.show =false">
        <div class="dep-wrap">
            <div class="dep-content">
                <ul class="dep-list">
                    <li v-for="item in listData" :class="{'active':currentIndex == $index}" @click="checkThisLink($index)">
                        <div class="li-content">
                            <div>
                                <span class="icon" :class="{'icon-hp_list__dropdown':item.children.length >0}"></span>
                                <span>{{item.name}}</span>
                            </div>
                            <!-- <input  @click.stop="" type="checkbox" :value="item.code" v-model="chooseArr"> -->
                        </div>
                        <ul v-if="item.children.length >0"  @click.stop="">
                            <li v-for="item in item.children">
                                <div class="li-inner">
                                    <span>{{item.name}}</span>
                                    <input type="checkbox" :class='{"disabled":isDefault(item.code)}' :disabled='isDefault(item.code)' :value="item.code" v-model="chooseArr">
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <!-- <div class="check-all">
                <span>全选</span>&emsp;<input type="checkbox" @click="checkAll" :checked="all">
            </div> -->
        </div>
    </modal>
</template>
<style lang="less" scoped>
    @import '../../../../../public/css/variable.less';
    .disabled::after{
        color:#e6ecef !important;
    }
    .dep-wrap{
        font-size: 12px;

        .check-all{
            height: 30px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding-right: 17px;
            margin-bottom: 20px;

            input{
                margin-right: 10px;
            }
        }
        .dep-content{
            overflow-y: scroll;
            height: 450px;
            border:1px solid @border-color;

            .dep-list{
                width: 100%;
                overflow: auto;
                .icon{
                    display: inline-block;
                    width: 12px;
                    height: 12px;
                    margin-right: 0;
                }

                li{
                    border-bottom: 1px solid @border-color;
                    cursor: pointer;

                    ul{
                        border-top: 1px solid @border-color;
                        display: none;
                    }

                    .li-content,.li-inner{
                        height: 44px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 0 20px 0 20px;

                        &:hover{
                            background-color: @info-hover;
                        }

                    }
                    .li-inner{
                        padding-left: 40px;
                    }
                }
                .icon-hp_list__dropdown{
                    transform: rotate(-90deg);
                    display: inline-block;
                }
                .active {
                    ul{
                        display: block;
                    }
                    .icon-hp_list__dropdown{
                        transform: rotate(0deg);
                        display: inline-block;
                    }
                }
            }

        }

    }
</style>

