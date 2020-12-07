<template>
  <div style="margin-top: 50px">
    <el-form :model="value" ref="productSaleForm" label-width="120px" size="medium">
      <el-form-item label="详细页标题：">
        <el-input v-model="value.product.detailTitle"></el-input>
      </el-form-item>
      <el-form-item label="详细页描述：">
        <el-input v-model="value.product.detailDescription" type="textarea" :autosize="true"></el-input>
      </el-form-item>
      <el-form-item label="商品相册：">
        <multi-upload v-model="selectProductPics"></multi-upload>
      </el-form-item>
      <el-form-item label="网页内容：">
        <el-tabs v-model="activeHtmlName" type="card">
          <el-tab-pane label="PC端网页" name="pc">
            <tinymce :width="800" :height="500" v-model="value.product.detailHtml"></tinymce>
          </el-tab-pane>
          <el-tab-pane label="移动端网页" name="mobile">
            <tinymce :width="800" :height="500" v-model="value.product.detailMobileHtml"></tinymce>
          </el-tab-pane>
        </el-tabs>
      </el-form-item>
      <el-form-item label="赠送积分：">
        <el-input style="width: fit-content" v-model="value.product.giftPoint"></el-input>
      </el-form-item>
      <el-form-item label="积分购买限制：">
        <el-input style="width: fit-content" v-model="value.product.usePointLimit"></el-input>
      </el-form-item>
      <el-form-item label="预告商品：">
        <el-switch
          v-model="value.product.isPreview"
          :active-value="1"
          :inactive-value="0">
        </el-switch>
      </el-form-item>
      <el-form-item label="商品上架：">
        <el-switch
          v-model="value.product.isPublish"
          :active-value="1"
          :inactive-value="0">
        </el-switch>
      </el-form-item>
      <el-form-item label="商品推荐：">
        <span style="margin-right: 10px">新品</span>
        <el-switch
          v-model="value.product.isNew"
          :active-value="1"
          :inactive-value="0">
        </el-switch>
        <span style="margin-left: 10px;margin-right: 10px">推荐</span>
        <el-switch
          v-model="value.product.isRecommend"
          :active-value="1"
          :inactive-value="0">
        </el-switch>
      </el-form-item>
      <el-form-item label="商品备注：">
        <el-input v-model="value.product.note" type="textarea" :autoSize="true"></el-input>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button size="medium" type="primary" @click="update">保存</el-button>
        <el-button size="medium" @click="handlePrev">上一步，商品基本信息</el-button>
        <el-button type="primary" size="medium" @click="handleNext">下一步，填写商品属性</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import Tinymce from '@/components/Tinymce'
  import MultiUpload from '@/components/Upload/multiUpload'
  import {updateProduct} from '@/api/product'

  export default {
    name: "UpdateProductDetailInfo",
    components: {Tinymce, MultiUpload},
    props: {
      value: Object,
    },
    data() {
      return {
        activeHtmlName: 'pc'
      }
    },
    computed: {
      selectProductPics: {
        get: function () {
          let images = []
          for (let i = 0; i < this.value.productImages.length; i++) {
            images.push(this.value.productImages[i].image)
          }
          return images
        },
        set: function (newValue) {
          this.value.productImages = []
          for (let i = 0; i < newValue.length; i++) {
            this.value.productImages.push({image: newValue[i]})
          }
        }
      }
    },
    methods: {
      handlePrev() {
        this.$emit('prevStep')
      },
      handleNext() {
        this.$emit('nextStep')
      },
      update() {
        this.$confirm('是否要保存', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.value.product.images = []
          for (let i = 0; i < this.value.productImages.length; i++) {
            this.value.product.images.push({image: this.value.productImages[i].image})
          }
          updateProduct(this.value.product.id, this.value.product).then(response => {
            this.$message({
              message: '保存成功',
              type: 'success',
              duration: 1000
            });
          })
        })
      },
    }
  }
</script>

<style scoped>

</style>
