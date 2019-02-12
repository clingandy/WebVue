<template>
  <div class="app-container calendar-list-container">

    <div class="filter-container">
      <selectDict @get-data="getQueryDictData" :data="dictQueryData"></selectDict>

      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.material" placeholder="材质">
        <el-option v-for="item in materialOptions" :key="item.key" :label="item.display_name" :value="item.key">
        </el-option>
      </el-select>

      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.exterior" placeholder="外观">
        <el-option v-for="item in exteriorOptions" :key="item.key" :label="item.display_name" :value="item.key">
        </el-option>
      </el-select>

      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="产品规格" v-model="listQuery.specification"></el-input>

      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-refresh" @click="handleReset">{{$t('table.reset')}}</el-button>
      <el-button class="filter-item" v-if="importProduct" style="margin-left: 10px;" @click="handleDownload" type="primary" icon="el-icon-download">模板</el-button>
      <el-button class="filter-item" v-if="importProduct" style="margin-left: 10px;" @click="handleImport" type="primary" icon="el-icon-upload2">{{$t('table.import')}}</el-button>
      <el-button class="filter-item" v-if="addProduct" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" :label="$t('table.id')" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.productId}}</span>
        </template>
      </el-table-column>

      <el-table-column align="left" label="产品分类 产品名称 规格 材质 外观" width="420">
        <template slot-scope="scope">
          <img style="width:50px;height:50px;" :src="getFileUrl(scope.row.imgUrl)">
          <span>{{getProductFullName(scope.row)}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="包重量（KG）">
        <template slot-scope="scope">
          <span>{{scope.row.packageWeight|toFixed(3)}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="参考价格（元）">
        <template slot-scope="scope">
          <span>{{scope.row.proposedPrice|toFixed(2)}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="零售价格（元）">
        <template slot-scope="scope">
          <span>{{scope.row.retailPrice|toFixed(2)}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="进货价格（元）">
        <template slot-scope="scope">
          <span>{{scope.row.purchasePrice|toFixed(2)}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="成本价格（元）">
        <template slot-scope="scope">
          <span>{{scope.row.costPrice|toFixed(2)}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('table.status')">
        <template slot-scope="scope">
          <el-tag style="margin-left: 1px;" :type="scope.row.status == 1? 'success':'danger'">{{typeConvert(scope.row.status, statusOptions)}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="修改时间">
        <template slot-scope="scope">
          <span>{{scope.row.modifyTime|formatDate("yyyy-MM-dd hh:mm")}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('table.actions')" width="200px" class-name="small-padding">
        <template slot-scope="scope">
          <el-button type="primary" v-if="editProduct" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
          <el-button type="primary" v-if="editProduct" size="mini" @click="navigateTo(scope.row)">历史</el-button>
          <el-button type="primary" v-if="scope.row.status==1" size="mini" icon="el-icon-goods" @click="handleAddToOrderItem(scope.row)"></el-button>
          <!-- <el-button size="mini" v-if="deleteProduct" type="danger" icon="el-icon-delete" @click="handleDel(scope.row)"></el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageIndex" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :fullscreen="this.isMobile" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="creatProductForm" :model="createProduct" label-position="left" label-width="130px" style='margin-left:50px;'>

        <selectDict @get-data="getFormDictData" :data="dictFormData"></selectDict>

        <el-form-item label='规格' prop="specification">
          <el-input autosize v-model="createProduct.specification" placeholder="Please input"></el-input>
        </el-form-item>

        <el-form-item label='状态' prop="status">
          <el-select autosize class="filter-item" v-model="createProduct.status" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='材质' prop="material">
          <el-select autosize class="filter-item" v-model="createProduct.material" placeholder="Please select">
            <el-option v-for="item in materialOptions" :key="item.key" :label="item.display_name" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='外观' prop="exterior">
          <el-select autosize class="filter-item" v-model="createProduct.exterior" placeholder="Please select">
            <el-option v-for="item in exteriorOptions" :key="item.key" :label="item.display_name" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='大小（MM）' prop="size">
          <el-input autosize v-model="createProduct.size" placeholder="Please input"></el-input>
        </el-form-item>

        <el-form-item label='厚度（MM）' prop="thickness">
          <el-input autosize v-model="createProduct.thickness" placeholder="Please input"></el-input>
        </el-form-item>

        <el-form-item label='重量（KG）' prop="weight">
          <el-input autosize v-model="createProduct.weight" placeholder="Please input"></el-input>
        </el-form-item>

        <el-form-item label='包重量（KG）' prop="packageWeight">
          <el-input autosize v-model="createProduct.packageWeight" placeholder="Please input"></el-input>
        </el-form-item>

        <el-form-item label='参考价格' prop="proposedPrice">
          <el-input autosize v-model="createProduct.proposedPrice" placeholder="Please input"></el-input>
        </el-form-item>

        <el-form-item label='零售价格' prop="retailPrice">
          <el-input autosize v-model="createProduct.retailPrice" placeholder="Please input"></el-input>
        </el-form-item>

        <el-form-item label='进货价格' prop="purchasePrice">
          <el-input autosize v-model="createProduct.purchasePrice" placeholder="Please input"></el-input>
        </el-form-item>

        <el-form-item label='成本价格' prop="costPrice">
          <el-input autosize v-model="createProduct.costPrice" placeholder="Please input"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="addSumbit(dialogStatus)">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :fullscreen="this.isMobile" title="批量导入" :visible.sync="dialogUploadVisible">
      <el-upload drag accept=".xlsx" :action="uploadUrl()" :on-success="uploadSuccess" :before-upload="beforeAvatarUpload" :show-file-list="false" :headers="uploadHeaders">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" style="color:red" class="el-upload__tip"> *请按照模板格式上传10M内文件，上传文件格式只能是office2007以上版本的xlsx</div>
        <div slot="tip" style="color:red" class="el-upload__tip">导入状态：{{uploadMsg}}</div>
      </el-upload>
    </el-dialog>
  </div>
</template>    


<script>
import {
  getProductPageList,
  createOrModifyProduct,
  downloadProductTemplate,
  getDictByType
} from "@/api/screw";
import selectDict from "@/views/components/selectDict";
import { getToken } from "@/utils/auth";
import waves from "@/directive/waves"; // 水波纹指令

const statusOptions = [
  { key: 1, display_name: "上架" },
  { key: 2, display_name: "下架" }
];

export default {
  name: "productList",
  directives: { waves },
  data() {
    const validateInteger = (rule, value, callback) => {
      if (!Number.isInteger(value)) {
        callback(new Error("请输入整数数字格式"));
      }
      callback();
    };

    return {
      dictQueryData: {
        text: "请选择产品分类",
        cText: "请选择产品名称",
        id: undefined,
        childId: undefined,
        type: 1,
        childType: 2
      },
      dictFormData: {
        text: "产品分类",
        cText: "产品名称",
        prop: "productType",
        propChild: "productNameType",
        id: undefined,
        childId: undefined,
        type: 1,
        childType: 2,
        isForm: true
      },
      statusOptions,
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create"
      },
      uploadMsg: "",
      uploadHeaders: {
        Token: getToken()
      },
      dialogFormVisible: false,
      dialogUploadVisible: false,
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
        productType: undefined,
        productNameType: undefined,
        material: undefined,
        exterior: undefined,
        specification: undefined
      },
      productTypeOptions: [],
      productNameTypeOptions: [],
      formProductNameTypeOptions: [],
      queryProductNameTypeOptions: [],
      materialOptions: [],
      exteriorOptions: [],
      createProduct: {},
      rules: {
        productType: [
          { required: true, message: "产品分类不能为空", trigger: "blur" }
        ],
        productNameType: [
          { required: true, message: "产品名称不能为空", trigger: "blur" }
        ],
        specification: [
          { required: true, message: "规则不能为空", trigger: "blur" },
          { min: 2, max: 20, message: "长度在2到20个字符", trigger: "blur" }
        ],
        size: [
          { required: true, message: "大小不能为空", trigger: "blur" },
          { type: "number", validator: validateInteger, trigger: "blur" }
        ],
        thickness: [
          { required: true, message: "厚度不能为空", trigger: "blur" },
          { type: "number", validator: validateInteger, trigger: "blur" }
        ],
        weight: [
          { required: true, message: "重量不能为空", trigger: "blur" },
          {
            type: "number",
            message: "请输入数字格式",
            trigger: "blur",
            transform(value) {
              return Number(value);
            }
          }
        ],
        packageWeight: [
          { required: true, message: "包重量不能为空", trigger: "blur" },
          {
            type: "number",
            message: "请输入数字格式",
            trigger: "blur",
            transform(value) {
              return Number(value);
            }
          }
        ],
        proposedPrice: [
          { required: true, message: "参考价格不能为空", trigger: "change" },
          {
            type: "number",
            message: "请输入数字格式",
            trigger: "blur",
            transform(value) {
              return Number(value);
            }
          }
        ],
        retailPrice: [
          { required: true, message: "零售价格不能为空", trigger: "change" },
          {
            type: "number",
            message: "请输入数字格式",
            trigger: "blur",
            transform(value) {
              return Number(value);
            }
          }
        ],
        purchasePrice: [
          { required: true, message: "进货价格不能为空", trigger: "change" },
          {
            type: "number",
            message: "请输入数字格式",
            trigger: "blur",
            transform(value) {
              return Number(value);
            }
          }
        ],
        costPrice: [
          { required: true, message: "成本价格不能为空", trigger: "change" },
          {
            type: "number",
            message: "请输入数字格式",
            trigger: "blur",
            transform(value) {
              return Number(value);
            }
          }
        ]
      },
      addProduct: false,
      editProduct: false,
      deleteProduct: false,
      importProduct: false
    };
  },
  watch: {},
  components: {
    selectDict: selectDict
  },
  created() {
    this.$store.dispatch("getPagePermission", "productList").then(result => {
      this.addProduct = result.addProduct;
      this.editProduct = result.editProduct;
      this.deleteProduct = result.deleteProduct;
      this.importProduct = result.importProduct;
    });
    this.getDictByType(1, this.productTypeOptions);
    this.getDictByType(2, this.productNameTypeOptions);
    this.getDictByType(3, this.materialOptions);
    this.getDictByType(4, this.exteriorOptions);
    this.getList();
  },
  methods: {
    getFileUrl(val){
      return process.env.FILE_API + val;
    },
    getProductFullName(row) {
      return (
        this.typeConvert(row.productType, this.productTypeOptions) +
        " " +
        this.typeConvert(row.productNameType, this.productNameTypeOptions) +
        " " +
        row.specification +
        " " +
        this.typeConvert(row.material, this.materialOptions) +
        " " +
        this.typeConvert(row.exterior, this.exteriorOptions)
      );
    },
    getQueryDictData(data) {
      this.listQuery.productType = this.dictQueryData.id = data.id;
      this.listQuery.productNameType = this.dictQueryData.childId =
        data.childId;
    },
    getFormDictData(data) {
      this.createProduct.productType = this.dictFormData.id = data.id;
      this.createProduct.productNameType = this.dictFormData.childId =
        data.childId;
    },
    typeConvert(type, option) {
      var d = option.find(d => {
        return d.key == type;
      });
      if (d) {
        return d.display_name;
      }
    },
    getDictByType(type, dataOptions) {
      getDictByType(type).then(response => {
        var data = response.data.data;
        data.forEach(d => {
          dataOptions.push({ key: d.key, display_name: d.value });
        });
      });
    },
    getList() {
      this.listLoading = true;
      getProductPageList(this.listQuery).then(response => {
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
    handleReset() {
      this.listQuery.productType = this.dictQueryData.id = undefined;
      this.listQuery.productNameType = this.dictQueryData.childId = undefined;
      this.listQuery.material = undefined;
      this.listQuery.exterior = undefined;
      this.listQuery.specification = undefined;
    },
    handleFilter() {
      this.listQuery.pageIndex = 1;
      this.getList();
    },
    navigateTo(row) {
      this.$router.push({
        path: "/screw/productHistory",
        query: { pid: row.productId }
      });
    },
    handleAddToOrderItem(row) {
      this.$store.dispatch("addOrderItem", row);
    },
    handleCreate() {
      this.dialogStatus = "create";
      this.dialogFormVisible = true;

      this.dictFormData.id = undefined;
      this.dictFormData.childId = undefined;

      this.createProduct = {
        productId: 0,
        productType: undefined,
        productNameType: undefined,
        specification: undefined,
        material: this.materialOptions[0].key,
        exterior: this.exteriorOptions[0].key,
        size: 0,
        thickness: 0,
        weight: 0,
        packageWeight: undefined,
        proposedPrice: undefined,
        retailPrice: undefined,
        purchasePrice: undefined,
        costPrice: undefined,
        status: 1,
        ImgUrl: undefined
      };

      this.$nextTick(() => {
        this.$refs["creatProductForm"].clearValidate();
      });
    },
    handleUpdate(row) {
      this.dialogStatus = "update";

      this.dictFormData.id = row.productType;
      this.dictFormData.childId = row.productNameType;

      this.createProduct = {
        productId: row.productId,
        productType: row.productType,
        productNameType: row.productNameType,
        specification: row.specification,
        material: row.material,
        exterior: row.exterior,
        size: row.size,
        thickness: row.thickness,
        weight: row.weight,
        packageWeight: row.packageWeight,
        proposedPrice: row.proposedPrice,
        retailPrice: row.retailPrice,
        purchasePrice: row.purchasePrice,
        costPrice: row.costPrice,
        status: row.status,
        ImgUrl: row.ImgUrl
      };
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["creatProductForm"].clearValidate();
      });
    },
    addSumbit(dialogStatus) {
      this.$refs["creatProductForm"].validate(valid => {
        if (valid) {
          this.reqAddEditSumbit(dialogStatus, false);
        }
      });
    },
    reqAddEditSumbit(dialogStatus, isSwith) {
      createOrModifyProduct(this.createProduct, dialogStatus).then(response => {
        this.dialogFormVisible = false;
        this.$notify({
          title: "成功",
          message: "操作成功",
          type: "success",
          duration: 2000
        });
        if (!isSwith) {
          this.handleFilter();
        }
      });
    },
    handleDownload() {
      this.$confirm(`确定下载模板, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          downloadProductTemplate().then(r => {
            this.$message({
              type: "info",
              message: "下载成功"
            });
          });
          //window.location.href = process.env.BASE_API + "/order/downloadProductTemplate";
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消下载"
          });
        });
    },
    handleImport() {
      this.dialogUploadVisible = true;
    },
    uploadUrl() {
      return process.env.BASE_API + "/order/ImportProduct";
    },
    beforeAvatarUpload(file) {
      const isType =
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isType) {
        this.$message.error("上传文件只能是 xlsx 格式!");
      }
      if (!isLt10M) {
        this.$message.error("上传文件大小不能超过 10MB!");
      }
      return isType && isLt10M;
    },
    uploadSuccess(response, file, fileList) {
      this.uploadMsg = response.msg;
      if (response.code != 200) {
        this.$message({
          message: response.msg,
          type: "error",
          duration: 2000
        });
      } else {
        this.$notify({
          title: "成功",
          message: `成功导入数据`,
          type: "success",
          duration: 2000
        });
        this.handleFilter();
      }
    },
    handleDel(row) {
      this.$confirm(
        `此操作将永久删除【${row.specification}】, 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          deleteProduct(row.productId).then(() => {
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