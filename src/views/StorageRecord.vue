<template>
  <div class="box">
    <div class="top-filter">
      <span class="item">
        <el-select style="width: 100px" v-model="key" clearable placeholder="查找依据">
          <el-option label="员 工" value="empId"/>
          <el-option label="书 名" value="bookId"/>
        </el-select>
      </span>
      <span class="item">
       <emp-id-selector v-if="key==='empId'" v-model="input"/>
        <book-id-selector v-else v-model="input"/>
      </span>
      <span class="item">
        <el-button type="primary" @click="list(undefined,true)">查找</el-button>
      </span>
    </div>
    <el-table :data="tableData" stripe style="width: 100%;margin: 1em 0;">
      <el-table-column prop="book.bookName" label="书 名"/>
      <el-table-column prop="book.bookAuthor" label="作 者" width="100px"/>
      <el-table-column prop="book.bookNumber" label="数 量" width="100px"/>
      <el-table-column prop="emp.name" label="操 作 人" width="150px"/>
      <el-table-column prop="emp.account" label="操作人账号" width="150px"/>
      <el-table-column prop="emp.tel" label="手 机 号" width="130px"/>
      <el-table-column prop="storage.time" label="入 库 时 间" width="200px"/>
      <el-table-column prop="storage.number" label="入库数量" width="200px"/>
      <el-table-column label="操 作" width="200px">
        <template #default="{$index,row}">
          <el-popconfirm title="确定删除这条记录吗?" @confirm="removeStorageById(row.storage.id,$Index)">
            <template #reference>
              <el-button
                  type="danger"
                  :loading="removeBtnLoading"
              >
                删除记录
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next"
                   :total="page.total" :page-count="page.pages" :current-page="page.current"
                   @current-change="list"
                   @prev-click="list"
                   @next-click="list"/>
  </div>
</template>
<script setup>
import {getCurrentInstance, ref} from "vue";
import {BookNetwork} from "@/api/Book";
import ReturnBookButton from "@/components/ReturnBookButton";
import ReaderIdSelector from "@/components/selecter/reader-id-selector";
import BookIdSelector from "@/components/selecter/book-id-selector";
import EmpIdSelector from "@/components/selecter/emp-id-selector";

const returnDefaultTime = ref(undefined)
const proxy = getCurrentInstance().proxy
const returnBookSubmit = (readerId, bookId, index) => {
  BookNetwork.returnBook({
    readerId: readerId,
    bookId: bookId,
    time: returnDefaultTime.value,
    success: (res) => {
      proxy.$notify.success("还书成功！");
      proxy.tableData[index].borrow.returnTime =
          returnDefaultTime.value ? returnDefaultTime.value : new Date().Format("yyyy-MM-dd hh:mm:ss")
    }
  })
}

const removeBtnLoading = ref(false)
const removeStorageById = (id, index) => {
  removeBtnLoading.value = true;
  const func = () => (removeBtnLoading.value = false);
  RecordNetwork.removeStorageById({
    id,
    success: (res) => {
      proxy.$notify.success("删除成功！");
      proxy.tableData.splice(index, 1)
      func();
    },
    fail: func,
    reject: func
  })
}


</script>
<script>
import {RecordNetwork} from "@/api/Record";

export default {
  name: "record",
  data() {
    return {
      tableData: [],
      page: {
        pages: 0,
        total: 0,
        current: 0,
        size: 2,
      },
      key: "empId",
      input: "",
    }
  },
  created() {
    this.list()
  },
  methods: {
    list(page, resetPage) {
      if (resetPage) {
        page = 1;
      }
      RecordNetwork.listStorage({
        page: page ? page : this.page.current + 1,
        size: this.page.size,
        [this.key]: this.input,
        success: (res) => {
          this.tableData = res.result.records;
          this.page = {
            pages: res.result.pages,
            total: res.result.total,
            current: res.result.current,
            size: res.result.size,
          }
        }
      })
    }
  }
}
</script>

<style scoped>

.top-filter {
  width: 100%;
}

.top-filter .item {
  margin: 0 .5em;
}


</style>
