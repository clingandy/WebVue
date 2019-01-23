webpackJsonp([28],{joK1:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=a("s3ol"),r=a("5ybE"),s={name:"departmentList",components:{treeTable:i.a},data:function(){return{listLoading:!1,data:[],textMap:{update:"Edit",create:"Create"},deptOptions:[{key:0,display_name:"没有上级"}],dialogFormVisible:!1,dialogStatus:"",createdept:{orgId:0,orgName:"",description:"",pOrgId:0},rules:{description:[{min:0,max:200,message:"长度不能超过200个字符",trigger:"blur"}],orgName:[{required:!0,message:"部门名称不能为空",trigger:"blur"},{min:1,max:20,message:"长度在1到20个字符",trigger:"blur"}],pOrgId:[{required:!0,message:"",trigger:"change"}]},addDept:!1,editDept:!1,deleteDept:!1}},created:function(){var e=this;this.$store.dispatch("getPagePermission","departmentList").then(function(t){e.addDept=t.AddDept,e.editDept=t.EditDept,e.deleteDept=t.DeleteDept}),this.getList()},methods:{orgConvert:function(e){var t=this.data.find(function(t){return t.key==e});return t?t.orgName:"没有上级"},getList:function(){var e=this;this.listLoading=!0,Object(r.c)(this.listQuery).then(function(t){e.listLoading=!1,e.data=t.data.data})},handleUpdate:function(e){var t=this;this.dialogStatus="update",this.deptOptions=[{key:0,display_name:"没有上级"}],this.data.forEach(function(a){e.orgId!=a.orgId&&t.deptOptions.push({key:a.orgId,display_name:a.orgName})}),this.createdept={orgId:e.orgId,orgName:e.orgName,description:e.description,pOrgId:e.pOrgId},this.dialogFormVisible=!0,this.$nextTick(function(){t.$refs.creatDeptForm.clearValidate()})},handleCreate:function(){var e=this;this.dialogStatus="create",this.deptOptions=[{key:0,display_name:"没有上级"}],this.data.forEach(function(t){e.deptOptions.push({key:t.orgId,display_name:t.orgName})}),this.createdept={orgId:0,orgName:"",description:"",pOrgId:0},this.dialogFormVisible=!0,this.$nextTick(function(){e.$refs.creatDeptForm.clearValidate()})},AddSumbit:function(e){var t=this;this.$refs.creatDeptForm.validate(function(a){a&&Object(r.a)(t.createdept,e).then(function(e){e.data;t.dialogFormVisible=!1,t.$notify({title:"成功",message:"操作成功",type:"success",duration:2e3}),t.getList()})})},handleDel:function(e){var t=this;this.$confirm("此操作将永久删除【"+e.orgName+"】, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){Object(r.b)(e.orgId).then(function(){t.$message({type:"success",message:"删除成功!"}),t.getList()})}).catch(function(){t.$message({type:"info",message:"已取消删除"})})}}},o={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"app-container"},[a("div",{staticClass:"filter-container"},[e.addDept?a("el-button",{staticClass:"filter-item",attrs:{type:"primary",icon:"el-icon-edit"},on:{click:e.handleCreate}},[e._v(e._s(e.$t("table.add")))]):e._e()],1),e._v(" "),a("tree-table",{attrs:{data:e.data,border:""}},[a("el-table-column",{attrs:{label:"部门名称"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(t.row.orgName))])]}}])}),e._v(" "),a("el-table-column",{attrs:{"class-name":"status-col",label:"上级部门"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(e.orgConvert(t.row.pOrgId)))])]}}])}),e._v(" "),a("el-table-column",{attrs:{label:"备注"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(t.row.description))])]}}])}),e._v(" "),a("el-table-column",{attrs:{label:"操作",width:"200"},scopedSlots:e._u([{key:"default",fn:function(t){return[e.editDept?a("el-button",{attrs:{type:"primary",size:"mini"},on:{click:function(a){e.handleUpdate(t.row)}}},[e._v(e._s(e.$t("table.edit")))]):e._e()]}}])})],1),e._v(" "),a("el-dialog",{attrs:{fullscreen:this.isMobile,title:e.textMap[e.dialogStatus],visible:e.dialogFormVisible},on:{"update:visible":function(t){e.dialogFormVisible=t}}},[a("el-form",{ref:"creatDeptForm",staticStyle:{"margin-left":"50px"},attrs:{rules:e.rules,model:e.createdept,"label-position":"left","label-width":"100px"}},[a("el-form-item",{attrs:{label:"部门名称",prop:"orgName"}},[a("el-input",{attrs:{autosize:"",placeholder:"Please input"},model:{value:e.createdept.orgName,callback:function(t){e.$set(e.createdept,"orgName",t)},expression:"createdept.orgName"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"上级部门",prop:"pOrgId"}},[a("el-select",{staticClass:"filter-item",attrs:{autosize:"",placeholder:"Please select"},model:{value:e.createdept.pOrgId,callback:function(t){e.$set(e.createdept,"pOrgId",t)},expression:"createdept.pOrgId"}},e._l(e.deptOptions,function(e){return a("el-option",{key:e.key,attrs:{label:e.display_name,value:e.key}})}))],1),e._v(" "),a("el-form-item",{attrs:{label:"备注",prop:"description"}},[a("el-input",{attrs:{type:"textarea",autosize:{minRows:2,maxRows:4},placeholder:"Please input"},model:{value:e.createdept.description,callback:function(t){e.$set(e.createdept,"description",t)},expression:"createdept.description"}})],1)],1),e._v(" "),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(t){e.dialogFormVisible=!1}}},[e._v(e._s(e.$t("table.cancel")))]),e._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:function(t){e.AddSumbit(e.dialogStatus)}}},[e._v(e._s(e.$t("table.confirm")))])],1)],1)],1)},staticRenderFns:[]},n=a("VU/8")(s,o,!1,null,null,null);t.default=n.exports}});