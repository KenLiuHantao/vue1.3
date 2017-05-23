<script>
    /*
     * @param {string} systemType - i|o|a   系统类型，关联于路由配置参数,以及后台接口的属性字段
     */
    import entLogo from 'np/images/entLogo.png'
    import userLogo from 'np/images/userLogo.png'
    import adminLogo from 'np/images/adminLogo.png'
    import proHeaderImg from 'np/images/img-prod-manager.png'
    import * as sysInitMenu from './sysInitMenus.js'
    export default{
        data(){
            return {
                //tab标签类型以及系统类型标识，同时也是列表数据属性
                systemType: '',
                //接口返回所有类型的菜单数据
                allMenuData: '',
                //当前显示的菜单数据
                listData: [],
                //用户信息数据
                userInfo: '',
                //企业logo
                entLogo: entLogo,
                defaultEntLogo:entLogo,
                //用户logo
                userLogo: userLogo,
                //跳转到管理界面图标
                adminLogo: adminLogo,
                //菜单数据
                isInit: false,
                isHelp: false,
                proHeaderImg: proHeaderImg,
                hasNewTask: false,
                //未初始化时，当前初始化的状态
                initStatus:'',
                initWorkFlow:[ {
                    "step" : 1,
                    "status" : 1
                }, {
                    "step" : 2,
                    "status" : 2
                }, {
                    "step" : 3,
                    "status" : 2
                }, {
                    "step" : 4,
                    "status" : 2
                }, {
                    "step" : 5,
                    "status" : 2
                } ],
                //未初始化时菜单数据
                sysListData:sysInitMenu.menu,
                unViewedReplyCount: 0,
                //帐套列表
                accountList:'',
                accountShow:false
            }
        },
        ready(){
            //获取用户信息
            this.getInitInfo();
            //获取菜单数据
            this.getMenuList();
            //检查是否有新任务
            //this.checkTask();
            //检测是否完成初始化
            this.isEnterpriseInit();
            //获取多账套数据
            this.getEntList()
            window.addEventListener('click', () => {
                this.accountShow = false
            })
        },
        methods: {
            checkTask(){
                //检查是否有新的任务
                var _ = this;
                this.$http.get(__URL.task + 'task/newTaskCount').then(
                    res => {
                        if (res.data.success) {
                            _.hasNewTask = res.data.data != 0;
                        } else {
                            console.log(res.data.errMsg)
                        }
                    }
                )
            },
            //获取用户信息
            getInitInfo(){
                this.$http.post(__URL.hr + 'get/user').then(
                    res => {
                        if (res.data.success) {
                            this.userInfo = res.data.data;
                            //如果返回的数据中有logo，则替换。无则使用默认logo
                            this.entLogo = this.userInfo.entLogo == null ? entLogo : this.userInfo.entLogo;
                            this.userLogo = this.userInfo.userLogo == null ? userLogo : this.userInfo.userLogo;
                            //重新判断当前用户身份与系统是否匹配
                            this.checkAdmin();
                            // 获取未读回复数量
                            this.getUnViewedReplyCount(this.userInfo.userCode);
                        }
                    }
                )
            },
            getMenuList(){
                this.$http.post(__URL.v1 + 'menus').then(
                    res => {
                        if (res.data.success) {
                            this.allMenuData = res.data.data
                            this.getManageType()
                            this.setData(this.systemType)
                        } else {
                            console.log(res.data.errMsg)
                        }

                    }
                )
            },
            isEnterpriseInit() {
                this.$http.post(__URL.hr + 'enterpriseInitialized/check').then(
                    res => {
                        if (res.data.success) {
                            this.isInit = res.data.data.step == 0
                            this.initStatus = res.data.data.step
                            this.initWorkFlow = res.data.data.steps   //1 成功 2感叹号(未导完) 3未开始
                            this.checkIsInit()
                        } else {
                            console.log(res.data.errMsg)
                        }
                    }
                )

            },
            getEntList(){
                this.$http.post(__URL.hr2 + 'user/ents').then(
                    res=>{
                        if(res.data.success){
                            this.accountList = res.data.data
                        }
                    }
                )
            },
            switchAccount(){
                this.accountShow = !this.accountShow
            },
            switchLoginAccount(item){
                window.location.href = '/ierp/login/impersonate?username=___ierp_switch_usercode___'+item.userCode
            },
            //跳转到管理员系统
            goAdmin(){
                localStorage.setItem('webUrl', window.location.href)
                this.$router.go('/a/rbac')
            },
            goHelp(){
                localStorage.setItem('webUrl', window.location.href)
                this.$router.go('/help/helpfeedback')
            },
            // 用户帮助与反馈返回到我的经管
            helpGoNormal() {
                // 重新获取未读回复数量
                //this.getUnViewedReplyCount(this.userInfo.userCode);
                this.unViewedReplyCount = 0;
                // 返回到我的经管
                this.goNormal()
            },
            //返回到之前进入管理员系统的界面
            goNormal(){
                if( this.userInfo.admin == 1 && this.allMenuData.ierp.length <1 ){
                    this.$router.go('/a/rbac')
                }else{
                    this.goToUrl('ierp')
                }
            },
            //检查到非管理员进入管理界面，则返回到默认页的第一项
            checkAdmin(){
                if (this.isInit && this.systemType == 'admin' && this.userInfo.admin != '1') {
                    if (this.allMenuData.ierp.length > 0) {
                        this.goToUrl('ierp')
                    } else if (this.allMenuData.oa.length > 0) {
                        this.goToUrl('oa')
                    }
                }
                //如果当前是管理员在非管理界面和帮助界面，且没有ierp数据，则直接默认跳转到管理员界面
                if(this.isInit &&  !this.isAdmin && !this.isHelp && this.userInfo.admin == 1 && (this.allMenuData.ierp && this.allMenuData.ierp.length < 1) ){
                    this.$router.go('/a/rbac')
                }
            },
            //改变tab选中状态
            checkTab(val){
                this.systemType = val
                this.goToUrl(val)
            },
            //设置列表数据
            setData(val){
                this.listData = this.allMenuData[val]
            },
            //检测是否初始化
            checkIsInit(){
                let i = sysInitMenu.directMenu.indexOf(this.$route.path) +1
                if ((!this.isInit && i > this.initStatus) || i == 0) {
                    this.$router.go(sysInitMenu.directMenu[this.initStatus-1])
                }
                this.getManageType()
            },
            //通过路由参数判断当前是 管理员|普通
            getManageType(){
                let k = this.$route.params ? this.$route.params.systemType : 'i'
                //传递的三种类型，分别对应三种系统类型以及将要应用的menu的key值
                switch (k) {
                    case 'i':
                        this.systemType = 'ierp';
                        break;
                    case 'o':
                        this.systemType = 'oa';
                        break;
                    case 'a':
                        this.systemType = 'admin';
                        break;
                    case 'init':
                        this.systemType = 'sysInit';
                        break;
                    case 'help':
                        this.systemType = 'help';
                        break;
                    default:
                        this.systemType = 'ierp';
                }
            },
            //获取数据中的第一个可点URL
            getFirstUrl(data){
                if (data.items.length > 0) {
                    return this.getFirstUrl(data.items[0])
                } else {
                    return data.url
                }
            },
            //跳转到某个链接
            goToUrl(val){
                if (this.allMenuData && this.allMenuData[val].length > 0) {
                    this.$router.go(this.getFirstUrl(this.allMenuData[val][0]))
                }
            },
            /**
             * 查询与IERP当前用户相关的所有公告和反馈的未读回复的数量
             */
            getUnViewedReplyCount(userCode) {
                this.$http.post(__URL.feedback + '/pc/feedback/new-reply/count', {
                    userCode: userCode
                }, {
                    emulateJSON: true
                }).then(
                    res => {
                        if (res.data.success) {
                            this.unViewedReplyCount = res.data.data;
                        } else {
                            this.unViewedReplyCount = 0;
                            console.log(res.data.errMsg)
                        }
                    }
                );
            },
        },
        watch: {
            //监听状态改变时，更改显示对应的数据
            systemType(val){
                if(val != 'sysInit'){
                    this.setData(val)
                }
            },
            //当路由改变时，监听系统类型是否切换
            $route: {
                handler(val, old){
                    if(!this.isInit){
                        this.isEnterpriseInit()
                    }else{
                        this.checkIsInit()
                        this.checkAdmin()
                    }
                },
                deep: true
            }
        },
        computed: {
            //正式版的时候需要的默认url
            defaultUrl(){
                return '/' + this.systemType + '/default'
            },
            isHelp(){
                return this.systemType == 'help'
            },
            isAdmin(){
                return this.systemType == 'admin'
            },
            isSysInit(){
                return this.systemType == 'sysInit'
            },
            isOa(){
                return this.systemType == 'oa'
            },
            isIerp(){
                return this.systemType == 'ierp'
            }
        }
    }
</script>
<template>
    <div class="sidebar" :class="{'pt-58':!isInit || isHelp }">

        <div class="logo-wrap" @click="goToUrl('ierp')">
            <span class="logo"></span>
            <span>我的经管</span>
        </div>
        <div class="tab-wrap" v-if="!isAdmin && !isSysInit && isInit && !isHelp">
            <a href="javascript:;" class="tab-item" :class="{'active':isIerp}" @click="checkTab('ierp')">
                <span class="icon" :class="{'icon-ierp__checked':isIerp,'icon-ierp':!isIerp}"></span><span>iERP</span>
            </a>
            <div class="tab-line"></div>
            <a href="javascript:;" class="tab-item" :class="{'active':isOa,'new_task':hasNewTask}" @click="checkTab('oa')">
                <span class="icon " :class="{'icon-oa__checked':systemType=='oa','icon-oa':systemType !='oa'}" ></span><span>OA协同</span>
            </a>
        </div>
        <div class="tab-wrap" v-if="isAdmin && isInit && !isHelp">
            <div class="boss-content">
                <span class="icon icon-eboss"></span><span>企业eBoss管理</span>
            </div>
        </div>
        <div class="tab-wrap" v-if="isSysInit">
            <div class="boss-content">
                <span class="icon icon-eboss"></span><span>系统初始化设置</span>
            </div>
        </div>
        <div class="menu-wrap" :class="{'pt-0':!isInit || isSysInit}" v-if="!isHelp">
            <!--正常从后台获取菜单-->
            <!--<a href="javascript:;" class="wait gray" v-if="!isSysInit">
                <span class="icon icon-pending "></span>
                <span>待处理</span>
            </a>-->
            <ul v-if="!isSysInit" class="menu-list">
                <li v-for="item in listData">
                    <a  v-link="{ path: item.url }"
                        :class="[item.items.length >0 ? 'gray':'']">
                        <span class="icon" :class="[item.style != '' && item.style != null ? item.style : '']"></span>
                        <span>{{item.name}}</span>
                    </a>
                    <ul v-if="item.items.length>0">
                        <li v-for="item in item.items">
                            <a v-link="{ path: item.url }">
                                <span>{{item.name}}</span>
                            </a>
                        </li>
                    </ul>
                </li>
            </ul>
            <ul v-else class="init-list">
                <li v-for="item in sysListData">
                    <a  v-link="{ path: item.url }"
                        :class="[item.items.length >0 ? 'gray':'']">
                        <span :class="{'gray':$index == 1 && initStatus<= 6 && initStatus>0}">{{item.name}}</span>
                        <span><i :class="{'icon-operate__success success': initStatus==0}"></i></span>
                    </a>
                    <ul v-if="item.items.length>0">
                        <li v-for="item in item.items">
                            <a v-link="{ path: item.url }" :class="{'doing':($index+1)==initStatus,'done':($index+1)<initStatus || initStatus==0 } ">
                                <span :class="{'gray':($index+1)>initStatus && initStatus !=0 }">{{item.name}} </span>
                                <span><i :class="{'icon-operate__success success':initWorkFlow[$index].status <2 || initStatus==0,'icon-warning__warn warning':initWorkFlow[$index].status == 2 && initStatus != 0 }"></i></span>
                            </a>
                        </li>
                    </ul>
                </li>
            </ul>
            <div class="hf-btn" v-if="isInit">
                <a href="javascript:;" @click="goHelp">
                    <span class="icon icon-user__help"></span>
                    <span>帮助与反馈</span>
                    <span class="reply-count" v-if="unViewedReplyCount > 0" v-text="unViewedReplyCount"></span>
                </a>
            </div>
        </div>

        <div class="menu-wrap" v-else>
            <div class="menu-content">
                <div class="header-img"><img class="pro-header-img" :src="proHeaderImg"></div>
                <div class="user-name">Freya Yan</div>
                <div class="pro-service">产品服务经理</div>
                <div class="content">
                    <p>
                        <span class="icon icon-light"></span>
                        <span>如果您有任何产品问题或建议，欢迎随时向我反馈，您的每条建议对我们都很重要。</span>
                    </p>
                </div>
            </div>
            <!--<div class="hf-btn">-->
                <!--<a href="javascript:;" @click="helpGoNormal">-->
                    <!--<span class="icon icon-ierp__return"></span>-->
                    <!--<span>返回我的经管</span>-->
                <!--</a>-->
            <!--</div>-->
            <button class="btn-lg-imp return-btn" @click="helpGoNormal"><span class="icon icon-ierp__return"></span>返回我的经管</button>
        </div>
    </div>
    <div class="header">
        <div class="company" @click.stop="">
            <div class="list-wrap">
                <img :src="entLogo">
                <div class="title" :title="userInfo.entName">{{userInfo.entName}}</div>
                <div class="switch-btn" v-if="accountList.length >1"   @click="switchAccount">切换企业账套 <span class="arrow"></span> </div>
            </div>
            <div class="select-option" v-show="accountShow">
                <div class="list-wrap bottom-line">
                    <img :src="entLogo">
                    <div class="title" :title="userInfo.entName">{{userInfo.entName}}</div>
                    <div class="switch-btn switch-btn-none"  @click="switchAccount">切换企业账套 <span class="arrow"></span> </div>
                </div>
                <ul>
                    <li class="list-wrap" v-for="item in accountList" @click="switchLoginAccount(item)" >
                        <img :src="item.entLogo == null ? defaultEntLogo :item.entLogo">
                        <div class="title list-title" :title="item.entName">{{item.entName}}</div>
                        <span class="default-ent" v-show="item.isDefault">默认登录</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="opt-wrap">
            <a href="javascript:;" class="admin-opt"  v-if="isAdmin && userInfo.admin == '1' && isInit && allMenuData.ierp.length" @click="goNormal">
                <span class="icon-ierp__return"></span><span>返回主页</span>
            </a>
            <a href="javascript:;" class="admin-opt" v-if="!isAdmin && userInfo.admin == '1' && initStatus == 0" @click="goAdmin">
                <span class="icon-manager__init"></span><span>管理员</span>
            </a>
            <img class="avatar" :src="userLogo">
            <span class="line">{{userInfo.userName}}</span>
            <a class="logout" href="/ierp/logout">退出</a>
        </div>
    </div>
</template>
<style lang="less">
    @import '../../../public/css/reset.css';
    @import '../../../public/css/variable.less';
    @import '../../../public/css/common.less';
    @import '../../../public/css/icon.less';

    .new_task{

    }

    .sidebar {
        width: 204px;
        height: 100%;
        position: absolute;
        border-right: 1px solid #d9d9d9;
        box-shadow: 1px 2px 5px 0px rgba(140, 150, 171, .41);
        padding-top: 110px;
        background-color: #f5f6fa;

        &.pt-58 {
            padding-top: 58px;
        }

        .icon {
            margin-right: 12px;
        }
        .logo {
            background: url("../../../public/images/logo.png") center center;
            display: inline-block;
            width: 44px;
            height: 24px;
            margin-right: 12px;
            background-size: 100% 100%;
        }
        .logo-wrap {
            width: 100%;
            height: 24px;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 15px auto;
            cursor: pointer;
            position: absolute;
            top: 0;
        }
        .tab-wrap {
            display: flex;
            width: 100%;
            flex-direction: row;
            justify-content: center;
            position: absolute;
            top: 58px;

            .tab-item {
                display: flex;
                flex: 1;
                height: 48px;
                align-items: center;
                justify-content: center;
                border-bottom: 1px solid @border-color;
                border-top: 2px solid transparent;
                color: #373f4f;

                &:hover {
                    color: @link-hover;
                    cursor: pointer;
                }

                &.active {
                    border-top: 2px solid @link-hover;
                    border-bottom: 2px solid #fbfcfd;
                    background-color: #fbfcfd;
                    color: @link-hover;
                }
            }
            .tab-line {
                width: 1px;
                border-top: 2px solid @link-hover;
                height: 51px;
                background-color: @border-color;
            }
            .boss-content {
                display: flex;
                width: 100%;
                height: 52px;
                align-items: center;
                justify-content: flex-start;
                padding-left: 20px;
                color: @link-color;
                background-color: white;
            }

        }
        .menu-wrap {
            padding-top: 8px;
            background-color: #fbfcfd;
            height: 100%;
            box-sizing: border-box;
            padding-bottom: 50px;
            position: relative;


            &.pt-0 {
                padding-top: 0;
            }
            .init-list{
                height: 100%;
                overflow: auto;

                .v-link-active{
                    color: @link-hover;

                    .gray{
                        color: @link-hover
                    }
                }
                a{
                    display: flex;
                    height: 34px;
                    align-items: center;
                    padding: 0 20px;
                    white-space: nowrap;

                    span{
                        margin-right: 5px;
                    }
                    .gray{
                        color: gray;
                    }
                }
                .warning{
                    color:#EC8A38
                }
                .success{
                    color:#659F3D
                }
                ul li{

                    a{
                        padding-left: 60px;
                        position: relative;
                        font-size: 12px;

                        &:before{
                            content: '';
                            display: flex;
                            border: 1px solid #c7c7cc;
                            width: 7px;
                            height: 7px;
                            border-radius: 50%;
                            position: absolute;
                            left: 45px;
                            top:12px;
                        }
                        &:after{
                            content: '';
                            display: flex;
                            border-left:1px dashed gray;
                            height: 20px;
                            position: absolute;
                            top: 24px;
                            left: 49px;
                        }
                    }
                    a.done{
                        &:before{
                            border: 1px solid #ADDCF1;
                            background-color: @link-hover;
                        }
                        &:after{
                            border-left: 1px solid @link-hover;
                        }
                    }
                    a.doing{
                        &:before{
                            border: 1px solid @link-hover;
                        }
                        &:after{
                            border-left: 1px solid @link-hover;
                        }
                    }
                    &:last-child a:after{
                        border-left: none;
                    }
                }
            }
            .menu-list {
                height: 100%;
                overflow: auto;
                .icon{
                    color: #7085a9;
                }
                >li >a{
                    font-size: 15px;
                    color: #223452;
                    height: 40px;
                }
                ul li a {
                    padding-left: 56px;
                    color: #373f4f;
                    font-size: 13px;
                }
                a {
                    display: flex;
                    height: 30px;
                    align-items: center;
                    padding: 0 20px;
                    white-space: nowrap;
                    overflow: hidden;

                    &:hover {
                        background-color:#E8F7FE;
                    }

                    &.v-link-active {
                        background-color: @link-hover;
                        span {
                            color: white;
                        }
                    }
                }
                .gray {
                    span {
                        color:#223452 ;
                    }
                    &:hover {
                        background-color: transparent;
                    }
                    .icon{
                        color: #7085a9;
                    }
                }
            }
            .menu-content {
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            .wait {
                position: absolute;
                top: 8px;
                width: 100%;
                box-sizing: border-box;
                font-size: 16px;
                padding: 0 20px;
                display: flex;
                height: 34px;
                align-items: center;
                .icon{
                    color: #f6a623;
                    opacity: .5;
                }
                &.v-link-active {
                    background-color: transparent;
                    border-left: none;
                    span {
                        color: #FFB800;
                    }
                }
                .tip-number {
                    background-color: #FF5104;
                    display: flex;
                    height: 16px;
                    position: absolute;
                    right: 20px;
                    border-radius: 16px;
                    align-items: center;
                    justify-content: center;
                    padding: 1px 5px 0px 5px;
                    color: white;
                    font-size: 12px;
                }
            }
            .hf-btn {
                position: absolute;
                bottom: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 49px;
                border: 1px solid @border-color;
                background-color: @body-bg;
                font-size: 14px;
                color: @gray-sub;
                .icon {
                    margin-right: 0;
                    color: #9BDBF9;
                }
                a {
                    &:hover {
                        color: @link-hover;
                        background-color: #fff;
                    }
                    .reply-count {
                        margin: 2px 0 0 6px;
                        display: inline-block;
                        text-align: center;
                        min-width: 18px;
                        border: 1px solid #97daf7;
                        background-color: #ddf3fe;
                        border-radius: 12px;
                        box-sizing: border-box;
                        font-size: 10px;
                        padding: 2px;
                        color: #07adff;
                    }
                }
            }
            .return-btn {
                position: absolute;
                left: calc((203px - 148px) / 2);
                bottom: 30px;
                width: 148px;
                height: 35px;

            }
            .header-img {
                margin-top: 20px;
            }
            .user-name {
                margin-top: 10px;
            }
            .pro-service {
                width: 98px;
                height: 25px;
                margin-top: 10px;
                background-color: #61BA5B;
                border-radius: 20px;
                color: #fff;
                font-size: 12px;
                text-align: center;
                line-height: 25px;
            }
            .content {
                margin: 30px 17px 0 34px;
                font-size: 12px;
                p {
                    position: relative;
                    line-height: 1.5;
                    .icon-light {
                        position: absolute;
                        top: 1px;
                        left: -18px;
                        color: #ffd830;
                        font-size: 14px;
                    }
                }
            }
            .pro-header-img {
                width: 70px;
                height: 70px;
                border-radius: @border-radius-base;
            }
        }
    }

    .header {
        position: absolute;
        z-index: 9;
        top: 0;
        left: 212px;
        right: 0;
        height: 55px;
        padding: 0 14px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .company {
            position: relative;
            height: 100%;

            .bottom-line{
                border-bottom: 1px solid @border-color;
                box-sizing: content-box;
            }
            .list-wrap{
                display: flex;
                align-items: center;
                height:55px;

                img{
                    margin-right: 10px;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    border: 1px solid #EAEAEA;
                }
                .title{
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    font-size: 16px;
                    line-height: 1.2;
                }
                .list-title{
                    margin-right: 12px;
                }
                .default-ent{
                    display: flex;
                    height: 18px;
                    align-items: center;
                    border: 1px solid #7ed321;
                    border-radius: 9px;
                    font-size: 12px;
                    color: #73c815;
                    padding: 0 5px;
                    background-color: #fbfff7;
                    white-space: nowrap;
                }
                .switch-btn{
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid @border-color;
                    border-radius: 12px;
                    background-color: white;
                    margin-left: 10px;
                    padding: 0 10px;
                    font-size: 12px;
                    color: @link-hover;

                    .arrow{
                        display: block;
                        width: 0;
                        height: 0;
                        border-left: 4px solid transparent;
                        border-right: 4px solid transparent;
                        border-top: 4px solid @link-hover;
                        border-bottom: 4px solid transparent;
                        margin-left: 10px;
                        transform: translateY(20%);
                    }
                    &:hover{
                        cursor: pointer;
                    }
                }
                .switch-btn-none{
                    border-color: transparent;
                    .arrow{
                        border-top: 4px solid transparent;
                        border-bottom: 4px solid @link-hover;
                        transform: translateY(-30%);
                    }
                }
            }
            .select-option{
                width: 100%;
                box-sizing: content-box;
                padding: 0px 10px 0 15px;
                position: absolute;
                top: 0;
                left: -15px;
                background-color: white;
                box-shadow: 0px 3px 3px 0px rgba(140, 150, 171, .41);

                ul{
                    position: absolute;
                    top: 56px;
                    left: 0;
                    width: 100%;
                    background-color: white;
                    box-shadow: 0px 3px 3px 0px rgba(140, 150, 171, .41);
                    border-radius: 0 0 3px 3px;
                    padding: 10px 0;

                    li{
                        height: 40px;
                        display: flex;
                        align-items: center;
                        padding: 0 15px;

                        &:hover{
                            background-color: #e8f7fe;
                            cursor: pointer;
                        }
                    }

                }
            }

        }

        .opt-wrap {
            display: flex;
            height: 100%;
            flex-direction: row;
            align-items: center;

            .admin-opt {
                color: white;
                width: 90px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 14px;
                background-color: #f29357;
            }
            .avatar{
                width: 28px;
                height: 28px;
                border-radius: 50%;
                border:1px solid #EAEAEA;
                margin-right: 10px;
                margin-left: 15px;
            }
            .line{
                border-right: 1px solid #d8d8d8;
                padding-right: 20px;
            }

            .logout{
                display: flex;
                align-items: center;
                border-radius: 4px;
                margin-left: 20px;
            }
        }
    }
</style>
