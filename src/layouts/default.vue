<template>
  <el-container>
    <div :class="{hideSidebar: collapse}" class="sidebar-container">
      <el-menu
        :collapse="collapse"
        :default-active="$route.path"
        :collapse-transition="false"
        router
        class="aside-menu"
        background-color="#2D303B"
        text-color="#FFFFFF"
      >
        <div class="logo">
          <nuxt-link to="/">
            <img class="logo-img" :src="$store.state.meta.logo" alt="logo" />
            <h1 class="logo-text">{{ $store.state.meta.appName }}</h1>
          </nuxt-link>
        </div>
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <menu-item :menuList="menuList"></menu-item>
        </el-scrollbar>

        <div class="fix-btn-wrap">
          <div class="collapse-btn" @click="collapse = !collapse">
            <img
              class="btn-icon"
              src="https://deepexi.oss-cn-shenzhen.aliyuncs.com/deepexi-services/%E5%B7%A6%E4%BE%A7%E8%8F%9C%E5%8D%95/expand.svg"
              alt=""
            />
          </div>
        </div>
      </el-menu>
    </div>
    <div class="main-container">
      <div class="header-wrap">
        <el-row class="head-container" type="flex" justify="end" align="middle">
          <div class="head-right">
            <div class="head-active">
              <img :src="userImg" class="userName-Img" alt="userName-Img" />
            </div>
            <!-- 用户名称 -->
            <div class="userName-text">{{ $store.state.user.nickname }}</div>
            <el-dropdown placement="bottom-end" @command="exitBtn">
              <span class="el-dropdown-link">
                <i class="el-icon-arrow-down el-icon--right set-Iconcolor"></i>
              </span>
              <el-dropdown-menu slot="dropdown" class="user-drop-menu">
                <el-dropdown-item
                  v-for="(item, index) in dropdownList"
                  :key="index"
                  :command="item.command"
                  >{{ item.title }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-row>
      </div>
      <el-main class="nuxt-main">
        <nuxt></nuxt>
      </el-main>
      <el-footer>
        <copyright></copyright>
      </el-footer>
    </div>
  </el-container>
</template>

<script>
import Copyright from '@/components/copyright.vue'
import {mapState} from 'vuex'
import MenuItem from '@/components/menu-item.vue'
import IconFont from '@/components/icon-font.vue'
import {Scrollbar} from 'element-ui'

export default {
  components: {
    Copyright,
    MenuItem,
    ElScrollbar: Scrollbar
  },
  data() {
    return {
      collapse: false,
      dropdownList: [
        {
          title: '退出',
          command: 'exit'
        }
      ]
    }
  },
  computed: {
    ...mapState(['menuList']),
    userImg() {
      return (
        this.$store.state.user.avatar ||
        'https://deepexi.oss-cn-shenzhen.aliyuncs.com/xpaas-console/user-portrait.png'
      )
    }
  },
  methods: {
    exitBtn(key, keyPath) {
      if (key == 'exit') {
        this.$store.commit('logout')
      }
    }
  }
}
</script>

<style lang="less">
#__nuxt {
  .el-icon-sort {
    transform: rotate(-90deg);
  }

  // dropdown
  .el-dropdown-link {
    cursor: pointer;
    color: #409eff;
  }

  .header-wrap {
    height: 60px;
    padding: 0 24px;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    background: #fff;

    .head-container {
      height: 100%;
    }

    .head-right {
      margin-right: 10px;
      display: flex;
      align-items: center;

      div {
        display: inline-block;
      }

      .head-active {
        .userName-Img {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          margin: 0 15px;
        }
      }

      .userName-text {
        text-align: center;
        overflow: hidden;
        margin-right: 10px;
      }

      .head-search {
        .set-search {
          margin-right: 5px;
        }

        .head-autocomplete {
          .el-icon-search {
            cursor: pointer;
            font-size: 18px;
          }
        }

        .el-dropdown-link {
          font-size: 18px;
          color: #a2a2b1 !important;
        }
      }

      .head-message {
        margin: 0 30px 0 20px;

        .item {
          .set-IconSize {
            height: 100%;
            max-width: 100%;
          }
        }
      }
    }
  }

  // main
  .nuxt-main {
    margin: 10px 20px 0;
    padding: 10px;
    background: #fff;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }

  .main-container {
    height: 100vh;
    overflow-y: scroll;
    overflow-x: hidden;
    flex: 1;
  }

  .sidebar-container {
    transition: width 0.28s;
    width: 200px !important;
    height: 100vh;
    overflow: hidden;
    box-shadow: 1px 0 6px rgba(0, 21, 41, 0.35);

    //reset element-ui css
    .horizontal-collapse-transition {
      transition:
        0s width ease-in-out,
 0s padding-left ease-in-out,
        0s padding-right ease-in-out;
    }

    .logo {
      position: relative;
      height: 60px;
      line-height: 60px;
      padding-left: 10px;
      background: #2d303b;
      overflow: hidden;

      .logo-img {
        /* width: 32px; */

        /* height: 32px; */
        vertical-align: middle;
      }

      .logo-text {
        color: #fff;
        display: inline-block;
        vertical-align: middle;
        font-size: 20px;
        margin: 0 0 0 5px;
        font-weight: 400;
        opacity: 1;
      }
    }

    .scrollbar-wrapper {
      height: calc(100vh - 110px);
      overflow-x: hidden !important;
      margin-bottom: 0 !important;

      .el-scrollbar__view {
        height: 100%;
      }
    }

    .el-scrollbar__bar.is-vertical {
      right: 0;
    }

    .is-horizontal {
      display: none;
    }

    .el-menu {
      border: none;
      height: 100%;
      width: 100% !important;

      .item-title {
        position: relative;

        &::before {
          content: '';
          display: inline-block;
          position: absolute;
          top: 50%;
          left: -12px;
          transform: translateY(-50%);
          bottom: 0;
          width: 5px;
          height: 5px;
          background: rgba(171, 172, 176, 1);
          border-radius: 1px;
        }
      }

      .el-menu-item {
        &.is-active {
          .item-title {
            &::before {
              width: 5px;
              height: 16px;
              background-color: #5d81f9;
              border-radius: 15px;
            }
          }
        }
      }

      [class*='icon'] {
        font-size: 14px;
        margin-right: 5px;
      }
    }

    .fix-btn-wrap {
      height: 50px;

      .collapse-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 50px;
        width: 100%;
        background: #343744;
        cursor: pointer;
      }

      .btn-icon {
        transform: rotate(180deg);
        font-size: 16px;
        width: 16px;
      }
    }

    // 折叠
    &.hideSidebar {
      width: 64px !important;

      .logo {
        padding-left: 13px;
      }

      .scrollbar-wrapper {
        height: calc(100vh - 60px - 50px);
      }

      .el-submenu__title {
        text-align: center;
      }

      // 有子菜单
      .sub-menu-title,
      .el-submenu__icon-arrow {
        display: none;
      }

      [class*='icon'] {
        font-size: 16px;
        margin: 0;
      }

      .fix-btn-wrap {
        .btn-icon {
          transform: rotate(0deg);
        }
      }
    }

    // when menu collapsed
    .menu--vertical {
      // the scroll bar appears when the subMenu is too long
      > .menu--popup {
        max-height: 100vh;
        overflow-y: auto;

        &::-webkit-scrollbar {
          width: 6px;
        }

        &::-webkit-scrollbar-thumb {
          border-radius: 20px;
        }
      }
    }
  }
}
</style>
