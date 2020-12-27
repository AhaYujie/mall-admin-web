<template>
  <el-card class="app-container" shadow="never">
    <el-form :model="submitOrderForm" ref="submitOrderForm" label-width="80px">
      <el-form-item label="会员">
        <el-autocomplete :fetch-suggestions="searchMember" @select="handleSelectMember"
                         placeholder="请输入会员用户名" v-model="submitOrderForm.memberUsername"></el-autocomplete>
      </el-form-item>
      <el-form-item label="折扣金额">
        <el-input-number v-model="submitOrderForm.discountAmount" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item label="搜索商品">
        <el-autocomplete :fetch-suggestions="searchProduct" @select="handleSelectProduct"
                         placeholder="请输入商品名称" v-model="skuInfo.name"></el-autocomplete>
      </el-form-item>
    </el-form>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>商品列表</span>
    </el-card>
    <div class="table-container">
      <el-table style="width: 100%;margin-top: 20px"
                :data="selectedProduct"
                border>
        <el-table-column label="图片" width="200" align="center">
          <template slot-scope="scope"><img style="height: 80px" :src="scope.row.pic"></template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="SKU编号" align="center">
          <template slot-scope="scope">{{scope.row.skuCode}}</template>
        </el-table-column>
        <el-table-column label="规格" align="center">
          <template slot-scope="scope">{{getSkuSpecificationString(scope.row.specification)}}</template>
        </el-table-column>
        <el-table-column label="价格" align="center">
          <template slot-scope="scope">
            {{scope.row.price}} ￥
          </template>
        </el-table-column>
        <el-table-column label="数量" align="center">
          <template slot-scope="scope">
            <el-input-number size="mini" v-model="scope.row.productQuantity" :min="1"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="handleDeleteProduct(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-form style="margin-top: 20px">
      <el-form-item style="text-align: center">
        <el-button style="text-align: center" type="primary" @click="handleSubmitOrder">提交订单</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="SKU信息" :visible.sync="skuInfo.dialogVisible" width="80%">
      <span>商品:</span>
      <span>{{skuInfo.name}}</span>
      <el-table style="width: 100%;margin-top: 20px"
                :data="skuInfo.skus"
                @selection-change="handleSelectSku"
                border>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="图片" width="200" align="center">
          <template slot-scope="scope"><img style="height: 80px" :src="scope.row.pic"></template>
        </el-table-column>
        <el-table-column label="SKU编号" width="200" align="center">
          <template slot-scope="scope">{{scope.row.skuCode}}</template>
        </el-table-column>
        <el-table-column label="规格" align="center">
          <template slot-scope="scope">{{getSkuSpecificationString(scope.row.specification)}}</template>
        </el-table-column>
        <el-table-column label="销售价格" width="100" align="center">
          <template slot-scope="scope">
            {{scope.row.price}}
          </template>
        </el-table-column>
        <el-table-column label="商品库存" width="100" align="center">
          <template slot-scope="scope">
            {{scope.row.stock}}
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="skuInfo.dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAddProduct">添加商品</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
  import {queryByUsername} from '@/api/member'
  import {search as queryProduct} from '@/api/product'
  import {fetchList as getSkuList} from '@/api/skuStock'
  import {submitOrder} from '@/api/order'

  export default {
    name: "submitOrder",
    data() {
      return {
        submitOrderForm: {
          memberId: null,
          memberUsername: "",
          discountAmount: 0,
          products: []
        },
        skuInfo: {
          name: null,
          dialogVisible: false,
          skus: [],
          selectedSkus: []
        },
        selectedProduct: []
      }
    },
    methods: {
      searchMember(username, callback) {
        if (username === undefined) {
          username = ""
        }
        queryByUsername({pageNum: 1, pageSize: 20, username: username}).then(response => {
          let members = response.data.data
          for (let i = 0; i < members.length; i++) {
            members[i].value = members[i].username
          }
          callback(members)
        })
      },
      handleSelectMember(member) {
        this.submitOrderForm.memberId = member.id
      },
      searchProduct(keyword, callback) {
        if (keyword === undefined) {
          keyword = ""
        }
        queryProduct({keyword: keyword, pageNum: 1, pageSize: 20}).then(response => {
          let products = response.data.data
          for (let i = 0; i < products.length; i++) {
            products[i].value = products[i].name
          }
          callback(products)
        })
      },
      handleSelectProduct(product) {
        this.skuInfo.name = product.name
        getSkuList(product.id, {keyword: null}).then(response => {
          this.skuInfo.skus = response.data
          this.skuInfo.dialogVisible = true
        })
      },
      getSkuSpecificationString(specificationJson) {
        let specifications = JSON.parse(specificationJson)
        let specificationString = ""
        if (specifications !== null && specifications.length > 0) {
          for (let i = 0; i < specifications.length; i++) {
            let specification = specifications[i]
            specificationString = specificationString + specification.key + ":" + specification.value + " "
          }
        }
        return specificationString
      },
      handleSelectSku(skus) {
        this.skuInfo.selectedSkus = skus
      },
      handleAddProduct() {
        for (let i = 0; i < this.skuInfo.selectedSkus.length; i++) {
          let sku = this.skuInfo.selectedSkus[i]
          this.selectedProduct.push({skuId: sku.id, name: this.skuInfo.name, pic: sku.pic, skuCode: sku.skuCode,
            specification: sku.specification, price: sku.price, productQuantity: 1})
        }
        this.skuInfo.dialogVisible = false
        this.skuInfo.selectedSkus = []
      },
      handleDeleteProduct(index) {
        this.selectedProduct.splice(index, 1)
      },
      handleSubmitOrder() {
        this.$confirm('是否要提交订单', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          for (let i = 0; i < this.selectedProduct.length; i++) {
            this.submitOrderForm.products.push({skuId: this.selectedProduct[i].skuId, productQuantity: this.selectedProduct[i].productQuantity})
          }
          submitOrder(this.submitOrderForm).then(response => {
            this.$message({
              type: 'success',
              message: '提交成功',
              duration: 1000
            });
            location.reload();
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>
