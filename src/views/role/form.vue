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
      <el-form-item label="角色名" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.desc" />
      </el-form-item>
      <el-form-item label="菜单权限">
        <el-tree
          :data="menus"
          show-checkbox
          node-key="id"
          ref="tree"
          highlight-current
          :props="defaultProps"
        ></el-tree>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getMenuTree } from "@/api/menu";
import { add, edit } from "@/api/role";

export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  computed: {},
  data() {
    return {
      menus: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      loading: false,
      dialog: false,
      form: {
        id: null,
        name: "",
        desc: ""
      },
      rules: {
        name: [{ required: true, message: "请输入角色名称", trigger: "blur" }]
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
    //给tree ,setcheckedkeys
    setkeys(ids) {
      this.getMenusTree();
      this.$nextTick(function() {
        this.$refs.tree.setCheckedKeys(ids);
      });
    },
    //确定新增
    doSubmit() {
      //校验参数，$refs['form'] 调用表单中的ref='form', validate在rules中自定义
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.isAdd) {
            this.doAdd();
          } else this.doEdit();
        } else {
          return false;
        }
      });
    },
    //执行添加动作，调用添加接口
    doAdd() {
      let param = {
        name: this.form.name,
        desc: this.form.desc,
        menuIds: this.$refs.tree.getCheckedKeys()
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
        name: this.form.name,
        desc: this.form.desc,
        menuIds: this.$refs.tree.getCheckedKeys()
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
      this.form = { name: "", menus: [] };
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ .el-input-number .el-input__inner {
  text-align: left;
}
</style>
