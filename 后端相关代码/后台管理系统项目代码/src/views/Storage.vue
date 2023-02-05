<template>
    <div class="storage">
        <div>
            <el-button type="primary" style="float: right; margin-right:10px ;" @click="handelEdit()">+ 新增题目</el-button>
        </div>
        <!-- 表单内容   -->
        <el-table :data="Items.tableData" max-height="500" stripe style="width: 100%">
            <el-table-column fixed prop="id" label="Id" width="40" />
            <el-table-column prop="qid" label="QId" width="80" />
            <el-table-column prop="question" label="Question" width="500" />
            <el-table-column prop="options" label="Options" width="500" />
            <el-table-column fixed="right" label="Operations" width="120">
                <template #default="scope">
                    <el-button link type="danger" size="small" @click="onClickRemove(scope.row.id)">删除</el-button>
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

            <el-form ref="ruleFormRef" class="demo-form-inline" label-width="auto" :rules="rules"
                :model="Items.questionItem">
                <el-form-item label="id:" prop="id">
                    <el-input v-model="Items.questionItem.id" disabled />
                </el-form-item>
                <el-form-item label="qid:" prop="qid">
                    <el-input v-model="Items.questionItem.qid" />
                </el-form-item>
                <el-form-item label="type:" prop="type">
                    <el-input v-model="Items.questionItem.type" />
                </el-form-item>
                <el-form-item label="question:" prop="question">
                    <el-input v-model="Items.questionItem.question" type="textarea" autosize />
                </el-form-item>
                <el-form-item label="options:" prop="options">
                    <el-input v-model="Items.questionItem.options" type="textarea" autosize />
                </el-form-item>
                <el-form-item label="result:" prop="result">
                    <el-input v-model="Items.questionItem.result" />
                </el-form-item>
                <el-form-item label="analysis:" prop="analysis">
                    <el-input v-model="Items.questionItem.analysis" type="textarea" autosize />
                </el-form-item>
                <el-form-item label="subject:" prop="subject">
                    <el-input v-model="Items.questionItem.subject" />
                </el-form-item>
                <el-form-item label="photo:" prop="photo">

                    <!-- 图片上传 -->
                    <el-upload ref="uploadRef" class="upload-demo" :action="baseImageUrl + '/upload'"
                        :auto-upload="false" list-type="picture" accept=".jpg, .jpeg, .png" limit="1"
                        :on-success="handleSucess" :on-error="handleError" :on-remove="handleRemove"
                        v-model:file-list="fileList">
                        <el-button type="primary">选择图片</el-button>
                        <template #tip>
                            <div class="el-upload__tip">
                                仅限上传一张小于5MB的 jpd, jpeg, png 图片.
                            </div>
                        </template>
                    </el-upload>

                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" size="medium" @click="handleSubmit(ruleFormRef)">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除弹出框 -->
        <el-dialog v-model="centerDialogVisible" title="Warning" width="30%" align-center>
            <span style="font-size:larger;">是否确定删除 Id:{{ selectId }} 该条数据</span>
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

<script setup name="storage">
import { onMounted, reactive, toRaw, ref, onUnmounted } from "vue";
import http from "../utils/request";

const centerDialogVisible = ref(false)
const dialogVisible = ref(false)
let selectId = 0
const ruleFormRef = ref()


// ============== 图片上传 & 加载
const baseImageUrl = 'http://localhost/api/v1/file'
const uploadRef = ref(null)
const fileList = ref([])

const handleSucess = async (response, uploadFile, uploadFiles) => {
    if (response != null) {
        console.log(response);
        Items.questionItem.photo = response.data
    }
    await http.post('storage', toRaw(Items.questionItem)).then(res => {
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
    init()
}

const handleError = (error) => {
    ElMessage({
        message: '图片上传失败',
        type: 'error',
    })
}

const handleRemove = (uploadFile, uploadFiles) => {

    if (uploadFiles.length == 0) {
        Items.questionItem.photo = ""
        uploadRef.value.clearFiles()
        console.log('图片已置空');
    }


}

//=================
const Items = reactive({
    tableData: [],
    title: '',
    action: '',
    questionItem: {
        "id": '',
        "qid": "",
        "type": "",
        "question": "",
        "options": "",
        "result": "",
        "analysis": "",
        "subject": "",
        "photo": ""
    }
})

// 获取选中的行数据，并给弹出框内容赋值
const initQuestionItem = (questionData) => {
    if (questionData != null) {
        Items.questionItem.id = questionData.id
        Items.questionItem.qid = questionData.qid
        Items.questionItem.type = questionData.type
        Items.questionItem.question = questionData.question
        Items.questionItem.options = questionData.options
        Items.questionItem.result = questionData.result
        Items.questionItem.analysis = questionData.analysis
        Items.questionItem.subject = questionData.subject
        Items.questionItem.photo = questionData.photo
        if (questionData.photo == null || questionData.photo == "") {
            console.log('当前题目没有图片');
        } else {
            fileList.value.push({
                name: questionData.photo,
                url: `${baseImageUrl}/download?name=${questionData.photo}`
            })
        }
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
    if (uploadRef.value != null) {
        uploadRef.value.clearFiles()
    }
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
        Items.questionItem = {} // 置空数据
        dialogVisible.value = true
    }

}


const onClickRemove = (id) => {
    selectId = id
    centerDialogVisible.value = true
}

// 确认删除
const confirmRemove = async () => {
    await http.delete('storage/' + selectId).then(res => {
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
const handleSubmit = async (formEl) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            // 手动上传图片 & 上传数据 
            if (fileList.value.length > 0) {
                uploadRef.value.submit()
            } else {
                handleSucess()
            }


        } else {
            console.log('表单校验不通过', fields)
            setTimeout(() => {
                formEl.resetFields()
            }, 3000)

        }
    })

}

// 表单校验规则
const rules = reactive({
    qid: [
        {
            required: true,
            trigger: 'change',
            message: '此项为必填',
        },
    ],
    type: [
        {
            required: true,
            trigger: 'change',
            message: '此项为必填',
        },
    ],
    question: [
        {
            required: true,
            trigger: 'change',
            message: '此项为必填',
        },
    ],
    options: [
        {
            required: true,
            trigger: 'change',
            message: '此项为必填',
        },
    ],
    result: [
        {
            required: true,
            trigger: 'change',
            message: '此项为必填',
        },
    ],
    subject: [
        {
            required: true,
            trigger: 'change',
            message: '此项为必填',
        },
    ]
})



const init = async () => {
    await http.get(`storage/page?page=${PageInfo.page}&pageSize=${PageInfo.pageSize}`).then(res => {
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