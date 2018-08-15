var g_repositories = {
  repositories: [
    'hw'
  ]
};
var g_tags = {
  name: 'hw',
  tags: [
    'latest'
  ]
};
var g_manifest = {
  schemaVersion: 1,
  name: 'hw',
  tag: 'latest',
  architecture: 'amd64',
  fsLayers: [{
      blobSum: 'sha256:a3ed95caeb02ffe68cdd9fd84406680ae93d633cb16422d00e8a7c22955b46d4'
    },
    {
      blobSum: 'sha256:9db2ca6ccae029dd195e331f4bede3d2ea2e67e0de29d6a0f8c1572e70f32fa7'
    }
  ],
  history: [{
      v1Compatibility: '{\"architecture\":\"amd64\",\"config\":{\"Hostname\":\"\",\"Domainname\":\"\",\"User\":\"\",\"AttachStdin\":false,\"AttachStdout\":false,\"AttachStderr\":false,\"Tty\":false,\"OpenStdin\":false,\"StdinOnce\":false,\"Env\":[\"PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin\"],\"Cmd\":[\"/hello\"],\"ArgsEscaped\":true,\"Image\":\"sha256:6bc48d210ad4c6bbb74e02e6196a9133b57107033c09e92cac12616cad30ebcf\",\"Volumes\":null,\"WorkingDir\":\"\",\"Entrypoint\":null,\"OnBuild\":null,\"Labels\":null},\"container\":\"6b6326f6afc81f7850b74670aad2bf550c7f2f07cd63282160e5eb564876087f\",\"container_config\":{\"Hostname\":\"6b6326f6afc8\",\"Domainname\":\"\",\"User\":\"\",\"AttachStdin\":false,\"AttachStdout\":false,\"AttachStderr\":false,\"Tty\":false,\"OpenStdin\":false,\"StdinOnce\":false,\"Env\":[\"PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin\"],\"Cmd\":[\"/bin/sh\",\"-c\",\"#(nop) \",\"CMD [\\\"/hello\\\"]\"],\"ArgsEscaped\":true,\"Image\":\"sha256:6bc48d210ad4c6bbb74e02e6196a9133b57107033c09e92cac12616cad30ebcf\",\"Volumes\":null,\"WorkingDir\":\"\",\"Entrypoint\":null,\"OnBuild\":null,\"Labels\":{}},\"created\":\"2018-07-11T00:32:08.432822465Z\",\"docker_version\":\"17.06.2-ce\",\"id\":\"3535063d9957314d9d97e7446b2b10f0268d23f27eebd1aa44188cbfc13d143b\",\"os\":\"linux\",\"parent\":\"b6d845cb453cc2dc0338cc4809aab17c77a87b10b53f7682b0cb242b20995546\",\"throwaway\":true}'
    },
    {
      v1Compatibility: '{\"id\":\"b6d845cb453cc2dc0338cc4809aab17c77a87b10b53f7682b0cb242b20995546\",\"created\":\"2018-07-11T00:32:08.223650038Z\",\"container_config\":{\"Cmd\":[\"/bin/sh -c #(nop) COPY file:3c3ca82dfdb40d30f91a91e2ee953fc0193dc455289fe87fd85219a2c19edcea in / \"]}}'
    }
  ],
  signatures: [{
    header: {
      jwk: {
        crv: 'P-256',
        kid: '7QXH:SGTX:GB6P:77SV:7QTL:QLWL:UJHE:FLOF:OQMH:6IKG:XZAZ:45D6',
        kty: 'EC',
        x: 'mEz9vi4-9EpcfYS0HdrSpimgAWgYTzsF5Wpdcbcc6d4',
        y: 'KC1XIalp-zeVK4nxuMsO_S6uj4pT2uyU3KAxE3dQhpA'
      },
      alg: 'ES256'
    },
    signature: 'ZmSO2M2ARj2BPor_s6zN1dGEK5dcBArA7jQWKwxSlBZpSb4F2uysVi-lwMwMrw9gucMOG-nilJIaM97tp6bM6Q',
    protected: 'eyJmb3JtYXRMZW5ndGgiOjIxMjgsImZvcm1hdFRhaWwiOiJDbjAiLCJ0aW1lIjoiMjAxOC0wOC0xNVQxNToxOTozNVoifQ'
  }]
};

angular.module('portainer.app')
  .controller('RegistryImagesController', ['$q', '$http', '$scope', '$state', 'ModalService', 'Notifications',
    function ($q, $http, $scope, $state, ModalService, Notifications) {

      $scope.state = {
        actionInProgress: false
      };

      $scope.images = [];
      $scope.manifests = [];

      $scope.removeAction = function (selectedItems) {
        ModalService.confirmDeletion(
          'Do you want to remove the selected images?',
          function onConfirm(confirmed) {
            if (!confirmed) {
              return;
            }
            console.log('remove images');
            // deleteSelectedImages(selectedItems);
          }
        );
      };

      // function deleteSelectedImages(selectedItems) {
      //   var actionCount = selectedItems.length;
      //   angular.forEach(selectedItems, function (registry) {
      //     RegistryService.deleteRegistry(registry.Id)
      //     .then(function success() {
      //       Notifications.success('Image successfully removed', registry.Name);
      //       var index = $scope.registries.indexOf(registry);
      //       $scope.registries.splice(index, 1);
      //     })
      //     .catch(function error(err) {
      //       Notifications.error('Failure', err, 'Unable to remove registry');
      //     })
      //     .finally(function final() {
      //       --actionCount;
      //       if (actionCount === 0) {
      //         $state.reload();
      //       }
      //     });
      //   });
      // }


      // function successTags(data, repository) {
      //   return function () {
      //     for (var i = 0; i < data.tags.length; i++) {
      //       var tag = data.tags[i];
      //       $q.all({
      //         manifest: g_manifest // TODO: GET /v2/repository/manifests/tag
      //       }).then(successManifest);
      //     }
      //   };
      // }

      // function successManifest(data) {
      //   return function () {
      //     $scope.manifests.push(data.manifest);
      //   };
      // }
      var base = 'http://localhost:5000/v2';

      function initView() {
        $q.all({
            repositories: $http.get(base + '/_catalog') // TODO: GET /v2/_catalog
          }).then(function success(data) {
            console.log(data);
            var repositories = data.repositories;
            var promises = [];
            for (var i = 0; i < repositories.length; i++) {
              var repository = repositories[i];
              var promise = $q.all({
                tags: $http.get(base + repository + '/tags/list') // TODO: GET /v2/repository/tags/list
              });
              promises.push(promise);
            }
            console.log(promises);
            $q.all(promises).then(
              function success(data) {
                console.log(data);
              }
            );
          })
          .catch(function error(err) {
            // $scope.images = [];
            Notifications.error('Failure', err, 'Unable to retrieve repositories');
          });

      }

      initView();
    }
  ]);