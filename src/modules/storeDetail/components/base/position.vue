<template>
  <div class="position">
    <div class="box">
      <div class="open">
        <p>24小时营业</p>
      </div>
      <h2>{{detail.name}}</h2>
    </div>
    <div class="address">
      <img
        src="@/assets/stores/dingwei.png"
        alt=""
      >
      <span>{{detail.address}}</span>
    </div>
    <div class="navigation">
      <img
        src="@/assets/stores/daohang.png"
        alt=""
      >
      <span>导航</span>
    </div>
    <div class="line"></div>
  </div>
</template>

<script>
export default {
  props: ["detail"],
  data() {
    return {};
  }
};
</script>
<style lang="stylus" scoped>
.position {
  width: 680px;
  margin: 20px auto;
  position: relative;
}

.box .open {
  width: 2rem;
  height: 0.64rem;
  background-image: linear-gradient(-138deg, #7FC8FD 0%, #0396FF 100%);
  border-radius: 0.106rem;
  font-family: DINAlternate-Bold;
  font-size: 0.32rem;
  color: #FFFFFF;
  letter-spacing: -0.0053rem;
  text-align: center;
  display: inline-block;
  line-height: 0.64rem;

  p {
    margin: 0;
  }
}

.box h2 {
  display: inline-block;
  font-family: PingFangSC-Medium;
  font-size: 0.48rem;
  color: #0F0F0F;
  letter-spacing: -0.0077rem;
  margin-left: 0.32rem;
}

.address {
  margin-top: 0.346rem;
}

.address img {
  width: 0.312rem;
  height: 0.373rem;
  vertical-align: -10%;
}

.address span {
  font-family: PingFangSC-Regular;
  font-size: 0.346rem;
  color: #3D3D3D;
  letter-spacing: -0.0077rem;
  display: inline-block;
  margin-left: 0.168rem;
}

.navigation {
  width: 2.026rem;
  height: 0.987rem;
  background: #FFFFFF;
  border: 0.0266rem solid #F3F3F3;
  border-radius: 0.573rem;
  text-align: center;
  line-height: 0.9rem;
  position: absolute;
  left: 7.36rem;
  top: 0.266rem;
  display: none;
}

.navigation span {
  font-family: PingFangSC-Regular;
  font-size: 0.373rem;
  color: #0F0F0F;
  letter-spacing: -0.0069rem;
  display: inline-block;
  margin-left: 0.173rem;
}

.navigation img {
  width: 0.333rem;
  height: 0.333rem;
}

.line {
  height: 0.05rem;
  background-color: #F1F1F1;
  margin-top: 0.4rem;
  margin-bottom: 0.373rem;
}
</style>