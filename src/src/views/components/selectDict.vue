<template>

  <span v-if="!data.isForm">
    <el-select clearable class="filter-item" :placeholder="data.text" style="width: 130px" v-model="data.id" @change="getDictChild">
      <el-option v-for="item in dict" :key="item.key" :label="item.value" :value="item.key">
      </el-option>
    </el-select>
    <el-select clearable class="filter-item" :placeholder="data.cText" style="width: 130px" v-model="data.childId" @change="sendToParent()">
      <el-option v-for="item in chileDict" :key="item.key" :label="item.value" :value="item.key">
      </el-option>
    </el-select>
  </span>

  <span v-else>
    <el-form-item :label='data.text' :prop="data.prop">
      <el-select autosize class="filter-item" placeholder="Please select" v-model="data.id" @change="getDictChild">
        <el-option v-for="item in dict" :key="item.key" :label="item.value" :value="item.key">
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item :label='data.cText' :prop="data.propChild">
      <el-select autosize class="filter-item" placeholder="Please select" v-model="data.childId" @change="sendToParent()">
        <el-option v-for="item in chileDict" :key="item.key" :label="item.value" :value="item.key">
        </el-option>
      </el-select>
    </el-form-item>
  </span>

</template>

<script>
  import { getDictByType } from "@/api/screw";
  export default{
    name: "selectDict",
    data() {
      return {
        // 父级传过来的值结构
        // data: {
        //     text: "请选择父级",
        //     cText: "请选择子级",
        //     id: undefined,
        //     type: undefined,
        //     childId: undefined,
        //     childType: undefined,
        //     isForm: false
        // },
        create: true,   // 是否已经查询过
        pId : undefined,  //用于判断孩子数据查询是否一致
        dict: [],
        chileDict: []
      };
    },
    props: ["data"], //从父组件接受的数据
    methods: {
      getData(type, pid, objectName) {
        getDictByType(type, pid, objectName).then(response => {
          switch(objectName){
            case 'dict':
              this.dict = response.data.data;
              break;
            case 'chileDict':
              this.chileDict = response.data.data;
              break;
          }
        });
      },
      getDict() {
        if(this.create){
          this.create=false;
          this.getData(this.data.type, undefined, 'dict')
        }
        if(this.data.id && this.data.id != this.pId){
          this.pId = this.data.id
          this.getData(this.data.childType, this.data.id, 'chileDict')
        }
      },
      getDictChild(pKey) {
        this.data.childId = undefined;
        // if(pKey) {
        //   this.getData(this.data.childType, pKey, 'chileDict')
        // }
        this.sendToParent(); // 更新父级值
      },
      // 向父组件传值
      sendToParent() {
        this.$emit('get-data', this.data);
      },
    },
    created() {
        this.getDict();
    },
    watch: {
      //监控父组件的数据
      data: {
        handler(newValue, oldValue) {
          this.getDict();
        },
        immediate: true, //关键
        deep: true
      }
    }    
  }
</script>

