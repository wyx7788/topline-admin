<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>评论管理</span>
    </div>
    <el-table
      :data="commentData"
      border
      style="width: 100%">
      <el-table-column
        prop="title"
        label="文章标题"
      >
      </el-table-column>
      <el-table-column
        prop="total_comment_count"
        label="总评论数"
        width="200">
      </el-table-column>
      <el-table-column
        prop="fans_comment_count"
        label="评论粉丝数"
        width="200">
      </el-table-column>
      <el-table-column
        prop="comment_status"
        label="是否允许评论"
        width="200">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.comment_status"
            @change="CommentStatus(scope.row)"
            active-color="#13ce66"
            :disabled="scope.row.changeLoading"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="page"
      background
      layout="prev, pager, next"
      @current-change="CommentPage"
      :total="totalCount">
    </el-pagination>
  </el-card>
</template>

<script>
export default {
  name: 'articleComment',
  data () {
    return {
      commentData: [],
      totalCount: 0,
      page: 1,
      per_page: 10,
      switchLoading: false
    }
  },
  created () {
    this.handleComment()
  },
  methods: {
    async handleComment (page = 1) {
      try {
        const data = await this.$http({
          method: 'GET',
          url: '/articles',
          params: {
            response_type: 'comment',
            page,
            per_page: 10
          }
        })
        data.results.forEach(item => {
          item.changeLoading = false
        })
        this.commentData = data.results
        this.totalCount = data.total_count
        this.page = data.page
        // console.log(data)
      } catch (err) {
        console.log(err)
      }
    },
    CommentPage (page) {
      this.page = page
      console.log(this.page)
      this.handleComment(page)
    },
    async CommentStatus (row) {
      row.changeLoading = true
      console.log(row)
      try {
        const data = await this.$http({
          method: 'PUT',
          url: '/comments/status',
          data: {
            allow_comment: row.comment_status
          },
          params: {
            article_id: row.id + ''
          }
        })
        console.log(data)
        row.changeLoading = false
        this.$message({
          type: 'success',
          message: `${data.allow_comment ? '开启' : '关闭'}评论状态成功`
        })
      } catch (err) {
        console.log(err)
        row.changeLoading = false
        row.comment_status = !row.comment_status // 启用失败后再返还原来的状态  非（不等于）
        this.$message.error('评论状态修改失败')
      }
    }
  }
}
</script>

<style lang='less' scoped>
</style>
