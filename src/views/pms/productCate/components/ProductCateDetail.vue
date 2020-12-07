<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="productCate"
             :rules="rules"
             ref="productCateFrom"
             label-width="150px">
      <el-form-item label="分类图标：">
        <single-upload v-model="productCate.icon"></single-upload>
      </el-form-item>
      <el-form-item label="分类名称：" prop="name">
        <el-input v-model="productCate.name"></el-input>
      </el-form-item>
      <el-form-item label="上级分类：">
        <el-cascader
          v-model="selectProductCate"
          :options="productCateOptions"
          @change="handleProductCateSelectChange"
          filterable
          change-on-select>
        </el-cascader>
      </el-form-item>
      <el-form-item label="排序：">
        <el-input v-model="productCate.sort"></el-input>
      </el-form-item>
      <el-form-item label="是否显示在导航栏：">
        <el-radio-group v-model="productCate.isNav">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="分类描述：">
        <el-input type="textarea" :autosize="true" v-model="productCate.description"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('productCateFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('productCateFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
  import {fetchList, createProductCate, updateProductCate, getProductCate, fetchListWithChildren} from '@/api/productCate';
  import SingleUpload from '@/components/Upload/singleUpload';

  const defaultProductCate = {
    id: null,
    description: '',
    icon: '',
    name: '',
    isNav: 0,
    parentId: 0,
    sort: 0
  };
  export default {
    name: "ProductCateDetail",
    components: {SingleUpload},
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        productCate: Object.assign({}, defaultProductCate),
        rules: {
          name: [
            {required: true, message: '请输入分类名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ]
        },
        selectProductCate: [0],
        productCateOptions: []
      }
    },
    created() {
      if (this.isEdit) {
        getProductCate(this.$route.query.id).then(response => {
          this.productCate = response.data;
        });
      } else {
        this.productCate = Object.assign({}, defaultProductCate);
      }
      this.getSelectProductCateList();
    },
    methods: {
      getSelectProductCateList() {
        fetchListWithChildren({parentId: 0}).then(response => {
          this.productCateOptions = this.helpGetOptions(response.data)
          this.productCateOptions.unshift({label: '无上级分类', value: 0})
          if (this.isEdit && this.productCate.parentId != null) {
            this.helpGetOption(this.productCateOptions, [])
          }
        })
      },
      helpGetOptions(trees) {
        let options = []
        for (let i = 0; i < trees.length; i++) {
          let tree = trees[i]
          if (this.productCate.id === tree.productCategory.id) {
            continue
          }
          let option = {label: tree.productCategory.name, value: tree.productCategory.id, children: null}
          if (tree.children != null && tree.children.length > 0) {
            option.children = this.helpGetOptions(tree.children)
          }
          options.push(option)
        }
        return options
      },
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              console.log(this.productCate)
              if (this.isEdit) {
                updateProductCate(this.$route.query.id, this.productCate).then(response => {
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration: 1000
                  });
                  this.$router.back();
                });
              } else {
                createProductCate(this.productCate).then(response => {
                  this.$refs[formName].resetFields();
                  this.resetForm(formName);
                  this.$message({
                    message: '提交成功',
                    type: 'success',
                    duration: 1000
                  });
                });
              }
            });

          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration: 1000
            });
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      handleProductCateSelectChange(value) {
        this.productCate.parentId = value[value.length - 1]
      },
      helpGetOption(options, path) {
        for (let i = 0; i < options.length; i++) {
          let option = options[i]
          path.push(option.value)
          if (option.value === this.productCate.parentId) {
            this.selectProductCate = path
            return true
          }
          if (option.children != null && option.children.length > 0) {
            if (this.helpGetOption(option.children, path)) {
              return true
            }
          }
          path.pop()
        }
        return false
      }
    },
    filters: {
    }
  }
</script>

<style scoped>

</style>
