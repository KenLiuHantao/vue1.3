<script>
    import logoImg from 'np/images/logo.png'
    export default {
        data () {
            return {
                // 视图初始化
                logoImg: logoImg,
                flowCfg: {
                    data: [{
                        no: '1',
                        name: '邮箱验证',
                        time: '',
                        filed: '',
                        user: '',
                        flag: true,
                    }, {
                        no: '2',
                        name: '选择版本类型',
                        time: '',
                        filed: '',
                        user: '',
                        flag: true,
                    }, {
                        no: '3',
                        name: '填写企业资料',
                        time: '',
                        filed: '',
                        user: '',
                        flag: true,
                    }, {
                        no: '4',
                        name: '申请完成',
                        time: '',
                        filed: '',
                        user: '',
                        flag: true,
                    }]
                },
                // url 获得的 code 和 token
                urlData: {
                    code: '',
                    token: ''
                },
                // 错误信息
                errMsg: '',
                // 发送成功后显示内容
                part4_show: false,
                // part4 提示申请状态的段落
                part4_state: false,
            }
        },
        methods: {
            // 获取 url ? 之后的参数
            getUrlParams () {
                let url = document.location.href
                if (url.indexOf('?') == -1) return
                let arr = url.split('')
                let count
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i] == '?') {
                        count = i
                        break
                    }
                }
                let params = url.substr(count + 1)
                this.urlData.code = params.split('&')[0].split('=')[1]
                this.urlData.token = params.split('&')[1].split('=')[1]
            },
            // 发送 code token 到 activate 接口
            postActivate () {
                let params = {
                    params: {
                        code: this.urlData.code,
                        token: this.urlData.token,
                    }
                }
                this.$http.post(__URL.service + 'organization/activate', null, params).then(
                    (res) => {
                        if (res.data.success) {
                            this.part4_show = true
                            this.part4_state = true
                        } else {
                            this.part4_show = true
                            this.part4_state = false
                            this.errMsg = res.data.errMsg
                        }
                    }
                )
            },
            // 跳转路由到注册页
            changeRouter () {
                this.$router.go({
                    name: 'createCompanyAccount'
                })
            },
        },
        created () {
            this.getUrlParams()
            this.postActivate()
        }
    }
</script>

<template>
    <header>
        <a href="/login">
            <img :src="logoImg">
            我的经管
        </a>
        <a class="login" href="/login">已有账号？<span>点此登录</span></a>
    </header>

    <article class="main">
        <workflow :config="flowCfg"></workflow>

        <section v-if="part4_show" class="part">
            <div class="part4">
                <div class="item" v-if="part4_state">
                    <div class="icon-finish"></div>
                    <h3>注册已完成</h3>
                    <div>
                        <p>•&nbsp;&nbsp;您已完成注册流程，感谢您注册我的经管企业账户。</p>
                        <p>•&nbsp;&nbsp;资料审核周期为一个工作日之内。</p>
                        <p>•&nbsp;&nbsp;审核完成之后我们会给您发送短信和邮件通知，请您注意查收。</p>
                    </div>
                </div>

                <div class="item" v-if="!part4_state">
                    <div class="icon-exclamatory"></div>
                    <h3>您的资料未通过审核</h3>
                    <p>原因说明：{{ errMsg }}，请您重新提交资料申请，谢谢。</p>
                    <button @click="changeRouter" class="btn-lg-imp">重新申请</button>
                </div>
            </div>
        </section>
    </article>

    <footer>
        <span><a href="http://www.miitbeian.gov.cn">云集智造 2015-2017 粤ICP备16020594号</a></span>
    </footer>
</template>

<style lang="less" scoped>
    @import "../../../../../public/css/serverCommon.less";
    .login {

        span {
            color: #03A9F4;
        }
    }

    .icon-finish,
    .icon-exclamatory {
        display: block;
        padding-bottom: 16px;
        font-size: 60px;
    }
    .icon-finish {
        color: #7ed321;
    }
    .icon-exclamatory {
        color: #feb61a;
    }

    .main {
        width: 75%;
        margin: 0 auto;
        padding: 40px 0 120px;
    }

    .part4 {
        margin-top: 40px;

        .item {
            display: flex;
            flex-direction: column;
            align-items: center;

            h3 {
                margin-bottom: 16px;
                font-size: 18px;
                font-weight: normal;
            }
            p {
                color: #757575;
                font-size: 12px;
                line-height: 20px;
            }
            button {
                margin-top: 16px;
            }
        }
    }
</style>
