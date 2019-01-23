<template>
  <div class="app-container calendar-list-container">

    <div class="filter-container">
      <el-button class="filter-item" v-if="addClientAddress" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>  
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="旺旺名称">
        <template slot-scope="scope">
          <span v-if="scope">{{pageQuery.clientName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="详细地址">
        <template slot-scope="scope">
          <span>{{scope.row.fullAddress}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="手机号码">
        <template slot-scope="scope">
          <span>{{scope.row.mobile}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('table.actions')"  style="width: 100%" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" v-if="editClientAddress" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button> 
          <el-button size="mini" v-if="deleteClientAddress && list != null && list.length > 1" type="danger" icon="el-icon-delete" @click="handleDel(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :fullscreen="this.isMobile" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="creatClientAddressForm" :model="creatClientAddress" label-position="left" label-width="100px" style='margin-left:50px;'>
        
        <el-form-item label='旺旺名称'>
          <el-input autosize v-model="pageQuery.clientName" placeholder="Please input" disabled></el-input>
        </el-form-item> 

        <city @get-data="getCityData" :data="creatClientAddress"></city>     

        <el-form-item label='详细地址' prop="address">
          <el-input autosize v-model="creatClientAddress.address" placeholder="Please input"></el-input>
        </el-form-item>

        <el-form-item label='手机号码' prop="mobile">
          <el-input autosize v-model.number="creatClientAddress.mobile" placeholder="Please input"></el-input>
        </el-form-item> 

        <el-form-item label=''>
          <el-tag type="danger">地址=省+市+区+详细地址</el-tag>
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
import { getClientAddressList, createOrModifyClientAddress, delClientAddress } from "@/api/screw";
import city from "@/views/components/city";
import {validateMobile} from "@/utils/validate";
import waves from "@/directive/waves"; // 水波纹指令

const sexOptions = [
  { key: true, display_name: "男" },
  { key: false, display_name: "女" }
];

export default {
  name: "clientAddressList",
  directives: { waves },
  components: {
    city: city
  },
  data() {
    const validateMobileData = (rule, value, callback) => {
      if (value && !validateMobile(value)) {
        callback(new Error("请输入正确的手机号码"));
      }
      callback();
    };
    return {
      textMap: {
        update: "Edit",
        create: "Create"
      },
      dialogStatus: "",
      dialogFormVisible: false,
      tableKey: 0,
      list: null,
      listLoading: true,
      pageQuery: {
        clientId: undefined,
        clientName: undefined,
        mobile: undefined
      },
      cityData:{
        provinceId: undefined,
        provinceName: undefined,
        cityId: undefined,
        cityName: undefined,
        areaId: undefined,
        areaName: undefined
      },
      creatClientAddress: {},
      rules: {
        address: [
          { required: true, message: "详细地址不能为空", trigger: "blur" },
          { min: 2, max: 20, message: "长度在2到20个字符", trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
          { validator: validateMobileData, trigger: "blur" }
        ]
      },
      
      addClientAddress: false,
      editClientAddress: false,
      deleteClientAddress: false
    };
  },
  watch: {},
  created() {
    this.$store.dispatch("getPagePermission", "clientAddressList").then(result => {
      this.addClientAddress = result.addClientAddress;
      this.editClientAddress = result.editClientAddress;
      this.deleteClientAddress = result.deleteClientAddress;
    });
    this.pageQuery.clientId=this.$route.query.clientId,
    this.pageQuery.clientName=this.$route.query.clientName,
    this.pageQuery.mobile=this.$route.query.mobile,
    this.getList();
  },
  methods: {
    getCityData(data) {
      this.creatClientAddress=data;
    },
    getList() {
      this.listLoading = true;
      getClientAddressList(this.pageQuery.clientId).then(response => {
        this.list = response.data.data;
        this.listLoading = false;
      });
    },
    handleCreate() {
      this.dialogStatus = "create";
      this.dialogFormVisible = true;

      this.creatClientAddress = {
        clientAddressId: 0,
        clientId: this.pageQuery.clientId,
        fullAddress: undefined,
        mobile: this.pageQuery.mobile,
        address: undefined,
        provinceId: undefined,
        provinceName: undefined,
        cityId: undefined,
        cityName: undefined,
        areaId: undefined,
        areaName: undefined
      };

      this.$nextTick(() => {
        this.$refs["creatClientAddressForm"].clearValidate();
      });
    },
    handleUpdate(row) {
      this.dialogStatus = "update";

      this.creatClientAddress = {
        clientAddressId: row.clientAddressId,
        clientId: row.clientId,
        fullAddress: row.fullAddress,
        mobile: row.mobile,
        address: row.address,
        provinceId: row.provinceId,
        provinceName: row.provinceName,
        cityId: row.cityId,
        cityName: row.cityName,
        areaId: row.areaId,
        areaName: row.areaName
      };

      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["creatClientAddressForm"].clearValidate();
      });
    },
    setFullAddress(){
      this.creatClientAddress.fullAddress="";
      if(this.creatClientAddress.provinceName){
        this.creatClientAddress.fullAddress=this.creatClientAddress.provinceName;
      }
      if(this.creatClientAddress.cityName){
        this.creatClientAddress.fullAddress=this.creatClientAddress.fullAddress+' '+this.creatClientAddress.cityName;
      }
      if(this.creatClientAddress.areaName){
        this.creatClientAddress.fullAddress=this.creatClientAddress.fullAddress+' '+this.creatClientAddress.areaName;
      }
      this.creatClientAddress.fullAddress=this.creatClientAddress.fullAddress+' '+this.creatClientAddress.address;
    },
    addSumbit(dialogStatus) {
      this.$refs["creatClientAddressForm"].validate(valid => {
        if (valid) {
          this.reqAddEditSumbit(dialogStatus, false);
        }
      });
    },
    reqAddEditSumbit(dialogStatus, isSwith) {
      this.setFullAddress();
      createOrModifyClientAddress(this.creatClientAddress, dialogStatus).then(response => {
        this.dialogFormVisible = false;

        this.$notify({
          title: "成功",
          message: "操作成功",
          type: "success",
          duration: 2000
        });
        if (!isSwith){
          this.getList();
        }
      });
    },
    handleDel(row) {
      this.$confirm(`此操作将永久删除【${row.fullAddress}】, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delClientAddress(row.clientAddressId).then(() => {
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