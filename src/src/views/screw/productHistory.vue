<template>
  <div class="app-container calendar-list-container">
    
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="产品序号" v-model="listQuery.productId"></el-input> 
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" :label="$t('table.id')" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.productId}}</span>
        </template>
      </el-table-column> 
      
      <el-table-column align="center" label="产品分类 产品名称 规格 材质 外观" width="420">
        <template slot-scope="scope">
          <span>{{getProductFullName(scope.row)}}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column align="center" label="产品名称">
        <template slot-scope="scope">
          <span>{{typeConvert(scope.row.productNameType, productNameTypeOptions)}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="规格">
        <template slot-scope="scope">
          <span>{{scope.row.specification}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="材质">
        <template slot-scope="scope">
           <span>{{typeConvert(scope.row.material, materialOptions)}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="外观">
        <template slot-scope="scope">
           <span>{{typeConvert(scope.row.exterior, exteriorOptions)}}</span>
        </template>
      </el-table-column> -->

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
          <span>{{typeConvert(scope.row.status, statusOptions)}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="修改时间">
        <template slot-scope="scope">
          <span>{{scope.row.modifyTime|formatDate("yyyy-MM-dd hh:mm")}}</span>
        </template>
      </el-table-column> 

    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageIndex" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>    


<script>
import { getProductHistoryPageList, getDictByType } from "@/api/screw";
import waves from "@/directive/waves"; // 水波纹指令
import { formatDate } from "@/filters/index.js";

const statusOptions = [
  { key: 1, display_name: "上架" },
  { key: 2, display_name: "下架" }
];

export default {
  name: "productHistoryList",
  directives: { waves },
  data() {
    return {
      statusOptions,
      dialogStatus: "",
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
        productId: undefined,
      },
      productTypeOptions: [],
      productNameTypeOptions: [],
      materialOptions: [],
      exteriorOptions: [],
      createProduct: {},
    };
  },
  watch: {},
  created() {
    this.listQuery.productId=this.$route.query.pid,
    this.getList();
    this.getDictByType(1, this.productTypeOptions);
    this.getDictByType(2, this.productNameTypeOptions);
    this.getDictByType(3, this.materialOptions);
    this.getDictByType(4, this.exteriorOptions);

  },
  methods: {
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
    typeConvert(type, option){
      var d = option.find(d=>{
        return d.key == type;
      })
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
      getProductHistoryPageList(this.listQuery).then(response => {
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
    }
  }
};
</script>