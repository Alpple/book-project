<template>
  <div style="display: flex;">
    <div style="margin-right: 1em">
      <el-card style="width: 300px;">
        <template #header>
          <div style="display: flex;justify-content: space-between">
            <span style="font-weight: 900;font-size: 1.1em">入 库</span>
            <el-checkbox v-model="isCreateNewBook">创 建 新 书</el-checkbox>
          </div>
        </template>
        <el-form :model="storage" :rules="storageRule" label-width="80px" ref="storageForm">
          <el-form-item label="现有图书" prop="bookId">
            <book-id-selector v-model="storage.bookId" v-if="!isCreateNewBook"/>
            <span v-else>请完成新图书信息表单</span>
          </el-form-item>
          <el-form-item label="数 量" prop="number">
            <el-input v-model="storage.number"
                      type="number" clearable
                      placeholder="请输入书籍的册数"/>
          </el-form-item>
          <el-form-item label="操 作 人">
            {{$store.state.user.name}}
          </el-form-item>
          <el-form-item label="日 期" prop="time">
            <el-date-picker
                v-model="storage.time"
                type="datetime"
                placeholder="时间（默认当前）"
                :default-time="defaultTime"
                value-format="YYYY-MM-DD HH:mm:ss"
                :disabled-date="disabledDate"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">入 库</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <el-card header="新 图 书 表 单" v-show="isCreateNewBook" style="width: 300px;">
      <el-form :model="book" :rules="bookRule" label-width="70px" ref="bookForm">
        <el-form-item label="书 名" prop="name">
          <el-input v-model.trim="book.name"
                    type="text" maxlength="32" clearable
                    placeholder="请输入书籍的名字"/>
        </el-form-item>
        <el-form-item label="作 者" prop="author">
          <el-input v-model.trim="book.author"
                    type="text" maxlength="9" clearable
                    placeholder="请输入作者的名字"/>
        </el-form-item>
        <el-form-item label="价 格" prop="price">
          <el-input v-model="book.price"
                    type="number" clearable
                    placeholder="请输入价格"/>
        </el-form-item>
        <el-form-item label="出版社" prop="publisher">
          <el-input v-model.trim="book.publisher"
                    type="text" maxlength="32" clearable
                    placeholder="请输入出版社的名字"/>
        </el-form-item>
        <el-form-item label="类 别" prop="typeId">
          <type-id-selector v-model="book.typeId"/>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script setup>
import {getCurrentInstance, ref} from "vue";
import {BookNetwork} from "@/api/Book";
import TypeIdSelector from "@/components/selecter/type-id-selector";
import BookIdSelector from "@/components/selecter/book-id-selector";

const proxy = getCurrentInstance().proxy;
const disabledDate = (time) => {
  return time.getTime() > Date.now()
}
const defaultTime = new Date();
const storage = ref({empId: 2})
const storageRule = {
  number: [
    {required: true, message: '图书的数量不能为空', trigger: 'blur'},
  ]
}
const storageForm = ref();


const isCreateNewBook = ref(false)
const bookRule = {
  name: [
    {required: true, message: '图书的名字不能为空', trigger: 'blur'},
  ],
  author: [
    {required: true, message: '图书的作者不能为空', trigger: 'blur'},
  ],
  publisher: [
    {required: true, message: '图书的出版社不能为空', trigger: 'blur'},
  ],
  typeId: [
    {required: true, message: '图书类型不能为空', trigger: 'blur'},
  ],
  price: [
    {required: true, message: '图书的价格不能为空', trigger: 'blur'},
  ]
}
const book = ref({
  name: "",
  author: '',
  publisher: '',
  typeId: undefined,
  price: '',
})
const bookForm = ref(null)

const loading = ref(false)

async function onSubmit() {
  let valid=true;
  if (isCreateNewBook.value) {
    valid = await bookForm.value.validate((valid) => valid)
  }else {
    if (!storage.value.bookId) {
      proxy.$notify.error("书名不能为空")
      return;
    }
  }
  if (!valid) {
    return;
  }
  valid = valid && await storageForm.value.validate((valid) => valid)
  if (!valid) {
    return;
  }
  loading.value = true;
  const func = () => {
    loading.value = false;
  }
  BookNetwork.storage({
    storage: {isCreateNewBook:isCreateNewBook.value, ...storage.value, ...book.value},
    success: () => {
      proxy.$notify.success("入库成功")
      func();
      book.value = {}
      storage.value = {empId: storage.value.empId}
    },
    fail: func, reject: func
  })

}
</script>

<style scoped lang="less">
.el-input {
  width: 200px;
}

.label {
  display: inline-block;
  width: 70px;
  margin-right: 1em;
  text-align: right;
}
</style>
