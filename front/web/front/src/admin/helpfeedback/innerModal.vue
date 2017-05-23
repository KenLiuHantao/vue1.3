<script>
    export default {
        props:['config'],
        methods:{
            close(){
                this.config.show = false
                this.$emit('cb')
            }
        }
    }
</script>
<template>
    <div class="modal-page modal-transition" v-if="config.show" transition="modal">
        <div class="modal-header">
            <div @click="close" class="header-item header-return">
                <span class="icon icon-return"></span>
                <span class="text">返回</span>
            </div>
            <!--<div class="header-item header-title">{{config.title}}</div>-->
            <!--<div class="header-item header-close"><span class="gray icon-modal__close" @click="close"></span></div>-->
        </div>
        <div class="modal-content">
            <slot></slot>
        </div>
    </div>
</template>
<style lang="less" scoped>

@import '../../../../../public/css/variable.less';
.modal-page {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 99999;
    top:0;
    left: 0;
    transition: all .3s ease;
    padding-bottom: 60px;
    border: 1px solid @border-color;
    background: white;

    .modal-header {
        box-sizing: border-box;
        background-color: #fff;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 16px 22px;
        font-size: 14px;
        border-bottom: 1px solid #e1e6e9;

        .header-item {
            display: flex;
            cursor: pointer;
        }
        .header-title {
            cursor: auto;
        }
        .header-return, .header-close {
            font-size: 0.6em;
            font-weight: 900;
            cursor: pointer;

            &:hover {
                span {
                    color: #017cdc;
                }
            }
        }
        .header-return {
            color: #212121;
            font-size: 1.2em;
            .icon {
                margin-right: 12px;
            }
            .text {
                font-weight: 400;
                line-height: 14px;
            }
        }
        .gray {
            color: #c6c6c6;
        }

    }
    .modal-content {
        box-sizing: border-box;
        border-top: none;
        width: 100%;
        height: 100%;
        transition: all .3s ease;
        padding-bottom: 60px;
        position: relative;
        overflow: auto;
    }
}

.modal-enter,
.modal-leave{
    left: 100%;
}
</style>

