<template>
  <div style="margin-top: 50px">
    <el-form :model="value" :rules="rules" ref="productInfoForm" label-width="120px" size="medium">
      <el-form-item label="商品名称：" prop="name">
        <el-input style="width: fit-content" v-model="value.name"></el-input>
      </el-form-item>
      <el-form-item label="商品货号：">
        <el-input style="width: fit-content"  v-model="value.productSn"></el-input>
      </el-form-item>
      <el-form-item label="商品分类：" prop="productCategoryId">
        <el-cascader
          v-model="selectProductCate"
          :options="productCateOptions"
          @change="handleProductCateSelectChange"
          filterable
          change-on-select>
        </el-cascader>
      </el-form-item>
      <el-form-item label="商品品牌：" prop="brandId">
        <el-select
          filterable
          v-model="value.brandId"
          placeholder="请选择品牌">
          <el-option
            v-for="item in brandOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="副标题：" prop="subTitle">
        <el-input style="width: fit-content"  v-model="value.subTitle"></el-input>
      </el-form-item>
      <el-form-item label="简要介绍：">
        <el-input
          :autoSize="true"
          v-model="value.description"
          type="textarea"
          placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="商品图片：">
        <single-upload v-model="value.pic"></single-upload>
      </el-form-item>
      <el-form-item label="商品关键词：">
        <el-input v-model="value.keywords"></el-input>
      </el-form-item>
      <el-form-item label="商品售价：">
        <el-input v-model="value.price"></el-input>
      </el-form-item>
      <el-form-item label="市场价：">
        <el-input v-model="value.originalPrice"></el-input>
      </el-form-item>
      <el-form-item label="计量单位：">
        <el-input v-model="value.unit"></el-input>
      </el-form-item>
      <el-form-item label="排序">
        <el-input v-model="value.sort"></el-input>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button type="primary" size="medium" @click="handleNext('productInfoForm')">下一步，商品详细信息</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {fetchListWithChildren} from '@/api/productCate'
  import {fetchList as fetchBrandList} from '@/api/brand'
  import SingleUpload from '@/components/Upload/singleUpload'

  export default {
    name: "ProductBasicInfo",
    components: {SingleUpload},
    props: {
      value: Object,
    },
    data() {
      return {
        //选中商品分类的值
        selectProductCate: [0],
        productCateOptions: [],
        brandOptions: [],
        rules: {
          name: [
            {required: true, message: '请输入商品名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          requiredProp: [{required: true, message: '该项为必填项', trigger: 'blur'}]
        }
      };
    },
    created() {
      this.getProductCateList();
      this.getBrandList();
    },
    methods: {
      getProductCateList() {
        fetchListWithChildren({parentId: 0}).then(response => {
          this.productCateOptions = this.helpGetOptions(response.data)
          this.productCateOptions.unshift({label: '不指定商品分类', value: 0})
        })
      },
      helpGetOptions(trees) {
        let options = []
        for (let i = 0; i < trees.length; i++) {
          let tree = trees[i]
          let option = {label: tree.productCategory.name, value: tree.productCategory.id, children: null}
          if (tree.children != null && tree.children.length > 0) {
            option.children = this.helpGetOptions(tree.children)
          }
          options.push(option)
        }
        return options
      },
      handleProductCateSelectChange(value) {
        if (value != null && value.length > 0) {
          this.value.productCategoryId = value[value.length - 1];
        } else {
          this.value.productCategoryId = null;
        }
      },
      getBrandList() {
        fetchBrandList().then(response => {
          this.brandOptions = [];
          let brandList = response.data;
          for (let i = 0; i < brandList.length; i++) {
            this.brandOptions.push({label: brandList[i].name, value: brandList[i].id});
          }
          this.brandOptions.unshift({label: '不指定商品品牌', value: 0})
        });
      },
      handleNext(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$emit('nextStep');
          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration: 1000
            });
            return false;
          }
        });
      }
    }
  }
</script>

<style scoped>
</style>
