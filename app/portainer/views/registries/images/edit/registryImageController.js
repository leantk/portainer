angular.module('portainer.app')
  .controller('RegistryImageController', ['$q', '$scope', '$transition$', '$state', 'LocalRegistryService', 'RegistryService', 'ModalService', 'Notifications',
    function ($q, $scope, $transition$, $state, LocalRegistryService, RegistryService, ModalService, Notifications) {

      $scope.state = {
        actionInProgress: false
      };

      $scope.removeImage = function () {
        LocalRegistryService.removeImage($scope.image.name, $scope.image.digest)
        .then(function success(data) {
          Notifications.success('Success', 'Image removed');
        }).catch(function error(err) {
          Notifications.error('Failure', err, 'Unable to delete image');
        });
      };

      function initView() {
        var repositoryName = $transition$.params().repository;
        var imageId = $transition$.params().imageId;
        var registryID = $transition$.params().id;
        $q.all({
            registry: RegistryService.registry(registryID),
            image: LocalRegistryService.repositoryImage(repositoryName, imageId)
          })
          .then(function success(data) {
            $scope.registry = data.registry;
            $scope.image = data.image;
            console.log(data.image);
          })
          .catch(function error(err) {
            Notifications.error('Failure', err, 'Unable to retrieve image information');
          });
      }

      initView();
    }
  ]);