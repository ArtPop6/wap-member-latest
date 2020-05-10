<template>
  <div class="group-class">
    <div class="course">
      <ClassTab :tabIndex="tabIndex" @indexChange="indexChange"/>
    </div>
    <DatePick :storeId="storeId" :type="dateType" @seleDate="getSeleDate"/>
    <div class="filter">
      <div @click="showFilter" class="filter-stores">
        <div class="filter-icon"></div>
        <div class="filter-store">{{currentStoreName}}</div>
        <div class="filter-switch"></div>
      </div>
      <transition>
        <div class="city-store__content" id="storePick" v-show="showPlace">
          <div class="citys-content">
            <div
              :class="index === currentCity ? 'city-change' : ''"
              :key="index"
              @click="selectCity(index)"
              class="citys"
              v-for="(item, index) in citys"
            >
              <div class="city-store__store">{{item.city_name}}</div>
            </div>
            <!-- <div class="citys city-change">
              <div class="city-store__store">厦门市</div>
            </div>-->
          </div>
          <div class="stores-content">
            <div
              :class="index === currentStore ? 'store-change' : ''"
              :key="index"
              @click="selectStore(index)"
              class="stores"
              v-for="(item, index) in storeOfCity"
            >
              <div class="city-store__store">
                <div class="store-name">{{item.name}}</div>
                <div v-if="item.show_distant" class="store-distance">{{item.show_distant}}km</div>
              </div>
              <div class="city-store__place">{{item.address}}</div>
            </div>
          </div>
        </div>
      </transition>
      <div @click="showClassFilter" class="filter-class">
        <div class="filter-class__title">筛选</div>
        <div class="filter-class__icon"></div>
      </div>
      <transition>
        <div class="class-type__content" id="classPick" v-show="showClass">
          <div class="select-area">
            <div class="class-tag">
              <div class="class-tag__title">类型</div>
              <div class="class-tag__content">
                <div
                  :class="index === currentType ? 'tagChange' : ''"
                  :key="index"
                  @click="selectType(index)"
                  class="tag-name"
                  v-for="(item, index) in type"
                >{{item.name}}
                </div>
              </div>
            </div>
            <div class="class-type">
              <div class="class-type__title">标签</div>
              <div class="class-type__tag">
                <div
                  :class="index === currentTag ? 'typeChange' : ''"
                  :key="index"
                  @click="selectTag(index)"
                  class="class-type__name"
                  v-for="(item, index) in tags"
                >{{item}}
                </div>
              </div>
            </div>
          </div>
          <div class="class-button">
            <div @click="reset" class="class-button__reset">重置</div>
            <div @click="handleOk" class="class-button__select">确认</div>
          </div>
        </div>
      </transition>
    </div>
    <div @click.stop="hidePanel()" class="overlay">
      <div class="overlay-parent">
        <div class="course-content">
          <van-pull-refresh @refresh="onRefresh" success-text="刷新成功" v-model="refreshing">
            <van-list :finished="finished" @load="onLoad" finished-text="没有更多了" v-model="loading" :immediate-check="immediateCheck">
              <van-cell :key="index" v-for="(item, index) in courseList">
                <div class="class__left">
                  <img :src="item.coach_avatar" alt class="avatar"/>
                  <div @click="goDetail(index)" class="desc">
                    <div class="class-type__name">
                      <div class="class-type__title">{{item.course_name}}</div>
                      <img alt class="hot" src="./assets/file.png" v-if="item.hot"/>
                    </div>
                    <div class="class-type__price">{{'￥' + item.price}}</div>
                    <div class="class-type__num">{{item.book_count + '人/' + item.course_capacity + '人'}}</div>
                  </div>
                </div>
                <div class="button">
                  <div
                    :class="item.full ? 'full' : 'null'"
                    @click="goClassDetail(index)"
                    class="goAppoint"
                  >{{item.full ? '已满员' : '马上预约'}}
                  </div>
                  <div class="appoint-state">{{item.begin_time + '-' + item.end_time}}</div>
                </div>
              </van-cell>
            </van-list>
          </van-pull-refresh>
        </div>
        <div class="zhezhao" v-if="showPlace || showClass"></div>
        <!-- <div class="tab-bar">
          <Tabs :tabindex="tab" @tabindexs="goTab" />
        </div>-->
      </div>
      <!-- <div class="overlay-over" v-if="showOverlay"></div> -->
    </div>
    <div class="tab-bar">
      <Tabs :tabindex="tab" @tabindexs="goTab"/>
    </div>
  </div>
</template>
<script>
  import './style.stylus'
  import go from '@utils/goto'
  // import TMap, { Tmap } from './tencentMap'
  import ClassTab from '../../components/class-tab/index'
  import Tabs from '../../components/tab'
  import DatePick from '../../components/date-pick/index'
  import { Toast } from 'vant'
  import moment from 'moment'
  import param from '@utils/url-param'

  export default {
    components: {
      ClassTab,
      Tabs,
      DatePick
    },
    data () {
      return {
        moment,
        tab: 3,
        tabIndex: 0,
        showPlace: false,
        showClass: false,
        citys: [],
        immediateCheck: false,
        storeOfCity: [],
        currentCity: 0,
        currentStore: 0,
        currentTag: -1,
        currentType: -1,
        currentStoreName: '',
        tags: [],
        type: [],
        courseList: [],
        allItems: 0,
        total: null,
        page: 1,
        size: 10,
        loading: false,
        finished: false,
        refreshing: false,
        showOverlay: false,
        longitude: null,
        latitude: null,
        storeId: null,
        storeIdUrl: param('store_id'), // 从url上获取storeId,判断是否是从二维码扫码进来的
        dateType: 'BOOK',
        seleDate: '',
        categoryId: '',
        label: ''
      }
    },
    watch: {},
    methods: {
      wxJsApiinit () {
        const that = this
        const urls = './auth/config/jsapi' // 获取后台数据接口url
        const datas = { page_url: location.href.split('#')[0] }
        this.$http
          .get(urls, { params: datas })
          .then(res => {
            wx.config({
              debug: false,
              appId: res.data.app_id,
              timestamp: res.data.timestamp,
              nonceStr: res.data.nonce_str,
              signature: res.data.signature,
              jsApiList: ['getLocation']
            })
            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获取结果之后，config是一个客户端的异步操作，所以如果要在页面加载时就调用相关接口，
            // 则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中
            wx.ready(function () {
              that.getLocationBySdk()
              console.log('接口调用成功!23')
            })
            // 通过error接口处理失败验证，config信息验证失败会执行error函数，如签名过期导致验证失败
            wx.error(res => {
              that.getLocationBySdk()
              console.log('接口调用失败!21')
            })
          })
          .catch(err => {
            that.getLocationBySdk()
            console.log('支付接口调用失败', err)
          })
      },
      onLoad () {
        setTimeout(() => {
          if (this.refreshing) {
            this.courseList = []
            this.refreshing = false
          }
          this.getClassList()
        }, 100)
      },
      onRefresh () {
        // 清空列表数据
        // this.allItems = 0
        this.finished = false
        Toast('刷新成功')
        // 重新加载数据
        // 将 loading 设置为 true，表示处于加载状态
        this.loading = true
        // this.refreshing = false
        this.onLoad()
      },
      getCityStore () {
        var url = './stores'
        const data = {
          lat: this.latitude,
          lon: this.longitude
        }
        this.$http
          .get(url, { params: data })
          .then(res => {
            this.citys = res.data
            this.storeOfCity = this.citys[0].stores
            // 如果url中storeId参数存在
            if (this.storeIdUrl) {
              console.log(this.storeIdUrl)
              this.storeId = this.storeIdUrl
              for (let i = 0; i < this.storeOfCity.length; i++) {
                if (this.storeOfCity[i].id == this.storeIdUrl) {
                  this.currentStore = i
                  this.currentStoreName = this.storeOfCity[i].name
                  console.log('二维码中的storeId', this.currentStore, this.currentStoreName)
                }
              }
              console.log('二维码', this.currentStore, this.currentStoreName)
              this.loading = true
              this.finished = false
              this.getClassList()
              return
            }
            // 如果url中storeId参数不存在
            this.storeId = this.citys[0].stores[0].id
            this.currentStoreName = this.citys[0].stores[0].name
            this.loading = true
            this.finished = false
            this.getClassList()
          })
          .catch(err => {
            console.log(err)
          })
      },
      getClassList () {
        // if (this.refreshing) {
        //   this.courseList = []
        //   this.refreshing = false
        // }
        const _today = moment().format('YYYY-MM-DD')
        const data = {
          store_id: this.storeId,
          date: this.seleDate || _today,
          category_id: this.categoryId,
          label: this.label
        }
        var url = './group_exercise/list'
        // this.page++
        this.$http
          .get(url, { params: data })
          .then(res => {
            this.courseList = res.data
            // this.allItems = this.allItems + res.data.items.length
            // this.total = res.data.total
            this.loading = false
            // if (this.allItems >= this.total) {
            this.finished = true
            // }
          })
          .catch(err => {
            console.log(err)
          })
        // setTimeout(() => {
        // }, 1000)
      },
      getTypeTag () {
        this.$http
          .get('group_exercise/label')
          .then(res => {
            this.tags = res.data.label
            this.type = res.data.course_type
          })
          .then(err => {
            console.log(err)
          })
      },
      goTab (data) {
        if (data == 0) {
          go(`./homePage.html`)
        } else if (data == 2) {
          go(`./qrcode.html`)
        } else if (data == 4) {
          go(`./myCenter.html`)
        } else if (data == 1) {
          go(`./allCards.html`)
        } else {
        }
      },
      indexChange (indexChange) {
        if (indexChange === 1) {
          go('./course.html')
        }
      },
      showFilter () {
        this.showClass = false
        this.showPlace = !this.showPlace
        this.showOverlay = !this.showOverlay
      },
      showClassFilter () {
        this.showPlace = false
        this.showClass = !this.showClass
        this.showOverlay = !this.showOverlay
      },
      selectCity (index) {
        this.currentCity = index
        this.storeOfCity = this.citys[index].stores
      },
      selectStore (index) {
        this.currentStore = index
        this.currentStoreName = this.storeOfCity[index].name
        this.storeId = this.storeOfCity[index].id
        this.showPlace = false
        this.showOverlay = !this.showOverlay
        this.finished = false
        this.courseList = []
      },
      getSeleDate (date) {
        // this.refreshing = false
        this.courseList = []
        this.finished = false
        // this.allItems = 0
        this.seleDate = date
        // this.onRefresh()
        // this.getClassList()
      },
      selectTag (index) {
        this.currentTag = index
        this.label = this.tags[index]
      },
      selectType (index) {
        this.currentType = index
        this.categoryId = this.type[index].id
      },
      reset () {
        this.currentTag = -1
        this.currentType = -1
        this.label = null
        this.categoryId = null
      },
      handleOk () {
        this.showClass = false
        this.finished = false
        this.courseList = []
      },
      goClassDetail (index) {
        if (this.courseList[index].full === true) {
          return
        }
        go(`./courseDetails.html?timetable=${this.courseList[index].timetable_id}&date=${this.seleDate}`)
      },
      goDetail (index) {
        if (this.courseList[index].full === true) {
          go(`./courseDetails.html?condition=full&timetable=${this.courseList[index].timetable_id}&date=${this.seleDate}`)
          return
        }
        go(`./courseDetails.html?timetable=${this.courseList[index].timetable_id}&date=${this.seleDate}`)
      },
      hidePanel (event) {
        var sp = document.getElementById('storePick')
        var sr = document.getElementById('classPick')
        if (sp || sr) {
          // if (!sp.contains(event.target)) {
          this.showPlace = false
          this.showClass = false
          // }
        }
      },
      // 使用腾讯地图api时获取经纬度方法
      getCurLocation () {
        var options = { timeout: 9000 }
        var positionNum = 0
        var geolocation = new qq.maps.Geolocation('RUOBZ-FXLLX-H664K-7HZWO-W6TXE-CJB4W', 'ampmfit')
        geolocation.getLocation(showPosition, showErr, options)

        function showPosition (position) {
          // positionNum++
          // document.getElementById('demo').innerHTML += '序号：' + positionNum
          // document.getElementById('demo').appendChild(document.createElement('pre')).innerHTML = JSON.stringify(
          //   position,
          //   null,
          //   4
          // )
          // document.getElementById('pos-area').scrollTop = document.getElementById('pos-area').scrollHeight
          this.latitude = position.lat
          this.longitude = position.lng
        }

        function showErr () {
          positionNum++
          document.getElementById('demo').innerHTML += '序号：' + positionNum
          document.getElementById('demo').appendChild(document.createElement('p')).innerHTML = '定位失败！'
          document.getElementById('pos-area').scrollTop = document.getElementById('pos-area').scrollHeight
        }
      },
      getLocationBySdk () {
        const that = this
        wx.getLocation({
          type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
          success: function (res) {
            that.latitude = res.latitude // 纬度，浮点数，范围为90 ~ -90
            that.longitude = res.longitude // 经度，浮点数，范围为180 ~ -180。
            that.getCityStore()
          },
          fail: function () {
            that.getCityStore()
          }
        })
      }
    },
    created () {
      this.wxJsApiinit()
      this.getTypeTag()
      // this.storeOfCity = this.citys[0].stores
      // this.selectCity()
    }
  }
</script>
