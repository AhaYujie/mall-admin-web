<template>
  <div style="margin-top: 50px">
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
            <el-button type="primary" size="medium" @click="addTextParam('textForm')">添加参数</el-button>
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
            <el-button type="primary" size="medium" @click="addTextImageParam('imageTextForm')">添加参数</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <el-table style="margin-top: 20px" :data="params" border>
      <el-table-column label="参数名称" align="center">
        <template slot-scope="scope">{{scope.row.name}}</template>
      </el-table-column>
      <el-table-column label="参数值" align="center">
        <template slot-scope="scope">{{scope.row.value}}</template>
      </el-table-column>
      <el-table-column label="参数图片" align="center">
        <template slot-scope="scope"><img v-if="scope.row.image != null" style="width: 30px; height: 30px" :src="scope.row.image"></template>
      </el-table-column>
      <el-table-column label="参数类型" align="center">
        <template slot-scope="scope">{{scope.row.type | typeFilter}}</template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleDelete(scope.$index)"
            type="danger">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-form style="margin-top: 20px" label-width="120px" size="medium">
      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev">上一步，商品详细信息</el-button>
        <el-button type="primary" size="medium" @click="handleNext">下一步，商品SKU信息</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import SingleUpload from '@/components/Upload/singleUpload'
  import MultiUpload from '@/components/Upload/multiUpload'

  export default {
    name: "ProductParamDetail",
    components: {SingleUpload, MultiUpload},
    props: {
      value: Array,
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
        params: [],
        rules: {
          name: [{required: true, message: '请输入参数名称', trigger: 'blur'}],
          value: [{required: true, message: '请输入参数值', trigger: 'blur'}],
          image: [{required: true, message: '请选择参数图片', trigger: 'blur'}]
        }
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
            this.params.unshift({name: this.textForm.name, value: this.textForm.value, type: 0, image: null})
            let valueJson = "{\"name\":\"" + this.textForm.value + "\"}"
            this.value.unshift({name: this.textForm.name, value: valueJson, type: 0})
            this.textForm.name = null
            this.textForm.value = null
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
            this.params.unshift({name: this.textImageForm.name, value: this.textImageForm.value, type: 1, image: this.textImageForm.image})
            let valueJson = "{\"name\":\"" + this.textImageForm.value + "\", \"image\": \"" + this.textImageForm.image + "\"}"
            this.value.unshift({name: this.textImageForm.name, value: valueJson, type: 1})
            this.textImageForm.name = null
            this.textImageForm.value = null
            this.textImageForm.image = null
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
          this.params.splice(index, 1)
          this.value.splice(index, 1)
        })
      }
    }
  }
</script>

<style scoped>
  .littleMarginLeft {
    margin-left: 10px;
  }

  .littleMarginTop {
    margin-top: 10px;
  }

  .paramInput {
    width: 250px;
  }

  .paramInputLabel {
    display: inline-block;
    width: 100px;
    text-align: right;
    padding-right: 10px
  }

  .cardBg {
    background: #F8F9FC;
  }
</style>
