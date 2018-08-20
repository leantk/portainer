angular.module('portainer.docker').component('registryImagesDatatable', {
  templateUrl: 'app/portainer/components/datatables/registries-images-datatable/registryImagesDatatable.html',
  controller: 'RegistryImagesDatatableController',
  bindings: {
    titleText: '@',
    titleIcon: '@',
    dataset: '<',
    tableKey: '@',
    orderBy: '@',
    reverseOrder: '<',
    removeAction: '<',
    downloadAction: '<',
    forceRemoveAction: '<'
  }
});
