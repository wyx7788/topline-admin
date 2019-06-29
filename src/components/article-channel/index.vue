<template>
<el-select clearable :value="value" @change="handleChange">
    <el-option
    v-for="item in channels"
    :key="item.id"
    :label="item.name"
    :value="item.id">
    </el-option>
  </el-select>
</template>

<script>

export default {
  name: 'ArticleChannel',
  props: {
    value: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      channels: []
    }
  },
  created () {
    // 加载文章频道
    this.loadChannels()
  },
  methods: {
    handleChange (val) {
      console.log(val)
      this.$emit('input', val)
    },
    loadChannels () {
      this.$http({
        method: 'GET',
        url: '/channels'
      }).then(data => {
        this.channels = data.channels
      }).catch(err => {
        console.log(err)
        this.$message.error('加载频道失败')
      })
    }
  }
}
</script>

<style lang='less' scoped>
</style>
