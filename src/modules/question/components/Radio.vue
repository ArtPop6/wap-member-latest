<template>
  <yd-radio-group v-model="checkbox"
                  :data-selected="checkbox"
                  class="radios">
    <yd-radio :val="index"
              v-for="(item, index) in options"
              :key="index"
              class="radios_two">{{item.title}}</yd-radio>
    <br />
  </yd-radio-group>
</template>

<script type="text/babel">
export default {
  props: {
    options: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      checkbox: null
    };
  }
};
</script>
<style lang="stylus" scoped>
.radios
  display flex
  flex-direction column
.radios_two
  padding-top 15px
</style>