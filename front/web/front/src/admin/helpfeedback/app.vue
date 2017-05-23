<script>
    import comment from './images/img-comment.png'
    import newComment from './images/img-new-comment.png'
    import defaultUserLogo from './images/default-user-log.png'
    import innerModal from './innerModal'
    export default {
        components: {
            comment,newComment,innerModal
        },
        data() {
            return {
                user:'',
                comment: comment,
                newComment: newComment,
                defaultUserLogo: defaultUserLogo,
                showList: true, // 是否显示公告和反馈列表

                fdbkDetail: {
                    title: "反馈详情",
                    show:false,
                    data: {
                        code: '',
                        title: '',
                        content: '',
                        userCode: '',
                        userName: '',
                        entCode: '',
                        entName: '',
                        createTime: '',
                        status: '',
                        attachList: [],
                        replyList: [],
                        replyCount: ''
                    },
                    newComment: {
                        content: ''
                    },
                    newReply: {
                        content: ''
                    }
                },
                uCfg:{
                    limit:6,
                },
                isEdit: true,
                newFeedback: {
                    show: false,
                    title: '新增用户反馈',
                    data: {
                        title: '',
                        content: '',
                        accountCode: '',
                        accountName: '',
                        userCode: '',
                        userName: '',
                        entCode: '',
                        entName: '',
                        attaches: ''    // 逗号分隔的文件id
                    },
                    uploadData: []
                },
                bulletinList: [],
                feedbackList:[],
                bltDetail: {
                    show: false,
                    title: '公告详情',
                    data: {
                        code: '',
                        title: '',
                        content: '',
                        createUser: '',
                        createTime: '',
                        publishTime: '',
                        status: '',
                        attachList: [],
                        replyList: [],
                        replyCount: 0
                    },
                    newComment: {
                        content: ''
                    },
                    newReply: {
                        bulletinCode: '',
                        parentCode: '',
                        content: '',
                        avatar: '',
                        fromUserCode: '',
                        fromUserName: ''
                    }
                }
            }
        },
        ready(){
            this.initCurrentUser();
        },
        methods : {
            /**
             * 初始化当前用户
             */
            initCurrentUser(){
                this.$http.get(__URL.v2+'user', {}).then(
                    (res) => {

                        if(res.data.success){
                            this.user = res.data.data;
                            this.newFeedback.data.accountCode = this.user.accountCode;
                            this.newFeedback.data.accountName = this.user.accountName;
                            this.newFeedback.data.userCode = this.user.userCode;
                            this.newFeedback.data.userName = this.user.userName;
                            this.newFeedback.data.entCode = this.user.entCode;
                            this.newFeedback.data.entName = this.user.entName;
                            this.loadBulletinList();
                            this.loadFeedbackList();
                        } else {
                            alert(res.data.errMsg);
                        }
                    }
                )
            },

            /**
             * 关闭模态框回调函数
             */
            closeModal() {
                this.showList = true;
                // 重新加载公告列表和反馈列表
                this.loadBulletinList();
                this.loadFeedbackList();
            },

            /**
             * 加载公告列表
             */
            loadBulletinList() {
                this.$http.post(__URL.feedback + '/pc/bulletin/query', {
                    userCode: this.user.userCode
                }, {
                    emulateJSON: true
                }).then((res) => {
                    if (res.data.success) {
                        this.bulletinList = res.data.data;
                    } else {
                        alert(res.data.errMsg)
                    }
                }, (res) => {

                });
            },

            /**
             * 加载反馈列表
             */
            loadFeedbackList(){
                this.$http.post(__URL.feedback + '/pc/feedback/feedback/query', {
                    userCode: this.user.userCode
                }, {
                    emulateJSON: true
                }).then((res) => {
                    if(res.data.success){
                        this.feedbackList = res.data.data
                    }else{
                        alert(res.data.errMsg)
                    }
                }, (res) => {

                });
            },

            /**
             * 显示公告详情
             */
            showBulletinDetail(item) {
                this.showList = false;
                this.bltDetail.show = true;
                this.bltDetail.data = '';

                // 重新加载公告详情
                this.reloadBulletinDetail(item.code);

                // 更新回复的已读状态
                if (item.newReplyCount && item.newReplyCount > 0) {
                    this.$http.post(__URL.feedback + '/pc/bulletin/reply/update-status', {
                        bulletinCode: item.code
                    }, {
                        emulateJSON: true
                    }).then(function (res) {
                        if (res.data.success) {

                        } else {
                            alert(res.data.errMsg)
                        }
                    }, function (res) {

                    });
                };
            },

            /**
             * 重新加载公告详情
             */
            reloadBulletinDetail(code) {
                this.bltDetail.data = '';
                this.$http.post(__URL.feedback + '/pc/bulletin/find-detail', {
                    bulletinCode: code,
                    userCode: this.user.userCode
                }, {
                    emulateJSON: true
                }).then(function (res) {
                    if(res.data.success){
                        this.bltDetail.data = res.data.data;
                    }
                }, function (res) {

                });
            },

            /**
             * 显示反馈详情
             */
            showFeedbackDetail(item) {
                let params = {code: item.code};

                // 重新加载反馈详情
                this.reloadFeedbackDetail(params.code);

                // 更新回复的已读状态
                if (item.newReplyCount && item.newReplyCount > 0) {
                    this.$http.post(__URL.feedback + '/pc/feedback/reply/update-status', {
                        feedbackCode: item.code
                    }, {
                        emulateJSON: true
                    }).then(function (res) {
                        if(res.data.success){

                        } else {
                            alert(res.data.errMsg)
                        }
                    }, function (res) {

                    });
                }
            },

            /**
             * 重新加载反馈详情
             */
            reloadFeedbackDetail(code) {
                this.$http.post(__URL.feedback + '/pc/feedback/feedback/detail', {
                    code: code
                }, {
                    emulateJSON: true
                }).then(
                    (res) => {
                        if(res.data.success){
                            console.log(res.data.data);
                            this.fdbkDetail.show = true;
                            this.showList = false;
                            if(res.data.data.replyList == undefined){
                                res.data.data.replyList = []
                            }
                            this.fdbkDetail.data = res.data.data;
                        }else{
                            alert(res.data.errMsg)
                        }
                    },
                    (res) => {
                        // 错误处理
                    }
                );
            },

            /**
             * 新增公告评论
             */
            addBulletinComment(el, detail) {
                let params = {
                    bulletinCode: this.bltDetail.data.code,
                    parentCode: null,
                    content: this.bltDetail.newComment.content,
                    avatar: this.user.avatarUrl,
                    fromUserCode: this.user.userCode,
                    fromUserName: this.user.userName
                };

                let bltReply = el.querySelector("#add-blt-reply");
                let bltCmt = el.querySelector("#add-blt-comment");
                bltReply.style.display = "none";
                bltCmt.parentNode.insertBefore(bltReply, bltCmt);

                this.$http.post(__URL.feedback + '/pc/bulletin/comment/add', params).then(function (res) {
                    if(res.data.success){
                        this.bltDetail.newComment.content = '';
                        this.reloadBulletinDetail(params.bulletinCode);
                    }else{
                        alert(res.data.errMsg)
                    }
                }, function (res) {

                });
            },

            /**
             * 新增反馈评论
             */
            addFeedbackComment(el, detail) {
                let params = {
                    feedbackCode: this.fdbkDetail.data.code,
                    parentCode: null,
                    content: this.fdbkDetail.newComment.content,
                    avatar: this.user.avatarUrl,
                    fromUserCode: this.user.userCode,
                    fromUserName: this.user.userName
                };
                console.log(params);
                let fdbkReply = el.querySelector("#add-fdbk-reply");
                let fdbkComment = el.querySelector("#add-fdbk-comment");
                fdbkReply.style.display = "none";
                fdbkComment.parentNode.insertBefore(fdbkReply, fdbkComment);

                this.$http.post(__URL.feedback + '/pc/feedback/comment/add', params).then(function (res) {
                    if(res.data.success){
                        this.fdbkDetail.newComment.content = '';
                        this.reloadFeedbackDetail(params.feedbackCode);
                    }else{
                        alert(res.data.errMsg)
                    }
                }, function (res) {

                });
            },

            /**
             * 新增公告回复
             */
            addBulletinReply(el, evt) {
                let input = evt.target.parentNode.querySelector("input");
                let params = this.bltDetail.newReply;
                params.avatar=this.user.avatarUrl;
                params.fromUserCode=this.user.userCode;
                params.fromUserName=this.user.userName;
                params.content = input.value;

                let bltReply = el.querySelector("#add-blt-reply");
                let bltCmt = el.querySelector("#add-blt-comment");
                bltReply.style.display = "none";
                bltCmt.parentNode.insertBefore(bltReply, bltCmt);

                this.$http.post(__URL.feedback + '/pc/bulletin/reply/add', params).then(function (res) {
                    if(res.data.success){
                        this.reloadBulletinDetail(params.bulletinCode);
                        this.bltDetail.newReply.content = '';
                        //this.bltDetail.newReply = {};
                    }else{
                        alert(res.data.errMsg)
                    }
                }, function (res) {

                });
            },

            /**
             * 新增反馈回复
             */
            addFeedbackReply(el, evt) {
                let input = evt.target.parentNode.querySelector("input");
                let params = this.fdbkDetail.newReply;
                params.avatar=this.user.avatarUrl;
                params.fromUserCode=this.user.userCode;
                params.fromUserName=this.user.userName;
                params.content = input.value;

                let fdbkReply = el.querySelector("#add-fdbk-reply");
                let fdbkComment = el.querySelector("#add-fdbk-comment");
                fdbkReply.style.display = "none";
                fdbkComment.parentNode.insertBefore(fdbkReply, fdbkComment);

                this.$http.post(__URL.feedback + '/pc/feedback/reply/add', params).then(function (res) {
                    if(res.data.success){
                        this.reloadFeedbackDetail(params.feedbackCode);
                        this.fdbkDetail.newReply.content = '';
                        //this.fdbkDetail.newReply = {};
                    }else{
                        alert(res.data.errMsg)
                    }
                }, function (res) {

                });
            },


            /**
             * 保存新增的反馈
             */
            saveNewFeedback() {
                this.newFeedback.data.attaches = this.newFeedback.uploadData.map(function(o) {
                    return o.fileId;
                }).join(",");

                this.$http.post(__URL.feedback + '/pc/feedback/feedback/save', this.newFeedback.data).then(
                    (res) => {
                        if(res.data.success){
                            this.showList = true;
                            this.newFeedback.show = false;
                            this.newFeedback.data.title = '';
                            this.newFeedback.data.content = '';
                            this.newFeedback.data.attaches = '';
                            this.newFeedback.uploadData = [];
                            this.loadFeedbackList();
                        }else{
                            alert(res.data.errMsg)
                        }
                    }
                );
            },
            
            /**
             * 显示新增反馈模态框
             */
            showAddFeedback() {
                this.newFeedback.show = true;
                this.showList = false;
            },

            /**
             * 取消新增反馈
             */
            cancelAddFeedback() {
                this.newFeedback.show = false;
                this.showList = true;
            },

            /**
             * 显示新增公告回复输入框
             */
            showAddBulletinReply(el, evt, reply) {
                evt.target.style.display = 'none'   // 显示评论则隐藏「回复」按钮
                let targetNode = evt.target.parentNode.parentNode.parentNode;
                let newReply = el.querySelector("#add-blt-reply");
                targetNode.insertBefore(newReply, null);
                newReply.style.display = "flex";

                let params = this.bltDetail.newReply;
                params.bulletinCode = reply.bulletinCode;
                params.parentCode = reply.level == 1 ? reply.code : reply.parentCode;
                params.toUserCode = reply.fromUserCode;
                params.toUserName = reply.fromUserName;
                params.level = reply.level;
            },

            /**
             * 取消新增公告回复
             */
            cancelAddBulletinReply(evt) {
                evt.target.parentNode.parentNode.querySelector('.act-reply').style.display = 'block'   // 取消评论则显示「回复」按钮
                let targetNode = evt.target.parentNode;
                targetNode.style.display = "none";
            },

            /**
             * 显示新增反馈回复输入框
             */
            showAddFeedbackReply(el, evt, reply) {
                let targetNode = evt.target.parentNode.parentNode.parentNode;
                let newReply = el.querySelector("#add-fdbk-reply");
                targetNode.insertBefore(newReply, null);
                newReply.style.display = "flex";

                let params = this.fdbkDetail.newReply;
                params.feedbackCode = reply.feedbackCode;
                params.parentCode = reply.level == 1 ? reply.code : reply.parentCode;
                params.toUserCode = reply.fromUserCode;
                params.toUserName = reply.fromUserName;
                params.level = reply.level;
            },

            /**
             * 取消新增反馈回复
             */
            cancelAddFeedbackReply(evt) {
                let targetNode = evt.target.parentNode;
                targetNode.style.display = "none";
            },

            /**
             * 获取用户头像URL
             * @param reply
             * @returns {string}
             */
            getUserAvatar(reply) {
                var src = "";
                if (reply.fromUserCode == this.user.userCode && this.user.avatarUrl) {
                    src = this.user.avatarUrl;
                } else if (reply.avatar) {
                    src = reply.avatar;
                } else {
                    src = this.defaultUserLogo;
                }
                return src;
            }
        }
    }
</script>
<template>
    <div class="container">
        <div class="content">
            <!-- 公告与反馈列表页 -->
            <div class="ct-list" v-show="showList">
                <div class="ct-header">
                    <div class="header-left">
                        <i class="icon icon-title"></i><span class="text">帮助与反馈</span>
                    </div>
                    <div class="header-right">
                        <button @click="showAddFeedback();" class="btn-lg-imp" style="width: 130px"><i class="icon-add"></i>给我们提建议</button>
                        <!--<a href="javascript:;" class="btn-xl-imp" @click="showAddFeedback();">
                            <i class="icon-add"></i>&nbsp;新增</a>-->
                    </div>
                </div>

                <!-- 公告与反馈列表 -->
                <div class="blt-fdbk-list">
                    <div class="blt-list">
                        <ul>
                            <li v-for="(index,item) in bulletinList">
                                <div class="title-and-time">
                                    <div class="item-title">
                                        <span><a href="javascript:;" @click="showBulletinDetail(item)" v-text="item.title"></a></span>
                                        <span class="top-forever" v-if="item.status==3">置顶</span>
                                    </div>
                                </div>
                                <div class="item-comment">
                                    <div class="item-time"><span v-text="item.publishTime"></span></div>
                                    <div>
                                        <img :src="item.newReplyCount == 0 ? comment : newComment"/>
                                        <span><span v-text="item.replyCount"></span>条评论</span>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <!-- 分隔符 -->
                    <div class="delimiter" v-if="bulletinList.length > 0 && feedbackList.length > 0"></div>
                    <div class="fdbk-list">
                        <ul>
                            <li v-for="(index,item) in feedbackList">
                                <div class="title-and-time">
                                    <span class="item-title"><a href="javascript:;" @click="showFeedbackDetail(item)" v-text="item.title"></a></span>
                                </div>
                                <div class="item-comment">
                                    <div class="item-time"><span v-text="item.createTime"></span></div>
                                    <div>
                                        <img :src="item.newReplyCount == 0 ? comment : newComment"/>
                                        <span><span v-text="item.replyCount"></span>条评论</span>
                                        <!--<span>1分钟前</span>-->
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- 公告详情页 -->
            <inner-modal :config='bltDetail' @cb="closeModal">
                <div class="in-content">
                    <div class="header-title">
                        <h3 v-text="bltDetail.data.title"></h3>
                        <div class="header-info">
                            <div class="user-time">
                                <span>{{bltDetail.data.createUser}}</span>，
                                <span>{{bltDetail.data.publishTime}}</span>，
                                <span class="reply-count">
                                    <img :src="comment"/>
                                    <span v-if="bltDetail.data.replyCount == 0">0</span>
                                    <span v-if="bltDetail.data.replyCount > 0">{{bltDetail.data.replyCount}}</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="body-text">
                        <pre v-text="bltDetail.data.content" class="pre"></pre>
                    </div>

                    <div class="attach-list">
                        <ul>
                            <li v-for="(index,pic) in bltDetail.data.attachList">
                                <a :href="pic.url" target="_blank"><img :src="pic.url"/></a>
                            </li>
                        </ul>
                    </div>

                    <ul class="comment-list">
                        <li v-for="(index,reply) in bltDetail.data.replyList">
                            <div class="comment-area">
                                <div class="user-avatar">
                                    <img :src="getUserAvatar(reply);"/>
                                </div>
                                <div class="comment">
                                    <div>
                                        <span class="cmt-user" v-text="reply.fromUserCode == user.userCode ? '我' : reply.fromUserName"></span>
                                        <span class="cmt-content">：{{reply.content}}</span>
                                    </div>
                                    <div class="cmt-op">
                                        <div class="cmt-time">
                                            <span v-text="reply.replyTime"></span>
                                            <a class="act-reply" v-if="reply.children.length == 0"
                                                  @click="showAddBulletinReply($el, $event, reply);">
                                                回复
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <ul class="reply-list" v-if="reply.children.length > 0">
                                <li v-for="(idx,child) in reply.children">
                                    <div class="comment-area">
                                        <div class="user-avatar">
                                            <img :src="getUserAvatar(child);"/>
                                        </div>
                                        <div class="comment">
                                            <div>
                                                <span class="cmt-user" v-text="child.fromUserCode == user.userCode ? '我' : child.fromUserName"></span>
                                                <span class="cmt-content">：{{child.content}}</span>
                                            </div>
                                            <div class="cmt-op">
                                                <div class="cmt-time">
                                                    <span v-text="child.replyTime"></span>
                                                    <a class="act-reply" v-if="(idx + 1) == reply.children.length"
                                                          @click="showAddBulletinReply($el, $event, child);">
                                                        回复
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </li>
                    </ul>

                    <div id="add-blt-reply" class="comment-write" style="display: none;">
                        <input placeholder="添加回复" v-model="bltDetail.newReply.content"/>
                        <button class="btn-lg-imp" @click="addBulletinReply($el, $event);">回复</button>
                        <button class="btn-lg-def" @click="cancelAddBulletinReply($event);">取消</button>
                    </div>
                </div>

                <div id="add-blt-comment" class="comment-write fixed-bottom">
                    <input placeholder="添加评论" v-model="bltDetail.newComment.content"/>
                    <button class="btn-lg-imp" @click="addBulletinComment($el, bltDetail)">发表</button>
                </div>
            </inner-modal>

            <!-- 反馈详情页 -->
            <inner-modal :config='fdbkDetail' @cb="closeModal">
                <div class="in-content">
                    <div class="header-title">
                        <h3 v-text="fdbkDetail.data.title"></h3>
                        <div class="header-info">
                            <div class="user-time">
                                <span>{{fdbkDetail.data.userName}}</span>，
                                <span>{{fdbkDetail.data.createTime}}</span>，
                                <span class="reply-count">
                                    <img :src="comment"/>
                                    <span v-if="fdbkDetail.data.replyCount == 0">0</span>
                                    <span v-if="fdbkDetail.data.replyCount > 0">{{fdbkDetail.data.replyCount}}</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="body-text">
                        <pre v-text="fdbkDetail.data.content" class="pre"></pre>
                    </div>

                    <div class="attach-list">
                        <ul>
                            <li v-for="(index,pic) in fdbkDetail.data.attachList">
                                <a :href="pic.url" target="_blank"><img :src="pic.url"/></a>
                            </li>
                        </ul>
                    </div>

                    <ul class="comment-list">
                        <li v-for="(index,reply) in fdbkDetail.data.replyList">
                            <div class="comment-area">
                                <div class="user-avatar">
                                    <img :src="getUserAvatar(reply);"/>
                                </div>
                                <div class="comment">
                                    <div>
                                        <span class="cmt-user" v-text="reply.fromUserCode == user.userCode ? '我' : reply.fromUserName"></span>
                                        <span class="cmt-content">：{{reply.content}}</span>
                                    </div>
                                    <div class="cmt-op">
                                        <div class="cmt-time">
                                            <span v-text="reply.replyTime"></span>
                                            <a class="act-reply" v-if="reply.children.length == 0"
                                                  @click="showAddFeedbackReply($el, $event, reply);">
                                                回复
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <ul class="reply-list" v-if="reply.children.length > 0">
                                <li v-for="(idx,child) in reply.children">
                                    <div class="comment-area">
                                        <div class="user-avatar">
                                            <img :src="getUserAvatar(child);"/>
                                        </div>
                                        <div class="comment">
                                            <div>
                                                <span class="cmt-user" v-text="child.fromUserCode == user.userCode ? '我' : child.fromUserName"></span>
                                                <span class="cmt-content">：{{child.content}}</span>
                                            </div>
                                            <div class="cmt-op">
                                                <div class="cmt-time">
                                                    <span v-text="child.replyTime"></span>
                                                    <a class="act-reply" v-if="(idx + 1) == reply.children.length"
                                                          @click="showAddFeedbackReply($el, $event, child);">
                                                        回复
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </li>
                    </ul>

                    <div id="add-fdbk-reply" class="comment-write" style="display: none;">
                        <input placeholder="添加回复" v-model="fdbkDetail.newReply.content"/>
                        <button class="btn-lg-imp" @click="addFeedbackReply($el, $event);">回复</button>
                        <button class="btn-lg-def" @click="cancelAddFeedbackReply($event);">取消</button>
                    </div>
                </div>

                <div id="add-fdbk-comment" class="comment-write fixed-bottom">
                    <input placeholder="添加评论" v-model="fdbkDetail.newComment.content"/>
                    <button class="btn-lg-imp" @click="addFeedbackComment($el, fdbkDetail)">发表</button>
                </div>
            </inner-modal>

            <!-- 新增反馈页 -->
            <inner-modal :config="newFeedback" @cb="closeModal">
                <div class="add-area">
                    <div class="title-area">
                        <span>*</span>
                        <label>标题:</label>
                        <input type="text" placeholder="请输入标题" v-model="newFeedback.data.title">
                    </div>
                    <div class="ct-area">
                        <textarea placeholder="请输入您的意见或建议" v-model="newFeedback.data.content"></textarea>
                    </div>
                    <div class="img-area">
                        <label>图片:</label>
                        <upfile-group :config ='uCfg' :edit="isEdit" :data="newFeedback.uploadData"></upfile-group>
                    </div>
                    <div class="button-area">
                        <button class="btn-xl-def" @click="cancelAddFeedback();">取消</button>
                        <ajax-button class="btn-xl-imp" @click="saveNewFeedback();">提交</ajax-button>
                    </div>
                </div>
            </inner-modal>
        </div>
    </div>
</template>


<style lang="less" scoped>
    @import '../../../../../public/css/variable.less';

    .container {
	    .content {
	        overflow: auto;
	    }
    }

    .modal-inner {
        padding: 20px;
    }

    .ct-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border: 1px solid @border-color;
        border-bottom: 1px solid #e1e6e9;
        padding: 6px 20px;
        background-color: #fff;

        .header-left {
            display: flex;
            font-weight: 600;
            font-size: 16px;
        }

        .icon {
            margin-right: 12px;
        }

        .text {
            font-weight: 400;
            line-height: 14px;
        }
    }
    .f-color {
        color: @gray;
    }

    .blt-fdbk-list {
        display: flex;
        flex-direction: column;
        padding: 0 20px;

        .delimiter {
            border-top: 8px solid #f5f5f5;
        }

        ul {
            list-style: none;
            width: 100%;

            li {
                border-bottom: 1px solid #f5f5f5;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                list-style: none;
                padding: 12px 0;

                .title-and-time {
                    display: flex;
                    justify-content: space-between;

                    .item-time {
                        color: #757575;
                        font-size: 0.75em;
                    }
                }

                .item-comment {
                    display: flex;
                    align-items: center;
                    margin-top: 12px;
                    div {
                        display: flex;
                        align-items: center;
                        padding-right: 8px;

                        &:nth-of-type(n+2) {
                            position: relative;
                            padding-left: 8px;

                            &::after {
                                content: "";
                                position: absolute;
                                top: calc(~"50% - 8px / 2");
                                left: 0;
                                width: 1px;
                                height: 8px;
                                background-color: #D8D8D8;
                        }
                    }

                    }
                    img {
                        width: 15px;
                        height: 14px;
                        margin-right: 4px;
                    }
                    span {
                        color: #757575;
                        font-size: 0.85em;
                    }
                }
            }
        }
    }

    .blt-list {
        display: flex;
        width: 100%;
        flex-direction: column;

        .top-forever {
            display: inline-block;
            padding: 2px 2px;
            background-color: #FF8C2F;
            border-radius: @border-radius-base;
            color: #fff;
            font-size: 12px;
        }
    }


    .fdbk-list {
        display: flex;
        width: 100%;
        flex-direction: column;

        li:first-child {
            border-top: none;
        }
    }

    .add-area {
        padding: 20px;
        height: 80%;
        .title-area {
            border: 1px solid @border-color;
            border-bottom: none;
            height: 50px;
            display: flex;
            align-items: center;
            span {
                color: red;
                margin: 0 5px 0 10px;
            }
            label {
                margin-right: 5px;
            }
            input {
                height: 36px;
                width: 90%;
                padding-left: 10px;
                margin-bottom: 0px;
                border: none;
            }
        }
        .ct-area {
            height: 100%;

            textarea {
                width: 100%;
                height: 100%;
                line-height: 1.5;
                border: 1px solid #F2F3F3;;
            }
        }
        .img-area {
            display: flex;
            align-items: center;
            height: 70px;
            border: 1px solid @border-color;
            border-top: none;
            label {
                margin: 0 15px 0 22px;
            }
        }
        .button-area {
            display: flex;
            align-items: center;
            justify-content: center;

            margin-top: 20px;

            button {
                margin-right: 25px;
            }
        }
    }

    .in-content {
        margin: 20px 20px 0;

        .header-title {
            h3 {
                margin: 0 0 16px;
                padding: 0;
                font-size: 16px;
                font-weight: 600;
            }

            .header-info {
                justify-content: space-between;
                display: flex;
                color: @gray-sub;
                font-size: 0.9em;

                .user-time {
                    display: flex;
                    align-items: center;
                }

                .reply-count {
                    align-content: center;
                    align-items: center;
                    display: flex;

                    img {
                        width: 14px;
                        height: 14px;
                        margin-right: 2px;
                    }
                }
            }
        }

        .body-text {
            /*border: 1px dotted #9b9b9b;*/
            padding: 10px 0;
            border-radius: 3px;
            margin: 20px 0;
            font-size: 14px;
            p {
                line-height: 1.5;
                word-wrap: break-word;
            }
        }

        .attach-list {
            ul {
                list-style: none;
            }

            li {
                display: inline-block;
            }
            li + li {
                margin-left: 10px;
            }

            img {
                border: 1px solid #9b9b9b;
                max-height: 88px;
            }
            img:hover {
                border-color: #03A9F4;
            }
        }
    }

    /* 评论列表 */
    ul.comment-list {
        margin-top: 20px;
        list-style: none;

        > li:first-child {
            border-top: 1px solid @border-color;
        }

        > li {
            border-bottom: 1px solid @border-color;
        }

        li {
            list-style: none;
            display: flex;
            flex-direction: column;
            width: 100%;
            padding: 20px 0;

            .comment-area {
                display: flex;

                .user-avatar {
                    display: flex;
                    margin-right: 12px;
                    img {
                        height: 36px;
                        width: 36px;
                        border: 1px solid #dddddd;
                        border-radius: 50%;
                    }
                }

                .comment {
                    width: 100%;
                    flex-direction: column;
                    font-size: 14px;

                    .cmt-user {
                        color: #295c9d;
                    }

                    .cmt-op {
                        display: flex;
                        flex-direction: column;
                        color: @gray-sub;
                        margin-top: 8px;
                        font-size: 12px;
                        .cmt-time {
                            display: flex;
                            align-items: center;
                        }
                        .act-reply {
                            padding-left: 15px;
                        }
                    }
                }
            }
        }
    }
    ul.reply-list {
        margin-left: 48px;

        li {
            border: none;
            padding-bottom: 0;
        }
    }

    .comment-write {
        margin-top: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        &.fixed-bottom {
            position: fixed;
            bottom: 0;
            width: calc(~"100% - 212px");
            padding: 12px 40px 12px 20px;
            background-color: #f1f1f1;
        }

        button:nth-of-type(n+2) {
            margin-left: 12px;
        }

        input {
            height: 36px;
            width: 90%;
            padding: 0 0 0 6px;
            margin-right: 12px;
            border: 1px solid #e1e6e9;
            border-radius: 2px;
            font-size: 14px;
            outline: none;
        }

        input:focus {
            border-color: #03A9F4;
        }
    }

    .pre {
        font-family: 'Ping Fang SC,Microsoft YaHei', 'iconfont';
        line-height: 1.6;
        white-space: pre-wrap;
        word-wrap: break-word;
    }
</style>
