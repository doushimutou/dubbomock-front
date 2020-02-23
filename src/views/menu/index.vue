<template>
  <div>
    <div>
      <!--表单组件-->
      <eForm ref="form" :is-add="isAdd" />
    </div>
    <div style="margin: 20px">
      <div>
        菜单名：
        <el-input
          type="text"
          placeholder="请输入内容"
          style="width: 200px"
          v-model="query.name"
          maxlength="10"
          show-word-limit
        ></el-input>创建时间：
        <el-date-picker
          v-model="query.time"
          type="datetimerange"
          range-separator=":"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </div>
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
        row-key="id"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        default-expand-all
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column label="菜单名" width="180">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="图标" width="110" align="center">
          <template slot-scope="scope">
            <svg-icon :icon-class="scope.row.icon" />
          </template>
        </el-table-column>
        <el-table-column label="排序" align="center">
          <template slot-scope="scope">{{ scope.row.sort}}</template>
        </el-table-column>
        <el-table-column label="路由地址" align="center">
          <template slot-scope="scope">{{scope.row.path }}</template>
        </el-table-column>
        <el-table-column align="center" label="创建时间" width="200">
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span>{{$moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss')}}</span>
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="edit(scope.row)">编辑</el-button>
            <el-popover :ref="scope.row.id" placement="top" width="180">
              <p>确定删除本条数据吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                <el-button
                  :loading="delLoading"
                  type="primary"
                  size="mini"
                  @click="subDelete(scope.row.id)"
                >确定</el-button>
              </div>
              <el-button slot="reference" type="danger" size="mini">删除</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { del} from "@/api/menu";
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
      delLoading: false
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
      //获取父级菜单列表
      this.$refs.form.getMenusTree();
      this.$refs.form.dialog = true;
    },
    //编辑
    edit(data) {
      this.isAdd = false;
      const _this = this.$refs.form;
       this.$refs.form.getMenusTree();
      console.log(data);
      _this.form = {
        id: data.id,
        name: data.name,
        path: data.path,
        sort: data.sort,
        icon: data.icon,
        pid: data.pid
      };
      _this.dialog = true;
    },
    //删除单条数据
    subDelete(id) {
      this.delLoading = true;
      //请求api删除单条数据
      del(id)
        .then(res => {
          this.delLoading = false;
          //取消
          this.$refs[id].doClose();
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
          this.$refs[id].doClose();
          // console.log(err.response.data.message)
        });
    },

    //在查询初始化之前准备好数据
    beforeInit() {
      this.url = "menus/list";
      this.params["name"] = this.query.name;
      if (this.query.time) {
        this.params["startTime"] = this.query.time[0];
        this.params["endTime"] = this.query.time[1];
      }
      return true;
    }
  }
};
</script>
