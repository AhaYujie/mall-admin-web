<template> 
  <div>
    <el-upload
      action=""
      :http-request="upload"
      list-type="picture"
      :multiple="false" :show-file-list="showFileList"
      :file-list="fileList"
      :on-remove="handleRemove"
      :on-preview="handlePreview"
      v-loading="loading">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10MB</div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="fileList[0].url" alt="">
    </el-dialog>
  </div>
</template>
<script>
  import {upload} from '@/api/oss'

  export default {
    name: 'singleUpload',
    props: {
      value: String
    },
    computed: {
      imageUrl() {
        return this.value;
      },
      imageName() {
        if (this.value != null && this.value !== '') {
          return this.value.substr(this.value.lastIndexOf("/") + 1);
        } else {
          return null;
        }
      },
      fileList() {
        return [{
          name: this.imageName,
          url: this.imageUrl
        }]
      },
      showFileList: {
        get: function () {
          return this.value !== null && this.value !== ''&& this.value!==undefined;
        },
        set: function (newValue) {
        }
      }
    },
    data() {
      return {
        dialogVisible: false,
        loading: false,
      };
    },
    methods: {
      upload(param) {
        this.loading = true
        const form = new FormData()
        form.append('file', param.file)
        upload(form).then(response => {
          this.showFileList = true;
          this.fileList.pop();
          this.fileList.push({name: param.file.name, url: response.data.url});
          this.emitInput(this.fileList[0].url);
        }).catch(err => {
          this.$message({
            message: '上传失败',
            type: 'error',
            duration: 1000
          });
        }).finally(() => {
          this.loading = false
        })
      },
      emitInput(val) {
        this.$emit('input', val)
      },
      handleRemove(file, fileList) {
        this.emitInput('');
      },
      handlePreview(file) {
        this.dialogVisible = true;
      },
    }
  }
</script>
<style>

</style>


