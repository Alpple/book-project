<template>
  <div style="display: flex;flex-wrap: nowrap">
    <div class="box">
      <div class="content bor" @click="type='borrow'">
        借书
      </div>
      <div class="content re" @click="type='return'">
        还书
      </div>
    </div>
    <el-card class="box-card" :style="{flex: type==='list'?1:''}">
      <template #header>
        <span>
          图书
          <el-tag type="success">
            {{ type === 'borrow' ? '借出' : '还入' }}
          </el-tag>
        </span>
        <el-button
            type="primary"
            v-show="type==='list'"
            @click="type='return'"
            style="float: right"
        >
          返回
        </el-button>
      </template>
      <div v-show="type==='borrow'">
        <div>
          <div class="item">
            <span class="label">图 书：</span>
            <book-id-selector v-model="bookId" style="flex: 1"/>
          </div>
          <div class="item">
            <span class="label">读 者：</span>
            <reader-id-selector v-model="readerId" style="flex: 1"/>
          </div>
        </div>
        <div style="margin-top: 30px;display: flex;align-items: end">
          <el-button size="small" style="margin-right: 1em" @click="resetBorrowInfo">取 消</el-button>
          <el-button type="primary" style="flex: 1" @click="borrowBook" :loading="borrowBtuLoading">
            借 出
          </el-button>
        </div>
      </div>
      <div v-show="type==='return'">
        <div class="item">
          <span class="label">读 者：</span>
          <reader-id-selector v-model="readerId"/>
        </div>
        <el-button type="primary"
                   @click="getReaderUnreturnBookList" :loading="searchBtuLoading"
                   style="display: block;width: 100%;margin-top: 50px"
        >
          检 索
        </el-button>
      </div>
      <el-table
          v-show="type==='list'"
          empty-text="没有借阅记录"
          :data="unReturnBooks"
          style="width: 100%">
        <el-table-column prop="book.bookName" label="书名"/>
        <el-table-column prop="borrow.borrowTime" label="借书时间"/>
        <el-table-column label="操作">
          <template #default="{$index,row}">
            <div v-if="row.borrow.returnTime">
              <el-tag type="success">已归还</el-tag>
            </div>
            <ReturnBookButton
                v-else v-model:time="returnDefaultTime"
                :returnBookSubmit="()=>returnBookSubmit(row.borrow.readerId,row.borrow.bookId,$index)"/>
          </template>
        </el-table-column>

      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import {getCurrentInstance, ref} from "vue";
import BookIdSelector from "@/components/selecter/book-id-selector";
import ReaderIdSelector from "@/components/selecter/reader-id-selector";
import {BookNetwork} from "@/api/Book";
import ReturnBookButton from "@/components/ReturnBookButton";

let proxy = getCurrentInstance().proxy;
const type = ref("return")
const bookId = ref(undefined)
const readerId = ref(1)
const borrowBtuLoading = ref(false)
const borrowBook = () => {
  if (!bookId.value || !readerId.value) {
    proxy.$notify.warning("读者和图书都不能为空");
    return;
  }
  borrowBtuLoading.value = true;
  const func = () => (borrowBtuLoading.value = false);
  BookNetwork.borrowBook({
    bookId: bookId.value,
    readerId: readerId.value,
    success: () => {
      proxy.$notify.success("借书成功，15天内归还！");
      resetBorrowInfo();
      func();
    },
    fail: func,
    reject: func
  })
}
const resetBorrowInfo = () => {
  bookId.value = undefined;
  readerId.value = undefined;
}
const defaultTime = new Date();
const returnDefaultTime = ref(undefined)
const unReturnBooks = ref([])
const searchBtuLoading = ref(false)
const getReaderUnreturnBookList = () => {
  if (!readerId.value) {
    proxy.$notify.warning("读者不能为空");
    return;
  }
  type.value = 'list'
  searchBtuLoading.value = false;
  unReturnBooks.value = []
  const func = () => (searchBtuLoading.value = false);
  BookNetwork.listReaderUnreturnById({
    readerId: readerId.value,
    success: (res) => {
      unReturnBooks.value = res.result;
      proxy.$notify.success("查询成功！");
      //resetBorrowInfo();
      func();
    },
    fail: func,
    reject: func
  })

}

const returnBtuLoading = ref(false)
const returnBookSubmit = (readerId, bookId, index) => {
  returnBtuLoading.value = true;
  const func = () => (searchBtuLoading.value = false);
  BookNetwork.returnBook({
    readerId: readerId,
    bookId: bookId,
    time: returnDefaultTime.value,
    success: (res) => {
      proxy.$notify.success("还书成功！");
      unReturnBooks.value[index].borrow.returnTime =
          returnDefaultTime.value ? returnDefaultTime.value : new Date()
      func();
    },
    fail: func,
    reject: func
  })

}
</script>

<style scoped>
.box-card {
  margin: 20px;
  min-width: 500px;
  flex-shrink: 0;
  transition: all .5s;
}

.label {
  display: inline-block;
  width: 60px;
  text-align: right;
}

.item {
  margin: 1em;
  width: 400px;
  display: flex;
  align-items: center;
}

.box {
  border-right: 1px solid #eeeeee;
  margin-right: 20px;
}

.content {
  display: flex;
  justify-content: center;
  align-content: center;

  width: 100px;
  margin: 1em;
  padding: 20px;
  font-size: 50px;


  border: 1px solid #eee;
  border-radius: 20px;
  box-shadow: 1px 2px 9px #eee;

  color: #fff;

  cursor: pointer;

  transition: transform 200ms;
  transform: scale(1);
}

.content:hover {
  transform: scale(1.1);
}

.content:active {
  color: red !important;
}


.re {
  background: #42b983;
}

.re:hover {
  background: #fff;
  color: #42b983;
  border-color: #42b983;
}

.bor {
  background: #5bb6f8;
}

.bor:hover {
  background: #fff;
  color: #5bb6f8;
  border-color: #5bb6f8;
}
</style>
