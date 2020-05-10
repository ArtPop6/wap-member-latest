<template>
  <div class="app">
    <swiper :imgs="detail.gym_imgs"></swiper>
    <position :detail="detail"></position>
    <cards></cards>
    <assort :services="detail.gym_services"></assort>
    <introduce :introduce="detail.description"></introduce>
  </div>
</template>

<script>
import "./style.stylus";
import param from "@utils/url-param";
import toast from "../../components/toast";
import swiper from "./components/base/swiper";
import position from "./components/base/position";
import cards from "./components/base/cards";
import assort from "./components/base/assort";
import introduce from "./components/base/introduce";

export default {
  components: {
    toast,
    swiper,
    position,
    cards,
    assort,
    introduce
  },
  data: () => ({
    id: param("id") || null,
    detail: {}
  }),
  methods: {
    getDetail() {
      return this.$http.get(`/stores/${this.id}`).then(
        res => {
          this.detail = res.data;
        },
        () => {
          alert("请求失败");
        }
      );
    }
  },
  watch: {},
  mounted() {
    this.getDetail()
  }
};
</script>
