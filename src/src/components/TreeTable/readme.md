## 写在前面
此组件仅提供一个创建TreeTable的解决思路

## prop说明
#### *data*
  **必填**

  原始数据,要求是一个数组或者对象
  ```javascript
    [{
      key1: value1,
      key2: value2,
      children: [{
        key1: value1
      },
      {
        key1: value1
      }]
    },
    {
      key1: value1
    }]
  ```
  或者
 ```javascript
    {
      key1: value1,
      key2: value2,
      children: [{
        key1: value1
      },
      {
        key1: value1
      }]
    }
  ```

#### columns
  列属性,要求是一个数组

  1. text: 显示在表头的文字
  2. value: 对应data的key。treeTable将显示相应的value
  3. width: 每列的宽度，为一个数字(可选)
  
  如果你想要每个字段都有自定义的样式或者嵌套其他组件，columns可不提供，直接像在el-table一样写即可，如果没有自定义内容，提供columns将更加的便捷方便
  
  如果你有几个字段是需要自定义的，几个不需要，那么可以将不需要自定义的字段放入columns，将需要自定义的内容放入到slot中，详情见后文
  ```javascript
  [{
    value:string,
    text:string,
    width:number
  },{
    value:string,
    text:string,
    width:number
  }]
  ```

#### expandAll
  是否默认全部展开，boolean值，默认为false

#### evalFunc
  解析函数，function，非必须

  如果不提供，将使用默认的[evalFunc](./eval.js)

  如果提供了evalFunc,那么会用提供的evalFunc去解析data，并返回treeTable渲染所需要的值。如何编写一个evalFunc，请参考[*eval.js*]
 

 ## 其他
  如果有其他的需求，请参考[el-table](http://element-cn.eleme.io/#/en-US/component/table)的api自行修改index.vue
