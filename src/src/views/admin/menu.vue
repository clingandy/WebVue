<template>
  <div class="app-container">

    <div class="filter-container">
      <el-button class="filter-item" v-if="AddMenu" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
    </div>

    <tree-table :data="data" border>
      <el-table-column label="菜单名称">
        <template slot-scope="scope">
          <span>{{scope.row.menuName}}</span>
        </template>
      </el-table-column>

      <el-table-column label="Vue文件">
        <template slot-scope="scope">
          <span>{{scope.row.vueFile}}</span>
        </template>
      </el-table-column>

      <el-table-column label="路径">
        <template slot-scope="scope">
          <span>{{scope.row.vueUrl}}</span>
        </template>
      </el-table-column>

      <el-table-column label="路由名称">
        <template slot-scope="scope">
          <span>{{scope.row.routerName}}</span>
        </template>
      </el-table-column>

      <el-table-column label="图标" width="50">
        <template slot-scope="scope">
          <span>
            <svg-icon :icon-class="scope.row.menuIcon" /> </span>
        </template>
      </el-table-column>

      <el-table-column label="权限值">
        <template slot-scope="scope">
          <el-tag style="margin-left: 1px;" v-for="r in scope.row.permission" :key="r.permissionName+'_'+r.permissionCode">{{r.permissionName}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="是否隐藏" width="80">
        <template slot-scope="scope">
          <!-- <el-tag :type="scope.row.IsShow | statusFilter">{{scope.row.isShow==1?"显示":"隐藏"}}</el-tag> -->
          <el-switch v-model="scope.row.isShow" @change="handleUpdateSwith(scope.row)"></el-switch>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" :label="$t('table.status')" width="100">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" @change="handleUpdateSwith(scope.row)"></el-switch>
        </template>
      </el-table-column>

      <el-table-column label="排序" width="50">
        <template slot-scope="scope">
          <span>{{scope.row.sort}}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="250px">
        <template slot-scope="scope">
          <el-button type="primary" v-if="EditPagePermission && scope.row.vueUrl!='noredirect'" size="mini" @click="modifyPermission(scope.row)"> 编辑权限 </el-button>
          <el-button type="primary" v-if="EditMenu" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
          <el-button size="mini" icon="el-icon-delete" v-if="DeleteMenu" type="danger" @click="handleDel(scope.row)"></el-button>
        </template>
      </el-table-column>
    </tree-table>

    <el-dialog :fullscreen="this.isMobile" :title="textMap[dialogStatus]" :visible.sync="dialogAddFormVisible">
      <el-form :rules="rules" ref="creatMenuForm" :model="creatmenu" label-position="left" label-width="100px" style='margin-left:50px;'>

        <el-form-item label='菜单名称' prop="menuName">
          <el-input autosize v-model="creatmenu.menuName" placeholder="Please input"></el-input>
        </el-form-item>

        <el-form-item label='Vue文件' prop="vueFile">
          <el-input autosize v-model="creatmenu.vueFile" placeholder="Please input"></el-input>
        </el-form-item>

        <el-form-item label='路径' prop="vueUrl">
          <el-input autosize v-model="creatmenu.vueUrl" placeholder="Please input"></el-input>
        </el-form-item>

        <el-form-item label='路由名称' prop="routerName">
          <el-input autosize v-model="creatmenu.routerName" placeholder="Please input"></el-input>
        </el-form-item>

        <el-form-item label='图标' prop="menuIcon">
          <el-input autosize v-model="creatmenu.menuIcon" placeholder="Please input"></el-input>
        </el-form-item>

        <el-form-item label='上级菜单' prop="pMenuId">
          <el-select autosize class="filter-item" v-model="creatmenu.pMenuId" placeholder="Please select">
            <el-option v-for="item in  menuOptions" :key="item.key" :label="item.display_name" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='是否显示' prop="isShow">
          <el-select autosize class="filter-item" v-model="creatmenu.isShow" placeholder="Please select">
            <el-option v-for="item in isShowOptions" :key="item.key" :label="item.display_name" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='是否可用' prop="status">
          <el-select autosize class="filter-item" v-model="creatmenu.status" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='排序' prop="sort">
          <el-input autosize v-model.number="creatmenu.sort" placeholder="Please input"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="AddSumbit(dialogStatus)">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑权限" width="45%" :visible.sync="dialogFormVisible">

      <el-form :inline="true" v-for="(p,index) in permissionCollection" :key="index" size="mini" class="demo-form-inline" style="width: auto">
        <el-form-item label="权限">
          <el-input v-model="p.permissionName"></el-input>
        </el-form-item>
        <el-form-item label="code">
          <el-input v-model="p.permissionCode"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="pdel(index)">delete</el-button>
          <el-button type="primary" @click="padd(p)">add</el-button>
        </el-form-item>
        <!-- style="margin-bottom:0px" -->
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="ModifyPermissionSumbit">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>


<script>
import treeTable from "@/components/TreeTable";
import {
  getmenulist,
  createOrModifyMenu,
  ModifyMenuPermission,
  deleteMenu
} from "@/api/menu";

const isShowOptions = [
  { key: true, display_name: "显示" },
  { key: false, display_name: "隐藏" }
];

const statusOptions = [
  { key: true, display_name: "可用" },
  { key: false, display_name: "不可用" }
];

export default {
  name: "menuList",
  components: { treeTable },

  data() {
    const validateInteger = (rule, value, callback) => {
      if (!value || !Number.isInteger(value)) {
        callback(new Error("请输入整数数字格式"));
      }
      callback();
    };

    return {
      data: [],
      isShowOptions,
      statusOptions,
      menuOptions: [{ key: 0, display_name: "没有上级" }],
      textMap: {
        update: "Edit",
        create: "Create"
      },
      dialogFormVisible: false,
      dialogAddFormVisible: false,
      dialogStatus: "",
      enumid: 0,
      permissionCollection: [],
      creatmenu: {
        menuId: 0,
        menuName: undefined,
        vueFile: undefined,
        vueUrl: undefined,
        routerName: undefined,
        menuIcon: undefined,
        isShow: true,
        status: true,
        sort: undefined,
        pMenuId: 0
      },
      rules: {
        menuName: [
          { required: true, message: "菜单名称不能为空", trigger: "blur" }
        ],
        vueFile: [
          { required: true, message: "Vue文件不能为空", trigger: "blur" }
        ],
        vueUrl: [
          {
            required: true,
            message: "路径不能为空,父菜单填写noredirect",
            trigger: "blur"
          }
        ],
        routerName: [
          { required: true, message: "路由名称不能为空", trigger: "blur" }
        ],
        sort: [
          { required: true, message: "序号不能为空", trigger: "blur" },
          { validator: validateInteger, trigger: "blur" }
        ]
      },
      AddMenu: false,
      EditMenu: false,
      DeleteMenu: false,
      EditPagePermission: false
    };
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
  created() {
    this.$store.dispatch("getPagePermission", "menuList").then(result => {
      this.AddMenu = result.AddMenu;
      this.EditMenu = result.EditMenu;
      this.DeleteMenu = result.DeleteMenu;
      this.EditPagePermission = result.EditPagePermission;
    });

    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      getmenulist().then(response => {
        this.listLoading = false;
        this.data = response.data.data;
        this.menuOptions = [{ key: 0, display_name: "没有上级" }];
        response.data.data.forEach(m => {
          if (!m.pMenuId) {
            this.menuOptions.push({ key: m.menuId, display_name: m.menuName });
          }
        });
      });
    },
    modifyPermission(row) {
      this.enumid = row.menuId;
      this.permissionCollection = [];
      if (!row.permission || row.permission.length == 0) {
        this.permissionCollection.push({
          permissionCode: "",
          permissionName: ""
        });
      } else {
        row.permission.forEach(element => {
          this.permissionCollection.push({
            permissionCode: element.permissionCode,
            permissionName: element.permissionName
          });
        });
      }
      this.dialogFormVisible = true;
    },
    AddSumbit(dialogStatus) {
      this.$refs["creatMenuForm"].validate(valid => {
        if (valid) {
          this.ReqAddEditSumbit(dialogStatus, false);
        }
      });
    },
    ReqAddEditSumbit(dialogStatus, isSwith) {
      createOrModifyMenu(this.creatmenu, dialogStatus).then(response => {
        var data = response.data;
        this.dialogAddFormVisible = false;
        this.$notify({
          title: "成功",
          message: "操作成功",
          type: "success",
          duration: 2000
        });
        if (!isSwith) {
          this.getList();
        }
      });
    },

    handleCreate() {
      this.dialogStatus = "create";
      this.dialogAddFormVisible = true;

      (this.creatmenu = {
        menuId: 0,
        menuName: undefined,
        vueFile: undefined,
        vueUrl: undefined,
        routerName: undefined,
        menuIcon: undefined,
        isShow: true,
        status: true,
        sort: undefined,
        pMenuId: 0
      }),
        this.$nextTick(() => {
          this.$refs["creatMenuForm"].clearValidate();
        });
    },
    handleUpdate(row) {
      this.dialogStatus = "update";

      this.creatmenu = {
        menuId: row.menuId,
        menuName: row.menuName,
        vueFile: row.vueFile,
        vueUrl: row.vueUrl,
        routerName: row.routerName,
        menuIcon: row.menuIcon,
        isShow: row.isShow,
        status: row.status,
        sort: row.sort,
        pMenuId: row.pMenuId
      };

      this.dialogAddFormVisible = true;
      this.$nextTick(() => {
        this.$refs["creatMenuForm"].clearValidate();
      });
    },
    handleUpdateSwith(row) {
      if (!this.EditMenu) return;
      this.creatmenu = {
        menuId: row.menuId,
        menuName: row.menuName,
        vueFile: row.vueFile,
        vueUrl: row.vueUrl,
        routerName: row.routerName,
        menuIcon: row.menuIcon,
        isShow: row.isShow,
        status: row.status,
        sort: row.sort,
        pMenuId: row.pMenuId
      };
      this.ReqAddEditSumbit("update", true);
    },
    handleDel(row) {
      this.$confirm(`此操作将永久删除【${row.menuName}】, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteMenu(row.menuId).then(() => {
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
    },
    ModifyPermissionSumbit() {
      ModifyMenuPermission(this.enumid, this.permissionCollection).then(() => {
        this.dialogFormVisible = false;
        this.$notify({
          title: "成功",
          message: "操作成功",
          type: "success",
          duration: 2000
        });
        this.getList();
      });
    },
    padd() {
      this.permissionCollection.push({
        permissionCode: "",
        permissionName: ""
      });
    },
    pdel(index) {
      if (this.permissionCollection.length == 1) {
        this.permissionCollection = [
          { permissionCode: "", permissionName: "" }
        ];
      } else {
        this.permissionCollection.splice(index, 1);
      }
    }
  }
};
</script>