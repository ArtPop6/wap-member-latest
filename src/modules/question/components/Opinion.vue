<template>
  <yd-cell-group>
    <yd-cell-item :data="textarea">
      <yd-textarea slot="right"
                   placeholder="请输入您的意见"
                   maxlength="100"
                   v-model="textarea"></yd-textarea>
    </yd-cell-item>
  </yd-cell-group>
</template>

<script type="text/babel">
export default {
  props: {
    questions: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      textarea: null
    };
  }
}
</script>