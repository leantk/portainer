angular.module('portainer.app')
  .controller('RegistryImagesController', ['$q', '$scope', '$state', 'LocalRegistryService', 'ModalService', 'Notifications',
    function ($q, $scope, $state, LocalRegistryService, ModalService, Notifications) {

      $scope.state = {
        actionInProgress: false
      };

      $scope.images = [];

      // $scope.removeAction = function (selectedItems) {
      //   ModalService.confirmDeletion(
      //     'Do you want to remove the selected images?',
      //     function onConfirm(confirmed) {
      //       if (!confirmed) {
      //         return;
      //       }
      //     }
      //   );
      // };      

      function initView() {
        LocalRegistryService.repositories()
          .then(function success(data) {
            $scope.images = data;
          })
          .catch(function error(err) {
            $scope.images = [];
            Notifications.error('Failure', err, 'Unable to retrieve repositories');
          });
      }

      initView();
    }
  ]);