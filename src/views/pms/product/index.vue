<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          @click="handleSearchList()"
          type="primary"
          size="small">
          搜索
        </el-button>
        <el-button
          style="float: right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input clearable style="width: 205px" v-model="listQuery.keyword" placeholder="商品名称"></el-input>
          </el-form-item>
          <el-form-item label="商品货号：">
            <el-input clearable style="width: 205px" v-model="listQuery.productSn" placeholder="商品货号"></el-input>
          </el-form-item>
          <el-form-item label="商品分类：">
            <el-cascader
              v-model="selectProductCate"
              :options="productCateOptions"
              @change="handleProductCateSelectChange"
              filterable
              change-on-select>
            </el-cascader>
          </el-form-item>
          <el-form-item label="商品品牌：">
            <el-select v-model="listQuery.brandId" placeholder="请选择品牌" clearable filterable>
              <el-option
                v-for="item in brandOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="新品状态：">
            <el-select v-model="listQuery.isNew" placeholder="全部" clearable>
              <el-option
                v-for="item in newStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="预告状态：">
            <el-select v-model="listQuery.isPreview" placeholder="全部" clearable>
              <el-option
                v-for="item in previewStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上架状态：">
            <el-select v-model="listQuery.isPublish" placeholder="全部" clearable>
              <el-option
                v-for="item in publishStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="推荐状态：">
            <el-select v-model="listQuery.isRecommend" placeholder="全部" clearable>
              <el-option
                v-for="item in recommendStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核状态：">
            <el-select v-model="listQuery.isVerify" placeholder="全部" clearable>
              <el-option
                v-for="item in verifyStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="最低价格：">
            <el-input style="width: 205px" v-model="listQuery.minPrice" placeholder="请输入商品的最低价格"></el-input>
          </el-form-item>
          <el-form-item label="最高价格：">
            <el-input style="width: 205px" v-model="listQuery.maxPrice" placeholder="请输入商品的最高价格"></el-input>
          </el-form-item>
          <el-form-item label="商品排序：">
            <el-select v-model="listQuery.sort" placeholder="默认" clearable>
              <el-option
                v-for="item in sortOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button
        class="btn-add"
        @click="handleAddProduct()"
        size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productTable"
                :data="list"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                v-loading="listLoading"
                border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="商品图片" width="200" align="center">
          <template slot-scope="scope"><img style="height: 80px" :src="scope.row.pic"></template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.name}}</p>
            <p>品牌：{{scope.row.brandName}}</p>
          </template>
        </el-table-column>
        <el-table-column label="价格/货号" width="120" align="center">
          <template slot-scope="scope">
            <p>价格：￥{{scope.row.price}}</p>
            <p>货号：{{scope.row.productSn}}</p>
          </template>
        </el-table-column>
        <el-table-column label="标签" width="140" align="center">
          <template slot-scope="scope">
            <p>上架：
              <el-switch
                @change="handlePublishStatusChange(scope.$index, scope.row)"
                :active-value="1"
                :inactive-value="0"
                v-model="scope.row.isPublish">
              </el-switch>
            </p>
            <p>新品：
              <el-switch
                @change="handleNewStatusChange(scope.$index, scope.row)"
                :active-value="1"
                :inactive-value="0"
                v-model="scope.row.isNew">
              </el-switch>
            </p>
            <p>推荐：
              <el-switch
                @change="handleRecommendStatusChange(scope.$index, scope.row)"
                :active-value="1"
                :inactive-value="0"
                v-model="scope.row.isRecommend">
              </el-switch>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="排序" width="100" align="center">
          <template slot-scope="scope">{{scope.row.sort}}</template>
        </el-table-column>
        <el-table-column label="SKU库存" width="100" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="handleShowSkuEditDialog(scope.$index, scope.row)"
                       circle></el-button>
          </template>
        </el-table-column>
        <el-table-column label="销量" width="100" align="center">
          <template slot-scope="scope">{{scope.row.sale}}</template>
        </el-table-column>
        <el-table-column label="审核状态" width="100" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.isVerify | verifyStatusFilter}}</p>
            <p>
              <el-button
                type="text"
                @click="handleShowVerifyDetail(scope.$index, scope.row)">审核详情
              </el-button>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleUpdateProduct(scope.$index, scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-select
        size="small"
        v-model="operateType" placeholder="批量操作">
        <el-option
          v-for="item in operates"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button
        style="margin-left: 20px"
        class="search-button"
        @click="handleBatchOperate()"
        type="primary"
        size="small">
        确定
      </el-button>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      title="SKU信息"
      :visible.sync="editSkuInfo.dialogVisible"
      width="80%">
      <span>商品:</span>
      <span>{{editSkuInfo.name}}</span>
      <span>货号:</span>
      <span>{{editSkuInfo.productSn}}</span>
      <el-input placeholder="按sku编号搜索" v-model="editSkuInfo.keyword" size="small" style="width: 50%;margin-left: 20px">
        <el-button slot="append" icon="el-icon-search" @click="handleSearchEditSku"></el-button>
      </el-input>
      <el-table style="width: 100%;margin-top: 20px"
                :data="editSkuInfo.stockList"
                border>
        <el-table-column
          label="SKU编号"
          width="200"
          align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.skuCode"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="规格"
          align="center">
          <template slot-scope="scope">
            {{getSkuSpecificationString(scope.row.specification)}}
          </template>
        </el-table-column>
        <el-table-column
          label="销售价格"
          width="120"
          align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.price"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="商品库存"
          width="120"
          align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.stock"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="库存预警值"
          width="120"
          align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.lowStock"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editSkuInfo.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditSkuConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    fetchList,
    search,
    updateDeleteStatus,
    updateNewStatus,
    updateRecommendStatus,
    updatePublishStatus
  } from '@/api/product'
  import {fetchList as fetchSkuStockList, update as updateSkuStockList} from '@/api/skuStock'
  import {fetchList as fetchProductAttrList} from '@/api/productAttr'
  import {fetchList as fetchBrandList} from '@/api/brand'
  import {fetchListWithChildren, fetchProcutCateList} from '@/api/productCate'

  const defaultListQuery = {
    keyword: null,
    productSn: null,
    productCategoryId: null,
    brandId: null,
    isNew: null,
    isPreview: null,
    isPublish: null,
    isRecommend: null,
    isVerify: null,
    minPrice: null,
    maxPrice: null,
    pageNum: 1,
    pageSize: 5,
    sort: 0
  };
  export default {
    name: "productList",
    data() {
      return {
        editSkuInfo: {
          dialogVisible: false,
          productId: null,
          name: null,
          productSn: '',
          stockList: [],
          keyword: null
        },
        operates: [
          {
            label: "商品上架",
            value: "publishOn"
          },
          {
            label: "商品下架",
            value: "publishOff"
          },
          {
            label: "推荐商品",
            value: "recommendOn"
          },
          {
            label: "取消推荐",
            value: "recommendOff"
          },
          {
            label: "设为新品",
            value: "newOn"
          },
          {
            label: "取消新品",
            value: "newOff"
          },
        ],
        operateType: null,
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        listLoading: true,
        selectProductCate: null,
        multipleSelection: [],
        productCateOptions: [],
        brandOptions: [],
        newStatusOptions: [{
          value: 1,
          label: '新品'
        }, {
          value: 0,
          label: '非新品'
        }],
        previewStatusOptions: [{
          value: 1,
          label: '预告商品'
        }, {
          value: 0,
          label: '非预告商品'
        }],
        publishStatusOptions: [{
          value: 1,
          label: '上架'
        }, {
          value: 0,
          label: '下架'
        }],
        recommendStatusOptions: [{
          value: 1,
          label: '推荐商品'
        }, {
          value: 0,
          label: '非推荐商品'
        }],
        verifyStatusOptions: [{
          value: 1,
          label: '审核通过'
        }, {
          value: 0,
          label: '未审核'
        }],
        sortOptions: [
          {
            value: 0,
            label: '按相关度排序'
          },
          {
            value: 1,
            label: '按销量从高到低排序'
          },
          {
            value: 2,
            label: '按价格从高到低排序'
          },
          {
            value: 3,
            label: '按价格从低到高排序'
          },
        ]
      }
    },
    created() {
      this.getList();
      this.getBrandList();
      this.getProductCateList();
    },
    watch: {},
    filters: {
      verifyStatusFilter(value) {
        if (value === 1) {
          return '审核通过';
        } else {
          return '未审核';
        }
      }
    },
    methods: {
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
      getProductSkuSp(row, index) {
        let spData = JSON.parse(row.specification);
        if (spData != null && index < spData.length) {
          return spData[index].value;
        } else {
          return null;
        }
      },
      getList() {
        this.listLoading = true;
        if (this.listQuery.keyword === null && this.listQuery.productSn === null && this.listQuery.productCategoryId === null &&
          this.listQuery.brandId === null && this.listQuery.isNew === null && this.listQuery.isPreview === null &&
          this.listQuery.isPublish === null && this.listQuery.isRecommend === null && this.listQuery.isVerify === null &&
          this.listQuery.minPrice === null && this.listQuery.maxPrice === null) {
          console.log("获取商品列表")
          fetchList(this.listQuery).then(response => {
            this.listLoading = false;
            this.list = response.data.data;
            this.total = response.data.total;
          });
        } else {
          console.log("搜索商品");
          search(this.listQuery).then(response => {
            this.listLoading = false;
            this.list = response.data.data;
            this.total = response.data.total;
          })
        }
      },
      getBrandList() {
        // TODO:修改为分页获取，或者通过输入自动搜索
        fetchBrandList().then(response => {
          this.brandOptions = [];
          let brandList = response.data
          for (let i = 0; i < brandList.length; i++) {
            this.brandOptions.push({label: brandList[i].name, value: brandList[i].id});
          }
        });
      },
      getProductCateList() {
        fetchListWithChildren({parentId: 0}).then(response => {
          this.productCateOptions = this.helpGetOptions(response.data)
        })
      },
      helpGetOptions(trees) {
        let options = []
        for (let i = 0; i < trees.length; i++) {
          let tree = trees[i]
          let option = {label: tree.productCategory.name, value: tree.productCategory.id, children: null}
          if (tree.children != null && tree.children.length > 0) {
            option.children = this.helpGetOptions(tree.children)
          }
          options.push(option)
        }
        return options
      },
      handleProductCateSelectChange(value) {
        if (value !== null && value.length > 0) {
          this.listQuery.productCategoryId = value[value.length - 1];
        } else {
          this.listQuery.productCategoryId = null;
        }
      },
      handleShowSkuEditDialog(index, row) {
        this.editSkuInfo.dialogVisible = true;
        this.editSkuInfo.productId = row.id;
        this.editSkuInfo.name = row.name
        this.editSkuInfo.productSn = row.productSn;
        this.editSkuInfo.keyword = null;
        fetchSkuStockList(row.id, {keyword: this.editSkuInfo.keyword}).then(response => {
          this.editSkuInfo.stockList = response.data;
        });
      },
      handleSearchEditSku() {
        fetchSkuStockList(this.editSkuInfo.productId, {keyword: this.editSkuInfo.keyword}).then(response => {
          this.editSkuInfo.stockList = response.data;
        });
      },
      handleEditSkuConfirm() {
        if (this.editSkuInfo.stockList == null || this.editSkuInfo.stockList.length <= 0) {
          this.$message({
            message: '暂无sku信息',
            type: 'warning',
            duration: 1000
          });
          return
        }
        this.$confirm('是否要进行修改', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateSkuStockList(this.editSkuInfo.productId, this.editSkuInfo.stockList).then(response => {
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 1000
            });
            this.editSkuInfo.dialogVisible = false;
          });
        });
      },
      handleSearchList() {
        console.log(this.listQuery)
        this.listQuery.pageNum = 1;
        if (this.listQuery.keyword === "") {
          this.listQuery.keyword = null;
        }
        if (this.listQuery.productSn === "") {
          this.listQuery.productSn = null;
        }
        this.getList();
      },
      handleAddProduct() {
        this.$router.push({path: '/pms/addProduct'});
      },
      handleBatchOperate() {
        if (this.operateType == null) {
          this.$message({
            message: '请选择操作类型',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        if (this.multipleSelection == null || this.multipleSelection.length < 1) {
          this.$message({
            message: '请选择要操作的商品',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        this.$confirm('是否要进行该批量操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = [];
          for (let i = 0; i < this.multipleSelection.length; i++) {
            ids.push(this.multipleSelection[i].id);
          }
          switch (this.operateType) {
            case this.operates[0].value:
              this.updatePublishStatus(1, ids);
              break;
            case this.operates[1].value:
              this.updatePublishStatus(0, ids);
              break;
            case this.operates[2].value:
              this.updateRecommendStatus(1, ids);
              break;
            case this.operates[3].value:
              this.updateRecommendStatus(0, ids);
              break;
            case this.operates[4].value:
              this.updateNewStatus(1, ids);
              break;
            case this.operates[5].value:
              this.updateNewStatus(0, ids);
              break;
            default:
              break;
          }
          this.getList();
        });
      },
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList();
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handlePublishStatusChange(index, row) {
        let ids = [];
        ids.push(row.id);
        this.updatePublishStatus(row.isPublish, ids);
      },
      handleNewStatusChange(index, row) {
        let ids = [];
        ids.push(row.id);
        this.updateNewStatus(row.isNew, ids);
      },
      handleRecommendStatusChange(index, row) {
        let ids = [];
        ids.push(row.id);
        this.updateRecommendStatus(row.isRecommend, ids);
      },
      handleResetSearch() {
        this.selectProductCate = [];
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      handleUpdateProduct(index, row) {
        this.$router.push({path: '/pms/updateProduct', query: {id: row.id}});
      },
      handleShowVerifyDetail(index, row) {
        console.log("handleShowVerifyDetail", row);
      },
      updatePublishStatus(publishStatus, ids) {
        let params = new URLSearchParams();
        params.append('ids', ids);
        params.append('publishStatus', publishStatus);
        updatePublishStatus(params).then(response => {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
        });
      },
      updateNewStatus(newStatus, ids) {
        let params = new URLSearchParams();
        params.append('ids', ids);
        params.append('newStatus', newStatus);
        updateNewStatus(params).then(response => {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
        });
      },
      updateRecommendStatus(recommendStatus, ids) {
        let params = new URLSearchParams();
        params.append('ids', ids);
        params.append('recommendStatus', recommendStatus);
        updateRecommendStatus(params).then(response => {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
        });
      },
      updateDeleteStatus(deleteStatus, ids) {
        let params = new URLSearchParams();
        params.append('ids', ids);
        params.append('deleteStatus', deleteStatus);
        updateDeleteStatus(params).then(response => {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 1000
          });
        });
        this.getList();
      }
    }
  }
</script>

<style></style>
