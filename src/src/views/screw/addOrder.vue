<template>
  <div class="app-container calendar-list-container">
    <el-form :rules="rules" ref="addOrderForm" :model="createOrder" :inline="true" label-position="right" label-width="100px" class="demo-form-inline">
      <div>
        <el-form-item label="旺旺名称" prop="clientId">
          <el-select v-if="!this.isMobile" v-model="createOrder.clientId" clearable filterable remote placeholder="请输入旺旺名称" :remote-method="getClientNameId" @change="getClientAddress"
            :loading="loadingClient" style="width:185px;">
            <el-option v-for="item in clientOptions" :key="item.key" :label="item.value" :value="item.key"></el-option>
          </el-select>
          <el-input v-else placeholder="请输入查询旺旺名称" v-model="createOrder.clientName" @change="getClientNameId" clearable class="input-with-select">
            <el-select @change="getClientAddress" v-model="createOrder.clientId" class="filter-item" slot="prepend" placeholder="选择" style="width:80px;">
              <el-option v-for="item in clientOptions" :key="item.key" :label="item.value" :value="item.key"></el-option>
            </el-select>
          </el-input>
        </el-form-item>

        <el-form-item label="收货地址" prop="fullAddress">
          <el-input placeholder="请输入保存收货地址" v-model="createOrder.fullAddress" clearable class="input-with-select">
            <el-select @change="selectAddress" v-model="createOrder.fullAddressId" class="filter-item" slot="prepend" placeholder="选择" style="width:80px;">
              <el-option v-for="item in fullAddressOptions" :key="item.key" :label="item.value" :value="item.key"></el-option>
            </el-select>
          </el-input>
        </el-form-item>
      </div>

      <div>
        <el-form-item label="物流类型" prop="shippingType">
          <el-select class="filter-item" v-model="createOrder.shippingType" placeholder="Please select" style="width:185px;">
            <el-option v-for="item in shippingTypeOptions" :key="item.key" :label="item.value" :value="item.key"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="物流单号" prop="shippingCode">
          <el-input v-model="createOrder.shippingCode" placeholder="Please input"></el-input>
        </el-form-item>

        <el-form-item label="运费" prop="freightPrice">
          <el-input v-model="createOrder.freightPrice" placeholder="Please input"></el-input>
        </el-form-item>
      </div>

      <div>
        <el-form-item label="状态" prop="status">
          <el-select class="filter-item" v-model="createOrder.status" placeholder="Please select" style="width:185px;">
            <el-option v-for="item in orderStatusOptions" :key="item.key" :label="item.value" :value="item.key"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="总价格" prop="totlaPrice">
          <el-input v-model="createOrder.totlaPrice" placeholder="Please input"></el-input>
        </el-form-item>

        <el-form-item label="备注" prop="description">
          <el-input type="textarea" :rows="1" v-model="createOrder.description" placeholder="Please input" style="width:385px;"></el-input>
        </el-form-item>
      </div>
    </el-form>

    <div style="color:red;font-size:13px">*商品请在产品管理页面进行选择，商品地址需要带http|https</div>

    <el-table key="1" :data="orderItems" border fit highlight-current-row style="width: 100%">
      <el-table-column align="left" label="产品分类 产品名称 规格 材质 外观" width="420">
        <template slot-scope="scope">
          <img style="width:60px;height:60px;" :src="getFileUrl(scope.row.imgUrl)">
          <router-link :to="{path: '/screw/productHistory', query: { pid: scope.row.productId }}">{{getProductFullName(scope.row)}}</router-link>
        </template>
      </el-table-column>

      <el-table-column align="center" label="参考价格(元)" width="110">
        <template slot-scope="scope">
          <span>{{scope.row.proposedPrice|toFixed(2)}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="零售价格(元)" width="110">
        <template slot-scope="scope">
          <span>{{scope.row.retailPrice|toFixed(2)}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="购买数量" width="150">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.buyCount" @change="(value)=>changeBuyCount(scope.row, value)" :min="1" :max="90000000" :step="10000" controls-position="right" size="small"
            label="购买数量"></el-input-number>
        </template>
      </el-table-column>

      <el-table-column align="center" label="总重量(KG)" width="150">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.buyWeight" :min="1" :max="1000" :precision="3" :step="0.001" controls-position="right" size="small" label="总重量"></el-input-number>
        </template>
      </el-table-column>

      <el-table-column align="center" label="单价(元)" width="150">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.retailPrice" @change="(value)=>changeRetailPrice(scope.row, value)" :min="1" :max="1000" :precision="2" :step="0.01"
            controls-position="right" size="small" label="单价"></el-input-number>
        </template>
      </el-table-column>

      <el-table-column align="center" label="总价(元)" width="150">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.buyTotalPrice" :min="1" :max="90000000" :precision="2" :step="100" controls-position="right" size="small" label="总价"></el-input-number>
        </template>
      </el-table-column>

      <el-table-column align="center" label="商品地址" width="360">
        <template slot-scope="scope">
          <el-input v-model="scope.row.buyProductUrl" placeholder="请输入商品地址" clearable></el-input>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('table.actions')" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-delete" size="mini" @click="handleRemoveOrderItem(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="margin:30px; float:right;">
      <el-button type="primary" v-if="orderItems.length>0" @click="addSumbit">{{$t('table.confirm')}}</el-button>
      <el-button type="primary" @click="computeTotalPrice">计算总价</el-button>
      <el-button @click="resetForm">{{$t('table.reset')}}</el-button>
    </div>
  </div>
</template>

<script>
import {
  getOrderPageList,
  addOrder,
  getOrderStatus,
  getDictByType,
  getClientAddressList,
  getClientNameIdByNameList
} from "@/api/screw";
import waves from "@/directive/waves"; // 水波纹指令

export default {
  name: "addOrder",
  directives: { waves },
  data() {
    return {
      queryName: undefined,
      loadingClient: false,
      clientOptions: [],
      fullAddressOptions: [],
      orderStatusOptions: [],
      shippingTypeOptions: [],
      productTypeOptions: [],
      productNameTypeOptions: [],
      materialOptions: [],
      exteriorOptions: [],
      createOrder: {
        orderId: 0,
        clientName: undefined,
        clientId: undefined,
        fullAddress: undefined,
        shippingType: undefined,
        shippingCode: undefined,
        freightPrice: undefined,
        status: undefined,
        totlaPrice: undefined,
        description: undefined
      },
      rules: {
        clientId: [
          { required: true, message: "请选择正确的旺旺名称", trigger: "blur" }
        ],
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
      }
    };
  },
  watch: {},
  created() {
    this.getOrderStatus();
    this.getDictByType(1, this.productTypeOptions);
    this.getDictByType(2, this.productNameTypeOptions);
    this.getDictByType(3, this.materialOptions);
    this.getDictByType(4, this.exteriorOptions);
    this.getDictByType(5, this.shippingTypeOptions);
  },
  computed: {
    orderItems() {
      return this.$store.getters.orderItems;
    }
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
    changeBuyCount(row, val) {
      row.buyTotalPrice = row.retailPrice * val;
    },
    changeRetailPrice(row, val) {
      row.buyTotalPrice = val * row.buyCount;
    },
    selectAddress(val) {
      this.createOrder.fullAddress = this.typeConvert(
        val,
        this.fullAddressOptions
      );
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
    getOrderStatus() {
      getOrderStatus().then(response => {
        this.orderStatusOptions = response.data.data;
      });
    },
    getDictByType(type, options) {
      getDictByType(type).then(response => {
        response.data.data.forEach(d => {
          options.push({ key: d.key, value: d.value });
        });
      });
    },
    getClientAddress(clientId) {
      if (this.isMobile) {  // 如果是M端
        this.createOrder.clientName = this.typeConvert(
          clientId,
          this.clientOptions
        );
      }

      this.fullAddressOptions = [];
      if (!clientId) return;
      getClientAddressList(clientId).then(response => {
        response.data.data.forEach(m => {
          this.fullAddressOptions.push({
            key: m.clientAddressId,
            value: m.fullAddress + " " + m.mobile
          });
        });
      });
    },
    getClientNameId(name) {
      if (!name || this.queryName === name) return;
      this.queryName = name;
      this.loadingClient = true;
      getClientNameIdByNameList(name).then(response => {
        this.clientOptions = response.data.data;
        this.loadingClient = false;
      });
    },
    createClientFilter(name) {
      return clientOptions => {
        return (
          clientOptions.value.toLowerCase().indexOf(name.toLowerCase()) > -1
        );
      };
    },
    handleRemoveOrderItem(row) {
      this.$store.dispatch("removeOrderItem", row.productId);
    },
    computeTotalPrice() {
      var totalPrice = 0;
      this.orderItems.forEach(p => {
        totalPrice = totalPrice + p.buyTotalPrice; //
      });
      totalPrice = totalPrice + Number(this.createOrder.freightPrice);
      this.createOrder.totlaPrice = totalPrice;
    },
    addSumbit() {
      this.computeTotalPrice();
      this.$refs["addOrderForm"].validate(valid => {
        if (valid) {
          var saveOrderItems = [];
          var isOK = true;
          this.orderItems.forEach(p => {
            if (!this.validateOrderItem(p)) {
              isOK = false;
            }
            saveOrderItems.push({
              orderItemId: 0,
              orderId: 0,
              productId: p.productId,
              productFullName: this.getProductFullName(p),
              count: p.buyCount,
              singlePrice: p.retailPrice,
              totalPrice: p.buyTotalPrice,
              productUrl: p.buyProductUrl,
              imgUrl: p.imgUrl,
              weight: p.buyWeight
            });
          });
          if (isOK) {
            addOrder(this.createOrder, saveOrderItems).then(response => {
              this.dialogFormVisible = false;
              this.resetForm(); // 重置数据
              this.$notify({
                title: "成功",
                message: "操作成功",
                type: "success",
                duration: 2000
              });
            });
          }
        }
      });
    },
    validateOrderItem(row) {
      if (row.buyCount > 0 && row.retailPrice > 0 && row.buyTotalPrice > 1) {
        return true;
      }
      this.$message({
        message: "购买数量、单价必须大于0，总价必须大于1",
        type: "error",
        duration: 5 * 1000
      });
      return false;
    },
    resetForm() {
      this.$nextTick(() => {
        this.$refs["addOrderForm"].clearValidate();
      });
      this.createOrder = {
        orderId: 0,
        clientId: undefined,
        fullAddress: undefined,
        shippingType: undefined,
        shippingCode: undefined,
        freightPrice: undefined,
        status: undefined,
        totlaPrice: undefined,
        description: undefined
      };
      this.$store.dispatch("cleanOrderItem");
    }
  }
};
</script>
