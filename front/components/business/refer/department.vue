<script>
    /*
     title:单选部门

     配置:
     config:{
     show:false, //弹框显示 true|false 必填
     },

     回调：
     cb(val)

     */
    export default {
        props:{
            config:{
                type:Object
            }
        },
        data(){
            return {
                listData:[],
                //是否全选
                all:false,
                currentIndex:-1,

                //选中的全部信息
                chooseInfo:[],
                chooseArr:'',

                //多选部门弹框配置
                modalCfg: {
                    show: this.config.show || false,
                    width: '400px',
                    height: 'auto',
                    header: '选取部门',
                    btn: [{
                        name: '取消',
                        emit: 'quite'
                    }, {
                        name: '确定',
                        emit: 'sure'
                    }],
                },
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
                        this.listData = res.data.data
                    }
                )
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
                this.listData.forEach(item=>{
                     if(item.code == this.chooseArr){
                        this.chooseInfo = item
                     }else if(item.children.length > 0){
                        item.children.forEach(it=>{
                            if(it.code == this.chooseArr){
                                this.chooseInfo = it
                            }
                        })
                     }
                })
                this.config.show = false
                this.$emit('cb',this.chooseInfo)
            },
            quite() {
                this.config.show = false
            }
        },
        watch:{
            config:{
                 handler: function (val, oldVal) {
                    this.modalCfg.show = val.show
                    if(val.show == true && this.config && this.config.data){
                            this.chooseArr = this.config.data.code
                    }
                 },
                 deep: true
            },
            modalCfg:{
                handler: function (val, oldVal) {
                    this.config.show = val.show
                 },
                 deep: true
            }
        }
    }
</script>
<template>
    <modal :config="modalCfg" @quite="quite" @sure="sure">
        <div class="dep-wrap">
            <div class="dep-content">
                <ul class="dep-list">
                    <li v-for="item in listData" :class="{'active':currentIndex == $index}" @click="checkThisLink($index)">
                        <div class="li-content">
                            <div>
                                <span class="icon" :class="{'icon-hp_list__dropdown':item.children.length >0}"></span>
                                <span>{{item.name}}</span>
                            </div>
                            <input  @click.stop="" type="radio" :value="item.code" v-model="chooseArr">
                        </div>
                        <ul v-if="item.children.length >0"  @click.stop="">
                            <li v-for="item in item.children">
                                <div class="li-inner">
                                    <span>{{item.name}}</span>
                                    <input type="radio" :value="item.code" v-model="chooseArr">
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </modal>
</template>
<style lang="less">
    @import '../../../public/css/variable.less';
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
            overflow-y: auto;
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
                    .li-content + ul {
                        background-color: #fafafa;
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

