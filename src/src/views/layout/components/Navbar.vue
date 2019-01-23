<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>

    <breadcrumb class="breadcrumb-container"></breadcrumb>

   <div class="site-select-href">
     <a style="color:#3a8ee6;text-decoration: underline;" target='_blank' :href="websiteDomain">{{websiteDomain}}</a>
   </div>

    <div class="right-menu">
      <div v-if="addOrder&&orderItems.length>0" class="international right-menu-item">
        <el-tooltip class="item" effect="dark" content="添加订单" placement="bottom">
          <el-button type="success" icon="el-icon-goods" size="mini" @click="handleCreateOrder">{{orderItems.length}}</el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="清空订单商品" placement="bottom">
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="cleanOrderItem"></el-button>
        </el-tooltip>
      </div>

      <error-log class="errLog-container right-menu-item"></error-log>

      <el-tooltip effect="dark" :content="$t('navbar.screenfull')" placement="bottom">
        <screenfull class="screenfull right-menu-item"></screenfull>
      </el-tooltip>

      <lang-select class="international right-menu-item"></lang-select>

      <el-tooltip effect="dark" :content="$t('navbar.theme')" placement="bottom">
        <theme-picker class="theme-switch right-menu-item"></theme-picker>
      </el-tooltip>

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img class="user-avatar" :src="'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80'">
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              {{$t('navbar.dashboard')}}
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span @click="GetUserInfo" style="display:block;">修改密码</span>
          </el-dropdown-item>          
          <el-dropdown-item divided>
            <span @click="logout" style="display:block;">{{$t('navbar.logOut')}}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

<div>
    <el-dialog  width="25%" title="修改密码" :visible.sync="dialogFormVisible">
      <el-form :rules="Rules" ref="modifyPwd" :model="modifyPwd" label-position="left" label-width="100px" style='margin-left:50px;'>
       
        <el-form-item label='旧密码' prop="userPwd">
          <el-input  type="password" autoComplete="on"  autosize v-model="modifyPwd.userPwd" ></el-input>
        </el-form-item>     

        <el-form-item label='新密码' prop="newPwd">
          <el-input  type="password" autoComplete="on" autosize v-model="modifyPwd.newPwd" ></el-input>
        </el-form-item>  

        <el-form-item label='确认新密码' prop="confirmPwd">
          <el-input  type="password" autoComplete="on" autosize v-model="modifyPwd.confirmPwd" ></el-input>
        </el-form-item>         
  
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="AddSumbit()">{{$t('table.confirm')}}</el-button>      
      </div>
    </el-dialog>

</div>

  </el-menu>


</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import ErrorLog from "@/components/ErrorLog";
import Screenfull from "@/components/Screenfull";
import LangSelect from "@/components/LangSelect";
import ThemePicker from "@/components/ThemePicker";

import { modifySysUserByPwd } from "@/api/users";
import store from "@/store";

export default {
  data() {
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入确认密码"));
      } else if (value != this.modifyPwd.newPwd) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
      callback();
    };
    return {
      dialogFormVisible: false,
      queryWebsiteLoading: false,
      websiteId: undefined,
      websiteDomain: undefined,
      websiteList: [],
      modifyPwd: {
        userPwd: undefined,
        newPwd: undefined,
        confirmPwd: undefined
      },
      Rules: {
        userPwd: [
          { required: true, message: "旧密码不能为空", trigger: "blur" }
        ],
        newPwd: [
          { required: true, message: "新密码不能为空", trigger: "blur" },
          { min: 6, max: 15, message: "长度在6到15个字符", trigger: "blur" }
        ],
        confirmPwd: [
          { required: true, trigger: "blur", validator: validatePassword }
        ]
      },

      addOrder: false
    };
  },
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    LangSelect,
    ThemePicker
  },
  computed: {
    ...mapGetters(["sidebar", "name", "avatar"]),
    orderItems() {
      return this.$store.getters.orderItems
    }
  },
  created(){
    this.$store.dispatch("getPagePermission", "orderList").then(result => {
      this.addOrder = result.addOrder;
    });
  },
  methods: {
    handleCreateOrder() {
      this.$router.push({path: '/screw/addOrder'});
    },
    cleanOrderItem() {
      this.$store.dispatch("cleanOrderItem");
    },
    toggleSideBar() {
      this.$store.dispatch("toggleSideBar");
    },
    logout() {
      this.$store.dispatch("LogOut").then(() => {
        location.reload(); // In order to re-instantiate the vue-router object to avoid bugs
      });
    },
    GetUserInfo() {
      this.modifyPwd = {
        userPwd: undefined,
        newPwd: undefined,
        confirmPwd: undefined
      };

      this.dialogFormVisible = true;

      this.$nextTick(() => {
        this.$refs["modifyPwd"].clearValidate();
      });
    },
    AddSumbit() {
      this.$refs["modifyPwd"].validate(valid => {
        if (valid) {
          modifySysUserByPwd(this.modifyPwd).then(() => {
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "操作成功,请重新登录",
              type: "success",
              duration: 5000
            });

            store.dispatch("FedLogOut").then(() => {
              location.reload(); // 为了重新实例化vue-router对象 避免bug
            });
          });
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container {
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .site-select-title {
    float: left;
    height: 100%;
    margin-left: 60px;
  }
  .site-select-href {
    float: left;
    height: 100%;
    margin-left: 10px;
  }
  .site-select {
    float: left;
    height: 100%;
    margin-left: 20px;
  }

  .right-menu {
    float: right;
    height: 100%;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international {
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
