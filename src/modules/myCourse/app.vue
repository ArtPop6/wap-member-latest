<template>
  <div class="course-wrap">
    <DatePickSlider :currentType="currentType" @getDateInfo="getCurrentDay" :cancelAppoint="cancelAppoint"/>
    <div class="button-group">
      <div
        :id="courseIndex === index ? 'act' : ''"
        :key="index"
        @click="clickCourseType(index)"
        class="coach-button"
        v-for="(item, index) in courseTypeArray"
      >{{item.name}}
      </div>
    </div>
    <van-pull-refresh @refresh="onRefresh" v-model="isLoading">
      <div class="course-info__wrap" v-if="courseData.length > 0">
        <div :key="index" class="course-date" v-for="(item, index) in courseData">
          <div class="course-store">
            <div class="course-store__name">{{item.store_name}}</div>
            <!--            <div class="dec-bar"></div>-->
          </div>
          <div :key="indexs" class="course-date__class" v-for="(course, indexs) in item.items" @touchend="touchEnd($event, indexs, index)"
               @touchmove="touchMove($event, indexs, index)"
               @touchstart="touchStart($event, indexs, index)" @transitionend="transitionEnd($event, indexs, index)"
               @webkit-transition-end="transitionEnd($event, indexs, index)" :ref="`course-date_${index}`" :style="slider">
            <div class="course-content__left">
              <div class="course-seat">
                <img :src="course.coach_avatar" alt class="avatar"/>
                <div class="course-desc">
                  <div class="course-name">{{course.course_name}}</div>
                  <div class="course-place" v-if="currentType === 'GROUP'">位置: {{course.seat}}号位</div>
                  <div class="course-place" v-if="currentType === 'PERSONAL'">{{course.coach_name}}</div>
                </div>
              </div>
              <div class="course-time__title">
                <div class="course-time">{{course.begin_time + '-' + course.end_time }}</div>
                <div class="space-name" v-if="currentType === 'GROUP'">{{course.space_name}}</div>
                <div class="train-log" @click="goTrainingLog(course.id)" v-if="currentType === 'PERSONAL'">训练日志</div>
              </div>
              <div class="cancel-zhezhao" v-if="courseState(course.course_status, course.order_status) === '已取消'">
                已取消
              </div>
            </div>
            <!--            {{ course.course_status === '未上课' && course.order_status === '预约成功' ? '取消预约' : course.course_status ? course.course_status : '课程异常' }}-->
            <!-- 课程状态是未上课，订单状态是预约成功时才能取消预约 -->
            <div class="course-content__right" :class="course.course_status === '未上课' && course.order_status === '预约成功' ? '' : 'hasclass'" @click="cancelReserve(course.id, course.course_status, course.order_status)" ref="cancelbutton">
              <div class="horizen-text">
                {{ courseState(course.course_status, course.order_status) }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="no-data" v-if="courseData.length === 0">
        <div class="no-data__content">
          <img alt class="no-class-pic" src="./img/noClass.png"/>
          <div class="no-data__title" v-if="currentType === 'GROUP'">暂无团课</div>
          <div class="no-data__title" v-if="currentType === 'PERSONAL'">暂无私教课</div>
          <div @click="goCoach()" class="go-other__class" v-if="currentType === 'GROUP'">去我的私教看看</div>
          <div @click="goGroup()" class="go-other__class" v-if="currentType === 'PERSONAL'">去我的团课看看</div>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>
<script>
  import './style.stylus'
  import param from '@utils/url-param'
  import go from '@utils/goto'
  import DatePick from '../../components/date-pick/index'
  import ClassTab from '../../components/class-tab/index'
  import DatePickSlider from '../../components/date-pick-slider/index'
  import { Dialog } from 'vant'
  import toast from '../../components/toast'

  export default {
    components: {
      DatePick,
      ClassTab,
      DatePickSlider
    },
    data () {
      return {
        courseTypeArray: [
          { name: `团\xa0课`, type: 'group' },
          { name: `私\xa0教`, type: 'coach' }
        ],
        courseData: [],
        courseIndex: 0, // 索引值判断团课与私教课
        currentDate: '', // 当前日历组件选中的值
        currentType: param('type') || 'GROUP', // 当前选中的课程名
        isLoading: false, // 分页时的加载状态
        start: { x: 0, y: 0 },
        endx: 0,
        distan: { x: 0, y: 0 },
        animation: false,
        cancelAppoint: false,
        translateAll: 0,
        click: ''
      }
    },
    computed: {
      slider () {
        const style = {}
        this.distan.x = 0
        // 使点击类型按钮时，重置滑动位置
        if (this.click === 'personal') {
          style['transform'] = 'translateX(0px)'
          return style
        }
        if (this.click === 'group') {
          style['transform'] = 'translateX(1px)'
          return style
        }
        return style['transform'] = 'none'
      }
    },
    methods: {
      // 下拉刷新(无分页)
      onRefresh () {
        this.getMyCourse()
        this.isLoading = false
        toast('刷新成功')
      },
      courseState (courseStatus, orderStatus) {
        if (courseStatus === '未上课' && orderStatus === '预约成功') {
          return '取消预约'
        }
        if (courseStatus === '未上课' && orderStatus === '取消预约') {
          return '已取消'
        }
        if (courseStatus === '未上课' && !orderStatus) {
          return '课程异常'
        }
        return courseStatus ? courseStatus : '课程异常'
      },
      goTrainingLog (id) {
        go(`./trainingLog.html?course_user_id=${id}`)
      },
      goCoach () {
        this.currentType = 'PERSONAL'
        this.courseIndex = 1
        this.getMyCourse()
      },
      goGroup () {
        this.currentType = 'GROUP'
        this.courseIndex = 0
        this.getMyCourse()
      },
      getCurrentDay (day) {
        this.currentDate = day
        if (this.currentType === 'PERSONAL') {
          this.goCoach()
        } else if (this.currentType === 'GROUP') {
          this.goGroup()
        }
      },
      clickCourseType (index) {
        this.courseIndex = index
        // this.click = true
        if (index === 0) {
          this.currentType = 'GROUP'
          this.click = 'group'
          this.getMyCourse()
        } else if (index === 1) {
          this.currentType = 'PERSONAL'
          this.click = 'personal'
          this.translateAll = 0
          this.getMyCourse()
        }
        // const dom = this.$refs['courseDateAll']
        // console.log('选中的元素', dom)
      },
      getMyCourse () {
        const data = {
          date: this.currentDate,
          type: this.currentType
        }
        this.$http
          .get('./personal/courses', { params: data })
          .then(res => {
            this.courseData = res.data
          })
          .catch(err => {
            console.log(err)
          })
      },
      touchStart (e, indexs, index) {
        this.start.x = e.touches[0].pageX // 计算点击时的坐标
        const domName = `course-date_${index}`
        const dom = this.$refs[domName]
        dom[indexs].style['transform'] = 'translateX(' + this.distan.x + 'px)'
        dom[indexs].style['transition'] = this.animation ? 'transform .5s ease-out' : 'none'
      },
      touchMove (e, indexs, index) {
        this.animation = true
        this.distan.x = e.touches[0].pageX - this.start.x // 计算移动距离
        const _width = this.$refs.cancelbutton[0].clientWidth
        if (Math.abs(this.distan.x) > _width && this.distan.x < 0) {
          this.distan.x = -_width
        } else if (Math.abs(this.distan.x) > _width && this.distan.x > 0) {
          this.distan.x = _width
        }
        const domName = `course-date_${index}`
        const dom = this.$refs[domName]
        dom[indexs].style['transform'] = 'translateX(' + this.distan.x + 'px)'
        dom[indexs].style['transition'] = this.animation ? 'transform .5s ease-out' : 'none'
      },
      touchEnd (e, indexs, index) {
        if (this.distan.x > 0) {
          this.animation = false
          this.distan.x = 0
        }
        const domName = `course-date_${index}`
        const dom = this.$refs[domName]
        dom[indexs].style['transform'] = 'translateX(' + this.distan.x + 'px)'
        dom[indexs].style['transition'] = this.animation ? 'transform .5s ease-out' : 'none'
      },
      transitionEnd (e, indexs, index) {
        this.animation = false
        const domName = `course-date_${index}`
        const dom = this.$refs[domName]
        dom[indexs].style['transform'] = 'translateX(' + this.distan.x + 'px)'
        dom[indexs].style['transition'] = this.animation ? 'transform .5s ease-out' : 'none'
      },
      cancelReserve (id, course, order) {
        if (this.courseState(course, order) === '取消预约') {
          Dialog.confirm({
            message: '确认取消预约?'
          })
            .then(() => {
              // on confirm
              this.$http.put(`./course/cancel_reserve?id=${id}`).then(res => {
                this.cancelAppoint = !this.cancelAppoint
                this.getMyCourse()
                toast('取消预约成功')
              }).catch(err => {
                this.getMyCourse()
                console.log(err)
              })
            })
            .catch(() => {
              // on cancel
            })
          return
        }
        return
      }
    },
    created () {
    }
  }
</script>
