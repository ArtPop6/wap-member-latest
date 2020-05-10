<template>
  <div class="course-wrap">
    <DatePickSlider :currentType="currentType" @getDateInfo="getCurrentDay"/>
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
          </div>
          <div :key="indexs" class="course-date__class" v-for="(course, indexs) in item.items">
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
  import go from '@utils/goto'
  import DatePick from '../../components/date-pick/index'
  import ClassTab from '../../components/class-tab/index'
  import DatePickSlider from '../../components/date-pick-slider/index'
  import { Toast } from 'vant'

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
        currentType: 'GROUP', // 当前选中的课程名
        isLoading: false // 分页时的加载状态
      }
    },
    methods: {
      // 下拉刷新(无分页)
      onRefresh () {
        this.getMyCourse()
        this.isLoading = false
        Toast('刷新成功')
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
        this.getMyCourse()
      },
      clickCourseType (index) {
        this.courseIndex = index
        if (index === 0) {
          this.currentType = 'GROUP'
          this.getMyCourse()
        } else if (index === 1) {
          this.currentType = 'PERSONAL'
          this.getMyCourse()
        }
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
      }
    },
    created () {
    }
  }
</script>
