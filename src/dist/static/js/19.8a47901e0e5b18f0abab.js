webpackJsonp([19],{U86J:function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var l=i("x3IM"),a=i("E4LH"),n=[{key:!0,display_name:"男"},{key:!1,display_name:"女"}],s={name:"clientList",directives:{waves:i("cAgV").a},data:function(){return{sexOptions:n,dialogStatus:"",textMap:{update:"Edit",create:"Create"},dialogFormVisible:!1,tableKey:0,list:null,total:null,listLoading:!0,listQuery:{pageIndex:1,pageSize:10,name:void 0,mobile:void 0},creatClient:{},rules:{clientName:[{required:!0,message:"旺旺名称不能为空",trigger:"blur"},{min:2,max:20,message:"长度在2到20个字符",trigger:"blur"}],mobile:[{required:!0,message:"手机号码不能为空",trigger:"blur"},{validator:function(e,t,i){t&&!Object(a.b)(t)&&i(new Error("请输入正确的手机号码")),i()},trigger:"blur"}]},addClient:!1,editClient:!1,deleteClient:!1}},watch:{},created:function(){var e=this;this.$store.dispatch("getPagePermission","clientList").then(function(t){e.addClient=t.addClient,e.editClient=t.editClient,e.deleteClient=t.deleteClient}),this.getList()},methods:{sexConvert:function(e){var t=this.sexOptions.find(function(t){return t.key==e});if(t)return t.display_name},navigateTo:function(e){this.$router.push({path:"/screw/clientAddress",query:{clientId:e.clientId,clientName:e.clientName,mobile:e.mobile}})},getList:function(){var e=this;this.listLoading=!0,Object(l.m)(this.listQuery).then(function(t){e.list=t.data.data,e.total=t.data.total,e.listLoading=!1})},handleSizeChange:function(e){this.listQuery.pageSize=e,this.getList()},handleCurrentChange:function(e){this.listQuery.pageIndex=e,this.getList()},handleFilter:function(){this.listQuery.pageIndex=1,this.getList()},handleCreate:function(){var e=this;this.dialogStatus="create",this.dialogFormVisible=!0,this.creatClient={clientId:0,clientName:void 0,sex:!0,age:0,weChat:void 0,qq:void 0,mobile:void 0},this.$nextTick(function(){e.$refs.creatClientForm.clearValidate()})},handleUpdate:function(e){var t=this;this.dialogStatus="update",this.creatClient={clientId:e.clientId,clientName:e.clientName,sex:e.sex,age:e.age,weChat:e.weChat,qq:e.qq,mobile:e.mobile},this.dialogFormVisible=!0,this.$nextTick(function(){t.$refs.creatClientForm.clearValidate()})},addSumbit:function(e){var t=this;this.$refs.creatClientForm.validate(function(i){i&&t.reqAddEditSumbit(e,!1)})},reqAddEditSumbit:function(e,t){var i=this;Object(l.c)(this.creatClient,e).then(function(e){i.dialogFormVisible=!1,i.$notify({title:"成功",message:"操作成功",type:"success",duration:2e3}),t||i.handleFilter()})}}},r={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"app-container calendar-list-container"},[i("div",{staticClass:"filter-container"},[i("el-input",{staticClass:"filter-item",staticStyle:{width:"200px"},attrs:{placeholder:"名称"},nativeOn:{keyup:function(t){if(!("button"in t)&&e._k(t.keyCode,"enter",13,t.key))return null;e.handleFilter(t)}},model:{value:e.listQuery.name,callback:function(t){e.$set(e.listQuery,"name",t)},expression:"listQuery.name"}}),e._v(" "),i("el-input",{staticClass:"filter-item",staticStyle:{width:"200px"},attrs:{placeholder:"手机号码"},nativeOn:{keyup:function(t){if(!("button"in t)&&e._k(t.keyCode,"enter",13,t.key))return null;e.handleFilter(t)}},model:{value:e.listQuery.mobile,callback:function(t){e.$set(e.listQuery,"mobile",t)},expression:"listQuery.mobile"}}),e._v(" "),i("el-button",{directives:[{name:"waves",rawName:"v-waves"}],staticClass:"filter-item",attrs:{type:"primary",icon:"el-icon-search"},on:{click:e.handleFilter}},[e._v(e._s(e.$t("table.search")))]),e._v(" "),e.addClient?i("el-button",{staticClass:"filter-item",staticStyle:{"margin-left":"10px"},attrs:{type:"primary",icon:"el-icon-edit"},on:{click:e.handleCreate}},[e._v(e._s(e.$t("table.add")))]):e._e()],1),e._v(" "),i("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.listLoading,expression:"listLoading"}],key:e.tableKey,staticStyle:{width:"100%"},attrs:{data:e.list,"element-loading-text":"给我一点时间",border:"",fit:"","highlight-current-row":""}},[i("el-table-column",{attrs:{align:"center",label:e.$t("table.id"),width:"65"},scopedSlots:e._u([{key:"default",fn:function(t){return[i("span",[e._v(e._s(t.row.clientId))])]}}])}),e._v(" "),i("el-table-column",{attrs:{align:"center",label:"旺旺名称"},scopedSlots:e._u([{key:"default",fn:function(t){return[i("span",[e._v(e._s(t.row.clientName))])]}}])}),e._v(" "),i("el-table-column",{attrs:{align:"center",label:"微信"},scopedSlots:e._u([{key:"default",fn:function(t){return[i("span",[e._v(e._s(t.row.weChat))])]}}])}),e._v(" "),i("el-table-column",{attrs:{align:"center",label:"QQ"},scopedSlots:e._u([{key:"default",fn:function(t){return[i("span",[e._v(e._s(t.row.qq))])]}}])}),e._v(" "),i("el-table-column",{attrs:{align:"center",label:"手机号码"},scopedSlots:e._u([{key:"default",fn:function(t){return[i("span",[e._v(e._s(t.row.mobile))])]}}])}),e._v(" "),i("el-table-column",{attrs:{align:"center",label:"性别"},scopedSlots:e._u([{key:"default",fn:function(t){return[i("span",[e._v(e._s(e.sexConvert(t.row.sex)))])]}}])}),e._v(" "),i("el-table-column",{attrs:{align:"center",label:"年龄"},scopedSlots:e._u([{key:"default",fn:function(t){return[i("span",[e._v(e._s(t.row.age))])]}}])}),e._v(" "),i("el-table-column",{attrs:{align:"center",label:"修改时间"},scopedSlots:e._u([{key:"default",fn:function(t){return[i("span",[e._v(e._s(e._f("formatDate")(t.row.modifyTime,"yyyy-MM-dd hh:mm")))])]}}])}),e._v(" "),i("el-table-column",{attrs:{align:"center",label:e.$t("table.actions"),"class-name":"small-padding fixed-width"},scopedSlots:e._u([{key:"default",fn:function(t){return[e.editClient?i("el-button",{attrs:{type:"primary",size:"mini"},on:{click:function(i){e.handleUpdate(t.row)}}},[e._v(e._s(e.$t("table.edit")))]):e._e(),e._v(" "),i("el-button",{attrs:{type:"primary",size:"mini"},on:{click:function(i){e.navigateTo(t.row)}}},[e._v("收货地址")])]}}])})],1),e._v(" "),i("div",{staticClass:"pagination-container"},[i("el-pagination",{attrs:{background:"","current-page":e.listQuery.pageIndex,"page-sizes":[10,20,30,50],"page-size":e.listQuery.pageSize,layout:"total, sizes, prev, pager, next, jumper",total:e.total},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}})],1),e._v(" "),i("el-dialog",{attrs:{fullscreen:this.isMobile,title:e.textMap[e.dialogStatus],visible:e.dialogFormVisible},on:{"update:visible":function(t){e.dialogFormVisible=t}}},[i("el-form",{ref:"creatClientForm",staticStyle:{"margin-left":"50px"},attrs:{rules:e.rules,model:e.creatClient,"label-position":"left","label-width":"100px"}},[i("el-form-item",{attrs:{label:"旺旺名称",prop:"clientName"}},[i("el-input",{attrs:{autosize:"",placeholder:"Please input"},model:{value:e.creatClient.clientName,callback:function(t){e.$set(e.creatClient,"clientName",t)},expression:"creatClient.clientName"}})],1),e._v(" "),i("el-form-item",{attrs:{label:"微信",prop:"weChat"}},[i("el-input",{attrs:{autosize:"",placeholder:"Please input"},model:{value:e.creatClient.weChat,callback:function(t){e.$set(e.creatClient,"weChat",t)},expression:"creatClient.weChat"}})],1),e._v(" "),i("el-form-item",{attrs:{label:"QQ",prop:"qq"}},[i("el-input",{attrs:{autosize:"",placeholder:"Please input"},model:{value:e.creatClient.qq,callback:function(t){e.$set(e.creatClient,"qq",t)},expression:"creatClient.qq"}})],1),e._v(" "),i("el-form-item",{attrs:{label:"手机号码",prop:"mobile"}},[i("el-input",{attrs:{autosize:"",placeholder:"Please input"},model:{value:e.creatClient.mobile,callback:function(t){e.$set(e.creatClient,"mobile",t)},expression:"creatClient.mobile"}})],1),e._v(" "),i("el-form-item",{attrs:{label:"性别",prop:"sex"}},[i("el-select",{staticClass:"filter-item",attrs:{autosize:"",placeholder:"Please select"},model:{value:e.creatClient.sex,callback:function(t){e.$set(e.creatClient,"sex",t)},expression:"creatClient.sex"}},e._l(e.sexOptions,function(e){return i("el-option",{key:e.key,attrs:{label:e.display_name,value:e.key}})}))],1),e._v(" "),i("el-form-item",{attrs:{label:"年龄",prop:"age"}},[i("el-input",{attrs:{autosize:"",placeholder:"Please input"},model:{value:e.creatClient.age,callback:function(t){e.$set(e.creatClient,"age",t)},expression:"creatClient.age"}})],1)],1),e._v(" "),i("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[i("el-button",{on:{click:function(t){e.dialogFormVisible=!1}}},[e._v(e._s(e.$t("table.cancel")))]),e._v(" "),i("el-button",{attrs:{type:"primary"},on:{click:function(t){e.addSumbit(e.dialogStatus)}}},[e._v(e._s(e.$t("table.confirm")))])],1)],1)],1)},staticRenderFns:[]},o=i("VU/8")(s,r,!1,null,null,null);t.default=o.exports}});