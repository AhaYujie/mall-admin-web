<template>
  <div style="margin-top: 50px">
    <el-card class="box-card">
      <div slot="header">
        <span>商品规格</span>
      </div>
      <el-table :data="value.specifications" border>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table :data="props.row.specificationValues" border>
              <el-table-column label="序号" align="center">
                <template slot-scope="scope">{{scope.row.id}}</template>
              </el-table-column>
              <el-table-column label="选项值" align="center">
                <template slot-scope="scope">{{getValueFromJson(scope.row.value)}}</template>
              </el-table-column>
              <el-table-column label="选项图片" align="center">
                <template slot-scope="scope">
                  <img v-show="scope.row.type === 1" style="width: 30px; height: 30px" :src="getImageFromJson(scope.row.value)">
                </template>
              </el-table-column>
              <el-table-column label="选项类型" align="center">
                <template slot-scope="scope">{{scope.row.type | valueTypeFilter}}</template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="序号" align="center" width="100">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="规格名称" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column width="150" label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleAddSpecificationValue(scope.row)">添加选项</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="box-card" style="margin-top: 20px">
      <div slot="header">
        <span>商品SKU</span>
        <el-button style="float: right" size="small" @click="handleAddSku">添加</el-button>
      </div>
      <el-table border :data="value.skus">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-carousel style="text-align: center" height="150px" type="card" :autoplay="false">
              <el-carousel-item v-for="skuImage in props.row.skuImages" :key="skuImage.id">
                <img style="height: 150px" :src="skuImage.image">
              </el-carousel-item>
            </el-carousel>
          </template>
        </el-table-column>
        <el-table-column label="序号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column >
        <el-table-column v-for="item in value.specifications" :key="item.id" :label="item.name" align="center">
          <template slot-scope="scope">{{getSpecificationValueFromJson(item, scope.row.specification)}}</template>
        </el-table-column>
        <el-table-column label="默认图片" align="center" width="100">
          <template slot-scope="scope">
            <img v-show="scope.row.pic != null" style="width: 30px; height: 30px" :src="scope.row.pic">
          </template>
        </el-table-column>
        <el-table-column label="SKU编号" align="center">
          <template slot-scope="scope">
            {{scope.row.skuCode}}
          </template>
        </el-table-column>
        <el-table-column label="价格" align="center" width="150">
          <template slot-scope="scope">
            {{scope.row.price}}
          </template>
        </el-table-column>
        <el-table-column label="库存" align="center" width="150">
          <template slot-scope="scope">
            {{scope.row.stock}}
          </template>
        </el-table-column>
        <el-table-column label="预警库存" align="center" width="150">
          <template slot-scope="scope">
            {{scope.row.lowStock}}
          </template>
        </el-table-column>
        <el-table-column label="销量" align="center" width="150">
          <template slot-scope="scope">{{scope.row.sale}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEditSku(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-form style="margin-top: 20px" label-width="120px" size="medium">
      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev">上一步，商品规格信息</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="添加规格选项" :visible.sync="addSpecificationValueDialogVisible">
      <el-tabs v-model="specificationValueFormActive" type="card">
        <el-tab-pane label="纯文本选项" name="text">
          <el-form :rules="rules" :model="textValueForm" label-width="120px" size="medium" ref="textValueForm">
            <el-form-item label="规格序号">
              <el-input :disabled="true" style="width: fit-content" v-model="editSpecification.id"></el-input>
            </el-form-item>
            <el-form-item label="规格名称">
              <el-input :disabled="true" style="width: fit-content" v-model="editSpecification.name"></el-input>
            </el-form-item>
            <el-form-item label="选项值" prop="value">
              <el-input style="width: fit-content" v-model="textValueForm.value"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="medium" @click="addSpecificationValue(0, 'textValueForm')">确定</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="图文选项" name="imageText">
          <el-form :rules="rules" :model="textImageValueForm" label-width="120px" size="medium" ref="textImageValueForm">
            <el-form-item label="规格序号">
              <el-input :disabled="true" style="width: fit-content" v-model="editSpecification.id"></el-input>
            </el-form-item>
            <el-form-item label="规格名称">
              <el-input :disabled="true" style="width: fit-content" v-model="editSpecification.name"></el-input>
            </el-form-item>
            <el-form-item label="选项值" prop="value">
              <el-input style="width: fit-content" v-model="textImageValueForm.value"></el-input>
            </el-form-item>
            <el-form-item label="选项图片" prop="image">
              <single-upload v-model="textImageValueForm.image"></single-upload>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="medium" @click="addSpecificationValue(1, 'textImageValueForm')">确定</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <el-dialog :title="isEditSku?'编辑SKU':'添加SKU'" :visible.sync="skuDialogVisible" width="80%">
      <el-form size="medium" :model="skuForm" label-width="10%">
        <el-form-item label="序号" v-if="isEditSku">
          <el-input style="width: 20%" :disabled="true" v-model="skuForm.id"></el-input>
        </el-form-item>
        <el-form-item v-for="(specification) in skuForm.specifications" :label="specification.name" :key="specification.specificationId">
          <el-select :disabled="isEditSku" placeholder="请选择" v-model="specification.specificationValueId">
            <el-option v-for="value in specification.values" :key="value.id" :label="value.value" :value="value.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="SKU编号">
          <el-input style="width: 50%" v-model="skuForm.skuCode"></el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input style="width: 20%" v-model="skuForm.price"></el-input>
        </el-form-item>
        <el-form-item label="库存">
          <el-input style="width: 20%" v-model="skuForm.stock"></el-input>
        </el-form-item>
        <el-form-item label="预警库存">
          <el-input style="width: 20%" v-model="skuForm.lowStock"></el-input>
        </el-form-item>
        <el-form-item label="默认图片">
          <single-upload v-model="skuForm.pic"></single-upload>
        </el-form-item>
        <el-form-item label="图片">
          <multi-upload v-model="skuForm.images"></multi-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancelAddSku">取消</el-button>
        <el-button type="primary" size="small" @click="addSku">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import SingleUpload from '@/components/Upload/singleUpload'
  import MultiUpload from '@/components/Upload/multiUpload'
  import {getProduct, updateSpecification} from '@/api/product'
  import {updateSku} from "../../../../api/product";

  export default {
    name: "UpdateProductSku",
    components: {SingleUpload, MultiUpload},
    props: {
      value: Object,
    },
    data() {
      return {
        addSpecificationValueDialogVisible: false,
        specificationValueFormActive: 'text',
        rules: {
          name: [{required: true, message: '请输入规格名称', trigger: 'blur'}],
          value: [{required: true, message: '请输入规格值', trigger: 'blur'}],
          image: [{required: true, message: '请选择规格图片', trigger: 'blur'}]
        },
        textValueForm: {
          value: null
        },
        textImageValueForm: {
          value: null,
          image: null
        },
        editSpecification: {
          id: null,
          name: null,
          values: []
        },
        isEditSku: false,
        skuDialogVisible: false,
        skuForm: {
          id: null,
          images: [],
          lowStock: null,
          pic: null,
          price: null,
          skuCode: null,
          specifications: [],
          stock: null
        },
      }
    },
    filters: {
      valueTypeFilter(value) {
        if (value === 0) {
          return '纯文本'
        } else if (value === 1) {
          return '图文'
        }
      }
    },
    methods: {
      getValueFromJson(json) {
        return JSON.parse(json).name
      },
      getImageFromJson(json) {
        return JSON.parse(json).image
      },
      handlePrev() {
        this.$emit('prevStep')
      },
      handleAddSpecificationValue(row) {
        this.editSpecification.id = row.id
        this.editSpecification.name = row.name
        this.editSpecification.values = []
        this.addSpecificationValueDialogVisible = true
      },
      addSpecificationValue(type, formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (type === 0) {
              this.editSpecification.values = [{type: 0, value: "{\"name\": \"" + this.textValueForm.value + "\"}"}]
            } else if (type === 1) {
              this.editSpecification.values = [{type: 1, value: "{\"name\": \"" + this.textImageValueForm.value + "\", \"image\": \"" + this.textImageValueForm.image + "\"}"}]
            }
            updateSpecification(this.value.product.id, {specifications: [this.editSpecification]}).then(response => {
              getProduct(this.value.product.id).then(response => {
                this.value.specifications = response.data.specifications
              })
              this.addSpecificationValueDialogVisible = false
              this.$message({
                message: '添加成功',
                type: 'success',
                duration: 1000
              });
            })
          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration: 1000
            });
          }
        })
      },
      getSpecificationValueFromJson(specification, json) {
        let values = JSON.parse(json)
        for (let i = 0; i < values.length; i++) {
          if (specification.name === values[i].key) {
            return values[i].value
          }
        }
        return null
      },
      setSkuFormDefault() {
        this.skuForm.id = null
        this.skuForm.images = []
        this.skuForm.lowStock = null
        this.skuForm.pic = null
        this.skuForm.price = null
        this.skuForm.skuCode = null
        this.skuForm.specifications = []
        this.skuForm.stock = null
      },
      handleAddSku() {
        this.setSkuFormDefault()
        for (let i = 0; i < this.value.specifications.length; i++) {
          let specification = {specificationId: this.value.specifications[i].id, specificationValueId: null,
            name: this.value.specifications[i].name, values: []}
          for (let j = 0; j < this.value.specifications[i].specificationValues.length; j++) {
            let value = this.value.specifications[i].specificationValues[j]
            specification.values.push({id: value.id, value: this.getValueFromJson(value.value)})
          }
          this.skuForm.specifications.push(specification)
        }
        this.isEditSku = false
        this.skuDialogVisible = true
      },
      handleEditSku(sku) {
        this.setSkuFormDefault()
        this.skuForm.id = sku.id
        this.skuForm.lowStock = sku.lowStock
        this.skuForm.pic = sku.pic
        this.skuForm.price = sku.price
        this.skuForm.skuCode = sku.skuCode
        this.skuForm.stock = sku.stock
        for (let i = 0; i < sku.skuImages.length; i++) {
          this.skuForm.images.push(sku.skuImages[i].image)
        }
        let values = JSON.parse(sku.specification)
        for (let i = 0; i < this.value.specifications.length; i++) {
          let specification = {specificationId: this.value.specifications[i].id, specificationValueId: null,
            name: this.value.specifications[i].name, values: []}
          let tmp = null
          for (let j = 0; j < values.length; j++) {
            if (values[j].key === this.value.specifications[i].name) {
              tmp = values[j]
              break
            }
          }
          for (let j = 0; j < this.value.specifications[i].specificationValues.length; j++) {
            let value = this.value.specifications[i].specificationValues[j]
            let valueParse = this.getValueFromJson(value.value)
            specification.values.push({id: value.id, value: valueParse})
            if (tmp.value === valueParse) {
              specification.specificationValueId = value.id
            }
          }
          this.skuForm.specifications.push(specification)
        }
        this.isEditSku = true
        this.skuDialogVisible = true
      },
      addSku() {
        for (let i = 0; i < this.skuForm.images.length; i++) {
          this.skuForm.images[i] = {image: this.skuForm.images[i]}
        }
        updateSku(this.value.product.id, {skus: [this.skuForm]}).then(response => {
          getProduct(this.value.product.id).then(response => {
            this.value.skus = response.data.skus
            this.skuDialogVisible = false
            this.$message({
              message: '添加成功',
              type: 'success',
              duration: 1000
            });
          })
        })
      },
      cancelAddSku() {
        this.skuDialogVisible = false
      },
    }
  }
</script>

<style scoped>

</style>
