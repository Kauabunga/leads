'use strict';

(function() {

class MainController {

  constructor($http) {
    this.$http = $http;

    this.submitFeedback = (form, feedback) => {

    }

  }

  $onInit() {

  }

}

angular.module('bbqApp')
  .component('main', {
    templateUrl: 'app/main/main.html',
    controller: MainController
  });

})();
