// pages/orders/orders.js
Page({
  data: {
    activeTab: 'all', // 当前激活的标签
    orders: []        // 订单列表
  },

  onLoad: function(options) {
    this.loadOrdersData();
  },

  onShow: function() {
    // 页面显示时刷新数据
    this.loadOrdersData();
  },

  // 切换标签
  switchTab: function(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab
    });
  },

  // 加载订单数据
  loadOrdersData: function() {
    // 这里应该是从服务器或缓存获取数据的逻辑
    // 模拟数据
    wx.showLoading({
      title: '加载中...',
    });
    
    setTimeout(() => {
      this.setData({
        orders: [
          {
            orderNo: '20231001123456',
            status: 'unpaid',
            totalAmount: 298.00,
            createTime: '2023-10-01 12:34:56',
            products: [
              {
                id: 1,
                name: '西湖龙井茶叶礼盒',
                image: '/images/tea-gift.jpg',
                spec: '250g/盒',
                price: 298.00,
                quantity: 1
              }
            ]
          },
          {
            orderNo: '20230915112233',
            status: 'paid',
            totalAmount: 596.00,
            createTime: '2023-09-15 11:22:33',
            products: [
              {
                id: 1,
                name: '西湖龙井茶叶礼盒',
                image: '/images/tea-gift.jpg',
                spec: '250g/盒',
                price: 298.00,
                quantity: 2
              }
            ]
          },
          {
            orderNo: '20230910112233',
            status: 'completed',
            totalAmount: 426.00,
            createTime: '2023-09-10 11:22:33',
            products: [
              {
                id: 2,
                name: '杭州特色丝绸围巾',
                image: '/images/silk-scarf.jpg',
                spec: '红色 90cm',
                price: 128.00,
                quantity: 1
              },
              {
                id: 3,
                name: '西湖藕粉',
                image: '/images/lotus-powder.jpg',
                spec: '300g/盒',
                price: 298.00,
                quantity: 1
              }
            ]
          },
        ]
      });
      wx.hideLoading();
    }, 800);
  },

  // 获取订单状态文本
  getStatusText: function(status) {
    const statusMap = {
      'unpaid': '待支付',
      'paid': '已支付',
      'completed': '已完成'
    };
    return statusMap[status] || '';
  },

  // 立即支付
  payOrder: function(e) {
    const orderNo = e.currentTarget.dataset.orderno;
    wx.showModal({
      title: '支付订单',
      content: '确定要支付订单 ' + orderNo + ' 吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '支付中...' });
          // 模拟支付成功
          setTimeout(() => {
            wx.hideLoading();
            this.updateOrderStatus(orderNo, 'paid');
            wx.showToast({
              title: '支付成功',
              icon: 'success'
            });
          }, 1500);
        }
      }
    });
  },

  // 确认收货
  confirmReceipt: function(e) {
    const orderNo = e.currentTarget.dataset.orderno;
    wx.showModal({
      title: '确认收货',
      content: '请确认已收到订单 ' + orderNo + ' 的商品',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '处理中...' });
          // 模拟确认收货
          setTimeout(() => {
            wx.hideLoading();
            this.updateOrderStatus(orderNo, 'completed');
            wx.showToast({
              title: '确认收货成功',
              icon: 'success'
            });
          }, 1500);
        }
      }
    });
  },

  // 取消订单
  cancelOrder: function(e) {
    const orderNo = e.currentTarget.dataset.orderno;
    wx.showModal({
      title: '取消订单',
      content: '确定要取消订单 ' + orderNo + ' 吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '处理中...' });
          // 模拟取消订单
          setTimeout(() => {
            wx.hideLoading();
            this.removeOrder(orderNo);
            wx.showToast({
              title: '订单已取消',
              icon: 'success'
            });
          }, 1500);
        }
      }
    });
  },

  removeOrder: function(orderNo) {
    this.setData({
      orders: this.data.orders.filter(order => order.orderNo !== orderNo)
    });
  },

  // 更新订单状态
  updateOrderStatus: function(orderNo, status) {
    const orders = this.data.orders.map(order => {
      if (order.orderNo === orderNo) {
        return { ...order, status };
      }
      return order;
    });
    this.setData({ orders });
  },

  // 查看订单详情
  viewOrderDetail: function(e) {
    const orderNo = e.currentTarget.dataset.orderno;
    wx.navigateTo({
      url: `/pages/orderDetail/orderDetail?orderNo=${orderNo}`,
    });
  },

  // 去逛逛
  goShopping: function() {
    wx.switchTab({
      url: '/pages/index/index',
    });
  }
});