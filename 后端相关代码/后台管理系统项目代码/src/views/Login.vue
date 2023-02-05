<template>
	<div class="login">
		<div class="login-box">
			<el-form ref="login" :model="Items.loginForm" :rules="loginRules">
				<el-form-item prop="username">
					<el-input v-model="Items.loginForm.username" type="text" auto-complete="off" placeholder="账号"
						maxlength="20">
						<template #prefix>
							<el-icon>
								<User />
							</el-icon>
						</template>
					</el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input v-model="Items.loginForm.password" type="password" placeholder="密码" maxlength="20"
						@keyup.enter.native="handleLogin(login)">
						<template #prefix>
							<el-icon>
								<Lock />
							</el-icon>
						</template>

					</el-input>
				</el-form-item>
				<el-form-item style="width:100%;">
					<el-button :loading="loading" class="login-btn" size="medium" type="primary" style="width:100%;"
						@click.native.prevent="handleLogin(login)">
						<span v-if="!loading">登录</span>
						<span v-else>登录中...</span>
					</el-button>
				</el-form-item>
			</el-form>
		</div>

	</div>


</template>

<script setup name="login">
import { reactive, ref, toRaw } from 'vue';
import http from '../utils/request';
const login = ref()
const Items = reactive({
	loginForm: {
		username: 'admin',
		password: '123456'
	},
	loading: false
})
const validateUsername = (rule, value, callback) => {
	if (value.length < 1) {
		callback(new Error('请输入用户名'))
	} else {
		callback()
	}
}
const validatePassword = (rule, value, callback) => {
	if (value.length < 6) {
		callback(new Error('密码必须在6位以上'))
	} else {
		callback()
	}
}

const loginRules = reactive({
	'username': [{ 'validator': validateUsername, 'trigger': 'blur' }],
	'password': [{ 'validator': validatePassword, 'trigger': 'blur' }]
})

const handleLogin = async (formEl) => {
	if (!formEl) return
	formEl.validate(async (valid, fields) => {
		if (valid) {
			console.log('submit!')
			await http.post('employee/login', toRaw(Items.loginForm)).then(res => {
				if (res.code === 200) {
					Items.loading = true
					localStorage.setItem('userInfo', JSON.stringify(res.data))
					window.location.href = '/'
				} else {
					Items.loading = false
					ElMessage({
						message: '账号或密码错误',
						type: 'error',
					})
				}
			})

		} else {
			console.log('error submit!', fields)
		}
	})
}
</script>

<style>
.login {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	background-color: #333;
}
</style>