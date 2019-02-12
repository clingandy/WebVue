
<template>
  <div class="app-container calendar-list-container">

    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="角色名称" v-model="listQuery.roleName">
      </el-input>

      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.orgId" placeholder="所属部门">
        <el-option v-for="item in  deptOptions" :key="item.key" :label="item.display_name" :value="item.key">
        </el-option>
      </el-select>

      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      <el-button class="filter-item" v-if="AddRole" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" :label="$t('table.id')" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.roleId}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="角色名称">
        <template slot-scope="scope">
          <span>{{scope.row.roleName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="所属部门">
        <template slot-scope="scope">
          <span>{{ deptConvert(scope.row.orgId)}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="备注">
        <template slot-scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('table.actions')"  width="210px" class-name="small-padding fixed-width">
        <template slot-scope="scope">

          <el-button type="primary" size="mini" v-if="EditRole" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
          <el-button type="primary" size="mini" v-if="RolePermission" @click="handleAllot(scope.row)">授权</el-button>
          <el-button size="mini" icon="el-icon-delete" type="danger" v-if="DeleteRole" @click="handleDel(scope.row)">
          </el-button>

        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageIndex" :pageIndex-sizes="[10,20,30,50]"
        :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :fullscreen="this.isMobile" :title="textMap[dialogStatus]" :visible.sync="dialogAddOrModifyFormVisible">
      <el-form :rules="rules" ref="creatRolesForm" :model="creatRolesForm" label-position="left" label-width="100px" style='margin-left:50px;'>

        <el-form-item label='角色名称' prop="roleName">
          <el-input style="width:200px" autosize v-model="creatRolesForm.roleName" placeholder="Please input"></el-input>
        </el-form-item>

        <el-form-item label='所属部门' prop="orgId">
          <el-select autosize class="filter-item" v-model="creatRolesForm.orgId" placeholder="Please select">
            <el-option v-for="item in  deptOptions" :key="item.key" :label="item.display_name" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='备注' prop="description">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="Please input" v-model="creatRolesForm.description">
          </el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddOrModifyFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button type="primary" :disabled="IsSumbit" @click="AddSumbit(dialogStatus)">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog title="分配权限" :fullscreen="this.isMobile" :visible.sync="dialogFormVisible">
      <tree-table :data="menuData" border v-loading="listLoadingtree">

        <el-table-column width="50px">
          <template slot-scope="scope">
            <el-checkbox :key="scope.row.menuId" v-model="scope.row.check" @change="menucheck(scope.row)"></el-checkbox>
          </template>
        </el-table-column>

        <el-table-column label="菜单名称" width="150px">
          <template slot-scope="scope">
            <span>{{scope.row.menuName}}</span>
          </template>
        </el-table-column>

        <el-table-column label="权限值">
          <template slot-scope="scope">
            <el-checkbox v-for="mpb in scope.row.permission" :key="mpb.permissionId" v-model="mpb.check" @change="permissioncheck(mpb, scope.row.pMenuId,scope.row.menuId)">{{mpb.permissionName}}</el-checkbox>
          </template>
        </el-table-column>
      </tree-table>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="modifyPermissionSumbit">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>


<script>
import treeTable from "@/components/TreeTable";
import waves from "@/directive/waves"; // 水波纹指令
import { fetchList, createOrModifyRole, deleteRole } from "@/api/roles";
import { fetchDeptList } from "@/api/department";
import { getMenuAndPermissionList, allocPermission } from "@/api/menu";

const statusOptions = [
  { key: 1, display_name: "正常" },
  { key: 0, display_name: "停用" }
];

export default {
  name: "roleList",
  components: { treeTable },
  directives: { waves },
  data() {
    return {
      menuData: [],
      menuIds: [],
      permissionIds: [],
      statusOptions,
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create"
      },
      dialogFormVisible: false,
      dialogAddOrModifyFormVisible: false,
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listLoadingtree: true,
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
        roleName: undefined,
        orgId: undefined
      },
      deptOptions: [],
      roleId: 0,
      creatRolesForm: {
        roleId: 0,
        roleName: undefined,
        orgId: undefined,
        description: undefined
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
        roleName: [
          { required: true, message: "角色名称不能为空", trigger: "blur" },
          { min: 2, max: 20, message: "长度在2到20个字符", trigger: "blur" }
        ],
        orgId: [
          { required: true, message: "所属部门不能为空", trigger: "change" }
        ]
      },
      AddRole: false,
      EditRole: false,
      DeleteRole: false,
      RolePermission: false,

      IsSumbit: false
    };
  },
  created() {
    this.$store.dispatch("getPagePermission", "roleList").then(result => {
      this.AddRole = result.AddRole;
      this.EditRole = result.EditRole;
      this.DeleteRole = result.DeleteRole;
      this.RolePermission = result.RolePermission;
    });

    this.getDeptList();
    this.getList();
  },
  computed: {},
  filters: {},
  methods: {
    deptConvert(orgId) {
      var d = this.deptOptions.find(d => {
        return d.key == orgId;
      });
      if (d) {
        return d.display_name;
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
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.list = response.data.data;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.pageIndex = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageIndex = val;
      this.getList();
    },
    handleUpdate(row) {
      this.dialogStatus = "update";
      this.creatRolesForm = {
        roleId: row.roleId,
        roleName: row.roleName,
        orgId: row.orgId,
        description: row.description
      };
      this.dialogAddOrModifyFormVisible = true;
      this.$nextTick(() => {
        this.$refs["creatRolesForm"].clearValidate();
      });
    },
    handleCreate() {
      this.creatRolesForm = {
        roleId: 0,
        roleName: undefined,
        orgId: undefined,
        description: undefined
      };

      this.dialogStatus = "create";
      this.dialogAddOrModifyFormVisible = true;

      this.$nextTick(() => {
        this.$refs["creatRolesForm"].clearValidate();
      });
    },
    handleAllot(row) {
      this.roleId = row.roleId;
      this.dialogFormVisible = true;
      if (!this.menuData.length) {
        //全部菜单
        getMenuAndPermissionList().then(response => {
          this.listLoadingtree = false;
          this.menuData = response.data.data;
          //已选中菜单
          getMenuAndPermissionList(row.roleId).then(response => {
            var data = response.data.data;
            data.forEach(item => {
              var p = this.menuData.find(m => {
                return m.menuId == item.menuId;
              });
              p.check = true;
              item.children.forEach(child => {
                var c = p.children.find(m => {
                  return m.menuId == child.menuId;
                });
                c.check = true;
                child.permission.forEach(perm => {
                  c.permission.find(m => {
                    return m.permissionId == perm.permissionId;
                  }).check = true;
                });
              });
            });
          });
          //已选中菜单END
        });
      }
    },
    AddSumbit(dialogStatus) {
      this.IsSumbit = true;

      this.$refs["creatRolesForm"].validate(valid => {
        if (valid) {
          createOrModifyRole(this.creatRolesForm, dialogStatus)
            .then(response => {
              var data = response.data;

              this.dialogAddOrModifyFormVisible = false;

              this.$notify({
                title: "成功",
                message: "操作成功",
                type: "success",
                duration: 2000
              });

              this.handleFilter();
              this.IsSumbit = false;
            })
            .catch(() => {
              this.IsSumbit = false;
            });
        } else {
          this.IsSumbit = false;
        }
      });
    },
    handleDel(row) {
      this.$confirm(`此操作将永久删除【${row.roleName}】, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteRole(row.roleId).then(() => {
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
    },
    menucheck(row) {
      if (row.pMenuId == 0) {
        if (row.children) {
          row.children.forEach(c => {
            c.check = row.check;
            c.permission.forEach(p => {
              p.check = row.check;
            });
          });
        }
      } else {
        row.permission.forEach(p => {
          p.check = row.check;
        });
        var p = this.menuData.find(m => {
          return m.menuId == row.pMenuId;
        });
        if (row.check) {
          p.check = true;
        } else {
          if (
            p.children.filter(m => {
              return m.check;
            }).length == 0
          ) {
            p.check = false;
          }
        }
      }
    },
    permissioncheck(row, pMenuId, menuId) {
      if (row.check) {
        var p = this.menuData.find(m => {
          return m.menuId == pMenuId;
        });
        var m = p.children.find(m => {
          return m.menuId == menuId;
        });
        p.check = true;
        m.check = true;
      }
    },
    removeNotCheckMenus(m) {
      if (m.check) {
        this.menuIds.push(m.menuId);
        this.removeNotCheckPermissions(m.permission);
        if (m.children) {
          m.children.forEach(child => {
            if (child.check) {
              this.removeNotCheckMenus(child);
            }
          });
        }
      }
    },
    removeNotCheckPermissions(p) {
      p.forEach(child => {
        if (child.check) {
          this.permissionIds.push(child.permissionId);
        }
      });
    },
    modifyPermissionSumbit() {
      this.menuIds = [];
      this.permissionIds = [];

      this.menuData.forEach(m => {
        this.removeNotCheckMenus(m);
      });
      allocPermission(this.roleId, this.menuIds, this.permissionIds).then(
        () => {
          this.$message({
            type: "success",
            message: "授权成功!"
          });
          this.handleFilter();
          this.dialogFormVisible = false;
        }
      );
    }
  }
};
</script>