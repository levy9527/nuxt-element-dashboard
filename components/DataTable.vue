<template>
  <div class="data-table">
    <!--搜索字段-->
    <el-form-renderer v-if="searchForm.length > 0" inline :content="searchForm" ref="searchForm">
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
        <el-button @click="onResetSearch">重置</el-button>
      </el-form-item>
    </el-form-renderer>

    <el-form v-if="hasNew || hasDelete">
      <el-form-item>
        <el-button v-if="hasNew" type="primary" size="small"
                   @click="onDefaultNew($event)">新增</el-button>
        <el-button v-if="hasSelect && hasDelete" type="danger" size="small"
                   @click="onDefaultDelete($event)"
                   :disabled="single ? (!selected.length || selected.length > 1) : !selected.length">删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-bind="table"
      :data="data"
      :row-style="showRow"
      v-loading="loading"
      @selection-change="handleSelectionChange"
    >

      <!--TODO 不用jsx写, 感觉template逻辑有点不清晰了-->
      <template v-if="isTree">

        <!--有多选-->
        <template v-if="hasSelect">
          <el-table-column key="selection-key" v-bind="columns[0]">
          </el-table-column>

          <el-table-column
            key="tree-ctrl"
            v-bind="columns[1]" >
            <template slot-scope="scope">
              <span v-if="isTree" v-for="space in scope.row._level" class="ms-tree-space" :key="space"></span>
              <span v-if="isTree && iconShow(scope.$index, scope.row)" class="tree-ctrl" @click="toggleExpanded(scope.$index)">
                <i v-if="!scope.row._expanded" class="el-icon-plus"></i>
                <i v-else class="el-icon-minus"></i>
              </span>
              {{scope.row[columns[1].prop]}}
            </template>
          </el-table-column>

          <el-table-column
            v-for="(col) in columns.filter((c, i) => i !== 0 && i !== 1)"
            :key="col.prop"
            v-bind="col" >
          </el-table-column>
        </template>

        <!--无选择-->
        <template v-else>

          <!--展开这列, 丢失 el-table-column属性-->
          <el-table-column
            key="tree-ctrl"
            v-bind="columns[0]" >
            <template slot-scope="scope">
              <span v-if="isTree" v-for="space in scope.row._level" class="ms-tree-space" :key="space"></span>
              <span v-if="isTree && iconShow(scope.$index, scope.row)" class="tree-ctrl" @click="toggleExpanded(scope.$index)">
                <i v-if="!scope.row._expanded" class="el-icon-plus"></i>
                <i v-else class="el-icon-minus"></i>
              </span>
              {{scope.row[columns[0].prop]}}
            </template>
          </el-table-column>

          <el-table-column
            v-for="(col) in columns.filter((c, i) => i !== 0)"
            :key="col.prop"
            v-bind="col" >
          </el-table-column>
        </template>
      </template>

      <!--非树-->
      <template v-else>
        <el-table-column
          v-for="(col) in columns"
          :key="col.prop"
          v-bind="col" >
        </el-table-column>
      </template>

      <el-table-column label="操作" v-if="hasOperation"
                       v-bind="operationColumn"
      >
        <template slot-scope="scope">
          <el-button v-for="(btn, i) in extraButtons" v-if="'show' in btn ? btn.show(scope.row) : true" v-bind="btn" @click="btn.atClick(scope.row)" :key="i" size="small">{{btn.text}}</el-button>
          <el-button v-if="hasEdit" size="small"
                     @click="onDefaultEdit(scope.row)">
            修改
          </el-button>
          <el-button v-if="!hasSelect && hasDelete && canDelete(scope.row)" type="danger" size="small"
                     @click="onDefaultDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>

      <!--自定义操作列-->
      <slot></slot>

    </el-table>
    <el-pagination
      v-if="!noPagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="size"
      :total="total"
      style="text-align: right; padding: 10px 0"
      layout="total, sizes, prev, pager, next, jumper"
    >
    </el-pagination>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" v-if="hasDialog">
      <!--https://github.com/leezng/el-form-renderer-->
      <el-form-renderer :content="form" ref="dialogForm"></el-form-renderer>

      <div slot="footer" class="" v-show="!isView">
        <el-button @click="cancel" size="small">取 消</el-button>
        <el-button type="primary" @click="confirm" v-loading="confirmLoading" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import _get from 'lodash/get'

// TODO
// row状态不同, 操作列显示不同文字
// doc
// test

// 默认返回的数据格式如下
// 可根据实际情况传入 data/total 两个字段的路径
//          {
//            "code":0,
//            "msg":"ok",
//            "payload":{
//              "docs":[], // 数组
//              "total":2, // 总数
//            }
//          }
// 如果接口不分页, 则传noPagination, 此时数据取 payload, 当然也可以自定义, 设置config.data即可

const noPaginationDataPath = 'payload'
const dataPath = 'payload.docs'
const totalPath = 'payload.total'
const treeChildKey = 'children'
const dialogForm = 'dialogForm'

// TODO 组件文档待补全
// 相关事件 selection-change, update (数据更新后触发)
export default {
  props: {
    // search字段渲染, 配置参考el-form-renderer
    searchForm: {
      type: Array,
      default() {
        return []
      }
    },
    // 存放 element table 属性
    table: {
      type: Object,
      default() {
        return {}
      }
    },
    columns: {
      type: Array,
      default() {
        return []
      }
    },
    config: {
      type: Object,
      required: true,
      // 有场景, 一进页面是没有数据的。
      // 所以也不用验证, 加个提示就好了
      //        validator: function (v) {
      //          return !!v.url
      //        },
      default() {
        return {
          url: '',
          // 查询对象, key:value 形式传入, 组件自动把参数拼接到url
          query: {},
          data: dataPath,
          total: totalPath
        }
      }
    },
    // 单选, 适用场景: 不可以批量删除
    single: {
      type: Boolean,
      default: false
    },
    // 是否有操作列
    hasOperation: {
      type: Boolean,
      default: true
    },
    // 自定义按钮
    extraButtons: {
      type: Array,
      default() {
        return [
          // {type: '', text: '', onClick: function (row) {}},
        ]
      }
    },
    // 操作列属性
    operationColumn: {
      type: Object,
      default() {
        return {width: '', fixed: 'right'}
      }
    },
    hasNew: {
      type: Boolean,
      default: true
    },
    hasEdit: {
      type: Boolean,
      default: true
    },
    // 这个是多选时的删除
    hasDelete: {
      type: Boolean,
      default: true
    },
    // 单选时行内的删除按钮
    // 返回true/false
    canDelete: {
      type: Function,
      default() {
        return true
      }
    },
    onNew: {
      type: Function
    },
    onEdit: {
      type: Function
    },
    onDelete: {
      type: Function
    },
    // FIXME 要修改成 hasPagination
    noPagination: {
      type: Boolean,
      default: false
    },
    // 不分页时的size的大小
    noPaginationSize: {
      type: Number,
      default: 999
    },
    // 树形结构
    isTree: {
      type: Boolean,
      default: false
    },
    expandAll: {
      type: Boolean,
      default: false
    },
    //弹窗
    hasDialog: {
      type: Boolean,
      default: true
    },
    dialogNewTitle: {
      type: String,
      default: '新增'
    },
    dialogEditTitle: {
      type: String,
      default: '修改'
    },
    dialogViewTitle: {
      type: String,
      default: '查看'
    },
    // 弹窗表单
    // 用于新增与修改
    form: {
      type: Array,
      default() {
        return []
      }
    },
    // 新增/修改提交时注入额外的参数
    extraParams: {
      type: Object
    }
  },
  name: 'DataTable',
  data() {
    return {
      data: [],
      hasSelect: this.columns.length && this.columns[0].type == 'selection',
      size: 10,
      page: 1,
      total: 0,
      loading: false,
      selected: [],

      //弹窗
      dialogTitle: this.dialogNewTitle,
      dialogVisible: false,
      isNew: true,
      isEdit: false,
      isView: false,
      confirmLoading: false,
      // 要修改的那一行
      row: {}
    }
  },
  mounted() {
    this.getList()
  },
  watch: {
    'config.query': function(val, old) {
      this.page = 1
      this.getList()
    },
    'config.url': function(val, old) {
      this.page = 1
      this.getList()
    }
  },
  methods: {
    getList() {
      let url = this.config.url
      let query = this.config.query || {}
      let size = this.noPagination ? this.noPaginationSize : this.size

      console.warn('DataTable: config.url 为空, 不发送请求')
      if (!url) return

      // 拼接 query
      if (url.indexOf('?') > -1) url += '&'
      else url += '?'

      url += `page=${this.page}&size=${size}`

      // query 有可能值为 0
      let params = Object.keys(query)
        .filter(
          k => query[k] !== '' && query[k] !== null && query[k] !== undefined
        )
        .reduce((params, k) => (params += `&${k}=${query[k]}`), '')

      url += params

      // 请求开始
      this.loading = true

      this.$axios
        .$get(url)
        .then(resp => {
          let config = this.config
          let data = []

          // 不分页
          if (this.noPagination) {
            data = _get(resp, config.data || noPaginationDataPath) || []
          } else {
            data = _get(resp, config.data || dataPath) || []
            this.total = _get(resp, config.total || totalPath)
          }

          this.data = data

          // 树形结构逻辑
          if (this.isTree) {
            this.data = this.tree2Array(data, this.expandAll)
          }

          this.loading = false
          // 返回原始数据
          this.$emit('update', data)
        })
        .catch(err => {
          this.loading = false
        })
    },
    handleSizeChange(val) {
      if (this.size === val) return

      this.size = val
      this.getList()
    },
    handleCurrentChange(val) {
      if (this.page === val) return

      this.page = val
      this.getList()
    },
    handleSelectionChange(val) {
      this.selected = val
      this.$emit('selection-change', val)
    },
    onSearch() {
      const data = this.$refs.searchForm.getFormValue()
      this.config.query = Object.assign({}, data)
    },
    onResetSearch() {
      this.$refs.searchForm.resetFields()
      this.config.query = {}
    },
    // 弹窗相关
    onDefaultNew(e) {
      if (this.onNew) {
        return this.onNew(e)
      }
      this.isNew = true
      this.isEdit = false
      this.isView = false
      this.dialogTitle = this.dialogNewTitle
      this.dialogVisible = true

      this.$nextTick(() => {
        this.form.forEach(entry => {
          // 使用$enableWhen存放隐藏属性, 有可能新增时会注入值, 所以不update
          // if ('$enableWhen' in entry) return

          // $refs 只在组件渲染完成后才填充
          this.$refs[dialogForm].updateValue({id: entry.$id, value: ''})
        })
      })
    },
    onDefaultEdit(row) {
      if (this.onEdit) {
        return this.onEdit(row)
      }

      this.row = row
      this.isEdit = true
      this.isNew = false
      this.isView = false
      this.dialogTitle = this.dialogEditTitle
      this.dialogVisible = true

      this.$nextTick(() => {
        this.form.forEach(entry => {
          let value = row[entry.$id]

          this.$refs[dialogForm].updateValue({id: entry.$id, value})
        })
      })
    },
    cancel() {
      this.isNew = false
      this.isEdit = false
      this.isView = false
      this.dialogVisible = false
      this.confirmLoading = false
    },
    confirm() {
      this.$refs[dialogForm].validate(valid => {
        if (!valid) return false

        let data = Object.assign(
          {},
          this.$refs[dialogForm].getFormValue(),
          this.extraParams
        )
        // 默认新增
        let method = '$post'
        let url = this.config.url + ''

        this.confirmLoading = true

        if (this.isEdit) {
          method = '$put'
          url += `/${this.row.id || this.row._id}`
        }

        if (this.isView) {
          this.cancel()
          return
        }

        this.$axios[method](url, data)
          .then(resp => {
            this.getList()
            this.showMessage(true)
            this.cancel()
          })
          .catch(err => {
            this.confirmLoading = false
          })
      })
    },
    onDefaultDelete(row) {
      if (this.onDelete) {
        return this.onDelete(row)
      }
      this.$confirm('确认删除吗', '提示', {
        type: 'warning'
      })
        .then(resp => {
          // 单个删除
          if (!this.hasSelect) {
            this.$axios
              .$delete(this.config.url + '/' + row.id || row._id)
              .then(resp => {
                this.getList()

                this.showMessage(true)
              })
          } else {
            // 多选模式
            this.$axios
              .$delete(
                this.config.url +
                  '/' +
                  this.selected.map(v => v._id || v.id).toString()
              )
              .then(resp => {
                this.getList()

                this.showMessage(true)
              })
          }
        })
        .catch(er => {
          /*取消 */
        })
    },
    // 树形table相关
    // https://github.com/PanJiaChen/vue-element-admin/tree/master/src/components/TreeTable
    tree2Array(data, expandAll, parent = null, level = null) {
      let tmp = []
      data.forEach(record => {
        if (record._expanded === undefined) {
          this.$set(record, '_expanded', expandAll)
        }
        let _level = 0
        if (level !== undefined && level !== null) {
          _level = level + 1
        }
        this.$set(record, '_level', _level)
        // 如果有父元素
        if (parent) {
          this.$set(record, 'parent', parent)
        }
        tmp.push(record)

        if (record[treeChildKey] && record[treeChildKey].length > 0) {
          const children = this.tree2Array(
            record.children,
            expandAll,
            record,
            _level
          )
          tmp = tmp.concat(children)
        }
      })
      return tmp
    },
    showRow(row) {
      const show = row.row.parent
        ? row.row.parent._expanded && row.row.parent._show
        : true
      row.row._show = show
      return show
        ? 'animation:treeTableShow 1s-webkit-animation:treeTableShow 1s'
        : 'display:none'
    },
    // 切换下级是否展开
    toggleExpanded(trIndex) {
      const record = this.data[trIndex]
      record._expanded = !record._expanded
    },
    // 图标显示
    iconShow(index, record) {
      //      return index ===0 && record.children && record.children.length > 0;
      return record.children && record.children.length > 0
    },
    showMessage(isSuccess = true) {
      if (isSuccess) {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
      } else {
        this.$message({
          type: 'error',
          message: '操作失败'
        })
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
  color-blue = #2196F3;
  space-width = 18px;

  .ms-tree-space {
    position: relative;
    top: 1px;
    display: inline-block;
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: space-width;
    height: 14px;

    &::before {
      content: '';
    }
  }

  .tree-ctrl {
    position: relative;
    cursor: pointer;
    color: color-blue;
  }

  @keyframes treeTableShow {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }
</style>
