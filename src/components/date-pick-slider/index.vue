<template>
  <div class="slider-wrap">
    <div class="current-date__title">
      <div class="time-desc">
        <div class="current-date">{{currentDate}}</div>
        <div class="time-right">
          <div class="current-week">{{'星期' + currentWeekTitle}}</div>
          <div class="current-month-year">{{currentMonth + '.' + currentYear}}</div>
        </div>
      </div>
      <img alt class="decorate-pic" src="./img/group.png" v-show="currentType === 'GROUP'"/>
      <img alt class="decorate-pic__two" src="./img/coach.png" v-show="currentType === 'PERSONAL'"/>
    </div>
    <div
      :style="getTransform"
      @touchend="touchEnd"
      @touchmove="touchMove"
      @touchstart="touchStart"
      @transitionend="transitionEnd"
      @webkit-transition-end="transitionEnd"
      class="date-pick__wrap"
      ref="sliders"
    >
      <div :key="index" class="date-pick__slider" v-for="(item, index) in dates">
        <div
          :key="index2"
          @click="clickDate(index2)"
          class="date-pick__threeweeks"
          v-for="(week, index2) in getCurrentWeekDates(item.date)"
        >
          <div :class="currentIndex === index2 ? 'today-week' : ''" class="week-day">{{chineseWeek(week.week)}}</div>
          <div
            :class="currentIndex === index2 ? 'today-date' : ''"
            class="date__slider"
          >{{week.isToday ? '今' : week.date.substring(8)}}
          </div>
          <div
            :class="currentIndex === index2 ? 'dot-today' : ''"
            class="default-dot"
            v-if="hasCourseDate.includes(getCurrentWeekDates(item.date)[index2].date)"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import moment from 'moment'
  import './slider.styl'
  import param from '@utils/url-param'

  export default {
    props: ['storeId', 'type', 'currentType'],
    computed: {
      chineseWeek () {
        return week => {
          if (week === 1) {
            return '一'
          }
          if (week === 2) {
            return '二'
          }
          if (week === 3) {
            return '三'
          }
          if (week === 4) {
            return '四'
          }
          if (week === 5) {
            return '五'
          }
          if (week === 6) {
            return '六'
          }
          if (week === 7) {
            return '日'
          }
        }
      },
      getTransform () {
        this.endx = -this.actIndex * this.sliderWidth + this.distan.x // 初始化时这三周的长盒子默认向左移动一周距离
        // this.endx = 1500;
        const style = {}
        style['transform'] = 'translateX(' + this.endx + 'px)'
        style['transition'] = this.isAnimation ? 'transform .5s ease-out' : 'none'
        return style
      },
      currentYear () {
        return moment(this.currentDay).format('YYYY')
      },
      currentMonth () {
        return moment(this.currentDay).format('MM')
      },
      currentDate () {
        return moment(this.currentDay).format('DD')
      },
      currentWeekTitle () {
        const _week = Number(moment(this.currentDay).format('E'))
        if (_week === 1) {
          return '一'
        }
        if (_week === 2) {
          return '二'
        }
        if (_week === 3) {
          return '三'
        }
        if (_week === 4) {
          return '四'
        }
        if (_week === 5) {
          return '五'
        }
        if (_week === 6) {
          return '六'
        }
        if (_week === 7) {
          return '日'
        }
      }
    },
    data () {
      return {
        dates: [],
        endx: 0,
        actIndex: 1, // 当前显示的周索引(一共有上一周，本周，下一周)
        sliderWidth: 0, // 设备宽度
        distan: { x: 0, y: 0 },
        isAnimation: false,
        start: { x: 0, y: 0 },
        direction: '',
        clickIndex: '',
        currentIndex: '',
        currentDay: '',
        hasCourseDate: [],
        paramDate: param('date') || moment().format('YYYYMMDD')
      }
    },
    methods: {
      // 判断是否有课
      judgeHasCourse () {
        const _currentWeekDates = this.getCurrentWeekDates(this.dates[1].date)
        const _beginDate = _currentWeekDates[0].date
        const _endDate = _currentWeekDates[6].date
        const data = {
          begin_date: _beginDate,
          end_date: _endDate,
          type: 'MINE'
        }
        this.$http
          .get('./personal/timetable', { params: data })
          .then(res => {
            const _hasCourseDates = res.data
            for (let i = 0; i < _hasCourseDates.length; i++) {
              if (_hasCourseDates[i].has_course) {
                this.hasCourseDate.push(_hasCourseDates[i].date)
              }
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      // 获取今天日期，上一周日期，下一周日期
      getDatesInfo () {
        this.dates[0] = { date: moment(this.paramDate, 'YYYYMMDD').subtract(7, 'd') }
        this.dates[1] = { date: moment(this.paramDate, 'YYYYMMDD') }
        this.dates[2] = { date: moment(this.paramDate, 'YYYYMMDD').add(7, 'd') }
        this.judgeCurrentIndex()
        this.currentDay = this.dates[1].date.format('YYYY-MM-DD')
        this.judgeHasCourse()
        this.$emit('getDateInfo', this.currentDay)
      },
      // yi'ri
      getCurrentWeekDates (date) {
        const weekOfDate = Number(moment(date).format('E'))
        if (weekOfDate === 7) {
          const weekOfDate = 0
          const weeks = [7, 1, 2, 3, 4, 5, 6]
          const today = moment()
          const arr = []
          for (let i = 0; i < 7; i++) {
            const _theDate = moment(date).subtract(weekOfDate - i, 'd')
            arr.push({
              date: _theDate.format('YYYY-MM-DD'),
              moDate: _theDate,
              week: weeks[i],
              isToday: _theDate.format('YYYY-MM-DD') === today.format('YYYY-MM-DD')
            })
          }
          return arr
        }
        const weeks = [7, 1, 2, 3, 4, 5, 6]
        const today = moment()
        const arr = []
        for (let i = 0; i < 7; i++) {
          const _theDate = moment(date).subtract(weekOfDate - i, 'd')
          arr.push({
            date: _theDate.format('YYYY-MM-DD'),
            moDate: _theDate,
            week: weeks[i],
            isToday: _theDate.format('YYYY-MM-DD') === today.format('YYYY-MM-DD')
          })
        }
        // console.log(arr);
        return arr
      },
      clickDate (index) {
        this.currentIndex = index
        this.currentWeek = this.getCurrentWeekDates(this.dates[this.actIndex].date)
        this.currentDay = this.currentWeek[index].date
        this.$emit('getDateInfo', this.currentDay)
        // this.clickIndex = index;
      },
      // 初始化时默认选中的星期
      judgeCurrentIndex () {
        if (Number(this.dates[this.actIndex].date.format('E')) === 7) {
          this.currentIndex = 0
          return
        }
        this.currentIndex = Number(this.dates[this.actIndex].date.format('E'))
      },
      touchStart (e) {
        this.start.x = e.touches[0].pageX // 获取触摸时的横距离
      },
      touchMove (e) {
        // 这里需要过渡动画
        // console.log("touchMove", e);
        this.isAnimation = true
        this.distan.x = e.touches[0].pageX - this.start.x // 计算出移动的距离
        // 需要移动的容器
        const dom = this.$refs.sliders
        // 向左
        this.endx = this.endx + this.distan.x
        // this.endx = "350";
        dom.style['transform'] = 'translateX(' + this.endx + 'px)'
      },
      touchEnd (e) {
        this.isAnimation = true
        this.distan.x = e.changedTouches[0].pageX - this.start.x
        // 向右
        if (this.distan.x > 0) {
          this.direction = 'right'
          this.actIndex = 0
          // this.currentDate = this.currentDate.subtract(7, "d");
        } else if (this.distan.x < 0) {
          this.direction = 'left'
          this.actIndex = 2
          // this.currentDate = this.currentDate.add(7, "d");
        }
        this.distan.x = 0
      },
      transitionEnd () {
        this.isAnimation = false
        if (this.actIndex === 2) {
          this.dates.push({
            date: moment(this.dates[this.actIndex].date).add(7, 'd')
          })
          this.dates.shift()
          const _currentWeek = this.getCurrentWeekDates(this.dates[1].date)
          this.currentDay = _currentWeek[this.currentIndex].date
          this.actIndex = 1
        } else if (this.actIndex === 0) {
          this.dates.unshift({
            date: moment(this.dates[this.actIndex].date).subtract(7, 'd')
          })
          this.dates.pop()
          this.actIndex = 1
          const _currentWeek = this.getCurrentWeekDates(this.dates[1].date)
          this.currentDay = _currentWeek[this.currentIndex].date
        }
        this.$emit('getDateInfo', this.currentDay)
        // 判断传来的这一周是否的有课情况
        this.judgeHasCourse()
      }
    },
    created () {
      this.getDatesInfo()
      this.sliderWidth = document.body.offsetWidth
    }
  }
</script>
