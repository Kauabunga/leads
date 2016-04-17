'use strict';

angular.module('bbqApp')
  .service('feedbackService', function ($http, $log, $q, $timeout, $localStorage, Util, toastService, $interval) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    const FEEDBACK_API = `${Util.getBaseApiUrl()}api/feedbacks`;
    const FEEDBACK_STORE_KEY = 'feedbackStore';

    $timeout(() => {
      document.addEventListener('online', this.sync, false);
      document.addEventListener('resume', this.sync, false);

      this.sync();

      $interval(this.sync, 10000);

      if (window.addEventListener) {
        /*
         Works well in Firefox and Opera with the
         Work Offline option in the File menu.
         Pulling the ethernet cable doesn't seem to trigger it.
         Later Google Chrome and Safari seem to trigger it well
         */
        window.addEventListener('online', this.sync, false);
        //window.addEventListener("offline', isOffline, false);
      }
      else {
        /*
         Works in IE with the Work Offline option in the
         File menu and pulling the ethernet cable
         */
        document.body.ononline = this.sync;
        //document.body.onoffline = isOffline;
      }


    });


    this.sendFeedback = ({ feedback, contact, name }) => {
      let feedbackObject = { feedback, contact, name };
      return $http.post(FEEDBACK_API, feedbackObject);
    };

    this.storeFeedback = (feedback) => {
      let uuid = Util.uuid();

      //TODO encrypt
      this.getFeedbackStore()[uuid] = feedback;

      return $q.when(feedback);
    };

    this.sendEncryptedFeedback = () => {};

    this.encryptFeedback = (feedback) => {};

    this.ensureSync = () => {
      return this.sync().then(this.sync);
    };

    this.sync = () => {
      let feedbackStore = this.getFeedbackStore();
      $log.debug('Sync called');

      return this.isSyncing ? this.isSyncing : this.isSyncing = $q.all(_(feedbackStore)
        .map((feedback, id) => {
          return this.sendFeedback(feedback)
            .then(() => {
              return feedbackStore[id] = undefined;
            });
        }).value())
        .then((success) => {
          if(success && success.length > 0){
            $log.debug('Successfully synced feedback', success);
            toastService.toast('Synced feedback');
          }
          else {
            $log.debug('No feedback to sync', success);
          }
        })
        .finally(() => {
          this.isSyncing = undefined;
        });
    };


    this.getFeedbackStore = () => {
      return $localStorage[FEEDBACK_STORE_KEY] = $localStorage[FEEDBACK_STORE_KEY] || {};
    }

  });
