<script>
    import sidebar from 'nc/frame/sidebar'
    import initpage from 'nc/frame/init'
    import loginEnt from 'nc/frame/loginEnt.vue'

    export default {
        components: {
            sidebar,initpage,loginEnt
        },
        data() {
          return {
              isShow : localStorage.getItem('init-show') == undefined ? false : true,
              isInit:true,
              isService:false,
              isEnt:true,
          }
        },
        ready(){
            this.isLoginEnt()
        },
        methods: {
          isLoginEnt(){
              this.$http.get(__URL.v2 + 'ent/login').then(
                  res => {
                      if(res.data.success) {
                          this.isEnt = res.data.data;
                          if(!this.isEnt){
                              this.isEnterpriseInit();
                          }
                      } else {
                          console.log(res.data.errMsg);
                      }
                  }
              )
          },
          changeState() {
            this.isShow = true;
            localStorage.setItem('init-show',true);
            window.location.href='#!/init/employeeInitBatchImport'
          },
          isEnterpriseInit() {
            this.$http.post(__URL.hr + 'enterpriseInitialized/check').then(
              res => {
                if(res.data.success) {
                  this.isInit = res.data.data.step == 0;
                } else {
                  console.log(res.data.errMsg);
                }
              }
            )
          }
        },
    }
</script>
<template>
    <login-ent v-if="!isEnt"></login-ent>
    <template v-else>
        <initpage @cb="changeState" v-if="!isInit && !isShow "></initpage>
        <template v-else>
            <sidebar></sidebar>
            <router-view></router-view>
        </template>
    </template>
</template>
