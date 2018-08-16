function RepositoryImageViewModel(data) {
  var basicInfo = data.basicInfo;
  var details = data.details;

  var history = [];
  for (var i = 0; i < basicInfo.history.length; i++) {
    var item = basicInfo.history[i];
    history.push(angular.fromJson(item.v1Compatibility));
  }
  this.name = basicInfo.name;
  this.tags = [basicInfo.tag];
  this.id = history[0].id;
  this.created = history[0].created;
  this.history = history;
  this.layers = details.layers.map(function (item) {
    return {
      digest: item.digest,
      size: item.size
    };
  });
  this.size = details.layers.reduce(function (a, b) {
    return {size: a.size + b.size};
  }).size;
}
