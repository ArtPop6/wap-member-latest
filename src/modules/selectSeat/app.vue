<template>
  <div class="seat-select">
    <div class="class-info">
      <div class="class-info__left">
        <img :src="courseDetail.coach_avatar" alt class="coach-avatar" />
        <div class="class-content">
          <div class="class-content__name">{{courseDetail.course_name}}</div>
          <div class="class-content__type">大团课</div>
        </div>
      </div>

      <img class="decorate-pic" src="./img/barbell.png" />
    </div>

    <div class="seat-instruct">
      <div class="seat-available">
        <div class="seat-available__img"></div>
        <div class="seat-available__title">可选</div>
      </div>
      <div class="seat-unavailable">
        <div class="seat-unavailable__img"></div>
        <div class="seat-unavailable__title">不可选</div>
      </div>
      <div class="seat-checked">
        <div class="seat-checked__img"></div>
        <div class="seat-checked__title">已选</div>
      </div>
    </div>

    <div class="coach-info">
      <div class="coach-info__name">{{courseDetail.coach_nick_name}}</div>
    </div>

    <!-- <div class="seat-table"> -->
    <div :style="transformWidth" class="seat-table__content">
      <!-- <div class="row-info__wrap">
          <div :key="index" class="row-info" v-for="(item, index) in seats[0].seat">{{index}}</div>
      </div>-->
      <!-- <div class="column-info__wrap">
        <div :key="index" class="column-info" v-for="(item, index) in seats">{{index + 1}}</div>
      </div>-->

      <div class="seat-table-flex">
        <div class="left-part">
          <div class="row-name"></div>
          <div :key="index" class="row-name" v-for="(item, index) in seats">{{index + 1}}</div>
        </div>
        <div class="right-part">
          <div :key="index" class="table-row" v-for="(item, index) in seats">
            <!-- :class="column.checked ? 'checked' : ''" -->
            <div class="row-tag-wrap" v-if="index === 0">
              <div :key="index" class="row-tag" v-for="(item, index) in item.seats">{{index + 1}}</div>
            </div>

            <div class="column-flex">
              <div
                :class="column.book_able ? checkNum === column.id ? 'checked' : '' : 'disable'"
                :key="indexs"
                @click="selectSeat(column, indexs)"
                class="table-column"
                v-for="(column, indexs) in item.seats"
              >
                <!-- <div class="row-name" v-if="indexs === 0">{{index + 1}}</div> -->
                {{column.id}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="ticket-info">
      <div class="ticket-info__content">
        <div class="ticket-info__store">{{storeContent.store_name}}</div>
        <div class="ticket-info__room">{{storeContent.space_name}}</div>
        <div class="ticket-info__time">{{courseDetail.begin_time + '-' + courseDetail.end_time}}</div>
      </div>
      <div class="ticket-info__date">{{courseDetail.date}}</div>
    </div>
    <!-- </div> -->

    <div class="seat-tab">
      <div class="seat-number" v-show="checkNum !== -1">已选 {{checkNum}}号位</div>
      <div class="seat-number" v-show="checkNum === -1">请选择座位</div>
      <div @click="goOrder()" class="select-button">确认选座</div>
    </div>
  </div>
</template>
<script>
import './style.stylus'
import go from '@utils/goto'
import param from '@utils/url-param'
import { Toast } from 'vant'

export default {
  components: {},
  data() {
    return {
      coachImg: 'https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1305353222,2352820043&fm=26&gp=0.jpg',
      seats: [],
      courseDetail: {},
      checkNum: -1,
      productId: param('course_product_id'),
      skuId: param('course_product_sku_id'),
      timetable: param('timetable_id'),
      date: param('date'),
      storeContent: {},
      biggestWidth: 0
    }
  },
  watch: {},
  computed: {
    transformWidth() {
      const style = {}
      if (this.biggestWidth <= 9) {
        style['justify-content'] = 'center'
      }
      return style
    }
  },
  methods: {
    selectSeat(column, indexs) {
      if (column.book_able) {
        // column.checked = !column.checked
        this.checkNum = column.id
      }
    },
    goOrder() {
      if (this.checkNum === -1) {
        Toast.fail('请选择座位号')
        return
      }
      go(
        `./courseOrder.html?product_id=${this.productId}&sku_id=${this.skuId}&timetable=${this.timetable}&seat=${this.checkNum}&store_id=${this.storeContent.store_id}&date=${this.date}`
      )
    },
    getBiggestLength(array) {
      for (let i = 0; i < array.length; i++) {
        if (array[i].seats.length > this.biggestWidth) {
          this.biggestWidth = array[i].seats.length
        }
      }
    },
    getSeatDetail() {
      const data = {
        timetable_id: this.timetable,
        date: this.date
      }
      this.$http
        .get('./group_exercise/seat', { params: data })
        .then(res => {
          this.courseDetail = res.data.course
          this.storeContent = res.data
          this.seats = res.data.book_seats
          this.getBiggestLength(this.seats)
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created() {
    this.getSeatDetail()
  }
}
</script>
