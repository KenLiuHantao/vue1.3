<script>
    /*
    配置参数:
    config:{
            showTime:true,   //是否显示时间 | 选填
            mark:'&radic;',  //完成后显示的状态图标 | 选填
            data:[{          //数据格式 | 必填
                no:'1',
                name:'完成',
                time:'2016.10.12',
                filed:'制单人',
                user:'skye',
                flag:true,
                }]
        }
    */
    export default{
        props:['config'],
        data(){
            return {
                defCfg:{
                    showTime:true,
                    mark:'icon-operate__success',
                    data:[]
                },
            }
        },
        ready(){
            this.copyData()
        },
        methods:{
            copyData(){
                this.defCfg = Object.assign(this.defCfg,this.config)
            }
        },
        watch:{
            config:{
                handler(){
                    this.copyData()
                },
                deep:true
            }
        }
    }
</script>

<template>
    <div class="flow" v-if="defCfg.data.length > 0">
        <div class="flow-item" v-for="item in defCfg.data" :class="{'active':item.flag}">
            <div class="flow-banner">
                <div class="flow-icon">
                    <i v-if="item.flag" class="icon" :class="[defCfg.mark]"></i>
                    <span v-else>{{item.no}}</span>
                </div>
            </div>
            <div class="flow-text">
                <div>{{item.name}}</div>
                <div class="time" v-if="defCfg.showTime">{{item.time}}</div>
            </div>
            <div class="flow-tips" v-if="item.user != '' && item.user != null">
                <div class="flow-angle"></div>
                {{item.filed}}:{{item.user}}
            </div>
        </div>
    </div>
</template>
<style lang="less">
    @import '../../../public/css/variable.less';
    .flow{
        width: 100%;
        padding: 30px 90px 20px 90px;
        background-color: #fbfbfb;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        line-height: 1;

        .flow-item{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            position: relative;
            flex: 1;

            &:first-child .flow-banner{
                border-radius: 3px 0 0 3px;
            }
            &:last-child .flow-banner{
                border-radius: 0 3px 3px 0;
            }
            &.active .flow-banner{
                background-color: #03a9f4;

                .flow-icon{
                    background-color:#03a9f4;
                }
            }
            .flow-banner{
                width: 100%;
                height: 6px;
                background-color: #E1F0F7;
                position: relative;
                margin-bottom: 15px;

                .flow-icon{
                    display: flex;
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    background-color:#ADDEF5;
                    color: white;
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    align-items: center;
                    justify-content: center;
                    transform: translateX(-50%) translateY(-50%);

                    i{
                        margin: 0;
                    }
                }
            }

            .flow-text{
                color: @gray-sub;
                cursor: pointer;

                div{
                    line-height: 1.3;
                    text-align: center;
                }

                .time{
                    font-size: 12px;
                }
            }
            .flow-text:hover + .flow-tips{
                display: flex;
            }
            .flow-tips{
                display:  none;
                align-items: center;
                justify-content: center;
                padding: 0 15px;
                height: 40px;
                position: absolute;
                bottom: -45px;
                border: 1px solid @border-color;
                background-color: white;
                box-shadow: 0 2px 4px 0 rgba(0,0,0,.05);
                border-radius: 5px;
                color: @gray-sub;
                z-index: 2;

                .flow-angle{
                    position: absolute;
                    width: 8px;
                    height: 8px;
                    left: 50%;
                    top: -1px;
                    background-color: white;
                    border: 1px solid @border-color;
                    border-left:none;
                    border-bottom: none;
                    transform:translateY(-50%) translateX(-50%) rotate(-45deg);
                }
            }

        }
    }

    // 注册页下，背景为白色
    .register {
        .flow {
            background-color: #f7f8fc;
        }
    }
</style>
