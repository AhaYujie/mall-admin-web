<template>
  <div style="margin-top: 50px">
    <el-card class="box-card">
      <div slot="header">
        <span>商品规格</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="addSpecification('specificationForm')">添加规格</el-button>
      </div>
      <el-form :rules="rules" :model="specificationForm" label-width="120px" size="medium" ref="specificationForm">
        <el-form-item label="规格名称" prop="name">
          <el-input style="width: fit-content" v-model="specificationForm.name"></el-input>
        </el-form-item>
      </el-form>
      <el-tabs v-model="active" type="card">
        <el-tab-pane label="纯文本选项" name="text">
          <el-form :rules="rules" :model="textValueForm" label-width="120px" size="medium" ref="textValueForm">
            <el-form-item label="选项值" prop="value">
              <el-input style="width: fit-content" v-model="textValueForm.value"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="medium" @click="addSpecificationTextValue('textValueForm')">添加选项</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="图文选项" name="imageText">
          <el-form :rules="rules" :model="textImageValueForm" label-width="120px" size="medium" ref="textImageValueForm">
            <el-form-item label="选项值" prop="value">
              <el-input style="width: fit-content" v-model="textImageValueForm.value"></el-input>
            </el-form-item>
            <el-form-item label="选项图片" prop="image">
              <single-upload v-model="textImageValueForm.image"></single-upload>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="medium" @click="addSpecificationTextImageValue('textImageValueForm')">添加选项</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <el-card class="operate-container" shadow="never">
        <i class="el-icon-tickets"></i>
        <span>规格选项列表</span>
      </el-card>
      <el-table :data="specificationValues" border>
        <el-table-column label="选项值" align="center">
          <template slot-scope="scope">{{scope.row.value}}</template>
        </el-table-column>
        <el-table-column label="选项图片" align="center">
          <template slot-scope="scope"><img v-if="scope.row.image != null" style="width: 30px; height: 30px" :src="scope.row.image"></template>
        </el-table-column>
        <el-table-column label="选项类型" align="center">
          <template slot-scope="scope">{{scope.row.type | valueTypeFilter}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleDeleteSpecificationValue(scope.$index)"
              type="danger">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-card class="operate-container" shadow="never">
        <i class="el-icon-tickets"></i>
        <span>商品规格列表</span>
      </el-card>
      <el-table :data="specifications" border>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table :data="props.row.values" border>
              <el-table-column label="选项值" align="center">
                <template slot-scope="scope">{{scope.row.value}}</template>
              </el-table-column>
              <el-table-column label="选项图片" align="center">
                <template slot-scope="scope"><img v-if="scope.row.image != null" style="width: 30px; height: 30px" :src="scope.row.image"></template>
              </el-table-column>
              <el-table-column label="选项类型" align="center">
                <template slot-scope="scope">{{scope.row.type | valueTypeFilter}}</template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="序号" align="center" width="50">
          <template slot-scope="scope">{{scope.$index}}</template>
        </el-table-column>
        <el-table-column label="规格名称" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column width="100" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleDeleteSpecification(scope.$index)"
              type="danger">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="box-card" style="margin-top: 20px">
      <div slot="header">
        <span>商品SKU</span>
      </div>
      <el-table border :data="value.skus">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form :model="props.row" label-width="120px" size="medium">
              <el-form-item label="默认图片: ">
                <single-upload v-model="props.row.pic"></single-upload>
              </el-form-item>
              <el-form-item label="SKU相册: ">
                <multi-upload v-model="props.row.images" ></multi-upload>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="序号" width="50" align="center">
          <template slot-scope="scope">{{scope.$index}}</template>
        </el-table-column >
        <el-table-column
          width="100"
          v-for="(item, index) in specifications"
          :key="index"
          :label="item.name"
          align="center">
          <template slot-scope="scope">
            {{getSkuSpecificationValue(index, scope.row)}}
          </template>
        </el-table-column>
        <el-table-column label="默认图片" align="center" width="100">
          <template slot-scope="scope">
            <img v-if="scope.row.pic != null" style="width: 30px; height: 30px" :src="scope.row.pic">
          </template>
        </el-table-column>
        <el-table-column label="SKU编号" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.skuCode"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="价格" align="center" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.price"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="库存" align="center" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.stock"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="预警库存" align="center" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.lowStock"></el-input>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-form style="margin-top: 20px" label-width="120px" size="medium">
      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev">上一步，商品规格信息</el-button>
        <el-button type="primary" size="medium" @click="handleFinishCommit">完成，提交商品</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import SingleUpload from '@/components/Upload/singleUpload'
  import MultiUpload from '@/components/Upload/multiUpload'

  export default {
    name: "ProductSkuDetail",
    components: {SingleUpload, MultiUpload},
    props: {
      value: Object,
    },
    data() {
      return {
        active: 'text',
        specificationForm: {
          name: null
        },
        textValueForm: {
          value: null
        },
        textImageValueForm: {
          value: null,
          image: null
        },
        specificationValues: [],
        // specifications: [{name: '测试规格', values: [{value: '选项1', image: null, type: 0},
        //     {value: '选项2', image: 'https://aha-yujie.oss-cn-shenzhen.aliyuncs.com/20201202211243-aMiukbm1TzlnBlNW.png', type: 1}]}],
        specifications: [],
        rules: {
          name: [{required: true, message: '请输入规格名称', trigger: 'blur'}],
          value: [{required: true, message: '请输入规格值', trigger: 'blur'}],
          image: [{required: true, message: '请选择规格图片', trigger: 'blur'}]
        },
      };
    },
    created() {
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
      addSpecificationTextValue(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.specificationValues.unshift({value: this.textValueForm.value, image: null, type: 0})
            this.textValueForm.value = null
          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration: 1000
            });
          }
        })
      },
      addSpecificationTextImageValue(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.specificationValues.unshift({value: this.textImageValueForm.value, image: this.textImageValueForm.image, type: 1})
            this.textImageValueForm.value = null
            this.textImageValueForm.image = null
          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration: 1000
            });
          }
        })
      },
      handleDeleteSpecificationValue(index) {
        this.$confirm('是否要删除该选项', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.specificationValues.splice(index, 1)
        })
      },
      addSpecification(formName) {
        this.$confirm('是否添加商品规格?(添加成功后将重新生成SKU)', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              if (this.specificationValues.length === 0) {
                this.$message({
                  message: '规格选项不能为空',
                  type: 'error',
                  duration: 1000
                })
              } else {
                let specification = {name: this.specificationForm.name, values: []}
                for (let i = 0; i < this.specificationValues.length; i++) {
                  let valueForm = this.specificationValues[i]
                  let value = {value: null, type: valueForm.type}
                  if (valueForm.type === 0) {
                    value.value = "{\"name\": \"" + valueForm.value + "\"}"
                  } else if (valueForm.type === 1) {
                    value.value = "{\"name\": \"" + valueForm.value + "\", \"image\": \"" + valueForm.image + "\"}"
                  }
                  specification.values.push(value)
                }
                this.value.specifications.push(specification)
                this.specifications.push({name: this.specificationForm.name, values: this.specificationValues})
                this.specificationForm.name = null
                this.specificationValues = []
                this.generateSku()
                this.$message({
                  message: '添加成功',
                  type: 'success',
                  duration: 1000
                })
              }
            } else {
              this.$message({
                message: '验证失败',
                type: 'error',
                duration: 1000
              });
            }
          })
        })
      },
      handleDeleteSpecification(index) {
        this.$confirm('是否要删除该规格?(删除成功后会重新生成SKU)', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.specifications.splice(index, 1)
          this.value.specifications.splice(index, 1)
          this.generateSku()
        })
      },
      generateSku() {
        this.value.skus = []
        this.generateSkuHelper([], 0)
        console.log(this.value.skus)
      },
      generateSkuHelper(path, index) {
        if (index === this.specifications.length && path.length > 0) {
          let sku = {
            images: [],
            lowStock: null,
            pic: null,
            price: null,
            skuCode: null,
            specificationIndex: [],
            stock: null
          }
          for (let i = 0; i < path.length; i++) {
            sku.specificationIndex.push(path[i])
          }
          this.value.skus.push(sku)
          return
        }
        for (let i = 0; i < this.specifications[index].values.length; i++) {
          path.push(i)
          this.generateSkuHelper(path, index + 1)
          path.pop()
        }
      },
      getSkuSpecificationValue(index, row) {
        return this.specifications[index].values[row.specificationIndex[index]].value
      },
      handlePrev() {
        this.$emit('prevStep')
      },
      handleFinishCommit() {
        this.$emit('finishCommit');
      }
    }
  }
</script>

<style scoped>

</style>
