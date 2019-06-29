<template>
<div>
  <!-- 筛选部分 -->
  <el-card class="box-card Screen_conditions">
    <div slot="header" class="clearfix">
      <span>筛选条件</span>
    </div>
    <!-- 筛选条件表单 -->
    <el-form ref="form" :model="filterParams" label-width="80px">
      <el-form-item label="文章状态">
        <el-radio-group v-model="filterParams.status">
          <el-radio label="">全部</el-radio>
          <el-radio
          v-for="(item,index) in statTypes"
          :key="item.label"
          :label="index + ''"
          >{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="频道列表">
        <article-channel v-model="filterParams.channel_id"></article-channel>
      </el-form-item>
      <el-form-item label="时间">
        <el-date-picker
          v-model="begin_end_pubdata"
          type="daterange"
          @change="handleDateChange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
        type="primary"
        @click="onSubmit"
        :disabled="articleLoading"
        >查询</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <!-- 列表部分 -->
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>共找到{{totalCount}}条符合条件的数据</span>
    </div>
    <!-- 表格 -->
    <el-table
      v-loading="articleLoading"
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="cover.images[0]"
        label="封面"
        width="180">
          <!-- 表格默认只能输入文本，如果要自定义里面的内容需要  写在 template 中
          slot-scope  是插槽作用域 ，  scope是起的一个名字
          scope 中有个成员叫 row
          也就是说 scope.row  就是当前的遍历项对象
          自定义列模板，el-table-column 的prop就没有意义了
          v-bind:src
          -->
          <template slot-scope="scope">
            <img height="35" :src="scope.row.cover.images[0]">
          </template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题"
        width="">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        width="180"
        >
        <!-- // 当前遍历对象 scope.row -->
        <template slot-scope="scope">
          <el-tag :type="statTypes[scope.row.status].type">
            {{ statTypes[scope.row.status].label }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="pubdate"
        label="上传时间">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 页面 -->
    <el-pagination
      class="page"
      background
      :current-page="page"
      layout="prev, pager, next"
      @current-change="Listenforpageevents"
      :disabled="articleLoading"
      :total="totalCount">
    </el-pagination>
  </el-card>
</div>
</template>

<script>
// const userInfo = JSON.parse(window.localStorage.getItem('user_info'))
import ArticleChannel from '@/components/article-channel'
export default {
  name: 'article-list',
  components: {
    ArticleChannel
  },
  data () {
    return {
      form: {
        region: '',
        resource: '',
        value1: ''
      },
      totalCount: 0,
      articleLoading: false,
      page: 1,
      tableData: [], // 列表数据
      filterParams: {
        status: '',
        channel_id: '',
        begin_pubdate: '',
        end_pubdate: ''
      },
      begin_end_pubdata: [],
      statTypes: [
        {
          type: 'info',
          label: '草稿'
        },
        {
          type: '',
          label: '待审核'
        },
        {
          type: 'success',
          label: '审核通过'
        },
        {
          type: 'warning',
          label: '审核失败'
        },
        {
          type: 'danger',
          label: '已删除'
        }
      ]
    }
  },
  created () {
    // 加载文章列表
    this.loadArticles()
  },
  methods: {
    handleDateChange () {
      this.filterParams.begin_pubdate = this.begin_end_pubdata[0]
      this.filterParams.end_pubdate = this.begin_end_pubdata[1]
    },
    // 查询筛选
    onSubmit () {
      // console.log('submit!')
      this.loadArticles()
      this.page = 1
    },
    // 加载文章列表
    loadArticles (page = 1) { // 默认参数显示第一页
      this.articleLoading = true
      const filterData = {}
      for (let key in this.filterParams) {
        if (this.filterParams[key]) {
          filterData[key] = this.filterParams[key]
        }
      }
      this.$http({
        methods: 'GET',
        url: '/articles',
        // headers: {
        //   Authorization: `Bearer ${userInfo.token}`
        // }
        // 在Authorization 请求头中携带的token，格式为"Bearer "拼接上token，注意Bearer后有一个空格
        // 路由请求拦截器中加载
        params: {
          per_page: 10,
          page,
          ...filterData
        }
      }).then(data => {
        this.articleLoading = false
        this.tableData = data.results // 列表数据
        this.totalCount = data.total_count // 数据总数
        // console.log(this.totalCount)
        this.page = data.page
      })
    },
    Listenforpageevents (page) {
      this.page = page
      // console.log(page)
      this.loadArticles(page)
    },
    // 删除文章
    handleDelete (tableData) {
      // console.log(tableData.id)
      this.$confirm('确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          method: 'DELETE',
          url: `articles/${tableData.id}`
        }).then(data => {
          console.log(data)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.loadArticles(this.page)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
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
