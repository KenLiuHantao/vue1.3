<script>
    /*
       @config{
           show:true,           false|true   必填
           type:'',             success|failure|warning   必填
           content:'提示消息',   根据内容自定   必填
           showTime:''          显示时间，以毫秒为单位
       }
    */
    export default {
        props:['config'],
        data(){
            return {
                timer:'',
                configs:{
                    show:false,
                    type:'success',
                    content:'',
                    showTime:2000
                }
            }
        },
        methods:{
            close(){
                this.config.show = false
            }
        },
        watch: {
            config: {
                handler(val) {
                    for(let key in val){
                        this.configs[key] = val[key]
                    }
                    if (val.show) {
                        clearTimeout(this.timer)
                        this.timer = setTimeout(()=> {
                            val.show = false;
                        }, this.configs.showTime)
                    }
                },
                deep: true
            }
        },
    }
</script>
<template>
    <div v-if="configs.show" class="base  modal-transition" :class="configs.type" transition="modal">
        <div class="item-icon">
            <span class="icon"></span>
        </div>
        <div class="item-content">
            {{configs.content}}
        </div>
        <div class="item-close"  @click="close">
            <span class="icon-warning__close"></span>
        </div>
    </div>
</template>
<style lang="less" scoped>
@import '../../../public/css/variable.less';

.base{
    display: flex;
    flex-direction: row;
    max-width: 374px;
    position: fixed;
    top:0;
    left: 50%;
    transform: translateX(-50%);
    padding: 8px;
    z-index: 9999999;
    transition: all .3s ease;

    .item-icon{
        width: 14px;
        height: 14px;
        border-radius: 50%;
        padding: 3px;
        display: flex;
        justify-content: center;
        align-items: center;

        span{
            display: inline-block;
            margin-right: 0;
        }
    }
    .item-content{
        flex: 1;
        margin-right: 35px;
        margin-left: 5px;
    }
    

    &.failure{
        color: #ec5a38;
        background-color: #FFF1F0;
        border: 1px solid #EC5A38;
        border-top: none;
        border-radius: 0 0 4px 4px;

        .icon:after{
            content:'\e982'
        }
        .item-icon{
            color: #ec5a38;
        }
        .item-close{
            color: #F5C1B7;
            cursor: pointer;
        }
    }
    &.success{
        color: #659F3D;
        background-color: #F2FAE3;
        border: 1px solid #09BB07;
        border-top: none;
        border-radius: 0 0 4px 4px;

        .icon:after{
            content:'\e985'
        }
        .item-icon{
            color: #659F3D;
        }
        .item-close{
            color: #C7DFA8;
            cursor: pointer;
        }
    }
    &.warning{
        color: #EC8A38;
        background-color: #FFF4EA;
        border: 1px solid #EC8738;
        border-top: none;
        border-radius: 0 0 4px 4px;

        .icon:after{
            content:'\e983'
        }

        .item-icon{
            color: #EC8A38;

        }
        .item-close{
            color: #F5CCB7;
            cursor: pointer;
        }
    }
}
.modal-enter,
.modal-leave{
    opacity: 0;
}
</style>

