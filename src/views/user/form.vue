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
      <el-form-item label="账号" prop="account" placeholder="请输入账号">
        <el-input v-model="form.account" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" show-password placeholder="请输入密码"  style="width: 200px"/>
      </el-form-item>
      <el-form-item label="昵称" prop="name" placeholder="请输入昵称"> 
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="form.tel" />
      </el-form-item>
      <el-form-item label="email">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item label="角色：">
        <el-select
          v-model="form.role"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="请选择文章标签"
          style="width: 200px"
        >
          <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from "@/api/user";
import { getRoles } from "@/api/role";
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
      loading: false,
      dialog: false,
      form: {
        account: "",
        password: "",
        name: "",
        tel: "",
        eamil: "",
        role: []
      },
      roles: [],

      rules: {
        account: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        name: [{ required: true, message: "请输入昵称", trigger: "blur" }]
      }
    };
  },
  methods: {
    getRolesSelect() {
      getRoles().then(res => {
        this.roles = res.list;
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
          } else this.doEdit();
        } else {
          return false;
        }
      });
    },
    //执行添加动作，调用添加接口
    doAdd() {
      let param = {
        account: this.form.account,
        password:this.form.password,
        name: this.form.name,
        tel: this.form.tel,
        eamil: this.form.eamil,
        roleIds: this.form.role
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
        account: this.form.account,
        name: this.form.name,
        demandName: this.form.tel,
        tel: this.form.taskName,
        eamil: this.form.eamil,
        roleIds: this.from.role
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
      this.form = { role: [] };
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ .el-input-number .el-input__inner {
  text-align: left;
}
</style>
