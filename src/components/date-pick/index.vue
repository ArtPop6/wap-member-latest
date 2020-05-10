<template>
  <div class="date-pick">
    <div :key="index" @click="clickDate(index)" class="date" v-for="(item, index) in dates">
      <div class="date-item">
        <div :class="index === currentIndex ? 'changeTitleStyle' : 'date-style'" class="date-item__title">{{item.day}}</div>
        <!-- item.has_course ? 'has-class' : 'num-style' -->
        <div
          :class="index === currentIndex ? 'changeNumStyle' : ''"
          class="date-item__num"
        >{{index === 0 ? '今' : chineseWeek(item.weekday)}}
        </div>
      </div>
    </div>
  </div>
</template>
<script>

  export default {
    props: ['storeId', 'type'],
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
      }
    },
    watch: {
      // storeId(newVal, oldVal) {
      //   this.currentStoreId = newVal
      // }
    },
    data () {
      return {
        dates: [],
        currentIndex: 0,
        currentStoreId: ''
      }
    },
    methods: {
      clickDate (index) {
        this.currentIndex = index
        this.$emit('seleDate', this.dates[index].date)
      },
      getDateInfo () {
        const data = {
          // store_id: this.currentStoreId,
          type: this.type
        }
        return this.$http
          .get('./group_exercise/timetable', { params: data })
          .then(res => {
            this.dates = res.data
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    created () {
      this.getDateInfo().then(() => {
        this.$emit('seleDate', this.dates[0].date)
      })
    }
  }
</script>
<style lang="stylus">
  .date-pick
    height 160px
    display flex
    // box-shadow 0 4px 26px 0 rgba(0, 0, 0, 0.03)
    box-shadow 0px 2px 6px 0px rgba(0, 0, 0, 0.1)
    background #fff
    z-index 100

    .date
      width 56px
      font-size 24px
      text-align center
      margin 26px
      color #0f0f0f

      .date-item
        .date-item__title
          height 34px
          display flex
          align-items center
          justify-content space-around
          text-align center
          line-height 34px
          margin-bottom 16px
          font-weight normal

        .changeTitleStyle
          font-weight 550

        .date-item__num
          height 56px
          border-radius 100%
          line-height 56px
          text-align center
          font-weight normal

        .changeNumStyle
          background linear-gradient(-146deg, #F3D825 0%, #FDDD05 84%, #FFDE00 91%)
          border 2px solid linear-gradient(-146deg, #F3D825 0%, #FDDD05 84%, #FFDE00 91%)
          font-weight 550
          color #fff
          text-shadow 3px 3px 5px rgba(0, 0, 0, 0.04)
          box-shadow 3px 3px 5px 0px rgba(0, 0, 0, 0.04)

        .num-style
          border 2px solid #E1E1E1

        .has-class
          border 2px solid #fcdb00
</style>
