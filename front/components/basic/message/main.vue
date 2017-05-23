<script>
    export default {
        data(){
            return {
                visible:false,
                showTime:2000,
                message:'',
                type:'success',
                closed:false,
                callback:null,
                timer:null
            }
        },
        compiled(){
            if(this.showTime>0){
                this.timer = setTimeout(()=> {
                    if(!this.closed){
                        this.close()
                    }
                }, this.showTime|| '2000')
            }
        },
        methods:{
            close(){
                this.closed = true
                if (typeof this.callback === 'function') {
                    this.callback(this);
                }
            },
            destroyElement(){
                this.$el.removeEventListener('transitionend', this.destroyElement);
                this.$el.parentNode.removeChild(this.$el);
                this.$destroy();
            }
        },
        watch: {
            closed(val){
                if(val){
                    this.visible = false
                    this.$el.addEventListener('transitionend', this.destroyElement);
                }
            },
        },
    }
</script>
<template>
    <div v-show="visible" class="base  modal-transition" :class="type" transition="modal">
        <div class="item-icon">
            <span class="icon"></span>
        </div>
        <div class="item-content">
            {{message}}
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

