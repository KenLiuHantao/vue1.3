<script>
    /*
    *  该登录帐号是否有授权帐套页面
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
       <div>
            <a class="logout" href="/ierp/logout">退出</a>
        </div>
  </header>
  <section>
      <p>您还没有授权帐套！</p>
  </section>
</template>

<style lang="less" scoped>
@import '../../../public/css/reset.css';
@import '../../../public/css/variable.less';
@import '../../../public/css/common.less';

body {
  background-color: @gray-dark !important;
}

header {
  box-shadow: 0 0 5px #979797;
  background-color: @body-bg;
    display: flex;
    height: 62px;
    align-items: center;
    justify-content: space-between;
    padding: 0 90px;
        .logo-wrap{
            display: flex;
            align-items: center;
            font-size: 22px;
        }

        .logo {
          background: url("../../../public/images/logo.png") center center;
          display: inline-block;
          width: 44px;
          height: 24px;
          margin-right: 12px;
          background-size: 100% 100%;
        }
       .logout{
          font-size: 16px;
          color: #212121;

          &:hover{
              color: #03a9f4;
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
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>
