<template>
  <div>
    <div>
      <el-select style="width: 100px" v-model="type" clearable placeholder="查找依据">
        <el-option label="书名" value="name"/>
        <el-option label="作者" value="author"/>
        <el-option label="出版社" value="publisher"/>
        <el-option label="类型" value="typeName"/>
      </el-select>
      <el-input v-model="key" placeholder="书籍名称" style="width: 500px;margin: 0 1em"></el-input>
      <el-button type="primary" @click="page.current===1?(list()):(page.current =1)">查找</el-button>
    </div>
    <el-table :data="tableData" stripe style="width: 100%;margin: 1em 0">
      <el-table-column prop="bookName" label="书 名"/>
      <el-table-column prop="bookAuthor" label="作 者" width="200px"/>
      <el-table-column prop="bookPublisher" label="出 版 社"/>
      <el-table-column prop="bookNumber" label="总 数 量" width="120px"/>
      <el-table-column prop="borrowNumber" label="已 借 数 量" width="120px"/>
      <el-table-column prop="bookPrice" label="价 格" width="120px"/>
      <el-table-column prop="typeName" label="类 型" width="120px"/>
      <el-table-column label="操作" v-if="$store.state.user.userType!==LOGIN_CODE_READER">
        <template #default="scope">
          <el-button type="primary" plain size="small" @click="borrow(scope.$index,scope.row)">借 出</el-button>
          <el-button type="warning" plain size="small" @click="modify(scope.$index,scope.row)">修 改</el-button>
          <el-popconfirm title="确定要删除这本书吗？" @confirm="removeById(scope.$index,scope.row)">
            <template #reference>
              <el-button type="danger" plain size="small">删 除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next"
                   :total="page.total" :page-count="page.pages" :current-page="page.current"
                   @current-change="pageH"
                   @prev-click="pageH"
                   @next-click="pageH"/>
  </div>

  <el-dialog
      v-model="dialog"
      title="修 改"
      width="30%">
    <el-form :model="book" label-width="90px" ref="bookForm">
      <el-form-item label="书 名">
        <el-input v-model.trim="book.name" placeholder="请输入作者的名字"/>
      </el-form-item>
      <el-form-item label="作 者">
        <el-input v-model.trim="book.author" placeholder="请输入作者的名字"/>
      </el-form-item>
      <el-form-item label="出 版 社">
        <el-input v-model.trim="book.publisher" placeholder="请输入出版社的名字"/>
      </el-form-item>
      <el-form-item label="类 别">
        <type-id-selector v-model="book.typeId"/>
      </el-form-item>
      <el-form-item label="价 格">
        <el-input v-model="book.price" placeholder="请输入价格"/>
      </el-form-item>
      <el-form-item label="数 量">
        {{book.number}}（由入库管理）
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialog = false">取 消</el-button>
        <el-button type="primary" @click="modifySubmit">确 认</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog
      v-model="borrowDialog"
      title="借出"
      width="30%">
    <el-form :model="borrowBook" label-width="90px" ref="bookForm">
      <el-descriptions title="书籍" column="2">
        <el-descriptions-item label="书名">{{ borrowBook.bookName }}</el-descriptions-item>
        <el-descriptions-item label="类别">{{ borrowBook.type === 0 ? '计算机' : '非计算机' }}</el-descriptions-item>
        <el-descriptions-item label="价格">{{ borrowBook.price }}</el-descriptions-item>
        <el-descriptions-item label="册数">{{ borrowBook.number }}</el-descriptions-item>

      </el-descriptions>
      <el-form-item label="用户">
        <el-select
            v-model="borrowBook.userId"
            filterable
            remote
            reserve-keyword
            placeholder="Please enter a keyword"
            :remote-method="searchUser"
            :loading="searchUserLoading"
        >
          <el-option
              v-for="item in users"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialog = false">取消</el-button>
        <el-button type="primary" @click="borrowSubmit">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import {LOGIN_CODE_READER} from "@/api/System";
import {onBeforeRouteUpdate} from "vue-router";
import {getCurrentInstance} from "vue";
const proxy = getCurrentInstance().proxy;
onBeforeRouteUpdate((a,b)=>{
  // debugger;
  // if (!this.page){return}
  proxy.page.current = parseInt(a.params.page) || 1;
  proxy.page.size = parseInt(a.params.size) || 3;
  proxy.list()
},)
</script>
<script>
import {BookNetwork} from "@/api/Book";
import {UserNetwork} from "@/api/User";
import {RecordNetwork} from "@/api/Record";
import TypeIdSelector from "@/components/selecter/type-id-selector";

export default {
  name: "List",
  components: {TypeIdSelector},
  data() {
    return {
      tableData: [],
      key: "",
      type: undefined,
      page: {
        pages: 0,
        total: 0,
        current: 0,
        size: 3,
      },
      dialog: false,
      book: {
        id: -1,
        bookName: '',
        type: '',
        author: '',
        publisher: "",
        price: -1,
        number: 0
      },
      borrowDialog: false,
      borrowBook: {},
      searchUserLoading: false,
      users: [],
      number: 0,
      price: 0,
      unReturnNumber: 0
    }
  },
  created() {
    this.page.current = parseInt(this.$route.params.page) || 1;
    this.page.size = parseInt(this.$route.params.size) || 3;
    this.list()
  },
  // 当前组件使用vue 3 setup后，vue2语法中的 beforeRouteUpdate 的 this 不是当前组件实例
  // beforeRouteUpdate(a,b){
  //   // debugger;
  //   // if (!this.page){return}
  //   this.page.current = parseInt(a.params.page) || 1;
  //   this.page.size = parseInt(a.params.size) || 3;
  //   this.list()
  // },
  methods: {
    searchUser(key) {
      this.searchUserLoading = true
      UserNetwork.queryByName(key, (data) => {
        this.users = data.result
        this.searchUserLoading = false
      }, () => {
        this.searchUserLoading = false
      }, () => {
        this.searchUserLoading = false
      })
    },
    pageH(value){
      this.page.current = value;
      this.$router.push(`/home/list/${this.page.current}/${this.page.size}`)
    },
    sizeH(value){
      this.page.size = value;
      this.$router.push(`/home/list/${this.page.current}/${this.page.size}`)
    },
    list() {
      BookNetwork.list({
            page: this.page.current, size: this.page.size,
            book: {[this.type]: this.key},
            success: (data) => {
              this.tableData = data.result.records;
              this.page = {
                pages: data.result.pages,
                total: data.result.total,
                size: data.result.size,
                current: data.result.current
              }
            }
          })
    },
    borrow(index, row) {
      this.borrowBook = row;
      this.borrowBook.index = index;
      this.borrowDialog = true
    },
    modify(index, row) {
      this.book = {
        id: row.bookId,
        name: row.bookName,
        author: row.bookAuthor,
        price: row.bookPrice,
        number: row.bookNumber,
        publisher: row.bookPublisher,
        typeId: row.typeId,
      };
      this.book.index = index;
      this.dialog = true
    },
    modifySubmit() {
      BookNetwork.modify({
        book: this.book,
        success: (data) => {
          this.tableData[this.book.index] = data.result;
          this.$notify.success("修改成功！")
          this.dialog = false;
        }
      })
    },
    borrowSubmit() {
      RecordNetwork.borrow({userId: this.borrowBook.userId, bookId: this.borrowBook.id}, () => {
        this.$notify.success("处理成功！");
        this.borrowBook.userId = -1;
        this.tableData[this.borrowBook.index].number--;
        this.borrowDialog = false;
      })
    },
    removeById(index, row) {
      BookNetwork.removeById({
        id: row.bookId,
        success: () => {
          this.$notify.success("删除成功")
          this.tableData.splice(index,1)
        }
      })
    }

  },
}
</script>

<style scoped>

</style>
