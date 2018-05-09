## 合作约定

### 背景

小组成员分工合作时, 每个人独立完成自己的页面, 但页面之间有可能有一定的关联性, 为提高代码可维护性, 降低合作成本, 故有产生了合作约定

### git 分支协作

### data-table generator

**忽略导出 datatable 的 TODO 和注释**

导出的.vue 文件目前能节省 50%以上的重复工作量, 可以尽情使用。

使用步骤:

1.  生成.vue 文件
1.  拷贝至项目 pages 目录下的相应位置
1.  git add xxx
1.  git commit -m 'init xxx' (完成后, 则会使用 prettier 格式化代码)
1.  进行二次开发

### query

页面之间通过 query 传参时, 后台 post/put 接口字段名是啥, query 就传啥。 如修改项目接口需要传一个字段为`projectId`, 则 query 为`{projectId: 1}`

也即, 往下个页面传 query 时, query 字段叫啥, 需要了解下个页面的请求接口, 所以:

1.  要么与后一个页面的开发人员协商讨论
2.  要么关注后一个页面的接口

这也是要求分工合作之后, 还要有能与上下游协调作战的能力, 不然自己只会成为螺丝钉, 非常危险。

## data-table 相关

### 表头

表头不要换行, 通过设置 columns 的 `minWidth`, 让表头能在一行显示。不要设置`width`，大屏下展示不友好

### 操作列

目的：按钮不换行

约定：使用 el-button, 每个按钮文字为两个中文字符，size 为 small 的情况

1.  3 个按钮的操作列 width=210px
2.  2 个按钮的操作列 width=144px
3.  1 个按钮的操作列不设置宽度

对于操作列操作按钮根据条件显示与隐藏的，以展示所有按钮、不换行的宽度为准。

使用 extraButtons button 的点击回调从 onClick 修改为 atClick（因为 onClick 在被绑定到 dom 上时，点击会被执行）

### 时间

通过设置 columns 的 `width`, 让时间保留在一行, 不要换行

另外时间格式化时注意精确度, 详见后面的时间格式化说明

### border 与 居中

默认不用 border, 文字居左, 也即默认样式, 无特别说明, 一般不需要注入 table 属性

### 操作列按钮样式

默认第一个按钮`type`为`primary`

### 统一 button 尺寸

做一个精致的程序员 在 data-table 的 button 使用 size 为 small 的 button 显得精致一点 💄

```
<el-button size="small"></el-button>
```

dialog 的取消确定按钮 也是 small

查询按钮还是默认大小

### 空值

table 里空值就显示空白, 不需要显示占位符 `-`

所以不需要 formatter = v => v || '-'

### 从外部注入新的值

例如 我在使用<data-table> 新增的时候, 需要加上 projectId, 而 projectId 是一个存放在 query 的值假定 projectId 为 8
这时候, 我们希望从外部传递一个 `projectId: 8` 到 data-table
可以使用 extraParams 参数使用参考如下:

```vue
    <data-table
      ref="dataTable"
      :data="list"
      :columns="columns"
      :config="config"
      noPagination
      :form="form"
      :extraParams="extraParams"
    >
    </data-table>
    <script>
    export default () {
      data() {
        return (
          extraParams: {
            projectId: 8
            }
        )
      }
    }
    
    </script>
```

### 统一 footer 样式 .data-table-footer

已写在 /assets/global.styl 可直接使用

```stylus
.data-table-footer
  margin-top 24px
  text-align right
```

## form 表单

label 右对齐(element 默认就是如此), 不需要添加冒号 `:`

## 时间组件起止中间使用 -

注意 时间起止日期，如果被 clear 了，返回的值是 null，不是[]
例如：

```vue
  <el-date-picker
    v-model="time"
    :clearable="false"
    type="daterange"
    range-separator="-"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    value-format="yyyy-MM-dd">
  </el-date-picker>
```

## 时间格式化

一般而言

1.  选择时间范围, “叫做选择日期”, 那么时间控件格式是精确到**日期**
2.  在后台管理系统, 一般文字叫“时间”的, 对应格式是精确到**分**
