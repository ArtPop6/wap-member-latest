<template>
  <div class="app">
    <header class="head">
      <header class="head_top">
        <img
          :src="survey.cover_img_url"
          class="head_icon"
        />
      </header>
      <main class="head_center">
        <span>{{survey.title}}</span>
      </main>
      <footer class="head_bottom">
        <span>{{survey.subtitle}}</span>
      </footer>
    </header>

    <form
      action=""
      class="menu"
      id="questionnaire"
      ref="form"
    >
      <ul>
        <div
          :id="'r'+index"
          v-for="(item, index) in questions"
          :key="index"
        >
          <li v-if="item.type=='SINGLE'">
            <span>{{index + 1}}. {{item.title}}</span>
            <Radio
              ref="ans"
              :options="item.options"
            ></Radio>
          </li>
          <li v-else-if="item.type=='MULTI'">
            <span>{{index + 1}}. {{item.title}}</span>
            <Checkbox
              ref="ans"
              class="checkbox"
              :options="item.options"
            ></Checkbox>
          </li>
          <li
            v-else-if="item.type=='CONTENT'"
            class="optinion"
          >
            <span>{{index + 1}}. {{item.title}}</span>
            <Opinion
              ref="ans"
              :questions="item"
              class="optinion_two"
            ></Opinion>
          </li>
        </div>
      </ul>
    </form>

    <button
      type="button"
      name="submit"
      id="submit"
      class="bottom"
      @click="submit"
    >提交</button>
  </div>
</template>

<script>
import "./style.stylus";
import param from "@utils/url-param";
import Radio from "./components/Radio.vue";
import Checkbox from "./components/Checkbox.vue";
import Opinion from "./components/Opinion";
import toast from '../../components/toast';


export default {
  components: {
    Radio,
    Checkbox,
    Opinion
  },
  data () {
    return {
      survey: {},
      questions: [],
      result: {}
    };
  },
  methods: {
    list () {
      this.$http.get(`/surveys/club-gfp`).then((res) => {
        this.survey = res.data;
        this.questions = this.survey.questions;
      });
    },

    collection () {
      const self = this;
      self.questions.map((item, index) => {
        if (item.type === "SINGLE") {
          let selectIndex = Number(document.getElementById("r0").children[0].children[1].dataset.selected);

          item.options.map((val, optIndex) => {
            if (optIndex === selectIndex) {
              val.chosen = true;
            } else {
              val.chosen = false;
            }
          });
        } else if (item.type === "MULTI") {
          let selectIndexs = self.$refs.ans[index].checkbox;
          item.options.map((val, optIndex) => {
            if (selectIndexs.indexOf(optIndex) > -1) {
              val.chosen = true;
            } else {
              val.chosen = false;
            }
          });
        } else if (item.type === "CONTENT") {
          let textareas = self.$refs.ans[index].textarea;
          item.content = textareas;
        }
      });
      // console.log(this.questions)
    },

    postData () {
      const postData = JSON.parse(JSON.stringify(this.survey));
      this.$http.post('/surverys/records', postData).then((res) => {
        const data = res.data;
        toast('操作成功');
      });
    },


    submit () {
      this.collection();
      this.postData();
    }
  },
  created () {
    this.list();
  }
};
</script>
<style lang="stylus" scoped>
.app
  display flex
  flex-direction column
  width 750px
  flex 1
  margin 0 auto

.head
  display flex
  flex-direction column
  width 750px
  height 350px

.head_top
  display flex
  flex-direction column-reverse
  height 180px
  width 750px

.head_icon
  width 280px
  height 180px
  margin 0 auto

.head_center
  width 730px
  height 50px
  margin-top 20px
  text-align center

.head_center span
  display block
  margin 0 auto
  font-weight bolder
  font-size 35px

.head_bottom span
  display block
  margin 0 auto
  width 650px
  margin-top 10px
  font-size 25px

.menu
  width 700px
  margin-left 50px

li
  font-size 30px
  margin-bottom 10px
  margin-top 20px

.optinion
  margin-top 80px

  .optinion_two
    margin-top 30px

.bottom
  display block
  margin 0 auto
  width 150px
  height 70px
  text-align center
  line-height 40px
  background-color green
  border-style none
  color aliceblue
  border-radius 10px
  margin-top 100px
  font-size 20px
</style>