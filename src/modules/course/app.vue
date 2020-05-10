<template>
  <div class="personal">
    <div class="class-tab">
      <ClassTab :tabIndex="tab" @indexChange="indexChange"/>
    </div>
    <div class="personal_top">
      <div class="personal_top-head">
        <!-- <img class="personal_top-headimg" src="../../assets/stores/place.png" /> -->
        <span class="personal_top-headspan"></span>
        <!-- <img class="personal_top-headlogo" src="../../assets/stores/ampmlogo.png" /> -->
        <div @click="screen" class="personal_top-screen">筛选</div>
      </div>
      <transition>
        <div class="personal_top-show" id="myPanel" v-show="isshow">
          <div class="personal_top-region">
            <div class="personal_top-area">门店：</div>
            <div class="personal_top-bottom">
              <div
                :class="index == selectname ? 'posnal-top_selectname' : ''"
                :key="index"
                @click="selectArea(index)"
                class="posnal-top_name"
                v-for="(store, index) in stores"
              >{{ store.name }}
              </div>
            </div>
          </div>
          <div class="personal_top-region">
            <div class="personal_top-area">类型：</div>
            <div class="personal_top-bottom">
              <div
                :class="index == selecttypes ? 'posnal-top_selectname' : ''"
                :key="index"
                @click="selectType(index)"
                class="posnal-top_name"
                v-for="(course, index) in courses"
              >{{ course }}
              </div>
            </div>
          </div>
          <div class="personal_top-footer">
            <div @click="reset" class="personal_top-noshow">重置</div>
            <div @click="confirm" class="personal_top-comfir">确定</div>
          </div>
        </div>
      </transition>
    </div>
    <div @click="hidePanel" class="personal_center">
      <div class="personal_center-search" v-show="!shows && coachss.length == 1">
        <img src="../../assets/stores/search.png"/>
        <p class="personal_center-hint">抱歉！暂时没有符合您条件的课程</p>
      </div>
      <div :key="index" v-for="(coach, index) in coachss">
        <div class="personal_center-shop" v-if="coach.coaches.length!=0">
          <div class="personal_center-shopname">
            <img class="personal_center-shopimg" src="../../assets/stores/shop_place.png"/>
            {{ coach.store.name }}
          </div>
          <div :key="index" class="personal_center-img" v-for="(realnames, index) in coach.coaches">
            <div class="personal_center-coach">
              <img :src="realnames.img"/>
            </div>
            <div class="personal_center-right">
              <span class="personal_center-rightspan">
                {{
                realnames.realname
                }}
              </span>
              <div class="personal_center-rightdetails">{{realnames.summary}}</div>
              <div @click="gotoDetail(realnames, coach)" class="personal_center-rightbutton">立即预约</div>
            </div>
          </div>
        </div>
      </div>

      <div class="over-lay" v-show="isshow">

      </div>
    </div>
    <div class="tab-bar">
      <Tab :tabindex="tabindex" @tabindexs="goTab"/>
    </div>
  </div>
</template>
<script>
  import './style.stylus'
  import go from '@utils/goto'
  import ClassTab from '../../components/class-tab/index'
  import Tab from '../../components/tab'

  export default {
    components: {
      ClassTab,
      Tab
    },
    data () {
      return {
        tabindex: 3,
        conditions: {},
        stores: [],
        courses: [],
        selectname: 0,
        selecttypes: 0,
        citys: [],
        selectcitys: 0,
        coachss: [],
        storeId: '',
        storeName: '全部',
        shows: '',
        isshow: false,
        tab: 1
      }
    },
    watch: {
      storeId (v) {
        this.lsitTwo()
      },
      storeName (v) {
        this.lsitTwo()
      }
    },
    methods: {
      goTab (data) {
        if (data === 2) {
          go(`./qrcode.html`)
        } else if (data === 4) {
          go(`./myCenter.html`)
        } else if (data === 1) {
          go(`./allCards.html`)
        } else if (data === 0) {
          go('./homePage.html')
        }
      },
      hidePanel (event) {
        var sp = document.getElementById('myPanel')
        if (sp) {
          if (!sp.contains(event.target)) {
            this.isshow = false
          }
        }
      },
      list () {
        this.$http.get('coaches/conditions').then(res => {
          this.conditions = res.data
          this.citys = res.data.city
          this.stores = res.data.stores
          this.courses = res.data.course_cate_name
        })
      },
      lsitTwo () {
        this.$nextTick(function () {
          const coach = {
            store_id: this.storeId,
            course_cate_name: this.storeName
          }
          this.$http.get('/coaches', { params: coach }).then(res => {
            this.coachss = res.data
            this.shows = this.coachss[0].coaches.length
          })
        })
      },
      screen () {
        this.isshow = !this.isshow
      },
      // 重置
      reset () {
        this.index = 0
        this.selectname = 0
        this.selecttypes = 0
        this.$nextTick(function () {
          const coach = {
            store_id: '',
            course_cate_name: '全部'
          }
          this.$http.get('/coaches', { params: coach }).then(res => {
            this.coachss = res.data
            this.shows = this.coachss[0].coaches.length
          })
        })
        this.storeId = ''
        this.storeName = '全部'
      },
      // 确定
      confirm () {
        const coach = {
          store_id: this.storeId,
          course_cate_name: this.storeName
        }
        this.$http.get('/coaches', { params: coach }).then(res => {
          this.coachss = res.data
          this.shows = this.coachss[0].coaches.length
          this.isshow = false
        })
      },
      // 地区
      selectCity (index) {
        this.selectcitys = index
      },
      // 门店
      selectArea (index) {
        this.selectname = index
        this.storeId = this.stores[index].id
      },
      // 类型
      selectType (index) {
        this.selecttypes = index
        this.storeName = this.courses[this.selecttypes]
      },
      gotoDetail (items, itemstwo) {
        go(`./coachDetails.html?id=${items.id}&storeId=${itemstwo.store.id}`)
      },
      indexChange (indexChange) {
        if (indexChange === 0) {
          go('./groupClass.html')
          // return
        }
        // if (indexChange === 1) {
        //   go('./groupClass.html')
        // }
      }
    },
    created () {
      this.list()
      this.lsitTwo()
    }
  }
</script>
<style lang="stylus">


  // .v-enter, .v-leave-to


  //   opacity 0


  //   transform translateY(-88px)


  // .v-enter-active, .v-leave-active


  //   transition all 0.4s ease


  // .personal


  //   display flex


  //   flex-direction column


  //   width 750px


  //   height 100%


  //   // margin 0 auto


  //   background #fafafc


  //   .personal_top


  //     width 750px


  //     height 88px


  //     background-color #FCDB00


  //     overflow-x hidden


  //     .personal_top-head


  //       display flex


  //       align-items center


  //       position fixed


  //       z-index 2


  //       height 88px


  //       width 750px


  //       background #fcdb00


  //       .personal_top-headimg


  //         padding-left 27px


  //         width 64px


  //         height 40px


  //       .personal_top-headspan


  //         display block


  //         padding-left 10px


  //         font-size 28px


  //         font-weight 500


  //         margin-top 4px


  //         color rgba(43, 44, 49, 1)


  //       .personal_top-headlogo


  //         width 130px


  //         height 60px


  //         margin-left 190px


  //       .personal_top-screen


  //         width 124px


  //         height 44px


  //         position absolute


  //         font-size 28px


  //         font-weight 500


  //         margin-top 4px


  //         right 30px


  //         background url('../../assets/stores/sousuo.png') center right no-repeat


  // .personal_top-show


  //   width 750px


  //   height auto


  //   position fixed


  //   z-index 2


  //   // top 88px


  //   top 220px


  //   background #fcdb00


  //   .personal_top-region


  //     display flex


  //     flex-direction column


  //     height auto


  //     width 750px


  //     .personal_top-area


  //       margin-left 32px


  //       margin-top 20px


  //       width 100px


  //       height 37px


  //       font-size 26px


  //       font-family PingFangSC-Medium, PingFang SC


  //       font-weight 500


  //       color rgba(0, 0, 0, 1)


  //       line-height 37px


  //     .personal_top-bottom


  //       display flex


  //       flex-wrap wrap


  //       width 750px


  //       margin-left 18px


  //       font-size 0


  //       .posnal-top_areaname


  //         width 120px


  //         height 48px


  //         color #FFFFFF


  //       .posnal-top_name


  //         height 48px


  //         color #FFFFFF


  //         width auto


  //         height 48px


  //         font-family PingFangSC-Regular, PingFang SC


  //         font-weight 400


  //         text-align center


  //         font-size 28px


  //         border-radius 8px


  //         margin 10px 0 10px 20px


  //         padding 14px


  //         line-height 22px


  //         border none


  //         background #E6C805


  //       .posnal-top_selectname


  //         background-color #2b2c31


  //         color #ffffff


  //   .personal_top-footer


  //     display flex


  //     width 750px


  //     height 80px


  //     margin-top 10px


  //     .personal_top-noshow


  //       width 375px


  //       height 88px


  //       text-align center


  //       font-size 28px


  //       line-height 88px


  //       background #e6c805


  //       color #fff


  //       font-weight 500


  //     .personal_top-comfir


  //       width 375px


  //       height 88px


  //       text-align center


  //       font-size 28px


  //       line-height 88px


  //       font-weight 500


  //       background #2B2C31


  //       color #fff


  // .personal_center


  //   // position absolute


  //   display flex


  //   align-content center


  //   flex-direction column


  //   width 750px


  //   // height 100%


  //   flex 1


  //   top 88px


  //   background #FAFAFC


  //   .personal_center-search


  //     display flex


  //     flex-direction column


  //     justify-content center


  //     align-items center


  //     height 100%


  //     .personal_center-hint


  //       margin-top 20px


  //       color #c0c0c0


  //   .personal_center-shop


  //     display flex


  //     flex-direction column


  //     width 710px


  //     margin 20px


  //     height auto


  //     background #FFFFFF


  //     box-shadow 0px 0px 6px 6px rgba(229, 229, 229, 1)


  //     .personal_center-shopname


  //       font-weight bold


  //       padding 14px


  //       font-size 32px


  //       border-bottom 1px solid #E5E5E5


  //       background #FFFFFF


  //       color #2B2C31


  //       .personal_center-shopimg


  //         width 34px


  //         height 40px


  //     .personal_center-img


  //       display flex


  //       width 710px


  //       height 360px


  //       border-bottom 1px solid #E5E5E5


  //       .personal_center-coach


  //         padding 29px 20px


  //         width 320px


  //         height 360px


  //         margin-bottom 10px


  //         img


  //           width 276px


  //           height 302px


  //       .personal_center-right


  //         position relative


  //         display flex


  //         flex-direction column


  //         padding 29px 20px


  //         width 390px


  //         height 360px


  //         .personal_center-rightspan


  //           font-size 36px


  //           font-weight bold


  //         .personal_center-rightdetails


  //           width 340px


  //           color #777A88


  //           word-break break-all


  //           word-wrap break-word


  //           font-size 24px


  //           overflow hidden


  //           text-overflow ellipsis


  //           display -webkit-box


  //           -webkit-box-orient vertical


  //           -webkit-line-clamp 4


  //           line-height 40px


  //           height 156px


  //         .personal_center-rightbutton


  //           position absolute


  //           width 256px


  //           height 60px


  //           font-size 24px


  //           text-align center


  //           background #FCDB00


  //           left 64px


  //           bottom 30px


  //           line-height 60px


  //           border-radius 10px


</style>
