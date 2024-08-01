<template>
  <div class="top-filter ">
    <span class="item">
    <el-select style="width: 100px" v-model="key" clearable placeholder="查找依据">
      <el-option label="用户手机号" value="tel"/>
      <el-option label="用户姓名" value="name"/>
      <el-option label="用户账号" value="account"/>
    </el-select>
    </span>
    <span class="item">
    <el-input v-model.trim="input" placeholder="请输入关键字查找" clearable style="width: 200px"/>
    </span>
    <span class="item">
      <el-button type="primary" @click="currentPage===1?(loadData()):(currentPage=1)">搜索</el-button>
    </span>
  </div>
  <el-table :data="tableData" stripe style="width: 100%;margin:1em 0">
    <el-table-column type="index"/>
    <el-table-column prop="name" label="姓 名"/>
    <el-table-column prop="sex" label="性 别" width="100"/>
    <el-table-column prop="tel" label="手 机 号" width="200"/>
    <el-table-column prop="account" label="账 号" width="200"/>
    <el-table-column label="密 码">
      <template #default="{row,$index}">
        <el-button size="small" plain type="danger" @click="resetPassword(row)">重置</el-button>
      </template>
    </el-table-column>
    <el-table-column label="启 用">
      <template #default="{row,$index}">
        <el-switch
            v-model="row.enabled"
            inline-prompt
            active-text="是"
            inactive-text="否"
            :loading="row.enabledBtnLoading"
            @change="()=>{enabled($index,row)}"
        />
      </template>
    </el-table-column>
    <el-table-column label="操 作">
      <template #default="{row,$index}">
        <el-button size="small" plain type="warning" @click="update($index,row)">修改</el-button>
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
      title="修改"
      v-model="dialogVisible"
  >

    <el-form ref="updateFormRef" :model="updateForm" :rules="UserNetwork.readerRules" label-width="80px">
      <el-form-item label="姓名" prop="name">
        <el-input v-model.trim="updateForm.name" maxlength="10" clearable/>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="updateForm.sex" placeholder="性别">
          <el-option label="女" value="女"/>
          <el-option label="男" value="男"/>
        </el-select>
      </el-form-item>
      <el-form-item label="手机号" prop="tel">
        <el-input v-model="updateForm.tel" maxlength="11" minlength="11" clearable/>
      </el-form-item>
      <el-form-item label="账号">
        {{ updateForm.account }}
      </el-form-item>

    </el-form>

    <template #footer>
      <div>
        <div style="margin-top: 30px;display: flex;align-items: end">
          <el-button size="small" style="margin-right: 1em" @click="resetForm">重置</el-button>
          <el-button type="primary" style="flex: 1" @click="submitForm" :loading="submitBtnLoading">
            修改
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


const proxy = getCurrentInstance().proxy;
const dialogVisible = ref(false)
const updateForm = ref({})
const updateIndex = ref()
const update = (index, row) => {
  updateForm.value = {...row};
  updateIndex.value = index
  dialogVisible.value = true;
}
const resetForm = () => {
  updateFormRef.value.resetFields()
}
const updateFormRef = ref(null)
const submitBtnLoading = ref(false)
const submitForm = () => {
  updateFormRef.value.validate((val) => {
    if (!val) {
      return;
    }
    updateBtnLoading.value = true;
    const func = () => {
      updateBtnLoading.value = false;
    }
    UserNetwork.empUpdate({
      data: updateForm.value,
      success: () => {
        proxy.$notify.success("更新成功")
        tableData.value[updateIndex.value] = updateForm.value
        updateForm.value = {}
        dialogVisible.value = false
        func();
      }, fail: func, reject: func

    })

  })
}
const resetBtnLoading = ref(false)
const updateBtnLoading = ref(false)
const enabled = (index, row) => {
  row.enabledBtnLoading = true;
  const func = () => {
    row.enabledBtnLoading = false;
  }
  UserNetwork.empEnabled({
    id: row.id,enabled:row.enabled,
    success: () => {
      proxy.$notify.success("操作成功")
      tableData.value[index].enabled=row.enabled;
      func();
    }, fail: func, reject: func
  })
}

const resetPassword = (row) => {
  resetBtnLoading.value = true;
  const func = () => {
    resetBtnLoading.value = false;
  }
  UserNetwork.resetEmpPassword({
    id: row.id,
    success: () => {
      proxy.$notify.success("重置成功")
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
  router.replace(`/home/emp/manage/${currentPage.value}/${pageSize.value}`)
})
onBeforeRouteUpdate((newRoute) => {
  currentPage.value = parseInt(newRoute.params.page)
  pageSize.value = parseInt(newRoute.params.size)
  loadData()
})

const key = ref("name")
const input = ref("")

const loadData = () => {
  let value = input.value;
  if (!input.value || input.value.length === 0) {
    value = undefined;
  }
  UserNetwork.listEmp({
    page: currentPage.value,
    size: pageSize.value,
    emp: {[key.value]: value},
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
  margin: 1em;
}
</style>
