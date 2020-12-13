<template> 
  <div>
    <el-upload
      action=""
      :http-request="upload"
      list-type="picture-card"
      :file-list="fileList"
      :on-remove="handleRemove"
      :on-preview="handlePreview"
      :limit="maxCount"
      :on-exceed="handleExceed"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
  import {upload} from '@/api/oss'

  export default {
    name: 'multiUpload',
    props: {
      //图片属性数组
      value: Array,
      //最大上传图片数量
      maxCount: {
        type: Number,
        default: 5
      }
    },
    data() {
      return {
        dialogVisible: false,
        dialogImageUrl: null,
      };
    },
    computed: {
      fileList() {
        let fileList = [];
        for (let i = 0; i < this.value.length; i++) {
          fileList.push({url: this.value[i]});
        }
        return fileList;
      }
    },
    methods: {
      emitInput(fileList) {
        let value = [];
        for (let i = 0; i < fileList.length; i++) {
          value.push(fileList[i].url);
        }
        this.$emit('input', value)
      },
      handleRemove(file, fileList) {
        this.emitInput(fileList);
      },
      handlePreview(file) {
        this.dialogVisible = true;
        this.dialogImageUrl = file.url;
      },
      handleExceed(files, fileList) {
        this.$message({
          message: '最多只能上传' + this.maxCount + '张图片',
          type: 'warning',
          duration: 1000
        });
      },
      upload(param) {
        this.loading = true
        const form = new FormData()
        form.append('file', param.file)
        upload(form).then(response => {
          this.fileList.push({name: param.file.name, url: response.data.url});
          this.emitInput(this.fileList);
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
    }
  }
</script>
<style>

</style>


