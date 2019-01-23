<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" v-if="addDept"  @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button> 
    </div>

    <tree-table :data="data"  border>
      <el-table-column label="部门名称">
        <template slot-scope="scope">
            <span>{{scope.row.orgName}}</span>        
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="上级部门">
        <template slot-scope="scope">
          <span>{{ orgConvert(scope.row.pOrgId) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="备注">
        <template slot-scope="scope">
            <span>{{scope.row.description}}</span>        
        </template>
      </el-table-column>

      <el-table-column label="操作" width="200">
        <template slot-scope="scope">

            <el-button type="primary" v-if="editDept" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>

             <!-- <el-button size="mini" icon="el-icon-delete" v-if="deleteDept" type="danger" @click="handleDel(scope.row)"></el-button> -->

        </template>
      </el-table-column>
    </tree-table>

    <el-dialog :fullscreen="this.isMobile" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="creatDeptForm" :model="createdept" label-position="left" label-width="100px" style='margin-left:50px;'>
        
        <el-form-item label='部门名称' prop="orgName">
          <el-input autosize v-model="createdept.orgName" placeholder="Please input"></el-input>
        </el-form-item>         
        
        <el-form-item label='上级部门' prop="pOrgId">
          <el-select autosize class="filter-item" v-model="createdept.pOrgId" placeholder="Please select">
            <el-option v-for="item in deptOptions" :key="item.key" :label="item.display_name" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='备注' prop="description">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="Please input" v-model="createdept.description">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="AddSumbit(dialogStatus)">{{$t('table.confirm')}}</el-button>      
      </div>
    </el-dialog>

  </div>
</template>


<script>
import treeTable from "@/components/TreeTable";
import {
  fetchDeptList,
  GetParentDeptList,
  createDepartmen,
  deleteDept
} from "@/api/department";

export default {
  name: "departmentList",
  components: { treeTable },
  data() {
    return {
      listLoading: false,
      data: [],
      textMap: {
        update: "Edit",
        create: "Create"
      },
      deptOptions: [{ key: 0, display_name: "没有上级" }],
      dialogFormVisible: false,
      dialogStatus: "",
      createdept: {
        orgId: 0,
        orgName: "",
        description: "",
        pOrgId: 0
      },
      rules: {
        description: [
          {
            min: 0,
            max: 200,
            message: "长度不能超过200个字符",
            trigger: "blur"
          }
        ],
        orgName: [
          { required: true, message: "部门名称不能为空", trigger: "blur" },
          { min: 1, max: 20, message: "长度在1到20个字符", trigger: "blur" }
        ],
        pOrgId: [{ required: true, message: "", trigger: "change" }]
      },
      addDept: false,
      editDept: false,
      deleteDept: false
    };
  },
  created() {
    this.$store.dispatch("getPagePermission", "departmentList").then(result => {
      this.addDept = result.AddDept;
      this.editDept = result.EditDept;
      this.deleteDept = result.DeleteDept;
    });

    this.getList();
  },
  methods: {
    orgConvert(orgid) {
      var d = this.data.find(d => {
        return d.key == orgid;
      });
      if (d) {
        return d.orgName;
      }
      return "没有上级";
    },
    getList() {
      this.listLoading = true;
      fetchDeptList(this.listQuery).then(response => {
        this.listLoading = false;
        this.data = response.data.data;
      });
    },
    handleUpdate(row) {
      this.dialogStatus = "update";
      this.deptOptions = [{ key: 0, display_name: "没有上级" }];
      this.data.forEach(d => {
        if (row.orgId != d.orgId) {
          this.deptOptions.push({ key: d.orgId, display_name: d.orgName });
        }
      });
      this.createdept = {
        orgId: row.orgId,
        orgName: row.orgName,
        description: row.description,
        pOrgId: row.pOrgId
      };

      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["creatDeptForm"].clearValidate();
      });
    },
    handleCreate() {
      this.dialogStatus = "create";
      this.deptOptions = [{ key: 0, display_name: "没有上级" }];
      this.data.forEach(d => {
        this.deptOptions.push({ key: d.orgId, display_name: d.orgName });
      });
      this.createdept = {
        orgId: 0,
        orgName: "",
        description: "",
        pOrgId: 0
      };

      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["creatDeptForm"].clearValidate();
      });
    },

    AddSumbit(dialogStatus) {
      this.$refs["creatDeptForm"].validate(valid => {
        if (valid) {
          createDepartmen(this.createdept, dialogStatus).then(response => {
            var data = response.data;
            this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: "操作成功",
                type: "success",
                duration: 2000
              });
            this.getList();
          });
        }
      });
    },

    handleDel(row) {
      this.$confirm(`此操作将永久删除【${row.orgName}】, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteDept(row.orgId).then(() => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getList();
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
