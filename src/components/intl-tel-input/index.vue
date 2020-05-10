<template>
  <div class="intl-tel-input">
    <span class="code" @click="handleCodeSelect">+{{currentData.dialCode}}</span>
    <select class="select" ref="select" :title="currentData.name" @change="handleCodeSelect">
      <!-- font countries -->
      <option v-for="c in frontCountriesArray" :key="c.code" :value="c.code">{{c.name}}</option>
      <!-- other countries -->
      <option v-for="c in countriesArray" :key="c.code" :value="c.code">{{c.name}}</option>
    </select>
    <input type="number" v-model="phone"
      placeholder="手机号"
      @input="handleInput">
  </div>
</template>

<script>
  import countries from './countries';

  export default {
    props: {
      toFront: {
        type: Array,
        default() {
          return ['cn', 'tw', 'hk', 'mo'];
        },
      },
      countryCode: {
        type: String,
        default: 'cn',
        // default: Object.keys(countries)[0],
        validator(code) {
          const clearCode = String(code).toLowerCase();
          return !!countries[clearCode];
        },
      },
    },
    data() {
      return {
        currentCode: this.countryCode,
        phone: '',
      };
    },
    computed: {
      currentData() {
        return countries[this.currentCode];
      },
      frontCountriesArray() {
        const toFrontCodes = {};
        this.toFront.forEach((code) => {
          const stringCode = String(code);
          const needObj = countries[stringCode];
          if (needObj) {
            toFrontCodes[stringCode] = needObj;
          }
        });
        return toFrontCodes;
      },
      countriesArray() {
        const countryCopie = { ...countries };
        this.toFront.forEach((code) => {
          delete countryCopie[code];
        });
        return countryCopie;
      },
    },
    methods: {
      handleInput() {
        const { dialCode } = this.currentData;
        let value = this.phone;
        if (dialCode !== 86) {
          value = `${dialCode}-${value}`;
        }
        this.$emit('input', value);
      },
      handleCodeSelect() {
        this.currentCode = this.$refs.select.value;
        this.handleInput();
      },
    },
  };
</script>

<style scoped lang="stylus">
  $input-height = 80px
  $code-width = 120px
  .intl-tel-input
    display flex
    position relative
    width 100%
    height $input-height
    background-color #eee
    border-radius 10px
    overflow hidden
  .code
    position relative
    display block
    width $code-width
    height 100%
    background-color #ddd
    line-height $input-height
    text-align center
    font-size 26px
    &:after
      content: ''
      position absolute
      right 0
      bottom 0
      display inline-block
      width 0
      height 0
      border-bottom 20px solid #999
      border-left 20px solid transparent
  .select
    position absolute
    top 0
    left 0
    bottom 0
    width $code-width
    background-color transparent
    color transparent
    border 0
    &:focus
      outline none
  input
    flex 1
    height $input-height
    padding 20px
    background-color transparent
    border 0
</style>
