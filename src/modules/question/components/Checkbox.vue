<template>
  <div :data-selected="checkbox">
    <yd-checkbox-group v-model="checkbox"
                       v-for="(item, index) in options"
                       :key="index"
                       class="checks">
      <yd-checkbox :val="index">{{item.title}}</yd-checkbox>
    </yd-checkbox-group>
  </div>
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
      checkbox: []
    };
  }
};
</script>
<style lang="stylus" scoped>
.checks
  padding-top 15px
</style>