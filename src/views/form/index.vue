<template>
  <div>
    <div>
      <!--表单组件-->
      <eForm ref="form" :is-add="isAdd" />
    </div>
    <div style="margin: 20px">
      <el-row class="demo-autocomplete">
        组别选择：
        <el-select
          clearable
          style="margin-right:20px"
          v-model="query.teamCode"
          placeholder="请选择组别"
          @change="selectTesterByTeamCode($event)"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>人员选择：
        <el-select
          v-model="query.testerCode"
          clearable
          placeholder="请选择人员"
          style="margin-right:20px"
        >
          <el-option
            style="margin-right:20px"
            v-for="item in testers"
            :key="item.testerCode"
            :label="item.name"
            :value="item.testerCode"
          ></el-option>
        </el-select>项目：
        <el-autocomplete
          style="margin-right:20px"
          class="inline-input"
          v-model="query.projectName"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
        ></el-autocomplete>第几周：
        <el-select v-model="query.weekYear" filterable clearable placeholder="请选择">
          <el-option
            v-for="item in weeks"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-row>
      <div style="margin-top:15px">
        <el-button type="primary" style="float: left" @click="creatWeekReport">生成周报</el-button>
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
        <el-table-column label="组别" width="80">
          <template slot-scope="scope">{{findName(scope.row.teamCode)}}</template>
        </el-table-column>
        <el-table-column label="项目" width="110" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.projectName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="需求" align="center">
          <template slot-scope="scope">{{ scope.row.demandName}}</template>
        </el-table-column>
        <el-table-column label="任务" align="center">
          <template slot-scope="scope">{{scope.row.taskName }}</template>
        </el-table-column>
        <el-table-column label="人员" width="110" align="center">
          <template slot-scope="scope">{{scope.row.testerName}}</template>
        </el-table-column>
        <el-table-column class-name="status-col" label="状态" width="110" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="开始时间" width="200">
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span>{{ $moment(scope.row.startTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="结束时间" width="200">
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span>{{ $moment(scope.row.endTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="第几周" width="110" align="center">
          <template slot-scope="scope">{{scope.row.weekYear}}</template>
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
import { del, getAllProjectName ,creatWeekReport} from "@/api/table";
import toQuery from "../../mixins/toQuery";
import eForm from "./form";

export default {
  components: { eForm },
  mixins: [toQuery],
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger"
      };
      return statusMap[status];
    }
  },
  computed: {
    //组别枚举值
    options() {
      return this.$store.state.settings.teamOptions;
    },
    //支撑组人员
    hawkeye() {
      return this.$store.state.settings.hawkeye;
    },
    //支撑组人员
    flash() {
      return this.$store.state.settings.flash;
    },
    //支撑组人员
    spider() {
      return this.$store.state.settings.spider;
    },
    //支撑组人员
    bigBangTest() {
      return this.$store.state.settings.bigBangTest;
    },
    //计算第几周枚举值
    weeks() {
      let weeks = [];
      let weeksValue = [];
      this.data.forEach(element => {
        if (weeks.indexOf(element.weekYear) == -1) {
          weeks.push(element.weekYear);
        }
      });
      weeks.sort();
      weeks.forEach(week => {
        weeksValue.push({ value: week });
      });
      return weeksValue;
    }
  },
  data() {
    return {
      //列表加载
      listLoading: true,
      //服务器请求项目数据
      restaurants: [],
      //删除加载
      delLoading: false,
      testers: []
    };
  },
  mounted() {
    this.loadAll();
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
    //获取项目数据提供给输入建议
    loadAll() {
      getAllProjectName().then(res => {
        res.forEach(item => {
          this.restaurants.push({ value: item });
        });
      });
    },

    //将列表中的组别转换成name
    findName(teamCode) {
      let name = "";
      this.options.some(item => {
        if (item.value == teamCode) {
          name = item.label;
          return true;
        }
      });
      return name;
    },
    //新增
    add() {
      this.isAdd = true;
      this.$refs.form.dialog = true;
    },
    //编辑
    edit(data) {
      this.isAdd = false;
      const _this = this.$refs.form;
      console.log(data);
      _this.form = {
        id: data.id,
        teamCode: data.teamCode + "",
        projectName: data.projectName,
        demandName: data.demandName,
        taskName: data.taskName,
        status: data.status,
        testerCode: data.testerCode + "",
        time: [data.startTime, data.endTime]
      };
      _this.dialog = true;
      //调用子组件的方法给testers赋值
      _this.selectTesterByTeamCode(data.teamCode);
    },
    //删除单条数据
    subDelete(id) {
      this.delLoading = true;
      console.log(id);
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
      this.url = "/table/list";

      const query = this.query;
      console.log(query);

      this.params["teamCode"] = query.teamCode;

      this.params["testerCode"] = query.testerCode;

      this.params["projectName"] = query.projectName;

      this.params["weekYear"] = query.weekYear;

      return true;
    },
    //生成周报
    creatWeekReport(){
      creatWeekReport();
    },
    
    //项目输入框建议查询
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      //保留的结果即：符合字符串开头就相同的相
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },

    createFilter(queryString) {
      //返回字符串首次出现的位置是开始的restaurant
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    }
  }
};
</script>
