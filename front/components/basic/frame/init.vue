<script>
    /*
    * 该帐号的否完成了初始化
    * */
export default {
  methods : {
    getToInit() {
      this.$emit('cb');
    }
  }
}
</script>

<template lang="html">
  <header>
    <div class="logo-wrap" @click="goToUrl('ierp')">
        <span class="logo"></span>
        <span>我的经管</span>
    </div>
  </header>
  <section>
    <article class="title">
      <p>系统初始化设置</p>
    </article>
    <article class="content">
      <div class="content-title">
        <!--<p>尊敬的用户您好:</p>-->
        <i></i>
      </div>
      <div class="content-content">
        <p>尊敬的用户您好：欢迎使用我的经管，请您先完成系统初始化设置！</p>
      </div>
      <div class="content-step">
        <div class="step-first">
          <div class="icon-area">
            <span>1</span>
          </div>
          <div class="content-head">
            导入期初数据
          </div>
          <div class="content-area">
            将准备好的期初数据文档上传到系统内
          </div>
         <!-- <div class="bottom-area">
            <p>系统预置信息不可删除</p>
          </div>-->
          <div class="position-right">
          </div>
          <div class="postion-backgroud-right">
          </div>
        </div>
        <div class="step-sec">
          <div class="icon-area">
            <span>2</span>
          </div>
          <div class="content-head">
            员工授权处理
          </div>
          <div class="content-area">
            给人事档案中的员工分配岗位权限
          </div>
          <div class="position-right">
          </div>
          <div class="postion-backgroud-right border-color">
          </div>
        </div>
        <div class="step-third">
          <div class="icon-area">
            <span>3</span>
          </div>
          <div class="content-head">
             初始化完成
          </div>
          <div class="content-area">
            授权完成后系统将自动向所有员工发送开户短信通知
          </div>
          <div class="position-right">
          </div>
          <div class="postion-backgroud-right border-color">
          </div>
        </div>
      </div>
    </article>
    <article class="footer">
      <button type="button" name="button" class="btn-lg-imp addWidth" @click="getToInit">进入初始化设定</button>
    </article>
  </section>
</template>

<style lang="less" scoped>

@import '../../../public/css/reset.css';
@import '../../../public/css/variable.less';
@import '../../../public/css/common.less';

body {
  background-color: @gray-dark !important;
}

.btn-xl-imp {
  width: 120px;
}

.addWidth {
    width: 140px !important;
}

header {
  box-shadow: 0 0 5px #979797;
  background-color: @body-bg;

  div {
    display: flex;
    height: 62px;
    color: #008AF5;
    font-size: 22px;
    align-items: center;
    margin-left: 90px;
    .logo {
      background: url("../../../public/images/logo.png") center center;
      display: inline-block;
      width: 44px;
      height: 24px;
      margin-right: 12px;
      background-size: 100% 100%;
    }

  }
}

section {
  width: 1095px;
  height: 586px;
  box-shadow: 0 0 5px #979797;
  margin: auto;
  margin-top: 68px;
  border-radius: @border-radius-base;
  background-color: #fff;

  > article {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .title {
    height: 66px;
    border-bottom: 1px solid @border-color;
    font-size: 20px;
  }

  .content {
    width: 830px;
    height: 440px;
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: baseline;
    justify-content: flex-start;

    .content-title {
      margin-top: 20px;
      font-size: 12px;
      color: #757575;
    }

    .content-content {
      margin: 30px 0 50px;
      text-align: center;
      font-size: 14px;
      width: 100%;
    }

    .content-step {
      display: flex;

      > div {
          width: 228px;
          height: 200px;
          margin-right: 72px;
          border: 1px solid @gray-sub;
          border-radius: @border-radius-base;
          position: relative;
      }

      .icon-area {
        width: 30px;
        height: 30px;
        margin: 15px auto;
        span {
          width: 100%;
          display: flex;
          height: 100%;
          border: 1px solid;
          border-radius: 50%;
          /* vertical-align: middle; */
          align-items: center;
          justify-content: center;
        }
      }

      .content-head{
        display: flex;
        justify-content: center;
        margin-bottom: 30px;
      }
      .content-area {
        width: 188px;
        height: 66px;
        margin: auto;
        font-size: 14px;
        line-height: 1.5;
        text-indent: 2em;
      }

      .position-right {
        width: 0px;
        height: 0px;
        position: absolute;
        right: -1px;
        bottom: -1px;
        border: 20px solid #fff;
      }

      .postion-backgroud-right {
        right: -1px;
        bottom: -1px;
        position: absolute;
        border: 20px solid #CBE1ED;
        border-bottom-color: transparent;
        border-right-color: transparent;
        border-radius: 2px;
      }



      .step-first {
        background-color: #EBF7FD;
        border: 1px solid #CBE1ED;
        .icon-area span {
          color: #00ACFF;
        }
        .bottom-area {
          font-size: 12px;
          color: @gray-sub;
          margin-top: 30px;
          margin-left: 20px;
        }
      }

      .step-sec {
        background-color: #F2FAE3;
        border: 1px solid #D7E6BA;
        .icon-area span {
          color: #8CC14C;
        }
        .border-color {
          border: 20px solid #D7E6BA;
          border-bottom-color: transparent;
          border-right-color: transparent;
        }
      }

      .step-third {
        background-color: #FFF1F0;
        border: 1px solid #F0CCCA;
        .icon-area span {
          color: #F7534A;
        }
        .border-color {
          border: 20px solid #F0CCCA;
          border-bottom-color: transparent;
          border-right-color: transparent;
        }
      }

    }


  }

  .footer {

  }
}

</style>
