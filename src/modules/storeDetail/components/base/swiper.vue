<template>
  <div class="swiper">
    <swiper :options="swiperOption" ref="mySwiper">
    <!-- slides -->
    <swiper-slide v-for="item in imgs" :key="item.id">
        <img :src="item.uri" alt="">
    </swiper-slide>
      <!-- Optional controls -->
    <div class="swiper-pagination"  slot="pagination"></div>
  </swiper>
  </div>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
    props: ['imgs'],
    components: {
      swiper,
      swiperSlide
    },
     data() {
      return {
        swiperOption: {
          autoplay:{
             delay:2000,
             stopOnLastSlide:false,
             disableOnInteraction:false,
           },
           loop: true,
           initialSlide:0,
           observe:true,
           observeParents:true,
           grabCursor:true,
           speed:500,
           pagination:{
            el:".swiper-pagination"
           }
        }
      }
    },
};
</script>
<style lang="stylus" scoped>
.swiper-slide {
   width: 100%;
   height: 4.69rem;
 }
.swiper-slide img{
   width: 100%;
   height: 100%;
 } 
.swiper >>> .swiper-pagination-bullet{
  width: 0.37rem;
  height: 0.106rem;
  background: #FFFFFF;
  border-radius: 0.08rem
  opacity: 1;
}
.swiper >>> .swiper-pagination-bullet.swiper-pagination-bullet-active{
  background-image: linear-gradient(-180deg, #FFDE00 0%, #FFDE00 100%);
  border-radius: 0.08rem
}
  
</style>