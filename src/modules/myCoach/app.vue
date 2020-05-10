<template>
  <div class="course-wrap">
    <ClassTab :tabIndex="tabIndex" @indexChange="indexChange" />
    <DatePick :type="dateType" @seleDate="getSeleDate" />
    <div class="course-info__wrap">
      <div :key="index" class="course-date" v-for="(item, index) in courseData">
        <div class="course-store">{{item.store_name}}</div>
        <div :key="indexs" class="course-date__class" v-for="(course, indexs) in item.course">
          <div class="course-seat">
            <img :src="course.coach_avatar" alt class="avatar" />
            <div class="course-desc">
              <div class="course-name">{{course.course_name}}</div>
              <div class="course-place">位置: {{course.seat}}号位</div>
            </div>
          </div>
          <div class="course-time">{{course.begin_time + '-' + course.end_time }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import './style.stylus'
import go from '@utils/goto'
import param from '@utils/url-param'
import DatePick from '../../components/date-pick/index'
import ClassTab from '../../components/class-tab/index'

export default {
  components: {
    DatePick,
    ClassTab
  },
  data() {
    return {
      seleDate: '',
      coachImg: 'https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1305353222,2352820043&fm=26&gp=0.jpg',
      courseData: [
        {
          name: '无竞悦动智享馆.思北店',
          classes: [
            {
              coachImg:
                'https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1305353222,2352820043&fm=26&gp=0.jpg',
              className: 'ZumBa 尊巴',
              seat: 5,
              time: '15:30-16:15'
            },
            {
              coachImg:
                'https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1305353222,2352820043&fm=26&gp=0.jpg',
              className: 'ZumBa 瑜伽',
              seat: 3,
              time: '15:30-16:15'
            }
          ]
        },
        {
          name: '无竞悦动智享馆.枋湖店',
          classes: [
            {
              coachImg:
                'https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1305353222,2352820043&fm=26&gp=0.jpg',
              className: 'ZumBa 尊巴',
              seat: 5,
              time: '15:30-16:15'
            }
          ]
        }
      ],
      tabIndex: 1,
      dateType: 'MINE'
    }
  },
  watch: {},
  methods: {
    indexChange(indexChange) {
      if (indexChange === 0) {
        go('./myCourse.html')
      }
    },
    getMyCourse() {
      this.$http.get(`./group_exercise/my_course?date=${this.seleDate}&type=COACH`).then(res => {
        this.courseData = res.data
        console.log(this.courseData)
      })
    },
    getSeleDate(date) {
      this.seleDate = date
      this.getMyCourse()
      console.log('获取了', date, '的数据')
    }
  },
  created() {
    this.getMyCourse()
  }
}
</script>