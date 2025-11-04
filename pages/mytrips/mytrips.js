// pages/myTrips/myTrips.js
Page({
  data: {
    trips: []  // 初始为空数组
  },

  onLoad: function(options) {
    this.loadTripsData()
  },

  loadTripsData: function() {
    setTimeout(() => {
      this.setData({
        trips: [
          {
            id: 1,
            title: '杭州西湖三日游',
            date: '2023-10-01 至 2023-10-03',
            location: '浙江杭州',
          },
          {
            id: 2,
            title: '北京故宫一日游',
            date: '2023-09-15',
            location: '北京',
          }
        ]
      })
    }, 500)
  }
})
