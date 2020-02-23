<template>
  <el-dialog
    :visible.sync="dialog"
    :close-on-click-modal="false"
    :before-close="cancel"
    :title="isAdd ? '新增内容' : '编辑内容'"
    append-to-body
    width="720px"
  >
    <el-form
      ref="form"
      :inline="true"
      :model="form"
      :rules="rules"
      size="small"
      label-width="200px"
    >
      <el-form-item label="菜单名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="地址" prop="path">
        <el-input v-model="form.path" />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model.number="form.sort" />
      </el-form-item>
      <el-form-item label="icon">
        <!-- <el-input v-model="form.icon" /> -->
        <el-select v-model="form.icon" placeholder="请选择" clearable style="width: 200px">
          <el-option v-for="item in icons" :key="item" :label="item" :value="item">
            <span style="float: left">{{ item }}</span>
            <!-- <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span> -->
            <svg-icon style="margin-top: 8px;float: right" :icon-class="item" />
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="父级" prop="pid">
        <treeselect v-model="form.pid" :options="menus" style="width: 200px;" placeholder="选择上级类目" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getMenuTree, add, edit } from "@/api/menu";
// import the component
import Treeselect from "@riophae/vue-treeselect";
// import the styles
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import icons from "../../utils/requireIcons";

export default {
  components: { Treeselect },
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  computed: {},
  data() {
    return {
      //提供接口查
      menus: [],
      //提供接口查
      icons: icons,
      loading: false,
      dialog: false,
      testers: [],
      form: {
        id: null,
        name: "",
        path: "",
        sort: "",
        icon: "",
        pid: 1
      },
      rules: {
        name: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
        path: [{ required: true, message: "请输入路由地址", trigger: "blur" }],
        sort: [{ type: "number", message: "请输入数字类型", trigger: "blur" }],
        pid: [{ required: true, message: "请选择父级", trigger: "blur" }]
      }
    };
  },
  methods: {
    //获取所有的menus
    getMenusTree() {
      getMenuTree().then(res => {
        console.log(res);
        this.menus = res;
      });
    },
    //取消新增
    cancel() {
      this.resetForm();
    },
    //确定新增
    doSubmit() {
      //校验参数，$refs['form'] 调用表单中的ref='form', validate在rules中自定义
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.isAdd) {
            this.doAdd();
          } else {
            this.doEdit();
          }
        } else {
          return false;
        }
      });
    },
    //执行添加动作，调用添加接口
    doAdd() {
      let param = {
        name: this.form.name,
        path: this.form.path,
        sort: this.form.sort,
        icon: this.form.icon,
        parentId: this.form.pid
      };
      add(param)
        .then(res => {
          this.resetForm();
          this.$notify({
            title: "添加成功",
            type: "success",
            duration: 2500
          });
          this.loading = false;
          this.$parent.init();
        })
        .catch(err => {
          this.loading = false;
        });
    },

    //执行编辑动作，调用编辑接口
    doEdit() {
      let param = {
        id: this.form.id,
        name: this.form.name,
        path: this.form.path,
        sort: this.form.sort,
        icon: this.form.icon,
        parentId: this.form.pid
      };
      edit(param)
        .then(res => {
          this.resetForm();
          this.$notify({
            title: "添加成功",
            type: "success",
            duration: 2500
          });
          this.loading = false;
          this.$parent.init();
        })
        .catch(err => {
          this.loading = false;
        });
    },

    resetForm() {
      this.dialog = false;
      this.$refs["form"].resetFields();
      this.form = { icon: "" };
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ .el-input-number .el-input__inner {
  text-align: left;
}
</style>
