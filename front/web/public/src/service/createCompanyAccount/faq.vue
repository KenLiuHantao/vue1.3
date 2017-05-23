<script>
    export default {
        data () {
            return {
                faqContentShow: false,
            }
        },
        methods: {
            faqContentShowSwitch () {
                this.faqContentShow = !this.faqContentShow
            }
        }
    }
</script>

<template>
    <div class="faq">
        <div class="faq_main">
            <span @click="faqContentShowSwitch" class="faq_btn">常<br>见<br>问<br>题</span>
            <div v-if="faqContentShow" class="faq_content">
                <div class="faq_content_header">
                    <span>注册前需要准备的资料：</span>
                    <i @click="faqContentShowSwitch" class="icon-modal__close"></i>
                </div>
                <div class="faq_content_text">
                    <p>1、营业执照清晰彩色原件扫描件或数码照</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
    .faq {
        position: fixed;
        top: 50%;
        right: 40px;
        text-align: center;
        transform: translateY(-50%);
    }

    .faq_main {
        position: relative;
    }

    .faq_btn {
        display: inline-block;
        width: 34px;
        height: 100px;
        padding-top: 9px;
        background-color: #fff;
        border: 1px solid #B3B3B4;
        color: #212121;
        font-size: 14px;
        text-align: center;
        line-height: 20px;
        cursor: pointer;
    }

    .faq_content {
        position: absolute;
        bottom: 0;
        right: 33px;
        width: 378px;
        height: 285px;
        padding: 20px;
        background-color: #fff;
        border: 1px solid #B3B3B4;
        text-align: left;
    }

    .faq_content_header {

        span {
            display: inline-block;
            padding-bottom: 25px;
            color: #222222;
            font-size: 16px;
        }

        i {
            float: right;
            color: #BBBCBD;
            cursor: pointer;
        }
    }

    .faq_content_text {
        color: #757575;
    }
</style>