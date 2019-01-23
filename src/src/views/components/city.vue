<template>
  <span>
    <el-form-item label='省级'>
      <el-select autosize class="filter-item" placeholder="Please select" v-model="data.provinceId" @change="changeProvince">
        <el-option v-for="item in province" :key="item.key" :label="item.value" :value="item.key">
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label='市级'>
      <el-select autosize class="filter-item" placeholder="Please select" :disabled="cityStatus" v-model="data.cityId" @change="changeCity">
        <el-option v-for="item in city" :key="item.key" :label="item.value" :value="item.key">
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label='区级'>
      <el-select autosize class="filter-item" placeholder="Please select" v-model="data.areaId" @change="changeArea">
        <el-option v-for="item in area" :key="item.key" :label="item.value" :value="item.key">
        </el-option>
      </el-select>
    </el-form-item>
  </span>
</template>

<script>
  import { getCityList } from "@/api/screw";
  export default{
    name: "selectCity",
    data() {
      return {
        // 父级传过来的值必须包括
        // data: {
        //     provinceId: undefined,
        //     cityId: undefined,
        //     areaId: undefined,
        // },
        cityArray: [110000,120000,310000,500000],
        create: true,
        cityStatus: false,
        provinceId: undefined,  // 当前查询城市条件
        cityId: undefined,      // 当前查询地区条件
        province: [],
        city: [],
        area: []
      };
    },
    props: ['data'], //从父组件接受的数据
    methods: {
      convert(option, key) {
        var d = option.find(d => {
          return d.key == key;
        });
        if (d) {
          return d.value;
        }
      },
      getData(pid, objectName) {
        getCityList(pid).then(response => {
          switch(objectName){
            case 'province':
              this.province = response.data.data;
              break;
            case 'city':
              this.city = response.data.data;
              break;
            case 'area':
              this.area = response.data.data;
              break;
          }
        });
      },
      getProvince() {
        if(this.create){
          this.create=false;
          this.getData(0, 'province');
        }
        if(this.data.provinceId){
          this.changeProvince(this.data.provinceId, true)
        }
        if(this.data.cityId){
          this.changeCity(this.data.cityId, true)
        }
      },
      changeProvince(pid, first) {
        if(this.cityArray.indexOf(this.data.provinceId) > -1){
          if(this.cityId != pid){
            this.cityId = pid;
            this.getData(pid, 'area');
            this.cityStatus = true;
          }
        }else{
          if(this.provinceId != pid){
            this.area = [];
            this.provinceId = pid;
            this.getData(pid, 'city');
            this.cityStatus = false;
          }
        }
        if(!first){
          this.data.cityId = undefined;
          this.data.areaId = undefined;
          this.data.provinceName = this.convert(this.province, pid);
          this.sendToParent();
        }
      },
      changeCity(pid, first) {
        this.cityStatus = false;
        if(this.cityId != pid){
          this.cityId = pid
          this.getData(pid, 'area');
        }
        if(!first){
          this.data.areaId = undefined;
          this.data.cityName = this.convert(this.city, pid);
          this.sendToParent();
        }
      },
      changeArea(pid) {
        this.data.areaName = this.convert(this.area, pid);
        this.sendToParent();
      },
      // 向父组件传值
      sendToParent() {
        this.$emit('get-data', this.data);
      },
    },
    created() {
      this.getProvince();
    },
    watch: {
      //监控父组件的数据
      data: {
        handler(newValue, oldValue) {
          this.getProvince();
        },
        immediate: true, //关键
        deep: true
      }
    }    
  }
</script>