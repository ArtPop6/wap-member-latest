<template>
  <div class="card">
    <div class="card-title">
      <img
        src="@/assets/stores/jieshao.png"
        alt=""
      >
      <h2>本店介绍</h2>
    </div>
    <div class="introduce">
      {{introduce}}
    </div>
  </div>
</template>

<script>
export default {
  props: ['introduce'],
  data() {
    return {};
  }
};
</script>
<style lang="stylus" scoped>
.card {
  position: relative;
  width: 9.41rem;
  margin: 0.373rem 0 0.4rem 0.266rem;
}

.card-title img {
  width: 0.48rem;
  height: 0.48rem;
  vertical-align: -18%;
}

.card-title h2 {
  display: inline-block;
  margin-left: 0.24rem;
  font-family: PingFangSC-Medium;
  font-size: 0.4266rem;
  color: #151515;
  letter-spacing: -0.0096rem;
}

.introduce {
  font-family: PingFangSC-Regular;
  font-size: 0.4rem;
  color: #0F0F0F;
  letter-spacing: 0.02rem;
  line-height: 0.64rem;
  margin-top: 0.4rem;
}
</style>