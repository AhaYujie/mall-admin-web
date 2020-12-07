<template> 
  <el-card class="app-container" shadow="never">
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="商品基本信息"></el-step>
      <el-step title="商品详细信息"></el-step>
      <el-step title="商品参数信息"></el-step>
      <el-step title="商品SKU信息"></el-step>
    </el-steps>
    <product-basic-info
      v-show="showStatus[0]"
      v-model="product.product"
      @nextStep="nextStep">
    </product-basic-info>
    <product-detail-info
      v-show="showStatus[1]"
      v-model="product.product"
      @nextStep="nextStep"
      @prevStep="prevStep">
    </product-detail-info>
    <product-param-detail
      v-show="showStatus[2]"
      v-model="product.params"
      @nextStep="nextStep"
      @prevStep="prevStep">
    </product-param-detail>
    <product-sku-detail
      v-show="showStatus[3]"
      v-model="product"
      @prevStep="prevStep"
      @finishCommit="finishCommit">
    </product-sku-detail>
  </el-card>
</template>
<script>
  import ProductBasicInfo from './ProductBasicInfo';
  import ProductDetailInfo from './ProductDetailInfo';
  import ProductSkuDetail from './ProductSkuDetail';
  import {createProduct, getProduct, updateProduct} from '@/api/product';
  import ProductParamDetail from "./ProductParamDetail";

  const defaultProductParam = {
    product: {
      brandId: 0,
      description: null,
      detailDescription: null,
      detailHtml: null,
      detailMobileHtml: null,
      detailTitle: null,
      giftPoint: null,
      images: [],
      isNew: 0,
      isPreview: 0,
      isPublish: 0,
      isRecommend: 0,
      keywords: null,
      lowStock: null,
      name: null,
      note: null,
      originalPrice: null,
      pic: null,
      price: null,
      productCategoryId: 0,
      productSn: null,
      promotionType: 0,
      serviceIds: null,
      sort: 0,
      stock: null,
      subTitle: null,
      unit: null,
      usePointLimit: null
    },
    params: [],
    specifications: [],
    skus: []
  };
  export default {
    name: 'ProductDetail',
    components: {ProductParamDetail, ProductBasicInfo, ProductDetailInfo, ProductSkuDetail},
    props: {
    },
    data() {
      return {
        active: 0,
        product: Object.assign({}, defaultProductParam),
        showStatus: [true, false, false, false]
      }
    },
    created() {
    },
    methods: {
      hideAll() {
        for (let i = 0; i < this.showStatus.length; i++) {
          this.showStatus[i] = false;
        }
      },
      prevStep() {
        if (this.active > 0 && this.active < this.showStatus.length) {
          this.active--;
          this.hideAll();
          this.showStatus[this.active] = true;
        }
      },
      nextStep() {
        if (this.active < this.showStatus.length - 1) {
          this.active++;
          this.hideAll();
          this.showStatus[this.active] = true;
        }
      },
      finishCommit() {
        this.$confirm('是否要提交该产品', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          createProduct(this.product).then(response => {
            this.$message({
              type: 'success',
              message: '提交成功',
              duration: 1000
            });
            location.reload();
          });
        })
      }
    }
  }
</script>
<style>
  .form-container {
    width: 800px;
  }
</style>


