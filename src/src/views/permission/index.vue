<template>
  	<div class="app-container">
		<div style="margin-bottom:15px;">您得角色名： {{roles}}</div>
		{{$t('permission.switchRoles')}}：
		<el-radio-group v-model="switchRoles">
			<el-radio-button label="editor"></el-radio-button>
		</el-radio-group>
		<br />
		<div style="margin-bottom:15px;">{{$t('permission.roles')}}： {{roles}}</div>
		{{$t('permission.switchRoles')}}：
		<el-radio-group v-if="addPage">
			<el-radio-button label="addPage"></el-radio-button>
		</el-radio-group>
  	</div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
	name: "permission",
	data() {
		return {
			switchRoles: "",
			addPage: true,
			permission: ""
		};
	},
	computed: {
		...mapGetters(["roles", "token"])
	},
	watch: {
		switchRoles(val) {
			this.$store.dispatch("ChangeRoles", val).then(() => {
				this.$router.push({ path: "/permission/index?" + new Date() });
			});
		},
		addPage(val) {

		}
	},
	created() {
		this.$store.dispatch("getPagePermission", 'permission').then(result => {
			this.permission = result;
			this.addPage = this.permission.canAdd;
		});
	},
	mounted() {


	}
};
</script>
