<template>
<div class="box">
  <div v-if="user.userType!==LOGIN_CODE_ROOT">
    <el-button type="primary" @click="update">修 改 信 息</el-button>
    <el-button type="warning" v-if="!showPassInput" @click="showPassInput=true">修 改 密 码</el-button>
    <el-input v-model="pass" placeholder="新 密 码" v-if="showPassInput" style="width: 200px"/>
    <el-button v-if="showPassInput" type="success" @click="modifyPasswordSubmit">修 改 密 码 提 交</el-button>
  </div>
  <div style="width: 500px;margin-top: 8px">
    <el-card>
      <el-form v-show="showUpdate" ref="updateFormRef" :model="updateForm" :rules="UserNetwork.readerRules" label-width="80px">
        <el-form-item label="姓 名" prop="name">
          <el-input v-model.trim="updateForm.name" maxlength="10" clearable/>
        </el-form-item>
        <el-form-item label="性 别" prop="sex">
          <el-select v-model="updateForm.sex" placeholder="性 别">
            <el-option label="女" value="女"/>
            <el-option label="男" value="男"/>
          </el-select>
        </el-form-item>
        <el-form-item label="手 机 号" prop="tel">
          <el-input v-model="updateForm.tel" maxlength="11" minlength="11" clearable/>
        </el-form-item>
        <el-form-item label="账 号">
          {{ updateForm.account }}
        </el-form-item>
        <div style="margin-top: 30px;display: flex;align-items: end">
          <el-button size="small" style="margin-right: 1em" @click="resetForm">重 置</el-button>
          <el-button type="primary" style="flex: 1" @click="submitForm" :loading="submitBtnLoading">
            修 改
          </el-button>
        </div>
      </el-form>
      <el-descriptions v-show="!showUpdate" title="用 户 信 息">
        <el-descriptions-item label="账号">
          <el-tag type="success">{{ user.account }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="姓名" v-if="user.name">{{ user.name }}</el-descriptions-item>
        <el-descriptions-item label="性别" v-if="user.sex">{{ user.sex }}</el-descriptions-item>
        <el-descriptions-item label="电话号码" v-if="user.tel">{{ user.tel }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</div>
</template>

<script setup>
import {useStore} from "vuex";
import {getCurrentInstance, ref} from "vue";
import {LOGIN_CODE_EMP, LOGIN_CODE_READER, SystemNetwork} from "@/api/System";
import {UserNetwork} from "@/api/User";

const {LOGIN_CODE_ROOT} = require("@/api/System");
let proxy = getCurrentInstance().proxy;
let store = useStore();
const user = ref(store.state.user)

const showUpdate = ref(false)
const updateBtnLoading = ref(false)
const updateForm = ref({})
const update = () => {
  showUpdate.value=true
  updateForm.value = {...user.value};
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
      updateBtnLoading.value = true;
    }
UserNetwork.readerUpdate({
  data: updateForm.value,
  success: (data) => {
    proxy.$notify.success("更新成功")
    updateForm.value = {}
    store.dispatch('setUser',data.result)
    user.value = data.result;
    showUpdate.value=false
    func();
  }, fail: func, reject: func

})

  })
}




const showPassInput = ref(false)
const pass = ref()
const modifyPassword = (() => {
  switch (user.value.userType) {
    case LOGIN_CODE_EMP:
      return SystemNetwork.modifyEmpPassword;
    case LOGIN_CODE_READER:
      return SystemNetwork.modifyReaderPassword;
  }
})();

const modifyPasswordSubmit = () => {
  modifyPassword({
    tel: user.value.tel,
    password: pass.value,
    success: () => {
      showPassInput.value = false;
      pass.value = ''
      proxy.$notify.success("修改密码成功")
    },
    fail() {

    }, reject() {

    }
  })
}

</script>

<style scoped>
.box{
  padding-left: 100px;
  padding-top: 20px;
}
</style>
