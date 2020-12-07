<template>
  <div style="margin-top: 50px">
    <el-form :model="value" ref="productSaleForm" label-width="120px" size="medium">
      <el-form-item label="详细页标题：">
        <el-input v-model="value.detailTitle"></el-input>
      </el-form-item>
      <el-form-item label="详细页描述：">
        <el-input v-model="value.detailDescription" type="textarea" :autosize="true"></el-input>
      </el-form-item>
      <el-form-item label="商品相册：">
        <multi-upload v-model="selectProductPics"></multi-upload>
      </el-form-item>
      <el-form-item label="网页内容：">
        <el-tabs v-model="activeHtmlName" type="card">
          <el-tab-pane label="PC端网页" name="pc">
            <tinymce :width="800" :height="500" v-model="value.detailHtml"></tinymce>
          </el-tab-pane>
          <el-tab-pane label="移动端网页" name="mobile">
            <tinymce :width="800" :height="500" v-model="value.detailMobileHtml"></tinymce>
          </el-tab-pane>
        </el-tabs>
      </el-form-item>
      <el-form-item label="赠送积分：">
        <el-input style="width: fit-content" v-model="value.giftPoint"></el-input>
      </el-form-item>
      <el-form-item label="积分购买限制：">
        <el-input style="width: fit-content" v-model="value.usePointLimit"></el-input>
      </el-form-item>
      <el-form-item label="预告商品：">
        <el-switch
          v-model="value.isPreview"
          :active-value="1"
          :inactive-value="0">
        </el-switch>
      </el-form-item>
      <el-form-item label="商品上架：">
        <el-switch
          v-model="value.isPublish"
          :active-value="1"
          :inactive-value="0">
        </el-switch>
      </el-form-item>
      <el-form-item label="商品推荐：">
        <span style="margin-right: 10px">新品</span>
        <el-switch
          v-model="value.isNew"
          :active-value="1"
          :inactive-value="0">
        </el-switch>
        <span style="margin-left: 10px;margin-right: 10px">推荐</span>
        <el-switch
          v-model="value.isRecommend"
          :active-value="1"
          :inactive-value="0">
        </el-switch>
      </el-form-item>
      <el-form-item label="商品备注：">
        <el-input v-model="value.note" type="textarea" :autoSize="true"></el-input>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev">上一步，商品基本信息</el-button>
        <el-button type="primary" size="medium" @click="handleNext">下一步，填写商品属性</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import Tinymce from '@/components/Tinymce'
  import MultiUpload from '@/components/Upload/multiUpload'

  export default {
    name: "ProductDetailInfo",
    components: {Tinymce, MultiUpload},
    props: {
      value: Object,
    },
    data() {
      return {
        activeHtmlName: 'pc'
      }
    },
    created() {
    },
    computed: {
      selectProductPics: {
        get: function () {
          let images = []
          for (let i = 0; i < this.value.images.length; i++) {
            images.push(this.value.images[i].image)
          }
          return images
        },
        set: function (newValue) {
          this.value.images = []
          for (let i = 0; i < newValue.length; i++) {
            this.value.images.push({image: newValue[i]})
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
      }
    }
  }
</script>

<style scoped>
  .littleMargin {
    margin-top: 10px;
  }
</style>
