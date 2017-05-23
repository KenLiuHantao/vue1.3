<script type="text/javascript">
    export default {
        ready(){
            this.getEntDetail();
            for (let i = 1980; i <= new Date().getFullYear(); i++) {
                this.yearList.push(i)
            }
        },
        data(){
            return {
                enterpriseInfo: {
                    licence: {},
                    logo: {}
                },
                isEdit: false,
                yearList: [],
                monthList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                attachment: {
                    "fileId": "",
                    "fileName": "",
                    "fileSize": "",
                    "mimeType": "",
                    "ext": "",
                    "eTag": "",
                    "url": ""
                },
                msg: {
                    show: false,
                    content: '修改成功',
                    type: 'success'
                }
            }
        },
        methods: {
            getEntDetail () {
                this.$http.post(__URL.arc + 'entInfo/detail', null).then(
                    (res) => {
                        if (res.data.success) {
                            this.enterpriseInfo = res.data.data;
                            this.attachment.fileId = this.enterpriseInfo.logo.fileId;
                        }
                    }
                )
            },
            downloadLicenseImage: function (url) {
                window.location.href = url;
            },
            changeEntEdit() {
                this.isEdit = true;
                this.getEntDetail();
            },
            file(val) {
                this.attachment.fileId = val.fileId;
                this.attachment.fileName = val.fileName;
                this.attachment.fileSize = val.fileSize;
                this.attachment.mimeType = val.mimeType;
                this.attachment.ext = val.ext;
                this.attachment.eTag = val.eTag;
                this.enterpriseInfo.logo.url = val.baseUrl;
            },
            updateEnt() {
                let updateEntDetail = {
                    "address": this.enterpriseInfo.address,
                    "attachment": this.attachment,
                    "code": this.enterpriseInfo.code,
                    "comFax": this.enterpriseInfo.comFax,
                    "name": this.enterpriseInfo.name,
                    "phone": this.enterpriseInfo.phone,
                    "postCode": this.enterpriseInfo.postCode,
                    "website": this.enterpriseInfo.website,
                    "year": this.enterpriseInfo.year,
                    "month": this.enterpriseInfo.month,
                    "remark": this.enterpriseInfo.remark,
                    "recordVersion": this.enterpriseInfo.recordVersion
                };
                this.$http.post(__URL.arc + 'entInfo/update', updateEntDetail).then(
                    (res) => {
                        this.msg.show = true;
                        this.msg.content = '修改成功';
                        if (res.data.success) {
                            this.msg.type = "success";
                            this.isEdit = false;
                        } else {
                            this.msg.type = "failure";
                            this.msg.content = '修改失败';
                        }
                    }
                )
            }
        },
        computed:{
            dateTime(){
                let text = ''
                if(this.enterpriseInfo.year != ''){
                    text += `${this.enterpriseInfo.year}年`

                    if(this.enterpriseInfo.month != ''){
                        text += `${this.enterpriseInfo.month}月`
                    }
                }
                return text
            }
        }
    }
</script>

<template>
    <div class="container">
        <div class="content">
            <div class="ent-container">
                <div class="ent-base-info">
                    <div class="head">
                       <i class="icon icon-ent__setting green" ></i> 企业注册信息
                    </div>
                    <div class="info-wrap">
                        <div>
                            <label for="企业名称">企业名称</label>
                            {{enterpriseInfo.name}}
                        </div>
                        <div>
                            <label for="营业执照扫描件">营业执照扫描件</label>
                            <span><img v-if="enterpriseInfo.licence.url!='' && enterpriseInfo.licence.url!=null"
                                       :src="enterpriseInfo.licence.url" alt="营业执照扫描件"
                                       @click="downloadLicenseImage(enterpriseInfo.licence.url)"></span>
                        </div>
                        <div>
                            <label for="统一社会信用代码">统一社会信用代码</label>
                            <span>{{enterpriseInfo.socialCreditCode}}</span>
                        </div>
                        <div class="">
                            <label for="注册所在地">注册所在地</label>
                            <span>{{enterpriseInfo.registerAddress}}</span>
                        </div>
                        <div class="">
                            <label for="行业类别">行业类别</label>
                            <span>{{enterpriseInfo.industryType}}</span>
                        </div>
                        <div class="">
                            <label for="从业人数">从业人数</label>
                            <p v-show='enterpriseInfo.employeeCount=="A"'>1-49人</p>
                            <p v-show='enterpriseInfo.employeeCount=="B"'>50-99人</p>
                            <p v-show='enterpriseInfo.employeeCount=="C"'>100-499人</p>
                            <p v-show='enterpriseInfo.employeeCount=="D"'>500-999人</p>
                            <p v-show='enterpriseInfo.employeeCount=="E"'>1000人以上</p>
                        </div>
                        <div class="">
                            <label for="法人代表姓名">法人代表姓名</label>
                            <span>{{enterpriseInfo.adminName}}</span>
                        </div>
                        <div class="">
                            <label for="身份证号码">身份证号码</label>
                            <span>{{enterpriseInfo.adminIdCard}}</span>
                        </div>
                        <div>
                            <label for="企业号">企业标识码</label>
                            <span>{{enterpriseInfo.code}}</span>
                        </div>
                    </div>
                </div>

                <div class="ent-sperator">
                    <span class="one"></span>
                    <span class="two"></span>
                </div>

                <div class="ent-base-info">
                    <div class="head">
                        <i class="icon icon-admin__link orange"></i>  系统管理员联系方式
                    </div>
                    <div>
                        <label for="手机号码">手机号码</label>
                        <span>{{enterpriseInfo.adminMobile}}</span>
                    </div>
                    <div>
                        <label for="邮箱地址">邮箱地址</label>
                        <span>{{enterpriseInfo.adminEmail}}</span>
                    </div>
                </div>

                <div class="ent-sperator">
                    <span class="one"></span>
                    <span class="two"></span>
                </div>

                <div class="ent-base-info" v-if="!isEdit">
                    <div class="head">
                        <i class="icon icon-ent__info blue" ></i>企业概况
                        <span class="edit"  @click="changeEntEdit"> <i class="icon-edit blue" ></i>编辑</span>
                    </div>
                    <div>
                        <label for="企业电话">企业电话</label>
                        {{enterpriseInfo.phone}}

                    </div>
                    <div>
                        <label for="企业传真">企业传真</label>
                        {{enterpriseInfo.comFax}}

                    </div>
                    <div>
                        <label for="邮政编码">邮政编码</label>
                        {{enterpriseInfo.postCode}}

                    </div>
                    <div>
                        <label for="企业网址">企业网址</label>
                        {{enterpriseInfo.website}}

                    </div>
                    <div class="split-line"></div>
                    <div>
                        <label for="成立时间">成立时间</label>
                        {{dateTime}}

                     </div>
                    <div>
                        <label for="企业地址">企业地址</label>
                        {{enterpriseInfo.address}}

                    </div>
                    <div >
                        <label for="公司Logo">公司Logo</label>
                        <span><img v-if="enterpriseInfo.logo.url!='' && enterpriseInfo.logo.url!=null"
                                   :src="enterpriseInfo.logo.url" alt="公司Logo"
                                   @click="downloadLicenseImage(enterpriseInfo.logo.url)"></span>
                    </div>
                    <div>
                        <label for="企业简介">企业简介</label>
                        {{enterpriseInfo.remark}}
                    </div>
                </div>
                <div class="ent-base-info" v-else>
                    <div class="head">
                        <i class="icon icon-ent__info blue"></i>企业概况
                    </div>
                    <div>
                        <label for="企业电话">企业电话</label>
                        <input type="text" v-model="enterpriseInfo.phone">
                    </div>
                    <div>
                        <label for="企业传真">企业传真</label>
                        <input type="text" v-model="enterpriseInfo.comFax">
                    </div>
                    <div>
                        <label for="邮政编码">邮政编码</label>
                        <input type="text" v-model="enterpriseInfo.postCode">
                    </div>
                    <div>
                        <label for="企业网址">企业网址</label>
                        <input type="text" v-model="enterpriseInfo.website">
                    </div>
                    <div class="split-line"></div>
                    <div class="choose-date">
                        <label for="成立时间">成立时间</label>
                        <select v-model='enterpriseInfo.year'>
                            <option :value='item' v-for='item in yearList'>{{item}}年</option>
                        </select>
                        <select v-model='enterpriseInfo.month'>
                            <option :value='item' v-for='item in monthList'>{{item}}月</option>
                        </select>
                    </div>
                    <div>
                        <label for="企业地址">企业地址</label>
                        <input type="text" v-model="enterpriseInfo.address">
                    </div>
                    <div class="fix">
                        <label for="公司Logo">公司Logo</label>
                        <div>
                            <img :src="enterpriseInfo.logo.url" alt="公司Logo">
                            <upfile :config="config" @cb="file">
                                <div class="add-file">+</div>
                            </upfile>
                            <span class="tips">{{attachment.fileId == '' ? 0 : 1}}/1</span>
                        </div>
                        <p>支持上传 .jpg .jpeg .png .bmp格式的图片,&nbsp;大小不超过5M</p>
                    </div>
                    <div class="auto">
                        <label for="企业简介">企业简介</label>
                        <textarea v-model="enterpriseInfo.remark"></textarea>
                    </div>
                </div>
                <div class="ent-btn">
                    <button v-if="isEdit" type="submit" name="button" class="btn-xl-imp" @click="updateEnt">保存</button>
                   <!-- <button v-if="!isEdit" type="button" name="button" class="btn-xl-def" @click="changeEntEdit">编辑
                    </button>-->
                </div>
            </div>
        </div>
    </div>
    <warning :config="msg"></warning>

    <!-- <message :config="msgConfig"></message> -->
</template>
<style lang="less" scoped>
    @import '../../../../../public/css/variable.less';
    .blue{
        color: @link-hover;
    }
    .orange{
        color: #F5A623;
    }
    .green{
        color:#4CCC9E
    }
    .container .content {
        overflow: auto;
        box-shadow: none;
    }

    .ent-container {
        display: flex;
        flex-direction: column;
    }

    img {
        width: 72px;
        height: 48px;
    }

    .ent-head {
        border-bottom: 1px solid #F2F3F3;
        height: 45px;
        display: flex;
        align-items: center;
        padding-left: 35px;
    }

    .ent-btn {
        margin-top: 25px;
        margin-left: 225px;
        display: flex;
        justify-content: flex-start;
        margin-bottom: 20px;
    }

    .ent-base-info {
        font-size: 12px;
        color: @gray;
        margin: 20px 40px;
        .head{
            margin-bottom: 5px;
            font-size: 20px;
            position: relative;

            .icon{
                margin-right: 10px;
            }
            .edit{
                font-size: 18px;
                cursor: pointer;
                margin-left: 20px;
                margin-top: 5px;
            }
        }
        .info-wrap{
            display: flex;
            height: auto;
            flex-direction: column;
            align-items: flex-start;
            background-color: #FBFCFD;
            border-radius: 5px;
            border: 1px dashed #E1E6E9;
        }
        .choose-date{
            select{
                width: 120px;
                margin-right: 10px;
            }
        }
        label {
            color: @gray-sub;
        }
        div {
            display: flex;
            align-items: center;
            height: 46px;
        }
        span {
            color: @gray;
        }
        textarea{
            width: 30%;
            height: 68px;
            margin-top: 20px;
        }
    }
    .split-line{
        height: 0!important;
        width: 100%;
        border-bottom: 1px solid @border-color;
        margin: 20px 50px;
    }
    .ent-sperator {
        border-bottom: 1px dashed #e1e6e9;
        margin-top: 10px;
        margin-bottom: 10px;
        position: relative;

        .one,.two{
            display: flex;
            width: 15px;
            height: 15px;
            background-color: #f7f8fc;
            position: absolute;
            top:-7px;
            border-radius: 50%;
        }
        .one{
            left: -7px;
        }
        .two{
            right: -7px;
        }
    }

    label {
        width: 150px;
        padding-left: 50px;
        margin-right: 35px;
        display: inline-block;
        text-align: left;
    }

    .fix {
        position: relative;
        height: 72px !important;
        margin-bottom: 20px;
        > p {
            position: absolute;
            top: 80px;
            left: 185px;
            color: @gray-sub;
        }
        .tips{
            display: flex;
            height: 100%;
            align-items: flex-end;
            margin-left: 10px;
            padding-bottom:5px;
            color: @gray-sub;
        }
        .add-file{
            width: 48px;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid @border-color;
            border-radius: 2px;
            margin-left: 10px;
            font-size: 30px;
            padding-bottom: 10px;
            color:@gray-sub;
        }
    }

    .auto{
        height: auto!important;
    }

</style>
