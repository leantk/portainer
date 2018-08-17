angular.module('portainer.app')
  .controller('RegistryImageController', ['$q', '$scope', '$transition$', '$state', 'LocalRegistryService', 'RegistryService', 'ModalService', 'Notifications',
    function ($q, $scope, $transition$, $state, LocalRegistryService, RegistryService, ModalService, Notifications) {

      $scope.state = {
        actionInProgress: false
      };

      function initView() {
        var repositoryName = $transition$.params().repository;
        var imageId = $transition$.params().imageId;
        LocalRegistryService.repositoryImage(repositoryName, imageId)
          .then(function success(data) {

          })
          .catch(function error(err) {
            Notifications.error('Failure', err, 'Unable to retrieve image information');
          });
      }

      initView();
    }
  ]);