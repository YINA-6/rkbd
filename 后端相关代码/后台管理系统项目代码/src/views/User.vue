<template>
    <div class="user">
        <!-- 表单内容   -->
        <el-table :data="Items.tableData" max-height="500" stripe style="width: 100%">
            <el-table-column fixed prop="openId" label="openId" width="auto" />
            <el-table-column prop="nickName" label="nickName" width="auto" />
            <el-table-column prop="quantityAndOdds" label="quantityAndOdds" width="auto" />
            <el-table-column prop="collects" label="collects" width="auto" />
            <el-table-column prop="errors" label="errors" width="auto" />
            <el-table-column fixed="right" label="Operations" width="120">
                <template #default="scope">
                    <el-button link type="danger" size="small" @click="onClickRemove(scope.row.openId)">删除</el-button>
                    <el-button link type="primary" size="small" @click="handelEdit(scope.row)">修改</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页栏 -->
        <el-pagination background :page-sizes="[10, 20, 30, 40]" :page-size="PageInfo.pageSize" hide-on-single-page
            layout="total, sizes, prev, pager, next, jumper" :total="PageInfo.total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange">
        </el-pagination>


        <!-- 信息修改弹出框 -->
        <el-dialog :title="Items.title" v-model="dialogVisible" width="40%">

            <el-form ref="ruleFormRef" class="demo-form-inline" label-width="auto" :model="Items.userItem">
                <el-form-item label="openId:" prop="openId">
                    <el-input v-model="Items.userItem.openId" disabled />
                </el-form-item>
                <el-form-item label="nickName:" prop="nickName">
                    <el-input v-model="Items.userItem.nickName" disabled />
                </el-form-item>
                <el-form-item label="quantityAndOdds:" prop="quantityAndOdds">
                    <el-input v-model="Items.userItem.quantityAndOdds" />
                </el-form-item>
                <el-form-item label="collects:" prop="collects">
                    <el-input v-model="Items.userItem.collects" />
                </el-form-item>
                <el-form-item label="errors:" prop="errors">
                    <el-input v-model="Items.userItem.errors" />
                </el-form-item>
                


            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" size="medium" @click="handleSubmit(ruleFormRef)">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除弹出框 -->
        <el-dialog v-model="centerDialogVisible" title="Warning" width="30%" align-center>
            <span style="font-size:larger;">是否确定删除 openId:{{ selectId }} 该条数据</span>
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

<script setup name="storage" >
import { onMounted, reactive, toRaw, ref, } from "vue";
import http from "../utils/request";

const centerDialogVisible = ref(false)
const dialogVisible = ref(false)
let selectId = 0


const Items = reactive({
    tableData: [],
    title: '',
    action: '',
    userItem: {
        "openId": '',
        "nickName": '',
        "quantityAndOdds": '',
        "collects": '',
        "errors": '',
    }
})

// 获取选中的行数据，并给弹出框内容赋值
const initQuestionItem = (questionData) => {
    if (questionData != null) {
        Items.userItem.openId = questionData.openId
        Items.userItem.nickName = questionData.nickName
        Items.userItem.quantityAndOdds = questionData.quantityAndOdds
        Items.userItem.collects = questionData.collects
        Items.userItem.errors = questionData.errors

    }

}
const PageInfo = reactive({
    page: 1,
    pageSize: 10,
    current: 1,
    total: 0

})

// 题目信息弹出框
const handelEdit = (item) => {
    // 兼容修改和新增
    if (item != null) {
        console.log(toRaw(item));
        Items.title = '修改题目'
        Items.action = 'edit'
        setTimeout(() => {
            initQuestionItem(item)
            dialogVisible.value = true
        }, 50)

    } else {
        Items.title = '新增题目'
        Items.action = 'add'
        Items.userItem = {} // 置空数据
        dialogVisible.value = true
    }

}


const onClickRemove = (id) => {
    selectId = id
    centerDialogVisible.value = true
}

// 确认删除
const confirmRemove = async () => {
    await http.delete('user/' + selectId).then(res => {
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

// 修改提交&新增提交
const handleSubmit = async () => {
    await http.post('user', toRaw(Items.provincesItem)).then(res => {
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
}





const init = async () => {
    await http.get(`user/page?page=${PageInfo.page}&pageSize=${PageInfo.pageSize}`).then(res => {
        Items.tableData = res.data.records
        PageInfo.total = Number(res.data.total)
    })
}
const handleSizeChange = (val) => {
    PageInfo.pageSize = val
    init()
}

const handleCurrentChange = (val) => {
    PageInfo.page = val
    init()
}
onMounted(() => {
    init()
})



</script>

<style>
.dialog-footer {
    display: flex;
    justify-content: center;
}
</style>