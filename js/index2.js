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
    position: {lng:102.658438, lat:25.087756, alt:0},
    maximumScreenSpaceError: 8,
    maximumMemoryUsage: 1024,
    show: true,
  })
  map.addLayer(tilesetLayer)

  var tiles3dLayerDT = new mars3d.layer.TilesetLayer({
    name: '小区1幢-单体',
    url: '/tiles/tileset.json',
    position: { alt: 1865 },
    classificationType: Cesium.ClassificationType.CESIUM_3D_TILE,
    style: {
      color: 'rgba(255, 255, 255, 0.01)',
    },
    maximumScreenSpaceError: 1,
    maximumMemoryUsage: 1024,
    showMoveFeature: true,
    pickFeatureStyle: {
      color: '#00ff00',
      opacity: 0.2,
    },
    popup: 'all',
  })
  map.addLayer(tiles3dLayerDT)
}