<template>
  <div class="card">
        <div class="card-title">
              <img src="@/assets/stores/peitao.png" alt="">
              <h2>本店卡片</h2>
        </div>
  </div>
</template>

<script>
export default {
     data() {
      return {
      }
    },
};
</script>
<style lang="stylus" scoped>
.card{
    position: relative;
    width: 9.41rem;
    margin: 0.373rem 0 0.4rem 0.266rem;
}
.card-title img{
    width: 0.48rem
    height: 0.48rem
    vertical-align: -18%;
}
.card-title h2{
    display: inline-block;
    margin-left: 0.24rem;
    font-family: PingFangSC-Medium;
    font-size: 0.4266rem;
    color: #151515;
    letter-spacing: -0.0096rem;
}
.card-title img.next{
   width: 0.213rem
   height: 0.373rem 
   position: absolute;
   right:0;
   top:0.14rem;
} 
</style>