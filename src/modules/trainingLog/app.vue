<template>
  <div class="personal-trainer">
    <div class="student-info__wrap">
      <div class="class-desc">
        <div class="class-name__desc">
          <van-icon name="label-o"/>
          <div class="class-name__title">课程:</div>
          <div class="class-name" v-if="className">{{ className }}</div>
        </div>
        <div class="coach-desc">
          <van-icon name="user-o"/>
          <div class="coach-title">教练:</div>
          <div class="coach-name" v-if="coachName">{{ coachName }}</div>
        </div>
      </div>

      <div class="class-time__desc">
        <van-icon name="clock-o"/>
        <div class="class-time__title">时间:</div>
        <div class="class-time" v-if="classTime">{{ classDate + ' / ' + classTime }}</div>
      </div>
    </div>

    <div class="class-proccess">
      <div class="class-plan__wrap">
        <div class="class-plan">课程规划:</div>
        <van-uploader
          v-if="planList.length"
          v-model="planList"
          max-size="10485760"
          preview-size="70"
          :deletable="false"
          :show-upload="false"
        />
        <div class="no-picture__wrap" v-if="!planList.length">
          <img class='no-picture' src="./img/nodata.png" alt="">
          <div class="no-picture__text">暂无图片描述</div>
        </div>
        <div class="log-content" v-if="classDesc">
          <img :src="coachAvatar" alt="" class="pt-avatar">
          <div class="log-text">
            <div class="has-text">{{classDesc}}</div>
            <!--            <div class="has-text" v-if="!classDesc">暂无留言</div>-->
          </div>
        </div>
      </div>

      <div class="class-summary__wrap">
        <div class="class-summary">课后总结:</div>
        <van-uploader
          v-if="sumList.length"
          v-model="sumList"
          preview-size="70"
          max-size="10485760"
          :deletable="false"
          :show-upload="false"
        />
        <div class="no-picture__wrap" v-if="!sumList.length">
          <img src="./img/nodata.png" class="no-picture" alt="">
          <div class="no-picture__text">暂无图片描述</div>
        </div>
        <div class="log-content" v-if="classSum">
          <img :src="coachAvatar" alt="" class="pt-avatar">
          <div class="log-text">
            <div class="has-text">{{classSum}}</div>
            <!--            <div class="has-text" v-if="!classSum">暂无留言</div>-->
          </div>
        </div>
      </div>
    </div>

    <div class="sign-up__wrap">
      <div class="sign-up" :class="signState === '已签到' ? 'disableSign' : ''" @click="signUp">
        {{signState}}
      </div>
    </div>

  </div>
</template>

<script>
  import './style.stylus'
  import param from '@utils/url-param'
  import toast from '../../components/toast'
  import moment from 'moment'

  export default {
    data () {
      return {
        planList: [],
        sumList: [],
        camera: 'camera',
        className: '',
        classTime: '',
        coachName: '',
        classDesc: '', // 课程规划
        classSum: '', // 课后总结
        courseUserId: param('course_user_id'),
        classDate: '',
        coachAvatar: '',
        courseState: ''
      }
    },
    computed: {
      signState () {
        if (this.courseState === '未上课') {
          return '点击签到'
        }
        return '已签到'
      }
    },
    methods: {
      // 初始化数据
      getInitPic () {
        this.$http
          .get(`./pt/training_log?course_user_id=${this.courseUserId}`)
          .then(res => {
            this.planList = res.data.planing.imgs
            this.classDesc = res.data.planing.description
            this.sumList = res.data.summary.imgs
            this.classSum = res.data.summary.description
            this.className = res.data.course_name
            this.classDate = res.data.begin_date
            this.classTime = res.data.begin_time + '-' + res.data.end_time
            this.coachName = res.data.coach_name
            this.coachAvatar = res.data.coach_avatar
            this.courseState = res.data.course_state // 签到状态
            console.log('格式化日期', moment(res.data.begin_date).format('YYYY年MM月DD日'))
          })
          .catch(err => {
            console.log(err)
          })
      },
      signUp () {
        if (this.signState === '已签到') {
          toast('你已经签过到啦')
          return
        }
        const data = {
          id: this.courseUserId
        }
        this.$http.put('./pt/sign', data).then(res => {
          this.courseState = res.data
          toast('签到成功')
        }).catch(err => {
          console.log(err)
          // toast(err.response.data)
        })
      }
    },
    created () {
      this.getInitPic()
    }
  }
</script>
