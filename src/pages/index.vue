<template>
  <div class="index">
    <h2>data-table generator</h2>
    <el-form-renderer :content="renderInput" ref="renderInput"></el-form-renderer>
    <el-form-renderer :content="renderCheckbox" ref="renderCheckbox"></el-form-renderer>
    <div>columns</div>
    <el-form inline>
      <div v-for="(col, index) in columns" :key="index">
        <el-form-item label="列名">
          <el-input v-model.trim="col.label"></el-input>
        </el-form-item>
        <el-form-item label="字段值">
          <el-input v-model.trim="col.prop"></el-input>
        </el-form-item>
      </div>
      <el-form-item label="">
        <el-button @click="addColumn">添加列</el-button>
      </el-form-item>
    </el-form>
    <div>extraButtons</div>
    <el-form inline>
      <div v-for="(btn, index) in extraButtons" :key="index">
        <!--<el-form-item label="类型">-->
          <!--<el-input v-model.trim="btn.type"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="text">
          <el-input v-model.trim="btn.text"></el-input>
        </el-form-item>
        <el-form-item label="@click">
          <el-input v-model.trim="btn.onClick"></el-input>
        </el-form-item>
      </div>
      <el-form-item label="">
        <el-button @click="addBtn">添加按钮</el-button>
      </el-form-item>
    </el-form>
    <div>查询字段</div>
    <el-form inline>
      <div v-for="(search, index) in searchForm" :key="index">
        <el-form-item label="label">
          <el-input v-model.trim="search.label"></el-input>
        </el-form-item>
        <el-form-item label="value">
          <el-input v-model.trim="search.$id"></el-input>
        </el-form-item>
      </div>
      <el-form-item label="">
        <el-button @click="addSearch">添加查询</el-button>
      </el-form-item>
    </el-form>
    <el-form>
      <el-form-item label="">
        <el-button @click="generate" type="primary">生成</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import fileSaver from 'file-saver'

export default {
  data() {
    return {
      renderInput: [
        {
          $type: 'input',
          $id: 'pageName',
          label: '页面名字(对应路由名字)',
          rules: [{required: true}]
        },
        {
          $type: 'input',
          $id: 'url',
          label: '接口url',
          rules: [{required: true}]
        }
      ],
      renderCheckbox: [
        {
          $type: 'checkbox',
          $id: 'hasNew',
          label: '新增',
          $default: true
        },
        {
          $type: 'checkbox',
          $id: 'hasEdit',
          label: '修改',
          $default: true
        },
        {
          $type: 'checkbox',
          $id: 'hasDelete',
          label: '删除',
          $default: true
        },
        {
          $type: 'checkbox',
          $id: 'hasSelect',
          label: '是否有选择(多选)',
          $default: true
        },
        {
          $type: 'checkbox',
          $id: 'single',
          label: '是否单选(上一项必须勾选才生效)',
          $default: false
        },
        {
          $type: 'checkbox',
          $id: 'hasPagination',
          label: '是否分页',
          $default: true
        },
        {
          $type: 'checkbox',
          $id: 'hasOperation',
          label: '是否有操作列',
          $default: true
        },
        {
          $type: 'checkbox',
          $id: 'isTree',
          label: '是否树形结构',
          $default: false
        }
      ],
      searchForm: [],
      extraButtons: [],
      columns: [],
      form: [],
      query: {}
    }
  },
  methods: {
    addColumn() {
      this.columns.push({
        prop: '',
        label: ''
      })
    },
    addBtn() {
      this.extraButtons.push({
        text: '',
        onClick: ''
      })
    },
    addSearch() {
      this.searchForm.push({
        $type: 'input',
        $id: '',
        label: '',
        $el: {
          placeholder: '请输入'
        }
      })
    },
    generate() {
      //      let host = 'levy.ren'
      let host = 'localhost'

      let api = `http://${host}:30000/generator/data-table`

      if (!this.columns.length) return alert('至少有一个列')

      this.$refs.renderInput.validate(valid => {
        if (!valid) return

        this.$refs.renderCheckbox.validate(valid => {
          if (!valid) return
        })

        let extraButtons = this.extraButtons.map(btn => ({
          text: btn.text,
          type: btn.type,
          atClick: `row => ${btn.onClick}`
        }))

        let data = Object.assign(
          {},
          this.$refs.renderInput.getFormValue(),
          this.$refs.renderCheckbox.getFormValue()
        )

        Object.keys(this.$data).forEach(key => {
          // renderxxx 不传给接口
          if (key.indexOf('render') > -1) return
          data[key] = this[key]
        })

        // 参数判断
        if (data.hasSelect && data.columns[0].type !== 'selection')
          data.columns.unshift({type: 'selection'})

        this.$axios.$post(api, data).then(resp => {
          console.log(resp)

          let file = new File([resp], data.pageName + '.vue', {
            type: 'text/plain;charset=utf-8'
          })
          fileSaver.saveAs(file)
        })
      })
    }
  }
}
</script>

<style>
</style>
