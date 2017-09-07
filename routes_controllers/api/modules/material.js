// 素材--模型
var Data = require('../../../mongo/models/Data.js');


function Material(obj) {}

Material.prototype = {
  // ----------------------查询所有
  all: function*(obj) {
    var me = this;
    // 展示
    var limit = parseInt(obj.rows);
    // 跳过
    var skip = (obj.page - 1) * limit;

    // 查询数据
    var data = yield Data
      .find()
      .limit(limit)
      .skip(skip)
      .exec();

    var count = yield Data
      .count()
      .exec();

    return {
      total: count,
      rows:data
    };
  },
};

module.exports = Material;
