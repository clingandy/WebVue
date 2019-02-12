<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="商品名称" v-model="listQuery.productName"></el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 100px;" class="filter-item" placeholder="旺旺名称" v-model="listQuery.clientName"></el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 100px;" class="filter-item" placeholder="手机号码" v-model="listQuery.mobile"></el-input>
      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.orderStatus" placeholder="订单状态">
        <el-option v-for="item in orderStatusOptions" :key="item.key" :label="item.value" :value="item.key">
        </el-option>
      </el-select>
      <el-date-picker v-model="listQuery.createDate" type="daterange" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 230px;vertical-align:middle;margin-bottom:10px;">
      </el-date-picker>

      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      <el-button class="filter-item" v-if="addOrder" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">

      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-table :key='scope.row.order.orderId' :data="scope.row.orderItem" border fit highlight-current-row style="width: 100%">
            <el-table-column align="left" label="产品分类 产品名称 规格 材质 外观" width="480">
              <template slot-scope="scopeItem">
                <img style="width:60px;height:60px;" :src="getFileUrl(scope.row.imgUrl)">
                <router-link :to="{path: '/screw/productHistory', query: { pid: scopeItem.row.productId }}">{{scopeItem.row.productFullName}}</router-link>
              </template>
            </el-table-column>

            <el-table-column align="center" label="数量">
              <template slot-scope="scopeItem">
                <span>{{scopeItem.row.count}}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="重量(KG)">
              <template slot-scope="scopeItem">
                <span>{{scopeItem.row.weight|toFixed(3)}}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="单价(元)">
              <template slot-scope="scopeItem">
                <span>{{scopeItem.row.singlePrice|toFixed(2)}}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="总价(元)">
              <template slot-scope="scopeItem">
                <span>{{scopeItem.row.totalPrice|toFixed(2)}}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="购买地址">
              <template slot-scope="scopeItem">
                <a target="_blank" v-if="scopeItem.row.productUrl" :href="scopeItem.row.productUrl">地址</a>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('table.id')" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.order.orderId}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="旺旺名称">
        <template slot-scope="scope">
          <span>{{scope.row.clientName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="物流类型">
        <template slot-scope="scope">
          <span>{{typeConvert(scope.row.order.shippingType, shippingTypeOptions)}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="物流单号">
        <template slot-scope="scope">
          <span>{{scope.row.order.shippingCode}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="运费">
        <template slot-scope="scope">
          <span>{{scope.row.order.freightPrice|toFixed(2)}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="总价格">
        <template slot-scope="scope">
          <span>{{scope.row.order.totlaPrice|toFixed(2)}}</span>
        </template>
      </el-table-column>

      <el-table-column :show-overflow-tooltip="true" align="center" label="收货地址">
        <template slot-scope="scope">
          <span>{{scope.row.order.fullAddress}}</span>
        </template>
      </el-table-column>

      <el-table-column :show-overflow-tooltip="true" align="center" label="备注">
        <template slot-scope="scope">
          <span>{{scope.row.order.description}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('table.status')">
        <template slot-scope="scope">
          <el-tag style="margin-left: 1px;" :type="getTagType(scope.row.order.status)">{{typeConvert(scope.row.order.status, orderStatusOptions)}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.order.createTime|formatDate("yyyy-MM-dd hh:mm")}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('table.actions')" width="150px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" v-if="editOrder && scope.row.order.status < 5" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
          <el-button type="primary" v-if="editOrder" size="mini" @click="handleDownload(scope.row)">打印</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageIndex" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :fullscreen="this.isMobile" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="editOrderForm" :model="creatOrder" label-position="left" label-width="100px" style='margin-left:50px;'>

        <el-form-item label='旺旺名称' prop="clientName">
          <el-input autosize v-model="creatOrder.clientName" placeholder="Please input" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item label='状态' prop="status">
          <el-select autosize class="filter-item" v-model="creatOrder.status" placeholder="Please select">
            <el-option v-for="item in orderStatusOptions" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='物流类型' prop="shippingType">
          <el-select autosize class="filter-item" v-model="creatOrder.shippingType" placeholder="Please select">
            <el-option v-for="item in shippingTypeOptions" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='物流单号' prop="shippingCode">
          <el-input autosize v-model="creatOrder.shippingCode" placeholder="Please input"></el-input>
        </el-form-item>

        <el-form-item label='运费' prop="freightPrice">
          <el-input autosize v-model="creatOrder.freightPrice" placeholder="Please input"></el-input>
        </el-form-item>

        <el-form-item label='总价格' prop="totlaPrice">
          <el-input autosize v-model="creatOrder.totlaPrice" placeholder="Please input"></el-input>
        </el-form-item>

        <el-form-item label='收货地址' prop="fullAddress">
          <el-input type="textarea" :rows="2" autosize v-model="creatOrder.fullAddress" placeholder="Please input"></el-input>
        </el-form-item>

        <el-form-item label='备注' prop="description">
          <el-input type="textarea" :rows="2" autosize v-model="creatOrder.description" placeholder="Please input"></el-input>
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
import {
  getOrderPageList,
  modifyOrder,
  getOrderStatus,
  getDictByType,
  printOrder
} from "@/api/screw";

import waves from "@/directive/waves"; // 水波纹指令

export default {
  name: "orderList",
  directives: { waves },
  data() {
    return {
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
        productName: undefined,
        clientName: undefined,
        mobile: undefined,
        createDate: undefined,
        orderStatus: undefined
      },
      orderStatusOptions: [],
      shippingTypeOptions: [],
      creatOrder: {},
      rules: {
        status: [{ required: true, message: "状态不能为空", trigger: "blur" }],
        shippingType: [
          { required: true, message: "快递不能为空", trigger: "blur" }
        ],
        // shippingCode: [
        //   { required: true, message: "快递单号不能为空", trigger: "blur" }
        // ],
        freightPrice: [
          { required: true, message: "运费不能为空", trigger: "change" },
          {
            type: "number",
            message: "请输入数字格式",
            trigger: "blur",
            transform(value) {
              return Number(value);
            }
          }
        ],
        totlaPrice: [
          { required: true, message: "总价格不能为空", trigger: "change" },
          {
            type: "number",
            message: "请输入数字格式",
            trigger: "blur",
            transform(value) {
              return Number(value);
            }
          }
        ],
        fullAddress: [
          { required: true, message: "收货地址不能为空", trigger: "blur" }
        ]
      },

      addOrder: false,
      editOrder: false
    };
  },
  watch: {},
  created() {
    this.$store.dispatch("getPagePermission", "orderList").then(result => {
      this.addOrder = result.addOrder;
      this.editOrder = result.editOrder;
    });
    this.getOrderStatus();
    this.getShippingType();
    this.getList();
  },
  methods: {
    getFileUrl(val) {
      return process.env.FILE_API + val;
    },
    typeConvert(val, option) {
      var d = option.find(d => {
        return d.key == val;
      });
      if (d) {
        return d.value;
      }
    },
    getOrderStatus() {
      getOrderStatus().then(response => {
        this.orderStatusOptions = response.data.data;
      });
    },
    getShippingType() {
      getDictByType(5).then(response => {
        this.shippingTypeOptions = response.data.data;
      });
    },
    getTagType(val) {
      switch (val) {
        case 1:
        case 2:
        case 3:
        case 4:
          return "";
        case 5:
          return "success";
        default:
          return "info";
      }
    },
    getList() {
      this.listLoading = true;
      getOrderPageList(this.listQuery).then(response => {
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
      this.$router.push({ path: "/screw/addOrder" });
    },
    handleDownload(row) {
      this.$confirm(`确定生成打印文件, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          printOrder(row.order.orderId).then(r => {
            this.$message({
              type: "info",
              message: "成功"
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    handleUpdate(row) {
      this.dialogStatus = "update";

      this.creatOrder = row.order;
      this.creatOrder.clientName = row.clientName;

      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["editOrderForm"].clearValidate();
      });
    },
    addSumbit(dialogStatus) {
      this.$refs["editOrderForm"].validate(valid => {
        if (valid) {
          modifyOrder(this.creatOrder, dialogStatus).then(response => {
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "操作成功",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    }
  }
};
</script>