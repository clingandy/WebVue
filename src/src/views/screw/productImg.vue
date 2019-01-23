<template>
  <div class="app-container calendar-list-container">

    <div class="filter-container">

      <el-select clearable class="filter-item" placeholder="请选择产品分类" style="width: 130px" v-model="listQuery.productType">
        <el-option v-for="item in productTypeOptions" :key="item.key" :label="item.value" :value="item.key">
        </el-option>
      </el-select>

      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="getList">{{$t('table.search')}}</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" :label="$t('table.id')" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.productNameType}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="产品名称">
        <template slot-scope="scope">
          <span>{{scope.row.productName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="图片">
        <template slot-scope="scope">
          <img style="width:60px;height:60px;" :src="getFileUrl(scope.row.imgUrl)">
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('table.actions')" style="width: 100%" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" v-if="editImg" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :fullscreen="this.isMobile" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="createProductImgForm" :model="createProductImg" label-position="left" label-width="100px" style='margin-left:50px;'>

        <el-form-item label='当前图片' prop="imgUrl">
          <img style="width:60px;height:60px;" :src="getFileUrl(createProductImg.imgUrl)">
          <el-input autosize v-model="createProductImg.imgUrl" placeholder="Please input" style="display:none;"></el-input>
        </el-form-item>

        <el-upload drag :action="uploadUrl()" :on-success="uploadSuccess" :before-upload="beforeAvatarUpload" :show-file-list="false" :headers="uploadHeaders">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div slot="tip" style="color:red" class="el-upload__tip"> *请上传200K内图片，上传文件格式只能是png|jpg</div>
        </el-upload>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="addSumbit(dialogStatus)">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>    


<script>
import {
  GetProductImgAll,
  getDictByType,
  createOrModifyProductImg
} from "@/api/screw";
import { getToken } from "@/utils/auth";
import waves from "@/directive/waves"; // 水波纹指令

export default {
  name: "productImgList",
  directives: { waves },
  data() {
    return {
      textMap: {
        update: "Edit",
        create: "Create"
      },
      dialogStatus: "",
      dialogFormVisible: false,
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        productType: undefined
      },
      uploadHeaders: {
        Token: getToken()
      },
      productTypeOptions: [],
      createProductImg: {
        productScrewImgId: 0,
        productNameType: undefined,
        imgUrl: undefined
      },
      editImg: false
    };
  },
  watch: {},
  created() {
    this.$store.dispatch("getPagePermission", "productImgList").then(result => {
      this.editImg = result.editImg;
    });

    this.getList();
    this.getDictByType(1, this.productTypeOptions);
  },
  methods: {
    getDictByType(type, Options) {
      getDictByType(type).then(response => {
        var data = response.data.data;
        data.forEach(d => {
          Options.push({ key: d.key, value: d.value });
        });
      });
    },
    getFileUrl(val){
      return process.env.FILE_API + val;
    },
    getList() {
      this.listLoading = true;
      GetProductImgAll(this.listQuery).then(response => {
        this.list = response.data.data;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    uploadUrl() {
      return process.env.BASE_API + "/order/UploadProductImg";
    },
    beforeAvatarUpload(file) {
      const isType = file.type === "image/png" || file.type === "image/jpeg";
      const isLtSize = file.size / 1024 / 200;
      if (!isType) {
        this.$message.error("上传文件只能是 png|jpg 格式!");
      }
      if (!isLtSize) {
        this.$message.error("上传图片大小不能超过 200KB!");
      }
      return isType && isLtSize;
    },
    uploadSuccess(response, file, fileList) {
      if (response.code != 200) {
        this.$message({
          message: response.msg,
          type: "error",
          duration: 2000
        });
      } else {
        this.$notify({
          title: "成功",
          message: `成功上传图片`,
          type: "success",
          duration: 2000
        });
        this.createProductImg.imgUrl = response.data
      }
    },
    handleUpdate(row) {
      this.dialogStatus = "update";
      if (row.productScrewImgId === 0) {
        this.dialogStatus = "create";
      }

      this.createProductImg = {
        productScrewImgId: row.productScrewImgId,
        productNameType: row.productNameType,
        imgUrl: row.imgUrl
      };
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["createProductImgForm"].clearValidate();
      });
    },
    addSumbit(dialogStatus) {
      this.$refs["createProductImgForm"].validate(valid => {
        if (valid) {
          createOrModifyProductImg(this.createProductImg, dialogStatus).then(
            response => {
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: "操作成功",
                type: "success",
                duration: 2000
              });
            }
          );
        }
      });
    }
  }
};
</script>