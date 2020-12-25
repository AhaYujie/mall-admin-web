<template> 
  <div class="detail-container">
    <div>
      <el-steps :active="formatStepStatus(order.status)" finish-status="success" align-center>
        <el-step title="提交订单" :description="formatTime(order.createTime)"></el-step>
        <el-step title="支付订单" :description="formatTime(order.payTime)"></el-step>
        <el-step title="平台发货" :description="formatTime(order.deliveryTime)"></el-step>
        <el-step title="确认收货" :description="formatTime(order.receiveTime)"></el-step>
        <el-step title="完成评价"></el-step>
      </el-steps>
    </div>
    <el-card shadow="never" style="margin-top: 20px">
      <div class="operate-container">
        <i class="el-icon-warning color-danger" style="margin-left: 20px"></i>
        <span class="color-danger">当前订单状态：{{formatStatus(order.status)}}</span>
        <div class="operate-button-container">
          <el-button size="mini" v-show="order.status===orderStatus.UN_DELIVER.value"
                     @click="deliverOrderDialogVisible=true">订单发货
          </el-button>
        </div>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">基本信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="8" class="table-cell-title">订单编号</el-col>
          <el-col :span="4" class="table-cell-title">会员用户名</el-col>
          <el-col :span="4" class="table-cell-title">支付方式</el-col>
          <el-col :span="4" class="table-cell-title">订单来源</el-col>
          <el-col :span="4" class="table-cell-title">订单类型</el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="table-cell">{{order.orderSn}}</el-col>
          <el-col :span="4" class="table-cell">{{order.memberUsername}}</el-col>
          <el-col :span="4" class="table-cell">{{order.payType | formatPayType}}</el-col>
          <el-col :span="4" class="table-cell">{{order.sourceType | formatSourceType}}</el-col>
          <el-col :span="4" class="table-cell">{{order.orderType | formatOrderType}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="table-cell-title">物流单号</el-col>
          <el-col :span="4" class="table-cell-title">物流公司</el-col>
          <el-col :span="4" class="table-cell-title">订单赠送积分</el-col>
          <el-col :span="8" class="table-cell-title">活动信息</el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="table-cell">{{order.deliverySn | formatNull}}</el-col>
          <el-col :span="4" class="table-cell">{{order.deliveryCompany | formatNull}}</el-col>
          <el-col :span="4" class="table-cell">{{order.integration}}</el-col>
          <el-col :span="8" class="table-cell">
            <el-popover
              placement="top-start"
              title="活动信息"
              width="200"
              trigger="hover"
              :content="order.promotionInfo">
              <span slot="reference">{{order.promotionInfo | formatLongText}}</span>
            </el-popover>
          </el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">收货人信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="4" class="table-cell-title">收货人姓名</el-col>
          <el-col :span="4" class="table-cell-title">收货人电话</el-col>
          <el-col :span="4" class="table-cell-title">省份/直辖市</el-col>
          <el-col :span="4" class="table-cell-title">区</el-col>
          <el-col :span="4" class="table-cell-title">街道</el-col>
          <el-col :span="4" class="table-cell-title">详细地址</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="table-cell">{{order.receiverName}}</el-col>
          <el-col :span="4" class="table-cell">{{order.receiverPhone}}</el-col>
          <el-col :span="4" class="table-cell">{{order.receiverProvince}}</el-col>
          <el-col :span="4" class="table-cell">{{order.receiverRegion}}</el-col>
          <el-col :span="4" class="table-cell">{{order.receiverStreet}}</el-col>
          <el-col :span="4" class="table-cell">
            <el-popover
              placement="top-start"
              title="详细地址"
              width="200"
              trigger="hover"
              :content="order.receiverDetailAddress">
              <span slot="reference">{{order.receiverDetailAddress | formatLongText}}</span>
            </el-popover>
          </el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">商品信息</span>
      </div>
      <el-table
        ref="orderItemTable"
        :data="orderProducts"
        style="width: 100%;margin-top: 20px" border>
        <el-table-column type="expand">
          <template slot-scope="props">
            <div class="table-layout">
              <el-row>
                <el-col :span="4" class="table-cell-title">商品品牌</el-col>
                <el-col :span="4" class="table-cell-title">商品分类</el-col>
                <el-col :span="8" class="table-cell-title">商品货号</el-col>
                <el-col :span="8" class="table-cell-title">SKU编码</el-col>
              </el-row>
              <el-row>
                <el-col :span="4" class="table-cell">{{props.row.brandName}}</el-col>
                <el-col :span="4" class="table-cell">{{props.row.productCategoryName}}</el-col>
                <el-col :span="8" class="table-cell">{{props.row.productSn}}</el-col>
                <el-col :span="8" class="table-cell">{{props.row.productSkuCode}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="4" class="table-cell-title">优惠券优惠金额</el-col>
                <el-col :span="4" class="table-cell-title">积分优惠金额</el-col>
                <el-col :span="4" class="table-cell-title">商品促销金额</el-col>
                <el-col :span="4" class="table-cell-title">商品赠送积分</el-col>
                <el-col :span="4" class="table-cell-title">商品状态</el-col>
                <el-col :span="4" class="table-cell-title">是否评价</el-col>
              </el-row>
              <el-row>
                <el-col :span="4" class="table-cell">￥ {{props.row.couponAmount}}</el-col>
                <el-col :span="4" class="table-cell">￥ {{props.row.integrationAmount}}</el-col>
                <el-col :span="4" class="table-cell">￥ {{props.row.promotionAmount}}</el-col>
                <el-col :span="4" class="table-cell">{{props.row.integration}}</el-col>
                <el-col :span="4" class="table-cell">{{formatOrderProductStatus(props.row.status)}}</el-col>
                <el-col :span="4" class="table-cell">{{props.row.isComment === 0 ? '未评价' : '已评价'}}</el-col>
              </el-row>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="商品图片" width="200" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.productPic" style="height: 80px">
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">{{scope.row.productName}}</template>
        </el-table-column>
        <el-table-column label="价格" align="center">
          <template slot-scope="scope">价格：￥{{scope.row.productPrice}}</template>
        </el-table-column>
        <el-table-column label="规格" align="center">
          <template slot-scope="scope">
            {{scope.row.specification | formatProductAttr}}
          </template>
        </el-table-column>
        <el-table-column label="数量" width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.productQuantity}}
          </template>
        </el-table-column>
        <el-table-column label="小计" width="120" align="center">
          <template slot-scope="scope">
            ￥{{scope.row.realAmount}}
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 60px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">费用信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="6" class="table-cell-title">订单总金额</el-col>
          <el-col :span="6" class="table-cell-title">运费</el-col>
          <el-col :span="6" class="table-cell-title">优惠券优惠金额</el-col>
          <el-col :span="6" class="table-cell-title">积分抵扣金额</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">￥{{order.totalAmount}}</el-col>
          <el-col :span="6" class="table-cell">￥{{order.freightAmount}}</el-col>
          <el-col :span="6" class="table-cell">-￥{{order.couponAmount}}</el-col>
          <el-col :span="6" class="table-cell">-￥{{order.integrationAmount}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell-title">促销金额</el-col>
          <el-col :span="6" class="table-cell-title">折扣金额</el-col>
          <el-col :span="6" class="table-cell-title">应付金额</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">-￥{{order.promotionAmount}}</el-col>
          <el-col :span="6" class="table-cell">-￥{{order.discountAmount}}</el-col>
          <el-col :span="6" class="table-cell">
            <span class="color-danger">￥{{order.payAmount}}</span>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-dialog title="订单发货" :visible.sync="deliverOrderDialogVisible">
      <el-form :model="deliverOrderForm" ref="deliverOrderForm" label-position="left" label-width="80px">
        <el-form-item label="物流公司">
          <el-input style="width: 300px" v-model="deliverOrderForm.deliveryCompany"></el-input>
        </el-form-item>
        <el-form-item label="物流单号">
          <el-input style="width: 300px" v-model="deliverOrderForm.deliverySn"></el-input>
        </el-form-item>
        <el-form-item label="发货时间">
          <el-date-picker v-model="deliverOrderForm.deliveryTime" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deliverOrderDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleDeliverOrder">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改收货人信息"
               :visible.sync="receiverDialogVisible"
               width="40%">
      <el-form :model="receiverInfo"
               ref="receiverInfoForm"
               label-width="150px">
        <el-form-item label="收货人姓名：">
          <el-input v-model="receiverInfo.receiverName" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="手机号码：">
          <el-input v-model="receiverInfo.receiverPhone" style="width: 200px">
          </el-input>
        </el-form-item>
        <el-form-item label="邮政编码：">
          <el-input v-model="receiverInfo.receiverPostCode" style="width: 200px">
          </el-input>
        </el-form-item>
        <el-form-item label="所在区域：">
          <v-distpicker :province="receiverInfo.receiverProvince"
                        :city="receiverInfo.receiverCity"
                        :area="receiverInfo.receiverRegion"
                        @selected="onSelectRegion"></v-distpicker>
        </el-form-item>
        <el-form-item label="详细地址：">
          <el-input v-model="receiverInfo.receiverDetailAddress" type="textarea" rows="3">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="receiverDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleUpdateReceiverInfo">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="备注订单"
               :visible.sync="markOrderDialogVisible"
               width="40%">
      <el-form :model="markInfo"
               label-width="150px">
        <el-form-item label="操作备注：">
          <el-input v-model="markInfo.note" type="textarea" rows="3">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="markOrderDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleMarkOrder">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {getOrderDetail, deliveryOrder} from '@/api/order';
  import {formatDate} from '@/utils/date';

  const defaultReceiverInfo = {
    orderId: null,
    receiverName: null,
    receiverPhone: null,
    receiverPostCode: null,
    receiverDetailAddress: null,
    receiverProvince: null,
    receiverCity: null,
    receiverRegion: null,
    status: null
  };
  export default {
    name: 'orderDetail',
    data() {
      return {
        id: null,
        order: {},
        orderProducts: [],
        receiverDialogVisible: false,
        receiverInfo: Object.assign({}, defaultReceiverInfo),
        markOrderDialogVisible: false,
        markInfo: {note: null},
        logisticsDialogVisible: false,
        orderStatus: {
          UN_PAY: {value: 0, name: '待付款'},
          UN_DELIVER: {value: 1, name: '待发货'},
          DELIVERED: {value: 2, name: '已发货'},
          UN_COMMENT: {value: 3, name: '待评价'},
          COMPLETE: {value: 4, name: '交易完成'},
          APPLY_REFUND: {value: 5, name: '申请仅退款'},
          APPLY_RETURN: {value: 6, name: '申请退货退款'},
          REFUND: {value: 7, name: '仅退款中'},
          RETURN: {value: 8, name: '退货退款中'},
          CLOSED: {value: 9, name: '交易关闭'}
        },
        orderProductStatus: {
          UN_PAY: {value: 0, name: '未购买'},
          PAY: {value: 1, name: '已购买'},
          AFTER_SALE: {value: 2, name: '售后中'},
          AFTER_SALE_COMPLETE: {value: 3, name: '售后完成'}
        },
        deliverOrderDialogVisible: false,
        deliverOrderForm: {
          deliveryCompany: null,
          deliverySn: null,
          deliveryTime: null,
          id: null
        }
      }
    },
    created() {
      this.id = this.list = this.$route.query.id;
      getOrderDetail(this.id).then(response => {
        this.order = response.data.order;
        this.orderProducts = response.data.orderProducts;
      });
    },
    filters: {
      formatNull(value) {
        if (value === undefined || value === null || value === '') {
          return '暂无';
        } else {
          return value;
        }
      },
      formatLongText(value) {
        if (value === undefined || value === null || value === '') {
          return '暂无';
        } else if (value.length > 20) {
          return value.substr(0, 20) + '...';
        } else {
          return value;
        }
      },
      formatPayType(value) {
        if (value === 1) {
          return '支付宝';
        } else if (value === 2) {
          return '微信';
        } else if (value === 0) {
          return '未支付';
        }
      },
      formatSourceType(value) {
        if (value === 1) {
          return 'APP订单';
        } else if (value === 0) {
          return 'PC订单';
        }
      },
      formatOrderType(value) {
        if (value === 1) {
          return '秒杀订单';
        } else if (value === 0) {
          return '正常订单';
        }
      },
      formatPayStatus(value) {
        if (value === 0) {
          return '未支付';
        } else if (value === 4) {
          return '已退款';
        } else {
          return '已支付';
        }
      },
      formatDeliverStatus(value) {
        if (value === 0 || value === 1) {
          return '未发货';
        } else {
          return '已发货';
        }
      },
      formatProductAttr(value) {
        if (value == null) {
          return '';
        } else {
          let attr = JSON.parse(value);
          let result = '';
          for (let i = 0; i < attr.length; i++) {
            result += attr[i].key;
            result += ":";
            result += attr[i].value;
            result += ";";
          }
          return result;
        }
      }
    },
    methods: {
      onSelectRegion(data) {
        this.receiverInfo.receiverProvince = data.province.value;
        this.receiverInfo.receiverCity = data.city.value;
        this.receiverInfo.receiverRegion = data.area.value;
      },
      formatTime(time) {
        if (time == null || time === '') {
          return '';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
      formatStepStatus(value) {
        if (value === this.orderStatus.UN_PAY.value) {
          return 1;
        } else if (value === this.orderStatus.UN_DELIVER.value) {
          return 2;
        } else if (value === this.orderStatus.DELIVERED.value) {
          return 3;
        } else if (value === this.orderStatus.UN_COMMENT.value) {
          return 4;
        } else if (value === this.orderStatus.COMPLETE.value) {
          return 5;
        }
        return null;
      },
      formatStatus(value) {
        if (value === this.orderStatus.UN_PAY.value) {
          return this.orderStatus.UN_PAY.name;
        } else if (value === this.orderStatus.UN_DELIVER.value) {
          return this.orderStatus.UN_DELIVER.name;
        } else if (value === this.orderStatus.DELIVERED.value) {
          return this.orderStatus.DELIVERED.name;
        } else if (value === this.orderStatus.UN_COMMENT.value) {
          return this.orderStatus.UN_COMMENT.name;
        } else if (value === this.orderStatus.COMPLETE.value) {
          return this.orderStatus.COMPLETE.name;
        } else if (value === this.orderStatus.APPLY_RETURN.value) {
          return this.orderStatus.APPLY_RETURN.name;
        } else if (value === this.orderStatus.APPLY_REFUND.value) {
          return this.orderStatus.APPLY_REFUND.name;
        } else if (value === this.orderStatus.RETURN.value) {
          return this.orderStatus.RETURN.name;
        } else if (value === this.orderStatus.REFUND.value) {
          return this.orderStatus.REFUND.name;
        } else if (value === this.orderStatus.CLOSED.value) {
          return this.orderStatus.CLOSED.name;
        }
        return null
      },
      showUpdateReceiverDialog() {
        this.receiverDialogVisible = true;
        this.receiverInfo = {
          orderId: this.order.id,
          receiverName: this.order.receiverName,
          receiverPhone: this.order.receiverPhone,
          receiverPostCode: this.order.receiverPostCode,
          receiverDetailAddress: this.order.receiverDetailAddress,
          receiverProvince: this.order.receiverProvince,
          receiverCity: this.order.receiverCity,
          receiverRegion: this.order.receiverRegion,
          status: this.order.status
        }
      },
      handleUpdateReceiverInfo() {
        this.$confirm('是否要修改收货信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateReceiverInfo(this.receiverInfo).then(response => {
            this.receiverDialogVisible = false;
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
            getOrderDetail(this.id).then(response => {
              this.order = response.data;
            });
          });
        });
      },
      showMarkOrderDialog() {
        this.markOrderDialogVisible = true;
        this.markInfo.id = this.id;
        this.closeOrder.note = null;
      },
      handleMarkOrder() {
        this.$confirm('是否要备注订单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = new URLSearchParams();
          params.append("id", this.markInfo.id);
          params.append("note", this.markInfo.note);
          params.append("status", this.order.status);
          updateOrderNote(params).then(response => {
            this.markOrderDialogVisible = false;
            this.$message({
              type: 'success',
              message: '订单备注成功!'
            });
            getOrderDetail(this.id).then(response => {
              this.order = response.data;
            });
          });
        });
      },
      formatOrderProductStatus(value) {
        if (value === this.orderProductStatus.UN_PAY.value) {
          return this.orderProductStatus.UN_PAY.name;
        } else if (value === this.orderProductStatus.PAY.value) {
          return this.orderProductStatus.PAY.name;
        } else if (value === this.orderProductStatus.AFTER_SALE.value) {
          return this.orderProductStatus.AFTER_SALE.name;
        } else if (value === this.orderProductStatus.AFTER_SALE_COMPLETE.value) {
          return this.orderProductStatus.AFTER_SALE_COMPLETE.name;
        }
        return null
      },
      handleDeliverOrder() {
        this.$confirm('是否要订单发货?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deliverOrderForm.id = this.id
          deliveryOrder(this.deliverOrderForm).then(response => {
            this.deliverOrderDialogVisible = false
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            getOrderDetail(this.id).then(response => {
              this.order = response.data.order;
              this.orderProducts = response.data.orderProducts;
            });
            this.deliverOrderForm.deliveryCompany = null
            this.deliverOrderForm.deliverySn = null
            this.deliverOrderForm.deliveryTime = null
          })
        });
      }
    }
  }
</script>

<style scoped>
  .detail-container {
    width: 80%;
    padding: 20px 20px 20px 20px;
    margin: 20px auto;
  }

  .operate-container {
    background: #F2F6FC;
    height: 80px;
    margin: -20px -20px 0;
    line-height: 80px;
  }

  .operate-button-container {
    float: right;
    margin-right: 20px
  }

  .table-layout {
    margin-top: 20px;
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
  }

  .table-cell {
    height: 60px;
    line-height: 40px;
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    font-size: 14px;
    color: #606266;
    text-align: center;
    overflow: hidden;
  }

  .table-cell-title {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    background: #F2F6FC;
    text-align: center;
    font-size: 14px;
    color: #303133;
  }
</style>
