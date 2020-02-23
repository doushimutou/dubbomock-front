<template>
  <div>
    <div>
      <!--表单组件-->
      <eForm ref="form" :is-add="isAdd" />
    </div>
    <div style="margin: 20px">
      <el-row class="demo-autocomplete">
        用户名：
        <el-input
          type="text"
          placeholder="请输入内容"
          style="width: 200px"
          v-model="query.name"
          maxlength="10"
          show-word-limit
        ></el-input>状态：
        <el-select v-model="query.status" clearable placeholder="请选择状态" style="margin-right:20px">
          <el-option
            style="margin-right:20px"
            v-for="item in statuss"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>email：
        <el-input
          type="text"
          placeholder="请输入内容"
          style="width: 200px"
          v-model="query.email"
          maxlength="10"
          show-word-limit
        ></el-input>
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
        <el-table-column align="center" label="ID" width="50">
          <template slot-scope="scope">{{ scope.$index }}</template>
        </el-table-column>
        <el-table-column label="用户" width="80">
          <template slot-scope="scope">{{scope.row.account}}</template>
        </el-table-column>
        <el-table-column label="昵称" width="110" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="角色" align="center">
          <template slot-scope="scope">{{ scope.row.role}}</template>
        </el-table-column>
        <el-table-column label="电话" align="center">
          <template slot-scope="scope">{{ scope.row.tel}}</template>
        </el-table-column>
        <el-table-column label="email" align="center">
          <template slot-scope="scope">{{scope.row.email }}</template>
        </el-table-column>
        <el-table-column class-name="status-col" label="状态" width="210" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value= "1"
              :inactive-value= "0"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="启用"
              inactive-text="禁用"
              class="switchStyle"
              @change="statusChange(scope.row)"
            ></el-switch>
          </template>
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
      <!--分页组件-->
      <el-pagination
        :total="total"
        :current-page="page +1 "
        style="margin-top: 8px;"
        layout="total, prev, pager, next, sizes"
        @size-change="sizeChange"
        @current-change="pageChange"
      />
    </div>
  </div>
</template>

<script>
import { del, isActive } from "@/api/user";
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
      statuss: [
        {
          value: "1",
          label: "启用"
        },
        {
          value: "0",
          label: "禁用"
        }
      ]
    };
  },
  mounted() {},
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
      this.$refs.form.getRolesSelect();
      this.$refs.form.dialog = true;
    },
    //编辑
    edit(data) {
      this.isAdd = false;
      const _this = this.$refs.form;
      const roleid = [];
      data.sets.forEach(role => {
        roleid.push(role.id);
      });
      _this.form = {
        account: data.account,
        name: data.name,
        tel: data.tel,
        eamil: data.eamil,
        role: roleid
      };
      _this.dialog = true;
      this.$refs.form.getRolesSelect();
    },
    //删除单条数据
    subDelete(id) {
      this.delLoading = true;
      console.log(id);
      //请求api删除单条数据
      del(id).then(res => {
          this.delLoading = false;
          //取消
          this.$refs[id].doClose();
          this.dleChangePage();
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
      this.url = "user/list";
      const query = this.query;
      this.params["name"] = query.name;
      this.params["status"] = query.status;
      this.params["email"] = query.email;
      this.params["pageNum"] = this.page;
      this.params["pageSize"] = this.size;
      return true;
    },
    statusChange(row) {
      console.log(row.status);
      isActive(row.id,row.status)
        .then(res => {
          //再次初始化列表数据
          this.init();
          //弹框
          this.$notify({
            title: "状态变更成功",
            type: "success",
            duration: 2500
          });
        })
        .catch(err => {
          //弹框
          this.$notify({
            title: "状态变更失败",
            type: "error",
            duration: 2500
          });
          // this.delChangePage(this.total)
          this.init();
        });
    }
  }
};
</script>

<style>
.switchStyle .el-switch__label {
  position: absolute;
  display: none;
  color: #fff;
}
.switchStyle .el-switch__label--left {
  z-index: 9;
  left: 6px;
}
.switchStyle .el-switch__label--right {
  z-index: 9;
  left: -14px;
}
.switchStyle .el-switch__label.is-active {
  display: block;
}
.switchStyle.el-switch .el-switch__core,
.el-switch .el-switch__label {
  width: 60px !important;
}
</style>
