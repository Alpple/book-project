<template>
  <top-header/>
  <div>
    <el-container>
      <el-menu
          style="margin-top: 1em"
          @select="select"
          v-model:default-active="active"
      >
        <el-menu-item v-for="(m,i) in menus" :index="i+''" key="path">{{ m.title }}</el-menu-item>
      </el-menu>
      <div style="flex: 1;padding: 36px">
        <router-view/>
      </div>
    </el-container>
  </div>
</template>

<script>
import {mapState} from "vuex";
import {LOGIN_CODE_EMP, LOGIN_CODE_READER, LOGIN_CODE_ROOT} from "@/api/System";
import TopHeader from '@/components/top-header'

export default {
  name: "Home",
  components: {TopHeader},
  data: () => {
    return {
      menus: [
        {factor: 0, title: "用户信息", path: '/home/userInfo', reg: /\/home\/userInfo/g},
        {factor: 1, title: "图 书 借 还", path: '/home/borrow/return/book', reg: /\/home\/borrow\/return\/book/g},
        {only: 1, title: "入 库", path: '/home/add', reg: /\/home\/add/g},

        {factor: 0, title: "图 书 列 表", path: '/home/list', reg: /\/home\/list/g},

        {factor: 0, title: "借 阅 记 录", path: '/home/record', reg: /\/home\/record/g},
        {factor: 1, title: "入 库 记 录", path: '/home/storage/record', reg: /\/home\/storage\/record/g},

        {
          factor: 1,
          title: "读 者 管 理",
          path: '/home/reader/manage/1/6',
          reg: /\/home\/reader\/manage(\/[0-9]\/[0-9])?\/?/gi
        },

        {
          factor: 2,
          title: "图 书 管 理 员 管 理",
          path: '/home/emp/manage/1/6',
          reg: /\/home\/emp\/manage(\/[0-9]\/[0-9])?\/?/gi
        },

        {
          factor: 1,
          title: "图 书 类 型 管 理",
          path: '/home/type/manage/1/6',
          reg: /\/home\/type\/manage(\/[0-9]\/[0-9])?\/?/gi
        }
      ],
      active: '0',
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created() {
    let factor = this.user.factor;
    // switch (this.user.userType) {
    //   case LOGIN_CODE_EMP:
    //     factor = 1;
    //     break;
    //   case LOGIN_CODE_READER:
    //     factor = 0;
    //     break;
    //   case LOGIN_CODE_ROOT:
    //     factor = 2;
    //     break;
    // }
    // this.$store.dispatch('setUser', {...this.user, factor})
    this.menus = this.menus.filter(v => {
      if (typeof v.only === 'undefined') {
        return factor >= v.factor
      }
      return factor === v.only;
    })
  },
  mounted() {
    for (let i = 0; i < this.menus.length; i++) {
      if (this.menus[i].reg.test(this.$route.fullPath)) {
        if (this.active === i + '') {
          return;
        }
        this.active = i + '';
        return;
      }
    }
  },
  beforeRouteUpdate(route) {
    for (let i = 0; i < this.menus.length; i++) {
      if (this.menus[i].reg.test(route.fullPath)) {
        if (this.active === i + '') {
          return;
        }
        this.active = i + '';
        return;
      }
    }
  },
  methods: {
    select(index) {
      if (index === this.active) {
        return;
      }
      this.$router.push(this.menus[index].path)
    }
  }
}
</script>

<style scoped lang="less">
:deep(.el-menu-item) {
  color: var(--el-text-color-regular);
  transition: color .25s;
  margin: 0.5em 1em;
  border-radius: 10px;

  height: var(--el-menu-sub-item-height);
  line-height: var(--el-menu-sub-item-height);

  &.is-active {
    font-weight: 600;
    color: var(--el-color-primary);
    background-color: rgba(var(--el-color-primary-rgb), .1);
  }
}
</style>
