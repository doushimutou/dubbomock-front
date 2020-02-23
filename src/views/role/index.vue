<template>
  <div>
    <div>
      <!--表单组件-->
      <eForm ref="form" :is-add="isAdd" />
    </div>
    <div style="margin: 20px">
      <el-row class="demo-autocomplete">
        角色名：
        <el-input
          type="text"
          placeholder="请输入内容"
          style="width: 200px"
          v-model="query.name"
          maxlength="10"
          show-word-limit
        ></el-input>
        创建时间：
        <el-date-picker
          v-model="query.time"
          type="datetimerange"
          range-separator=":"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-row>
      <div style="margin-top:15px">
        <el-button type="primary" icon="el-icon-edit" @click="add">新增</el-button>
        <el-button
          type="primary"
          icon="el-icon-search"
          style="float: right;margin-right: 30px"
          @click="toQuery"
        >搜索</el-button>
        <el-button style="float: right" @click="reset">重置</el-button>
      </div>
    </div>
    <!-- 表格内容 -->
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :data="data"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" label="ID" width="150">
          <template slot-scope="scope">{{ scope.$index }}</template>
        </el-table-column>
        <el-table-column label="角色名称" >
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="描述"  align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.desc }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间" >
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span>{{$moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss')}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="edit(scope.row)">编辑</el-button>
            <el-popover :ref="scope.row.name" placement="top" width="180">
              <p>确定删除本条数据吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="$refs[scope.row.name].doClose()">取消</el-button>
                <el-button
                  :loading="delLoading"
                  type="primary"
                  size="mini"
                  @click="subDelete(scope.row.name)"
                >确定</el-button>
              </div>
              <el-button slot="reference" type="danger" size="mini">删除</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <el-pagination
        :total="total"
        :current-page="page + 1"
        style="margin-top: 8px;"
        layout="total, prev, pager, next, sizes"
        @size-change="sizeChange"
        @current-change="pageChange"
      />
    </div>
  </div>
</template>

<script>
import { del } from "@/api/role";
import toQuery from "../../mixins/toQuery";
import eForm from "./form";

export default {
  components: { eForm },
  mixins: [toQuery],
  computed: {},
  data() {
    return {
      //列表加载
      listLoading: true,
      //删除加载
      delLoading: false,
    };
  },
  created() {
    this.listLoading = true;
    this.init();
    this.listLoading = false;
  },
  methods: {
    //重置
    reset() {
      this.query = {};
    },
    //新增
    add() {
      this.isAdd = true;
      this.$refs.form.getMenusTree();
      this.$refs.form.dialog = true;
    },
    //编辑
    edit(data) {
      this.isAdd = false;
      const _this = this.$refs.form;
      //调用子组件的方法给checkedkeys赋值
      _this.setkeys(data.menuIds);
      _this.form = {
        name: data.name,
        desc: data.desc
      };
      _this.dialog = true;
    },
    //删除单条数据
    subDelete(name) {
      this.delLoading = true;
      
      //请求api删除单条数据
      del(name)
        .then(res => {
          this.delLoading = false;
          //取消
          this.$refs[name].doClose();
          // this.dleChangePage()
          //再次初始化列表数据
          this.init();
          //弹框
          this.$notify({
            title: "删除成功",
            type: "success",
            duration: 2500
          });
        })
        .catch(err => {
          this.delLoading = false;
          this.$refs[name].doClose();
          // console.log(err.response.data.message)
        });
    },

    //在查询初始化之前准备好数据
    beforeInit() {
      this.url = "/role/list";
      const query = this.query;
      this.params["name"] = query.name;
      if (query.time) {
        this.params["startTime"] = query.time[0];
        this.params["endTime"] = query.time[1];
      }
      this.params["pageNum"] = this.page;
      this.params["pageSize"] = this.size;
      return true;
    }
  }
};
</script>
