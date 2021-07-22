"use script"; //开发环境建议开启严格模式

//判断webgl支持
if (!mars3d.Util.webglreport()) {
  mars3d.Util.webglerror();
}

//读取 config.json 配置文件
let configUrl = 'config/config.json'
fetch(configUrl)
  .then(function (response) {
    if (!response.ok) {
      var error = new Error(response.statusText)
      error.response = response
      throw error
    } else {
      return response.json()
    }
  })
  .then((json) => {
    initMap(json.map3d); //构建地图 
  })
  .catch(function (error) {
    console.log('加载JSON出错', error) 
    haoutil.alert(error?.message, '出错了')
  })

var map;

function initMap(mapOptions) {
  //创建三维地球场景
  map = new mars3d.Map("mars3dContainer", mapOptions);

  var tilesetLayer = new mars3d.layer.TilesetLayer({
    name: '小区',
    type: '3dtiles',
    url: '//data.mars3d.cn/3dtiles/qx-xiaoqu/tileset.json',
    position: { alt: 0 },
    maximumScreenSpaceError: 8,
    maximumMemoryUsage: 1024,
    show: true,
  })
  map.addLayer(tilesetLayer)

  var geoJsonLayerDTH = new mars3d.layer.GeoJsonLayer({
    name: '昆明小区-单体化',
    url: '/item.json',
    symbol: {
      styleOptions: {
        label: {
          text: '{name}',
          opacity: 1,
          font_size: 30,
          clampToGround: true,//
          color: 'red',
          font_family: '楷体',
          outline: true,
          outlineColor: '#000000',
          outlineWidth: 3,
          background: false,
          backgroundColor: '#000000',
          backgroundOpacity: 0.1,
          scaleByDistance: true,
          scaleByDistance_far: 1000,
          scaleByDistance_farValue: 0.3,
          scaleByDistance_near: 10,
          scaleByDistance_nearValue: 1,
        },
      },
    },
    //dth 标识为单体化数据，内部特殊处理
    dth: {
      type: 'click', //设置这个属性改为单击后高亮,默认为鼠标移入高亮
      color: 'rgba(255,255,0,0.3)',
      buffer: 1.0,
    },
    popup: [
      { field: 'name', name: '房屋名称' },
      { field: 'jznf', name: '建造年份' },
      { field: 'ssdw', name: '所属单位' },
      { field: 'remark', name: '备注信息' },
    ],
  })
  map.addLayer(geoJsonLayerDTH)
}
