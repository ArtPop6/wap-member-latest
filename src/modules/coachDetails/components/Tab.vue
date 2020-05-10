<template>
  <yd-tab active-color="#fcdb00" font-size="15px" height="40px">
    <yd-tab-panel label="简介">
      <div class="detail" v-html="details"></div>
    </yd-tab-panel>
    <yd-tab-panel class="detail" label="预约">
      <div class="detail">
        <div :key="index" v-for="(daytime, index) in time">
          <span class="week">{{daytime.week_display}}</span>
          <div class="time_list">
            <div :key="jindex" class="time_one" v-for="(item, jindex) in dayTimeConfig">
              <div
                :class="{
                     'selected': currentSelected === `${index}-${jindex}`, 
                     'unselected': currentSelected !== `${index}-${jindex}`,
                     'disabled': isDisabled(index, jindex)
                     }"
                :data-id="`${index}-${jindex}`"
                :data-index="`${index}`"
                @click="select"
              >{{item.times}}</div>
            </div>
          </div>
        </div>
      </div>
    </yd-tab-panel>
    <yd-tab-panel class="detail" label="评价">
      <div class="datail_evaluate">
        <img class="blank" src="../../../assets/stores/blank.png" />
        <span class="exploit">程序猿正在努力开发中......</span>
      </div>
    </yd-tab-panel>
  </yd-tab>
</template>
<script>
import param from '@utils/url-param'
export default {
  props: ['details', 'time'],
  data() {
    return {
      dayTimeConfig: [
        { times: '07:00 - 08:00' },
        { times: '08:00 - 09:00' },
        { times: '09:00 - 10:00' },
        { times: '10:00 - 11:00' },
        { times: '11:00 - 12:00' },
        { times: '12:00 - 13:00' },
        { times: '13:00 - 14:00' },
        { times: '14:00 - 15:00' },
        { times: '15:00 - 16:00' },
        { times: '16:00 - 17:00' },
        { times: '17:00 - 18:00' },
        { times: '18:00 - 19:00' },
        { times: '19:00 - 20:00' },
        { times: '20:00 - 21:00' },
        { times: '21:00 - 22:00' },
        { times: '22:00 - 23:00' }
      ],
      currentSelected: null,
      selectIndex: null,
      odatime: [],
      coach_id: '',
      beginData: '',
      beginTime: '',
      week_display: ''
    }
  },

  methods: {
    select(e) {
      this.currentSelected = e.currentTarget.dataset.id
      this.selectIndex = e.target.dataset.index
      this.coach_id = param('id')
      this.beginData = this.time[this.selectIndex].week_date
      this.beginTime = e.target.innerHTML
      this.$emit('post', this.coach_id, this.beginData, this.beginTime)
      if (e.currentTarget.className === 'unselected' || e.currentTarget.className === 'selected') {
        this.$emit('selecteds', this.currentSelected)
      } else {
        this.$emit('selecteds', '')
        return false
      }
    },

    isDisabled(weekIndex, timeIndex) {
      let _foo = false
      if (this.time[weekIndex].coach_time === undefined) {
        return _foo
      } else {
        for (const item of this.time[weekIndex].coach_time) {
          if (this.checkTime(item, weekIndex, timeIndex)) {
            _foo = true
            break
          }
        }
        return _foo
      }
    },

    checkTime(item, weekIndex, timeIndex) {
      function getTime(str) {
        return str.match(/^\d{2}:\d{2}/)[0]
      }
      let _flag = false
      const _time = `${getTime(item.begin_time)} - ${getTime(item.end_time)}`
      const _originTime = this.dayTimeConfig[timeIndex].times
      if (_time === _originTime) _flag = true
      return _flag
    }
  },
  created() {}
}
</script>
<style lang="stylus" scoped>
.detail
  height 650px
  padding 10px 20px
  width 100%
  overflow-y auto
  overflow-x hidden

.week
  display block
  height 30px
  line-height 30px
  font-size 30px

.time_list
  display flex
  flex-wrap wrap
  padding-top 20px

  .time_one
    width 200px
    height 80px
    text-align center
    font-size 24px
    border-radius 15px
    margin 0 10px 10px 10px
    line-height 80px
    border none
    background-color #FFFFFF

.selected
  border-radius 15px
  background-color #fcdb00

.disabled
  border-radius 15px
  background gray
  opacity 0.5

span
  font-size 25px

.datail_evaluate
  display flex
  flex-direction column

.blank
  margin 0 auto
  align-items center
  margin-top 80px

.exploit
  margin 20px
  text-align center
  align-items center
  color #a5a5a5
</style>
