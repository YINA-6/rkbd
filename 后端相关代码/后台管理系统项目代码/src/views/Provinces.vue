<template>
    <div class="provinces">

        <!-- 表单内容   -->
        <el-table :data="Items.tableData" max-height="570" stripe style="width: 100%">
            <el-table-column fixed prop="id" label="Id" width="auto" />
            <el-table-column prop="name" label="Name" width="auto" />
            <el-table-column prop="registration" label="Registration" width="auto" />

            <el-table-column prop="test" label="Test" width="auto" />

            <el-table-column fixed="right" label="Operations" width="120">
                <template #default="scope">
                    <el-button link type="danger" size="small" @click="onClickRemove(scope.row.id)">删除</el-button>
                    <el-button link type="primary" size="small" @click="handleEdit(scope.row)">修改</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 信息修改弹出框 -->
        <el-dialog :title="Items.title" v-model="dialogVisible" width="40%">

            <el-form ref="ruleFormRef" class="demo-form-inline" label-width="auto" :rules="rules"
                :model="Items.categoryItem">
                <el-form-item label="id:" prop="id">
                    <el-input v-model="Items.provincesItem.id" disabled />
                </el-form-item>
                <el-form-item label="name:" prop="name">
                    <el-input v-model="Items.provincesItem.name" disabled />
                </el-form-item>
                <el-form-item label="registration:" prop="registration">
                    <el-input v-model="Items.provincesItem.registration"  />
                </el-form-item>
                <el-form-item label="test:" prop="test">
                    <el-input v-model="Items.provincesItem.test" />
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" size="medium" @click="handleSubmit(ruleFormRef)">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除弹出框 -->
        <el-dialog v-model="centerDialogVisible" title="Warning" width="30%" align-center>
            <span style="font-size:larger;">是否确定删除 id:{{ selectId }} 该条数据</span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="centerDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="confirmRemove">
                        确 定
                    </el-button>
                </span>
            </template>
        </el-dialog>

    </div>
</template>

<script setup name="provinces">
import http from "../utils/request";
import { onMounted, reactive, ref, toRaw } from 'vue';

const centerDialogVisible = ref(false)
const dialogVisible = ref(false)
const selectId = ref()
const ruleFormRef = ref()


const Items = reactive({
    tableData: [],
    title: '',
    action: '',
    provincesItem: [{
        id: '',
        name: '',
        registration: '',
        test: ''
    }]
})
const initCategoryItem = (item) => {
    Items.provincesItem.id = item.id
    Items.provincesItem.name = item.name
    Items.provincesItem.registration = item.registration
    Items.provincesItem.test = item.test


}
// 表单校验规则
const rules = reactive({
    registration: [
        {
            required: true,
            trigger: 'change',
            message: '此项为必填',
        },
    ],
    test: [
        {
            required: true,
            trigger: 'change',
            message: '此项为必填',
        },
    ],
})

// 题目信息弹出框
const handleEdit = (item) => {
    // 兼容修改和新增
    if (item != null) {
        console.log(toRaw(item));
        Items.title = '修改题目'
        Items.action = 'edit'
        setTimeout(() => {
            initCategoryItem(item)
            dialogVisible.value = true
        }, 50)

    } else {
        Items.title = '新增题目'
        Items.action = 'add'
        Items.provincesItem = {} // 置空数据
        dialogVisible.value = true
    }

}


const onClickRemove = (id) => {
    selectId.value = id
    centerDialogVisible.value = true
}

// 确认删除
const confirmRemove = async () => {
    await http.delete('provinces/' + selectId.value).then(res => {
        if (res.code === 200) {
            ElMessage({
                message: '操作成功',
                type: 'success',
            })
            centerDialogVisible.value = false
            init()
        } else {
            ElMessage({
                message: '操作失败',
                type: 'error',
            })
        }
    })
}

// 修改提交
const handleSubmit = async (formEl) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            http.post('provinces', toRaw(Items.provincesItem)).then(res => {
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


const init = async () => {
    await http.get('provinces').then(res => {
        Items.tableData = res.data
    })
}


onMounted(() => {
    init()
})
</script>