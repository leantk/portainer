angular.module('portainer.app')
  .factory('LocalRegistries', ['$resource', function LocalRegistriesFactory($resource) {
    'use strict';
    var baseUrl = 'http://localhost:5000/v2';
    return $resource(baseUrl, {}, {
      catalog: {
        method: 'GET',
        url: baseUrl + '/_catalog'
      },
      tags: {
        method: 'GET',
        url: baseUrl + '/:name/tags/list',
        params: {
          name: '@name'
        }
      },
      manifest: {
        method: 'GET',
        url: baseUrl + '/:name/manifests/:tag',
        params: {
          name: '@name',
          tag: '@tag'
        },
        headers: {
          'Cache-Control': 'no-cache'
        }
      },
      manifestV2: {
        method: 'GET',
        url: baseUrl + '/:name/manifests/:tag',
        params: {
          name: '@name',
          tag: '@tag'
        },
        headers: {
          'Accept': 'application/vnd.docker.distribution.manifest.v2+json',
          'Cache-Control': 'no-cache'
        }
      }
    });
  }]);