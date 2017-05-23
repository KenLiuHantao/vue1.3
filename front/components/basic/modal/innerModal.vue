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
            <div class="header-item"><span class="gray icon-return" @click="close"></span></div>
            <div class="header-item">{{config.title}}</div>
            <div class="header-item"><span class="gray icon-innerpage__close" @click="close"></span></div>
        </div>
        <div class="modal-content">
            <slot></slot>
        </div>
    </div>
</template>
<style lang="less" scoped>
@import '../../../public/css/variable.less';
.modal-page{
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 9999;
    top:0;
    left: 0;
    transition: all .3s ease;
    padding-bottom: 60px;
    background: white;

    .modal-header{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0 90px;
        height: 60px;
        font-size: 20px;
        border-bottom: 1px solid @border-color;

        .gray{
            color: #c6c6c6;
        }
        .header-item{
            display: flex;
            cursor: pointer;
        }
    }
    .modal-content{
        width: 100%;
        height: 100%;
        transition: all .3s ease;
        padding-bottom: 60px;
        position: relative;
    }
}

.modal-enter,
.modal-leave{
    left: 100%;
}
</style>

