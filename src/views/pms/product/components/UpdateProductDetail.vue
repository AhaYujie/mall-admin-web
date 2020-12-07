<template>
  <el-card class="app-container" shadow="never">
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="商品基本信息"></el-step>
      <el-step title="商品详细信息"></el-step>
      <el-step title="商品参数信息"></el-step>
      <el-step title="商品SKU信息"></el-step>
    </el-steps>
    <update-product-basic-info
      v-show="showStatus[0]"
      v-model="product.product"
      @nextStep="nextStep">
    </update-product-basic-info>
    <update-product-detail-info
      v-show="showStatus[1]"
      v-model="product"
      @nextStep="nextStep"
      @prevStep="prevStep">
    </update-product-detail-info>
    <update-product-param
      v-show="showStatus[2]"
      v-model="product.productParams"
      :product-id="product.product.id"
      @nextStep="nextStep"
      @prevStep="prevStep">
    </update-product-param>
    <update-product-sku
      v-show="showStatus[3]"
      @finishCommit="finishCommit"
      @prevStep="prevStep">
    </update-product-sku>
  </el-card>
</template>

<script>
  import UpdateProductBasicInfo from './UpdateProductBasicInfo'
  import UpdateProductDetailInfo from './UpdateProductDetailInfo'
  import UpdateProductParam from './UpdateProductParam'
  import UpdateProductSku from './UpdateProductSku'
  import {getProduct} from '@/api/product'

  export default {
    name: "UpdateProductDetail",
    components: {UpdateProductBasicInfo, UpdateProductDetailInfo, UpdateProductParam, UpdateProductSku},
    data() {
      return {
        active: 0,
        showStatus: [true, false, false, false],
        product: {
          product: {
            brandId: null,
            brandName: null,
            createTime: null,
            description: null,
            detailDescription: null,
            detailHtml: null,
            detailMobileHtml: null,
            detailTitle: null,
            giftPoint: null,
            id: null,
            isDeleted: null,
            isNew: null,
            isPreview: null,
            isPublish: null,
            isRecommend: null,
            isVerify: null,
            keywords: null,
            lowStock: null,
            name: null,
            note: null,
            originalPrice: null,
            pic: null,
            price: null,
            productCategoryId: null,
            productCategoryName: null,
            productSn: null,
            promotionType: null,
            sale: null,
            serviceIds: null,
            sort: null,
            stock: null,
            subTitle: null,
            unit: null,
            updateTime: null,
            usePointLimit: null,
          },
          productImages: [],
          productParams: [],
          skus: [],
          specifications: []
        }
      }
    },
    created() {
      getProduct(this.$route.query.id).then(response => {
        this.product = response.data
      })
    },
    methods: {
      nextStep() {
        if (this.active < this.showStatus.length - 1) {
          this.active++;
          this.hideAll();
          this.showStatus[this.active] = true;
        }
      },
      prevStep() {
        if (this.active > 0 && this.active < this.showStatus.length) {
          this.active--;
          this.hideAll();
          this.showStatus[this.active] = true;
        }
      },
      hideAll() {
        for (let i = 0; i < this.showStatus.length; i++) {
          this.showStatus[i] = false;
        }
      },
      finishCommit() {
        this.$confirm('是否要提交该产品', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        })
      }
    }
  }
</script>

<style scoped>

</style>
