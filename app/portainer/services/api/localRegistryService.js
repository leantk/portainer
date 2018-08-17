angular.module('portainer.app')
  .factory('LocalRegistryService', ['$q', 'LocalRegistries', function LocalRegistryServiceFactory($q, LocalRegistries) {
    'use strict';
    var service = {};

    function groupBy(array, prop) {
      return array.reduce(function (groups, item) {
        var val = item[prop];
        groups[val] = groups[val] || [];
        groups[val].push(item);
        return groups;
      }, {});
    }

    function groupTags(manifests) {
      var grouped = groupBy(manifests, 'name');
      for (var prop in grouped) {
        if (grouped.hasOwnProperty(prop)) {
          grouped[prop] = groupBy(grouped[prop], 'id');
        }
      }
      var images = [];
      for (var name in grouped) {
        if (grouped.hasOwnProperty(name)) {
          for (var id in grouped[name]) {
            if (grouped[name].hasOwnProperty(id)) {
              var squashedImage = grouped[name][id].reduce(function (a, b) {
                a.tags = a.tags.concat(b.tags);
                return a;
              });

              images.push(squashedImage);
            }
          }
        }
      }
      return images;
    }

    function manifestPromise(repository, tag) {
      var deferred = $q.defer();

      var promises = [LocalRegistries.manifest({
          name: repository.name,
          tag: tag
        }).$promise,
        LocalRegistries.manifestV2({
          name: repository.name,
          tag: tag
        }).$promise
      ];

      $q.all(promises)
        .then(function success(data) {
          var basicInfo = _.find(data, function (item) {
            return item.schemaVersion === 1;
          });
          var details = _.find(data, function (item) {
            return item.schemaVersion === 2;
          });
          deferred.resolve({
            basicInfo: basicInfo,
            details: details
          });
        }).catch(function error() {
          deferred.reject();
        });

      return deferred.promise;
    }



    service.images = function () {
      var deferred = $q.defer();

      LocalRegistries.catalog().$promise
        .then(function success(data) {
          var repositories = data.repositories;
          var tagsPromises = [];
          for (var i = 0; i < repositories.length; i++) {
            var repository = repositories[i];
            var promise = LocalRegistries.tags({
              name: repository
            }).$promise;
            tagsPromises.push(promise);
          }
          return $q.all(tagsPromises);
        }).then(function success(data) {
          var manifestsPromises = [];
          for (var i = 0; i < data.length; i++) {
            var repository = data[i];
            for (var j = 0; j < repository.tags.length; j++) {
              var tag = repository.tags[j];
              var promise = manifestPromise(repository, tag);
              manifestsPromises.push(promise);
            }
          }
          return $q.all(manifestsPromises);
        })
        .then(function success(data) {
          console.log(data);
          var manifests = data.map(function (item) {
            return new RepositoryImageViewModel(item);
          });
          var images = groupTags(manifests);
          deferred.resolve(images);
        }).catch(function error(err) {
          deferred.reject({
            msg: 'Unable to retrieve repositories',
            err: err
          });
        });
      return deferred.promise;
    };

    service.repositoryImage = function (repository, imageId) {
      var deferred = $q.defer();
      LocalRegistries.manifestV2({
          name: repository,
          tag: 'sha256:9db2ca6ccae029dd195e331f4bede3d2ea2e67e0de29d6a0f8c1572e70f32fa7'
        }).$promise
        .then(function success(data) {
          console.log(data);
          
          deferred.resolve();
        }).catch(function error(err) {
          deferred.reject({
            msg: 'Unable to retrieve image information',
            err: err
          });
        });
      return deferred.promise;
    };

    return service;
  }]);