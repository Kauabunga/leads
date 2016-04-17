'use strict';

angular.module('bbqApp')
  .service('feedbackService', function ($http, $log, $q, $timeout, $localStorage, Util, toastService) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    const FEEDBACK_API = `${Util.getBaseApiUrl()}api/feedbacks`;
    const FEEDBACK_STORE_KEY = 'feedbackStore';

    $timeout(() => {
      document.addEventListener('online', this.sync, false);
      document.addEventListener('resume', this.sync, false);
      this.sync();
    });

    this.sendFeedback = ({ feedback, contact, name }) => {
      return $http.post(FEEDBACK_API, { feedback, contact, name });
    };

    this.storeFeedback = (feedback) => {
      let uuid = Util.uuid();

      //TODO encrypt
      this.getFeedbackStore()[uuid] = feedback;

      return $q.when(feedback);
    };

    this.sendEncryptedFeedback = () => {};

    this.encryptFeedback = (feedback) => {};

    this.sync = () => {
      let feedbackStore = this.getFeedbackStore();
      return $q.all(_(feedbackStore).map((feedback, id) => {
        return this.sendFeedback(feedback)
          .then(() => {
            return feedbackStore[id] = undefined;
          });
      }).value())
        .then((success) => {
          $log.debug('Successfully synced feedback', success);
          toastService.toast('Synced feedback');
        });
    };


    this.getFeedbackStore = () => {
      return $localStorage[FEEDBACK_STORE_KEY] = $localStorage[FEEDBACK_STORE_KEY] || {};
    }

  });
