<template>
  <div class="assort">
    <div class="assort-title">
      <img
        src="@/assets/stores/peitao.png"
        class="assort-title-img"
        alt=""
      >
      <h2>本店配套</h2>
    </div>
    <ul>
      <li
        :class="{'hidden': this.findTargetById(1)}">
        <img
          src="@/assets/stores/park.png"
          class="park-img"
          alt=""
        >
        <span>停车场</span>
      </li>
      <li
        :class="{'hidden': this.findTargetById(2)}">
        <img
          src="@/assets/stores/child.png"
          class="children-pavilion-img"
          alt=""
        >
        <span>儿童馆</span>
      </li>
      <li
        :class="{'hidden': this.findTargetById(3)}">
        <img
          src="@/assets/stores/rest.png"
          class="restaurant-img"
          alt=""
        >
        <span>餐厅</span>
      </li>
      <li
        :class="{'hidden': this.findTargetById(4)}">
        <img
          src="@/assets/stores/wifi.png"
          class="wifi-img"
          alt=""
        >
        <span>WIFI</span>
      </li>
    </ul>
    <div class="line"></div>
  </div>
</template>

<script>
export default {
  props: ['services'],
  data() {
    return {};
  },
  methods: {
    findTargetById(id) {
      this.services && this.services.some(item => {
        return item.id === id
      })
    }
  }
};
</script>
<style lang="stylus" scoped>
.hidden {
  background red
}

.assort {
  position: relative;
  width: 9.41rem;
  margin: 0.373rem 0 0.4rem 0.266rem;
}

.assort-title-img {
  width: 0.48rem;
  height: 0.48rem;
}

.park-img {
  width: 0.266rem;
  height: 0.36rem;
}

.restaurant-img {
  width: 0.301rem;
  height: 0.373rem;
}

.children-pavilion-img {
  width: 0.301rem;
  height: 0.373rem;
}

.assort-title img {
  vertical-align: -18%;
}

.wifi-img {
  width: 0.373rem;
  height: 0.264rem;
}

.assort-title h2 {
  display: inline-block;
  margin-left: 0.24rem;
  font-family: PingFangSC-Medium;
  font-size: 0.4266rem;
  color: #151515;
  letter-spacing: -0.0096rem;
}

.assort ul {
  display: flex;
  margin: 0;
  padding: 0;
}

.assort ul li {
  width: 2rem;
  height: 0.9rem;
  list-style: none;
  margin-top: 0.4rem;
  margin-right: 0.213rem;
  border: 0.02666rem solid #EBEBEB;
  border-radius: 0.106rem;
  text-align: center;
  line-height: 0.906rem;
}

.assort ul li img {
  vertical-align: -4%;
}

.assort ul li span {
  display: inline-block;
  margin-left: 0.133rem;
  font-family: PingFangSC-Regular;
  font-size: 0.373rem;
  color: #3D3D3D;
}

.line {
  height: 0.05rem;
  background-color: #F1F1F1;
  margin-top: 0.4rem;
  margin-bottom: 0.373rem;
}
</style>