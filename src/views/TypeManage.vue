<template>
  <div class="top-filter ">
    <span class="item">
    <el-input v-model.trim="input" placeholder="类型名称搜索" clearable style="width: 200px"/>
    </span>
    <span class="item">
      <el-button type="primary" @click="currentPage===1?(loadData()):(currentPage=1)">搜 索</el-button>
    </span>
    <span class="item" style="float: right">
      <el-button type="success" @click="add">新 增</el-button>
    </span>
  </div>
  <el-table :data="tableData" stripe style="width: 100%;margin: 1em 0">
    <el-table-column type="index"/>
    <el-table-column prop="name" label="名 称"/>
    <el-table-column prop="number" label="数 量"/>
    <el-table-column label="操 作">
      <template #default="{row,$index}">
        <el-button size="small" plain type="warning" @click="update($index,row)">修 改</el-button>
        <el-popconfirm title="你确定要删除这个吗？" @confirm="remove($index,row)">
          <template #reference>
            <el-button size="small" plain type="danger">删 除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
      v-model:currentPage="currentPage"
      :page-size="pageSize"
      :page-sizes="[1,3,6,10]"
      layout="total, sizes,prev, pager, next, jumper"
      :total="recordTotal"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
  />

  <el-dialog
      :title="formType==='update'?'修改':'新增'"
      v-model="dialogVisible"
  >

    <el-form
        ref="updateFormRef"
        :model="updateForm"
        :rules="{
            name: [
                {required: true, message: '名称不能为空', trigger: 'blur'},
                {min: 2, max: 10, message:'长度为2-10', trigger: 'blur'}
              ],
        }"
        label-width="80px"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model.trim="updateForm.name" maxlength="10" clearable/>
      </el-form-item>
      <el-form-item label="数量" v-if="formType==='update'">
        {{ updateForm.number }}
      </el-form-item>
    </el-form>

    <template #footer>
      <div>
        <div style="margin-top: 30px;display: flex;align-items: end">
          <el-button size="small" style="margin-right: 1em" @click="resetForm">重置</el-button>
          <el-button type="primary" style="flex: 1" @click="submitForm" :loading="submitBtnLoading">
            {{ formType==='update'?'修改':'新增' }}
          </el-button>
        </div>
      </div>
    </template>
  </el-dialog>

</template>

<script setup>
import {getCurrentInstance, onMounted, ref, watch} from "vue";
import {UserNetwork} from "@/api/User";
import {onBeforeRouteUpdate, useRoute, useRouter} from "vue-router";
import {SystemNetwork} from "@/api/System";


const proxy = getCurrentInstance().proxy;
const dialogVisible = ref(false)
const updateForm = ref({})
const updateIndex = ref()
const update = (index, row) => {
  updateForm.value = {...row};
  updateIndex.value = index
  dialogVisible.value = true;
  formType.value = 'update'
}
const resetForm = () => {
  updateFormRef.value.resetFields()
}
const updateFormRef = ref(null)
const submitBtnLoading = ref(false)
const formType = ref('update')
const submitForm = () => {// you 骗 me
  updateFormRef.value.validate((val) => {
    if (!val) {
      return;
    }
    updateBtnLoading.value = true;
    const func = () => {
      updateBtnLoading.value = true;
    }
    if (formType.value === 'update') {
      SystemNetwork.typeUpdate({
        data: updateForm.value,
        success: () => {
          proxy.$notify.success("更新成功")
          tableData.value[updateIndex.value] = updateForm.value
          updateForm.value = {}
          dialogVisible.value = false
          func();
        }, fail: func, reject: func
      })
      return;
    }
    SystemNetwork.typeSave({
      data: updateForm.value,
      success: () => {
        proxy.$notify.success("新增成功")
        tableData.value.unshift(({...updateForm.value}))
        updateForm.value = {}
        dialogVisible.value = false
        func();
      }, fail: func, reject: func
    })
  })
}

const add = () => {
  formType.value = 'insert'
  dialogVisible.value = true;
  updateForm.value = {}
}

const updateBtnLoading = ref(false)
const removeBtnLoading = ref(false)
const remove = (index, row) => {
  removeBtnLoading.value = true;
  const func = () => {
    removeBtnLoading.value = true;
  }
  SystemNetwork.typeRemove({
    id: row.id,
    success: () => {
      proxy.$notify.success("删除成功")
      tableData.value.splice(index, 1)
      func();
    }, fail: func, reject: func
  })
}

const tableData = ref([])

let route = useRoute();
const currentPage = ref(parseInt(route.params.page) || 1)
const pageSize = ref(parseInt(route.params.size) || 6)
const recordTotal = ref(0)
watch([currentPage, pageSize], () => {
  router.replace(`/home/type/manage/${currentPage.value}/${pageSize.value}`)
})
onBeforeRouteUpdate((newRoute) => {
  currentPage.value = parseInt(newRoute.params.page)
  pageSize.value = parseInt(newRoute.params.size)
  loadData()
})


const input = ref("")

const loadData = () => {
  let value = input.value;
  if (!input.value || input.value.length === 0) {
    value = undefined;
  }
  SystemNetwork.typePage({
    page: currentPage.value,
    size: pageSize.value,
    data: {name: value},
    success: (res) => {
      tableData.value = res.result.records;
      recordTotal.value = res.result.total
      currentPage.value = res.result.current
    }
  })
}
let router = useRouter();
const handleSizeChange = (value) => {
  pageSize.value = value
}
const handleCurrentChange = (value) => {
  currentPage.value = value
}

onMounted(loadData)
</script>

<style scoped>
.top-filter {
  width: 100%;
}

.top-filter .item {
  margin: 0 0.5em;
}
</style>
