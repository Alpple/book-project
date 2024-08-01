<template>
  <div class="top-h">
    <div class="title">
      <book-svg size="50px"/>
      <span style="vertical-align: text-bottom">
        图 书 借 阅 管 理 系 统
      </span>
    </div>
    <span style="float: right">
        <el-popconfirm title="确定要退出登录吗？" @confirm="outLogin">
          <template #reference>
            <el-button type="danger">
              退出登录 【
              {{
                user.userType === LOGIN_CODE_ROOT ? '系统管理员' : user.name
              }}
              】
              &nbsp;&nbsp;<exit-door-svg/>
            </el-button>
          </template>
        </el-popconfirm>
      </span>
  </div>
</template>

<script setup>
import {LOGIN_CODE_ROOT, SystemNetwork} from "@/api/System";
import {useStore} from "vuex";
import {toRefs} from "vue";
import {useRouter} from "vue-router";
import BookSvg from "@/components/icon/book-svg";
import ExitDoorSvg from "@/components/icon/exit-door-svg";

let store = useStore();
const {user} = toRefs(store.state)

const router = useRouter();
const outLogin = () => {
  SystemNetwork.unLogin({
    success: () => {
      router.replace('/login')
    }
  })
}

</script>

<style scoped>
.top-h {
  font-family: '华文楷体', serif;
  display: flex;
  justify-content: space-between;
  padding: 0 2em;
  height: 70px;
  line-height: 70px;
  border-bottom: 1px solid var(--el-border-color);
  background-color: #fff;
}

.title {
  border-radius: 10px;

  color: var(--el-color-primary);
  /*background-color: rgba(var(--el-color-primary-rgb), .1);*/
  font-size: 30px;
  font-weight: 900;
}
</style>
