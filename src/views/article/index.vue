<template>
<div>
  <!-- 筛选部分 -->
  <el-card class="box-card Screen_conditions">
    <div slot="header" class="clearfix">
      <span>筛选条件</span>
    </div>
    <!-- 筛选条件表单 -->
    <el-form>
      <el-form-item label="文章状态">
        <el-radio-group v-model="form.resource">
          <el-radio label="草稿"></el-radio>
          <el-radio label="待审核"></el-radio>
          <el-radio label="审核通过"></el-radio>
          <el-radio label="审核失败"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="频道列表">
        <el-select v-model="form.region" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="value1"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <!-- 列表部分 -->
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>共找到20条符合条件的数据</span>
    </div>
    <!-- 表格 -->
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="date"
        label="日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址">
      </el-table-column>
    </el-table>
    <!-- 页面 -->
    <el-pagination
      class="page"
      background
      layout="prev, pager, next"
      :total="1000">
    </el-pagination>
  </el-card>
</div>
</template>

<script>
export default {
  data () {
    return {
      value1: '',
      value2: '',
      form: {
        region: '',
        resource: ''
      },
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  methods: {
    onSubmit () {
      console.log('submit!')
    }
  }
}
</script>

<style lang='less' scoped>
.Screen_conditions{
  margin-bottom: 10px;
}
.page{
  margin-top: 20px;
}
</style>
