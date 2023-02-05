<template>
    <div class="employee">
        <div class="tableBar">
            <el-input v-model="Items.input" placeholder="请输入成员姓名" style="width: 150px"
                @keyup.enter.native="handleQuery">
                <template #prefix>
                    <el-icon style="cursor:pointer" @click="handleQuery">
                        <Search />
                    </el-icon>
                </template>
            </el-input>
            <el-button type="primary" style="float: right;" @click="handleEdit('add')">
                + 添加成员
            </el-button>
        </div>
        <el-table :data="Items.tableData" stripe class="tableBox">
            <el-table-column prop="name" label="成员姓名"></el-table-column>
            <el-table-column prop="username" label="账号"></el-table-column>
            <el-table-column prop="phone" label="手机号"></el-table-column>
            <el-table-column label="账号状态">
                <template #default="scope">
                    {{ String(scope.row.status) === '0' ? '已禁用' : '正常' }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="160">
                <template #default="scope">
                    <el-button type="text" size="small" class="blueBug" @click="handleEdit(scope.row)">
                        编辑
                    </el-button>
                    <el-button type="text" size="small" class="delBut non" @click="hanleStatus(scope.row)"
                        v-if="userInfo.username === 'admin'">
                        {{ scope.row.status == '1' ? '禁用' : '启用' }}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination class="pageList" :page-sizes="[10, 20, 30, 40]" :page-size="pageInfo.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.counts" :current-page.sync="pageInfo.page"
            @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>


        <!-- 信息修改弹出框 -->
        <el-dialog :title="Items.title" v-model="dialogVisible" width="40%">

            <el-form ref="ruleFormRef" :model="Items.employeeItem" :rules="rules" :inline="false" label-width="180px"
                class="demo-employeeItem">
                <el-form-item label="账号:" prop="username">
                    <el-input v-model="Items.employeeItem.username" placeholder="请输入账号" maxlength="20" />
                </el-form-item>
                <el-form-item label="成员姓名:" prop="name">
                    <el-input v-model="Items.employeeItem.name" placeholder="请输入成员姓名" maxlength="20" />
                </el-form-item>

                <el-form-item label="手机号:" prop="phone">
                    <el-input v-model="Items.employeeItem.phone" placeholder="请输入手机号" maxlength="20" />
                </el-form-item>
                <el-form-item label="性别:" prop="sex">
                    <el-radio-group v-model="Items.employeeItem.sex">
                        <el-radio label="1">男</el-radio>
                        <el-radio label="0">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="身份证号:" prop="idNumber">
                    <el-input v-model="Items.employeeItem.idNumber" placeholder="请输入身份证号" maxlength="20" />
                </el-form-item>
                <div class="subBox address">
                    <el-form-item>
                        <el-button @click="dialogVisible = false">
                            取 消
                        </el-button>
                        <el-button type="primary" @click="handleSubmit(ruleFormRef)">
                            确 认
                        </el-button>
                    </el-form-item>
                </div>
            </el-form>
        </el-dialog>
    </div>

</template>

<script setup name="employee">
import http from '../utils/request'
import { onMounted, reactive, ref, toRaw } from 'vue';
const dialogVisible = ref(false)
const ruleFormRef = ref()
const pageInfo = reactive({
    counts: 0,
    page: 1,
    pageSize: 10,
})
const userInfo = reactive({
    username: '',
    id: '',
})
const Items = reactive({
    status: '',
    title: '',
    action: '',
    input: '',
    tableData: [],
    employeeItem: {
        'id': '',
        'name': '',
        'phone': '',
        'sex': "1",
        'idNumber': '',
        'username': '',
        'updateUser': userInfo.id
    }
})
// 校验规则
const rules = reactive({
    username: [{
        'required': true,
        'trigger': 'blur'
    }],
    //姓名
    name: [{
        'required': true,
        'trigger': 'blur'
    }],
    phone: [{
        'required': true,
        'trigger': 'blur'
    }],
    idNumber: [{
        'required': true,
        'trigger': 'blur'
    }]

})
// 弹框初始化
const initEmployeeItem = (item) => {
    Items.employeeItem.id = item.id
    Items.employeeItem.name = item.name
    Items.employeeItem.phone = item.phone
    Items.employeeItem.sex = item.sex
    Items.employeeItem.idNumber = item.idNumber
    Items.employeeItem.username = item.username
    Items.employeeItem.updateUser = userInfo.id

}

// 添加&编辑
const handleEdit = (item) => {
    // 兼容修改和新增
    if (item === 'add') {
        Items.title = '新增成员'
        Items.action = 'add'
        Items.employeeItem = {} // 置空数据
        dialogVisible.value = true
    } else {
        console.log(toRaw(item));
        Items.title = '修改成员'
        Items.action = 'edit'
        setTimeout(() => {
            initEmployeeItem(item)
            dialogVisible.value = true
        }, 50)
    }
}
// 禁用
const hanleStatus = async (item)=>{
    const questionItem = toRaw(item)
    questionItem.status = questionItem.status == 0 ? 1 : 0
    await http.put('employee',questionItem).then(res=>{
        console.log(res);
        if(res.code === 200){
           init()
        }
    })
}
// 修改提交
const handleSubmit = async (formEl) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            http.put('employee', toRaw(Items.employeeItem)).then(res => {
                if (res.code === 200) {
                    ElMessage({
                        message: '操作成功',
                        type: 'success',
                    })
                    dialogVisible.value = false
                    init()
                } else {
                    ElMessage({
                        message: '操作失败',
                        type: 'error',
                    })
                }
            })

        } else {
            console.log('表单校验不通过', fields)
            setTimeout(() => {
                formEl.resetFields()
            }, 3000)

        }
    })

}

// 姓名模糊查询
const handleQuery = async () => {
    if (Items.input === '') return

    await http.get(`employee/${Items.input}`).then(res => {
        if (res.code === 200 && res.data != null) {
            console.log(res);
            Items.tableData = [res.data]
        } else {
            ElMessage({
                message: '无当前用户',
                type: 'error',
            })
        }
    })

}

const init = async () => {
    await http.get(`employee/page/?page=${pageInfo.page}&pageSize=${pageInfo.pageSize}`).then(res => {
        if (res.code === 200) {
            Items.tableData = res.data.records
            Items.counts = res.data.total
        }
    }).catch(err => {
        ElMessage({
            message: "服务器请求错误",
            type: 'error',
        })
    })
}

onMounted(() => {
    [userInfo.id, userInfo.username] = [...Object.values(JSON.parse(localStorage.getItem('userInfo')))]
    init()
    console.log('onMounted');
})

</script>