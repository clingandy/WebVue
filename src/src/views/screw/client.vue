<template>
  <div class="app-container calendar-list-container">

    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="名称" v-model="listQuery.name"></el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="手机号码" v-model="listQuery.mobile"></el-input>
            
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      <el-button class="filter-item" v-if="addClient" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>  
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" :label="$t('table.id')" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.clientId}}</span>
        </template>
      </el-table-column> 

      <el-table-column align="center" label="旺旺名称">
        <template slot-scope="scope">
          <span>{{scope.row.clientName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="真实姓名">
        <template slot-scope="scope">
          <span>{{scope.row.realName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="微信">
        <template slot-scope="scope">
          <span>{{scope.row.weChat}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="QQ">
        <template slot-scope="scope">
          <span>{{scope.row.qq}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="手机号码">
        <template slot-scope="scope">
          <span>{{scope.row.mobile}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="性别">
        <template slot-scope="scope">
          <span>{{sexConvert(scope.row.sex)}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="年龄">
        <template slot-scope="scope">
          <span>{{scope.row.age}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="修改时间">
        <template slot-scope="scope">
          <span>{{scope.row.modifyTime | formatDate("yyyy-MM-dd hh:mm")}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('table.actions')" width="150px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" v-if="editClient" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
          <el-button type="primary" size="mini" @click="navigateTo(scope.row)">收货地址</el-button>
          <!-- <el-button size="mini" v-if="deleteClient" type="danger" icon="el-icon-delete" @click="handleDel(scope.row)"></el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageIndex" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :fullscreen="this.isMobile" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="creatClientForm" :model="creatClient" label-position="left" label-width="100px" style='margin-left:50px;'>
        
        <el-form-item label='旺旺名称' prop="clientName">
          <el-input autosize v-model="creatClient.clientName" placeholder="Please input"></el-input>
        </el-form-item>

        <el-form-item label='真实姓名' prop="realName">
          <el-input autosize v-model="creatClient.realName" placeholder="Please input"></el-input>
        </el-form-item>  

        <el-form-item label='微信' prop="weChat">
          <el-input autosize v-model="creatClient.weChat" placeholder="Please input"></el-input>
        </el-form-item>     

        <el-form-item label='QQ' prop="qq">
          <el-input autosize v-model="creatClient.qq" placeholder="Please input"></el-input>
        </el-form-item> 

        <el-form-item label='手机号码' prop="mobile">
          <el-input autosize v-model="creatClient.mobile" placeholder="Please input"></el-input>
        </el-form-item> 
 
        <el-form-item label='性别' prop="sex">
          <el-select autosize class="filter-item" v-model="creatClient.sex" placeholder="Please select">
            <el-option v-for="item in sexOptions" :key="item.key" :label="item.display_name" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='年龄' prop="age">
          <el-input autosize v-model="creatClient.age" placeholder="Please input"></el-input>
        </el-form-item> 

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="addSumbit(dialogStatus)">{{$t('table.confirm')}}</el-button>      
      </div>
    </el-dialog>


  </div>
</template>    


<script>
import { getClientPageList, createOrModifyClient } from "@/api/screw";
import {validateMobile} from "@/utils/validate";
import waves from "@/directive/waves"; // 水波纹指令

const sexOptions = [
  { key: true, display_name: "男" },
  { key: false, display_name: "女" }
];

export default {
  name: "clientList",
  directives: { waves },
  data() {
    const validateMobileData = (rule, value, callback) => {
      if (value && !validateMobile(value)) {
        callback(new Error("请输入正确的手机号码"));
      }
      callback();
    };

    return {
      sexOptions,
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create"
      },
      dialogFormVisible: false,
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
        name: undefined,
        mobile: undefined
      },
      creatClient: {},
      rules: {
        clientName: [
          { required: true, message: "旺旺名称不能为空", trigger: "blur" },
          { min: 2, max: 20, message: "长度在2到20个字符", trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
          { validator: validateMobileData, trigger: "blur" }
        ]
        // qq: [
        //   { type: "number", message: "请输入数字格式", trigger: "blur", transform(value) {return Number(value);}}
        // ]
      },

      addClient: false,
      editClient: false,
      deleteClient: false
    };
  },
  watch: {},
  created() {
    this.$store.dispatch("getPagePermission", "clientList").then(result => {
      this.addClient = result.addClient;
      this.editClient = result.editClient;
      this.deleteClient = result.deleteClient;
    });

    this.getList();
  },
  methods: {
    sexConvert(sex) {
      var d = this.sexOptions.find(d => {
        return d.key == sex;
      });
      if (d) {
        return d.display_name;
      }
    },
    navigateTo(row){
      this.$router.push({path: '/screw/clientAddress',query:{ clientId:row.clientId, clientName:row.clientName, mobile:row.mobile }});
    },
    getList() {
      this.listLoading = true;
      getClientPageList(this.listQuery).then(response => {
        this.list = response.data.data;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageIndex = val;
      this.getList();
    },
    handleFilter() {
      this.listQuery.pageIndex = 1;
      this.getList();
    },
    handleCreate() {
      this.dialogStatus = "create";
      this.dialogFormVisible = true;

      this.creatClient = {
        clientId: 0,
        clientName: undefined,
        sex: true,
        age: 0,
        weChat: undefined,
        qq: undefined,
        mobile: undefined
      };

      this.$nextTick(() => {
        this.$refs["creatClientForm"].clearValidate();
      });
    },
    handleUpdate(row) {
      this.dialogStatus = "update";

      this.creatClient = {
        clientId: row.clientId,
        clientName: row.clientName,
        sex: row.sex,
        age: row.age,
        weChat: row.weChat,
        qq: row.qq,
        mobile: row.mobile
      };

      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["creatClientForm"].clearValidate();
      });
    },
    addSumbit(dialogStatus) {
      this.$refs["creatClientForm"].validate(valid => {
        if (valid) {
          this.reqAddEditSumbit(dialogStatus, false);
        }
      });
    },
    reqAddEditSumbit(dialogStatus, isSwith) {
      createOrModifyClient(this.creatClient, dialogStatus).then(response => {
            this.dialogFormVisible = false;

            this.$notify({
              title: "成功",
              message: "操作成功",
              type: "success",
              duration: 2000
            });
            if (!isSwith){
              this.handleFilter();
            }
          });
    }
  }
};
</script>