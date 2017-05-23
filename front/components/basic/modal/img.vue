<script>
/**
 * 弹出框
 * @params {object} config
 * {
 *   show:Boolean   控制弹框的控制状态(必要参数）
 *   quite:Boolean  是否显示取消按钮
 *   sure:Boolean   是否显示确认按钮
 *   cb:String      点击确认后会触发的事件名称
 *  }
 */
export default {
    props: {
        config: Object
    }
}
</script>
<template>
    <div class="modal-mask modal-transition" v-show="config.show" transition="modal">
        <div class="modal-area">
            <img :src="config.url">
            <a @click='config.show = !config.show' class="close" href="javascript:;">&#xe924;</a>
        </div>
    </div>
</template>
<style lang='less' scoped>
@import '../../public/css/variables.less';
.modal-mask,
.moimg-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    transition: opacity .3s ease;
}

.modal-area {
    position: relative;
    margin: 0 auto;
    max-width: 50%;
    background-color: #ffffff;
    border-radius: 8px;
    margin: 0 auto;
    transition: all .3s ease;
    box-shadow: 1px 1px 50px rgba(0, 0, 0, .3);
    img {
        max-width: 100%;
        height: auto;
        max-height: 600px;
        margin: 0 auto;
    }
    .close {
        width: 40px;
        border-radius: 100%;
        height: 40px;
        top: -15px;
        position: absolute;
        right: -15px;
        display: inline-block;
        font-size: 20px;
        line-height: 37px;
        color: #000;
        text-align: center;
        background: #fff;
        cursor: pointer;
        border: 2px solid #000;
    }
}

.modal-enter,
.modal-leave,
.moimg-enter,
.moimg-leave {
    opacity: 0;
}

.modal-enter .modal-area,
.modal-leave .modal-area,
.moimg-enter .moimg-area,
.moimg-leave .moimg-area {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
}
</style>
