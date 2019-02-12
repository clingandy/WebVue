<template>
  <div class="app-container calendar-list-container">

    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="用户登录名称" v-model="listQuery.userName">
      </el-input>
    
      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.orgId"  placeholder="所属部门">
        <el-option v-for="item in  deptOptions" :key="item.key" :label="item.display_name" :value="item.key">
        </el-option>
      </el-select>
            
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      <el-button class="filter-item" v-if="AddUser" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>  
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" :label="$t('table.id')" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.userId}}</span>
        </template>
      </el-table-column> 

      <el-table-column align="center" label="用户登录名称">
        <template slot-scope="scope">
          <span>{{scope.row.userName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="用户真实名称">
        <template slot-scope="scope">
          <span>{{scope.row.userCode}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="所属部门">
        <template slot-scope="scope">
          <span>{{ deptConvert(scope.row.orgId)}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="角色名称">
        <template slot-scope="scope">
           <span>{{ roleConvert(scope.row.roleId)}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="上次登录时间">
        <template slot-scope="scope">
          <span>{{scope.row.modifyTime|formatDate("yyyy-MM-dd hh:mm")}}</span>
        </template>
      </el-table-column>   

      <el-table-column align="center" label="错误次数" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.errorCount}}</span>
        </template>
      </el-table-column> 

      <el-table-column class-name="status-col" label="锁状态" width="100">
        <template slot-scope="scope">
          <el-switch  v-model="scope.row.isLock" @change="handleUpdateSwith(scope.row)"></el-switch>
        </template>
      </el-table-column>

       <el-table-column class-name="status-col" :label="$t('table.status')" width="100">
        <template slot-scope="scope">
          <el-switch  v-model="scope.row.status" @change="handleUpdateSwith(scope.row)" ></el-switch>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('table.actions')"  width="150px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" v-if="EditUser" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
          <el-button type="primary" v-if="EditUser" size="mini" @click="handleResetPwd(scope.row)">重置</el-button> 
          <!-- <el-button size="mini" v-if="DeleteUser" type="danger" icon="el-icon-delete" @click="handleDel(scope.row)"></el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageIndex" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>


    <el-dialog :fullscreen="this.isMobile" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="creatUserForm" :model="createUser" label-position="left" label-width="100px" style='margin-left:50px;'>
        
        <el-form-item label='登录名' prop="userName">
          <el-input autosize v-model="createUser.userName" placeholder="Please input"></el-input>
        </el-form-item>     

        <el-form-item label='真实名' prop="userCode">
          <el-input autosize v-model="createUser.userCode" placeholder="Please input"></el-input>
        </el-form-item>       
 
        <!--<el-form-item label='性别' prop="sex">
          <el-select autosize class="filter-item" v-model="createUser.sex" placeholder="Please select">
            <el-option v-for="item in sexOptions" :key="item.key" :label="item.display_name" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item> -->
        
        <el-form-item label='所属部门' prop="orgId">
          <el-select autosize class="filter-item" @change="selectRoleByOrgId" v-model="createUser.orgId" placeholder="Please select">
            <el-option v-for="item in deptOptions" :key="item.key" :label="item.display_name" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='所属角色' prop="roleId">
          <el-select autosize class="filter-item" v-model="createUser.roleId" placeholder="Please select">
            <el-option v-for="item in roleOptions" :key="item.key" :label="item.display_name" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="dialogStatus=='create'" label='密码' prop="userPwd">
          <el-input autosize v-model="createUser.userPwd" placeholder="Please input"></el-input>
        </el-form-item>

        <el-form-item label='状态' prop="status">
          <el-select autosize class="filter-item" v-model="createUser.status" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item.key">
            </el-option>
          </el-select>
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
import { getusers, createOrModifyUser, deleteUser, resetPwd } from "@/api/users";

import { getAllSysRoleList } from "@/api/roles";
import { fetchDeptList } from "@/api/department";
import waves from "@/directive/waves"; // 水波纹指令

const statusOptions = [
  { key: true, display_name: "正常" },
  { key: false, display_name: "停用" }
];

const sexOptions = [
  { key: 1, display_name: "男" },
  { key: 0, display_name: "女" }
];

export default {
  name: "userList",
  directives: { waves },
  data() {
    return {
      statusOptions,
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
        userName: undefined,
        orgId: undefined
      },
      deptOptions: [],
      roleOptions: [],
      roles: [],
      createUser: {
        id: 0,
        orgId: 0,
        roleId: undefined,
        isLock: false,
        status: true,
        userName: undefined,
        userCode: undefined,
        userPwd: undefined
      },
      rules: {
        userCode: [
          { required: true, message: "真实姓名不能为空", trigger: "blur" },
          { min: 2, max: 20, message: "长度在2到20个字符", trigger: "blur" }
        ],
        userName: [
          { required: true, message: "用户名称不能为空", trigger: "blur" },
          { min: 2, max: 20, message: "长度在2到20个字符", trigger: "blur" }
        ],
        orgId: [
          { required: true, message: "所属部门不能为空", trigger: "change" }
        ],
        roleId: [
          { required: true, message: "所属角色不能为空", trigger: "change" }
        ],
        userPwd: [
          { required: true, message: "密码不能为空", trigger: "change" },
          { min: 6, max: 15, message: "长度在6到15个字符", trigger: "blur" }
        ]
      },

      AddUser: false,
      EditUser: false,
      DeleteUser: false
    };
  },
  watch: {},
  created() {
    this.$store.dispatch("getPagePermission", "userList").then(result => {
      this.AddUser = result.AddUser;
      this.EditUser = result.EditUser;
      this.DeleteUser = result.DeleteUser;
    });

    this.getDeptList();
    this.getRoleList();
    this.getList();
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: "success",
        0: "danger"
      };
      return statusMap[status];
    }
  },
  methods: {
    deptConvert(orgid) {
      var d = this.deptOptions.find(d => {
        return d.key == orgid;
      });
      if (d) {
        return d.display_name;
      }
    },
    roleConvert(roleid) {
      var d = this.roles.find(d => {
        return d.roleId == roleid;
      });
      if (d) {
        return d.roleName;
      }
    },
    getDeptList() {
      fetchDeptList().then(response => {
        var dept = response.data.data;
        dept.forEach(d => {
          this.deptOptions.push({ key: d.orgId, display_name: d.orgName });
        });
      });
    },
    getRoleList(){
      getAllSysRoleList().then(response => {
        this.roles = response.data.data;
      });
    },
    selectRoleByOrgId(orgId){
      this.roleOptions = [];
      this.roles.forEach(r => {
        if(r.orgId == orgId){
          this.roleOptions.push({ key: r.roleId, display_name: r.roleName });
        }
      });
      this.createUser.roleId = this.roleOptions[0] ? this.roleOptions[0].key : undefined
    },
    getList() {
      this.listLoading = true;
      getusers(this.listQuery).then(response => {
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

      this.createUser = {
        id: 0,
        orgId: this.deptOptions[0].key,
        roleId: undefined,
        isLock: false,
        status: true,
        userName: undefined,
        userCode: undefined,
        userPwd: undefined
      };

      this.$nextTick(() => {
        this.$refs["creatUserForm"].clearValidate();
      });
    },
    handleUpdate(row) {
      this.dialogStatus = "update";

      this.createUser = {
        userId: row.userId,
        orgId: row.orgId,
        roleId: row.roleId,
        isLock: row.isLock,
        status: row.status,
        userName: row.userName,
        userCode: row.userCode,
        userPwd: "********"
      };
      this.selectRoleByOrgId(row.orgId);
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["creatUserForm"].clearValidate();
      });
    },
    handleUpdateSwith(row) {
      if(!this.EditUser)return;
      this.createUser = {
        userId: row.userId,
        roleId: row.roleId,
        orgId: row.orgId,
        isLock: row.isLock,
        status: row.status,
        userName: row.userName,
        userCode: row.userCode,
        userPwd: "********"
      };
      this.reqAddEditSumbit("update", true);
    },
    addSumbit(dialogStatus) {
      this.$refs["creatUserForm"].validate(valid => {
        if (valid) {
          this.reqAddEditSumbit(dialogStatus, false);
        }
      });
    },
    reqAddEditSumbit(dialogStatus, isSwith) {
      createOrModifyUser(this.createUser, dialogStatus).then(response => {
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
    },
    handleResetPwd(row){
      var model = {
        userId: row.userId,
        pwd: '123456'
      }
      this.$confirm(`此操作将重置【${row.userName}】用户密码, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          resetPwd(model).then(response => {
            this.$notify({
              title: "成功",
              message: "成功重置密码为：123456",
              type: "success",
              duration: 2000
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消重置"
          });
        });
    },
    handleDel(row) {
      this.$confirm(`此操作将永久删除【${row.userName}】, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteUser(row.id).then(() => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.handleFilter();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>