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

//创建单体化图层
geoJsonLayerDTH = new mars3d.layer.GeoJsonLayer({
    name: '分层分单元单体化',
    url: '/fenhu.json',
    onCreateGraphic: createDthGraphic, //自定义解析数据
    dth: {
      type: 'click', //设置这个属性改为单击后高亮,默认为鼠标移入高亮
      color: 'rgba(0,255,0,0.5)',
      buffer: 0.2,
    },
    popup: 'all',
  })
  map.addLayer(geoJsonLayerDTH)
}

//添加单体化矢量对象
function createDthGraphic(graphicOptions) {
  var points = graphicOptions.positions
  var floor = graphicOptions.attr.floor //楼层层高配置信息

  //循环每一层
  var arrGraphic
  for (var j = 0, len = floor.length; j < len; j++) {
    var floorCfg = floor[j]

    var minHight = floorCfg.bottom //当前层的 底部海拔高度
    var maxHight = floorCfg.top //当前层的 顶部海拔高度

    var primitive = new mars3d.graphic.PolygonPrimitive({
      positions: points,
      style: {
        height: minHight,
        extrudedHeight: maxHight,
      },
      attr: floorCfg,
    })
    geoJsonLayerDTH.addGraphic(primitive)
  }
}