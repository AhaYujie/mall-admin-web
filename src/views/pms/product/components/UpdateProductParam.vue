<template>
  <div style="margin-top: 50px">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button style="float: right" size="mini" @click="handleAdd">添加</el-button>
    </el-card>
    <el-table style="margin-top: 20px" :data="value" border>
      <el-table-column label="参数名称" align="center">
        <template slot-scope="scope">{{scope.row.name}}</template>
      </el-table-column>
      <el-table-column label="参数值" align="center">
        <template slot-scope="scope">{{getValueFromJson(scope.row.value)}}</template>
      </el-table-column>
      <el-table-column label="参数图片" align="center">
        <template slot-scope="scope">
          <img v-show="scope.row.type === 1" style="width: 30px; height: 30px" :src="getImageFromJson(scope.row.value)">
        </template>
      </el-table-column>
      <el-table-column label="参数类型" align="center">
        <template slot-scope="scope">{{scope.row.type | typeFilter}}</template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleUpdate(scope.row, scope.$index)">修改</el-button>
          <el-button size="mini" @click="handleDelete(scope.$index)" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-form style="margin-top: 20px" label-width="120px" size="medium">
      <el-form-item style="text-align: center">
        <el-button size="medium" type="primary" @click="update">保存</el-button>
        <el-button size="medium" @click="handlePrev">上一步，商品详细信息</el-button>
        <el-button type="primary" size="medium" @click="handleNext">下一步，商品SKU信息</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :title="isEdit?'编辑参数':'添加参数'" :visible.sync="dialogVisible">
      <el-tabs v-model="active" type="card">
        <el-tab-pane label="纯文本参数" name="text">
          <el-form :rules="rules" :model="textForm" label-width="120px" size="medium" ref="textForm">
            <el-form-item label="参数名称" prop="name">
              <el-input style="width: fit-content" v-model="textForm.name"></el-input>
            </el-form-item>
            <el-form-item label="参数值" prop="value">
              <el-input style="width: fit-content"  v-model="textForm.value"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="addTextParam('textForm')">确定</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="图文参数" name="imageText">
          <el-form :rules="rules" :model="textImageForm" label-width="120px" size="medium" ref="imageTextForm">
            <el-form-item label="参数名称" prop="name">
              <el-input style="width: fit-content"  v-model="textImageForm.name"></el-input>
            </el-form-item>
            <el-form-item label="参数值" prop="value">
              <el-input style="width: fit-content"  v-model="textImageForm.value"></el-input>
            </el-form-item>
            <el-form-item label="参数图片" prop="image">
              <single-upload v-model="textImageForm.image"></single-upload>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="addTextImageParam('imageTextForm')">确定</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
  import SingleUpload from '@/components/Upload/singleUpload'
  import {updateParam, getProduct} from '@/api/product'

  export default {
    name: "UpdateProductParam",
    components: {SingleUpload},
    props: {
      value: Array,
      productId: {
        type: Number
      }
    },
    data() {
      return {
        active: 'text',
        textForm: {
          name: null,
          value: null
        },
        textImageForm: {
          name: null,
          value: null,
          image: null
        },
        rules: {
          name: [{required: true, message: '请输入参数名称', trigger: 'blur'}],
          value: [{required: true, message: '请输入参数值', trigger: 'blur'}],
          image: [{required: true, message: '请选择参数图片', trigger: 'blur'}]
        },
        isEdit: false,
        editParamIndex: null,
        dialogVisible: false
      }
    },
    filters: {
      typeFilter(value) {
        if (value === 0) {
          return '纯文本'
        } else if (value === 1) {
          return '图文'
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
      addTextParam(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let valueJson = "{\"name\":\"" + this.textForm.value + "\"}"
            if (this.isEdit) {
              this.value[this.editParamIndex].name = this.textForm.name
              this.value[this.editParamIndex].value = valueJson
              this.value[this.editParamIndex].type = 0
            } else {
              this.value.push({name: this.textForm.name, value: valueJson, type: 0})
            }
            this.dialogVisible = false
            this.clearForm()
          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration: 1000
            });
          }
        })
      },
      addTextImageParam(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let valueJson = "{\"name\":\"" + this.textImageForm.value + "\", \"image\": \"" + this.textImageForm.image + "\"}"
            if (this.isEdit) {
              this.value[this.editParamIndex].name = this.textImageForm.name
              this.value[this.editParamIndex].value = valueJson
              this.value[this.editParamIndex].type = 1
            } else {
              this.value.push({name: this.textImageForm.name, value: valueJson, type: 1})
            }
            this.dialogVisible = false
            this.clearForm()
          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration: 1000
            });
          }
        })
      },
      handleDelete(index) {
        this.$confirm('是否要删除该参数', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.value.splice(index, 1)
        })
      },
      getValueFromJson(json) {
        return JSON.parse(json).name
      },
      getImageFromJson(json) {
        return JSON.parse(json).image
      },
      update() {
        this.$confirm('是否要保存', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateParam(this.productId, {productParams: this.value}).then(response => {
            getProduct(this.productId).then(response => {
              this.value = response.data.productParams
            })
            this.$message({
              message: '保存成功',
              type: 'success',
              duration: 1000
            });
          })
        })
      },
      handleAdd() {
        this.isEdit = false
        this.clearForm()
        this.dialogVisible = true
      },
      handleUpdate(row, index) {
        this.isEdit = true
        this.clearForm()
        this.editParamIndex = index
        if (row.type === 0) {
          this.textForm.name = row.name
          this.textForm.value = this.getValueFromJson(row.value)
          this.active = 'text'
        } else if (row.type === 1) {
          this.textImageForm.name = row.name
          this.textImageForm.value = this.getValueFromJson(row.value)
          this.textImageForm.image = this.getImageFromJson(row.value)
          this.active = 'imageText'
        }
        this.dialogVisible = true
      },
      clearForm() {
        this.textForm.name = null
        this.textForm.value = null
        this.textImageForm.name = null
        this.textImageForm.value = null
        this.textImageForm.image = null
      },
    }
  }
</script>

<style scoped>

</style>
