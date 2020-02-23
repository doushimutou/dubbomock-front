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
      <el-form-item label="组别" prop="teamCode">
        <el-select
          v-model="form.teamCode"
          placeholder="请选择组别"
          @change="selectTesterByTeamCode($event)"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="测试人员" prop="testerCode">
        <el-select v-model="form.testerCode">
          <el-option
            style="margin-right:20px"
            v-for="item in testers"
            :key="item.testerCode"
            :label="item.name"
            :value="item.testerCode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="项目">
        <el-input v-model="form.projectName" />
      </el-form-item>
      <el-form-item label="需求">
        <el-input v-model="form.demandName" />
      </el-form-item>
      <el-form-item label="任务" prop="taskName">
        <el-input v-model="form.taskName" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-input v-model="form.status" />
      </el-form-item>
      <el-form-item label="任务时间">
        <el-date-picker
          v-model="form.time"
          type="datetimerange"
          range-separator=":"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from "@/api/table";

export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    options() {
      return this.$store.state.settings.teamOptions;
    },
    //支撑组人员
    hawkeye() {
      return this.$store.state.settings.hawkeye;
    },
    //骑手组人员
    flash() {
      return this.$store.state.settings.flash;
    },
    //商家组人员
    spider() {
      return this.$store.state.settings.spider;
    },
    //测开组人员
    bigBangTest() {
      return this.$store.state.settings.bigBangTest;
    }
  },
  data() {
    return {
      loading: false,
      dialog: false,
      testers: [],
      form: {
        id: null,
        teamCode: "",
        projectName: "",
        demandName: "",
        taskName: "",
        status: "",
        testerCode: "",
        time: []
      },
      rules: {
        teamCode: [{ required: true, message: "请输入组别", trigger: "blur" }],
        taskName: [{ required: true, message: "请输入任务", trigger: "blur" }],
        status: [{ required: true, message: "请选择状态", trigger: "blur" }],
        testerCode: [
          { required: true, message: "请选择测试人员", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    //根据teamCode获取对应的成员
    selectTesterByTeamCode(teamCode) {
      if (teamCode == 0) {
        this.testers = this.spider;
      }
      if (teamCode == 1) {
        this.testers = this.flash;
      }
      if (teamCode == 2) {
        this.testers = this.hawkeye;
      }
      if (teamCode == 3) {
        this.testers = this.bigBangTest;
      }
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
        teamCode: this.form.team.teamCode,
        projectName: this.form.projectName,
        demandName: this.form.demandName,
        taskName: this.form.taskName,
        status: this.form.status,
        testerCode: this.form.testerCode,
        startTime: this.form.time[0],
        endTime: this.form.time[1]
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
        teamCode: this.form.teamCode,
        projectName: this.form.projectName,
        demandName: this.form.demandName,
        taskName: this.form.taskName,
        status: this.form.status,
        testerCode: this.form.testerCode,
        startTime: this.form.time[0],
        endTime: this.form.time[1]
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
      this.form = { team: "", project: "" };
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ .el-input-number .el-input__inner {
  text-align: left;
}
</style>
