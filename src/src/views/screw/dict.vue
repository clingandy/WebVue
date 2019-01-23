<template>
  <div class="app-container calendar-list-container">

    <div class="filter-container">

      <el-select clearable class="filter-item" style="width: 130px"  @change="changeQueryDictType" v-model="listQuery.dictType"  placeholder="所属分类">
        <el-option v-for="item in dictTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
        </el-option>
      </el-select>

      <el-select clearable class="filter-item" v-if="queryPDictkeyStatus" style="width: 130px" v-model="listQuery.pDictKey"  placeholder="父级">
        <el-option v-for="item in queryPDictOptions" :key="item.key" :label="item.display_name" :value="item.key">
        </el-option>
      </el-select>

      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="字典值" v-model="listQuery.dictValue"></el-input>
            
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      <el-button class="filter-item" v-if="addDict" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>  
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">

      <!-- <el-table-column align="center" :label="$t('table.id')" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.dictId}}</span>
        </template>
      </el-table-column>  -->

      <el-table-column align="center" label="所属分类">
        <template slot-scope="scope">
          <span>{{ dictTypeConvert(scope.row.dictType)}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="标记值">
        <template slot-scope="scope">
          <span>{{scope.row.dictKey}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="显示文本">
        <template slot-scope="scope">
          <span>{{scope.row.dictValue}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="排序">
        <template slot-scope="scope">
           <span>{{ scope.row.sort }}</span>
        </template>
      </el-table-column>

       <el-table-column class-name="status-col" :label="$t('table.status')" width="100">
        <template slot-scope="scope">
          <el-switch  v-model="scope.row.status" @change="handleUpdateSwith(scope.row)" ></el-switch>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('table.actions')"  style="width: 100%" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" v-if="editDict" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageIndex" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>


    <el-dialog :fullscreen="this.isMobile" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="creatDictForm" :model="createDict" label-position="left" label-width="100px" style='margin-left:50px;'>

        <el-form-item label='所属分类' v-if="dialogStatus=='create'" prop="dictType">
          <el-select autosize class="filter-item" v-model="createDict.dictType" @change="changeDictType" placeholder="Please select">
            <el-option v-for="item in dictTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='父级' v-if="pDictkeyStatus && dialogStatus=='create'" prop="pDictKey">
          <el-select autosize class="filter-item" v-model="createDict.pDictKey" placeholder="Please select">
            <el-option v-for="item in pDictOptions" :key="item.key" :label="item.display_name" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='标记值' v-if="dialogStatus=='create'" prop="dictKey">
          <el-input autosize v-model.number="createDict.dictKey" placeholder="Please input"></el-input>
        </el-form-item> 

        <el-form-item label='显示文本' prop="dictValue">
          <el-input autosize v-model="createDict.dictValue" placeholder="Please input"></el-input>
        </el-form-item>

        <el-form-item label='排序' prop="sort">
          <el-input autosize v-model.number="createDict.sort" placeholder="Please input"></el-input>
        </el-form-item>

        <el-form-item label='状态' prop="status">
          <el-select autosize class="filter-item" v-model="createDict.status" placeholder="Please select">
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
import { getDictPageList, getDictType, getDictByType, createOrModifyDict } from "@/api/screw";
import waves from "@/directive/waves"; // 水波纹指令

const statusOptions = [
  { key: true, display_name: "正常" },
  { key: false, display_name: "停用" }
];

export default {
  name: "dictList",
  directives: { waves },
  data() {
    const validateInteger = (rule, value, callback) => {
      if (!Number.isInteger(value)) {
          callback(new Error("请输入整数数字格式"));
      }
      callback();
    };

    return {
      statusOptions,
      dialogStatus: "",
      pDictkeyStatus: false,
      queryPDictkeyStatus: false,
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
        dictValue: undefined,
        dictType: undefined
      },
      dictTypeOptions: [],
      pDictOptions: [],
      queryPDictOptions:[],
      createDict: {
        dictId: 0,
        dictType: 1,
        dictKey: undefined,
        pDictKey: undefined,
        dictValue: undefined,
        sort: undefined,
        status: true
      },
      rules: {
        pDictKey: [
          { required: true, message: "父级不能为空", trigger: "blur" },
        ],
        dictKey: [
          { required: true, message: "key不能为空", trigger: "blur" },
          { validator: validateInteger, trigger: "blur"}
        ],
        dictValue: [
          { required: true, message: "value不能为空", trigger: "blur" },
          { min: 2, max: 25, message: "长度在2到25个字符", trigger: "blur" }
        ],
        sort: [
          { required: true, message: "排序不能为空", trigger: "blur" },
          { validator: validateInteger, trigger: "blur"}
        ]
      },
      addDict: false,
      editDict: false
    };
  },
  watch: {},
  created() {
    this.$store.dispatch("getPagePermission", "dictList").then(result => {
      this.addDict = result.addDict;
      this.editDict = result.editDict;
    });

    this.getDictType();
    this.getList();
  },
  methods: {
    dictTypeConvert(dictType) {
      var d = this.dictTypeOptions.find(d => {
        return d.key == dictType;
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
    changeDictType(key){
      this.pDictkeyStatus = false;
      if(key != 2)  return; //目前只有2类别需要
      this.pDictkeyStatus = true;
      this.getDictByType(1, this.pDictOptions);
    },
    changeQueryDictType(key){
      this.queryPDictkeyStatus = false;
      if(key != 2)  return; //目前只有2类别需要
      this.queryPDictkeyStatus = true;
      this.getDictByType(1, this.queryPDictOptions);
    },
    getDictByType(type, Options){
      if(Object.keys(Options).length != 0) return;
      getDictByType(type).then(response => {
        var data = response.data.data;
        data.forEach(d => {
          Options.push({ key: d.key, display_name: d.value });
        });
      });
    },
    getDictType() {
      getDictType().then(response => {
        var data = response.data.data;
        data.forEach(d => {
          this.dictTypeOptions.push({ key: d.key, display_name: d.value });
        });
      });
    },
    getList() {
      this.listLoading = true;
      getDictPageList(this.listQuery).then(response => {
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
      this.changeDictType(this.listQuery.dictType);

      this.createDict = {
        dictId: 0,
        dictType: this.listQuery.dictType ? this.listQuery.dictType : this.dictTypeOptions[0].key,
        dictKey: undefined,
        pDictKey: undefined,
        dictValue: undefined,
        sort: undefined,
        status: true
      };

      this.$nextTick(() => {
        this.$refs["creatDictForm"].clearValidate();
      });
    },
    handleUpdate(row) {
      this.dialogStatus = "update";
      this.changeDictType(row.dictType);

      this.createDict = {
        dictId: row.dictId,
        dictType: row.dictType,
        dictKey: row.dictKey,
        pDictKey: row.pDictKey,
        dictValue: row.dictValue,
        sort: row.sort,
        status: row.status
      };
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["creatDictForm"].clearValidate();
      });
    },
    handleUpdateSwith(row) {
      if(!this.editDict)return;
      this.createDict = {
        dictId: row.dictId,
        dictType: row.dictType,
        dictKey: row.dictKey,
        pDictKey: row.pDictKey,
        dictValue: row.dictValue,
        sort: row.sort,
        status: row.status
      };
      this.reqAddEditSumbit("update", true);
    },
    addSumbit(dialogStatus) {
      this.$refs["creatDictForm"].validate(valid => {
        if (valid) {
          this.reqAddEditSumbit(dialogStatus, false);
        }
      });
    },
    reqAddEditSumbit(dialogStatus, isSwith) {
      createOrModifyDict(this.createDict, dialogStatus).then(response => {
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