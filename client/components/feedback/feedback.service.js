'use strict';

angular.module('bbqApp')
  .service('feedbackService', function ($http, $log, $q, $timeout, $localStorage, Util, toastService, $interval) {


    const FEEDBACK_API = `${Util.getBaseApiUrl()}api/leads`;
    const FEEDBACK_ENCRYPTED_API = `${Util.getBaseApiUrl()}api/leads/encrypted`;
    const FEEDBACK_PUBLIC_KEY_API = `${Util.getBaseApiUrl()}api/leads/public`;
    const FEEDBACK_STORE_KEY = 'feedbackStore';
    const FEEDBACK_PUBLIC_KEY_KEY = 'feedbackPublicKey';

    $timeout(() => {
      document.addEventListener('online', this.sync, false);
      document.addEventListener('resume', this.sync, false);

      this.sync();
      this.getPublicKey();

      $interval(this.sync, 10000);

      if (window.addEventListener) {
        window.addEventListener('online', this.sync, false);
      }
      else {
        document.body.ononline = this.sync;
      }

    });


    this.encryptAndSendFeedback = (feedbackObject) => {

      return this.encryptFeedback(feedbackObject)
        .then(encryptedFeedback => {
          return this.sendEncryptedFeedback(encryptedFeedback)
        });
    };

    this.sendFeedback = feedbackObject => {
      return $http.post(FEEDBACK_API, feedbackObject);
    };

    this.storeFeedback = (feedbackObject) => {
      let uuid = Util.uuid();

      return this.encryptFeedback(feedbackObject)
        .then(encryptedFeedback => {
          this.getFeedbackStore()[uuid] = encryptedFeedback;
          return $q.when(feedbackObject);
        })
        .catch(err => {
          $log.debug('Error trying to encrypt feedback', err);
          this.getFeedbackStore()[uuid] = feedbackObject;
          return $q.when(feedbackObject);
        });
    };

    this.sendEncryptedFeedback = ({ encrypted }) => {
      let encryptedFeedbackObject = { encrypted };
      return $http.post(FEEDBACK_ENCRYPTED_API, encryptedFeedbackObject);
    };

    this.encryptFeedback = (feedback) => {
      return this.getPublicKey()
        .then(publicKey => {
          let encryptedFeedback = { encrypted: cryptico.encrypt(JSON.stringify(feedback), publicKey).cipher };
          $log.debug('encryptedFeedback', encryptedFeedback);
          return encryptedFeedback;
        });
    };

    this.ensureSync = () => {
      return this.sync().then(this.sync);
    };

    this.getPublicKey = () => {
      return $localStorage[FEEDBACK_PUBLIC_KEY_KEY] ? $q.when($localStorage[FEEDBACK_PUBLIC_KEY_KEY]) :
        $http.get(FEEDBACK_PUBLIC_KEY_API)
          .then(response => {
            return $localStorage[FEEDBACK_PUBLIC_KEY_KEY] = response.data.publicKey;
          });
    };

    this.sync = () => {
      let feedbackStore = this.getFeedbackStore();

      $log.debug('Sync called');

      return this.isSyncing ? this.isSyncing : this.isSyncing = $q.all(_(feedbackStore)
        .map((feedback, id) => {

          if(feedback.encrypted){
            $log.debug('Found encrypted feedback', feedback);
            return this.sendEncryptedFeedback(feedback)
              .then(() => {
                return feedbackStore[id] = undefined;
              });
          }
          else {
            $log.debug('Found unencrypted feedback');
            return this.sendFeedback(feedback)
              .then(() => {
                return feedbackStore[id] = undefined;
              });
          }

        }).value())
        .then((success) => {
          if(success && success.length > 0){
            $log.debug('Successfully synced feedback', success);
            toastService.toast(`Sent ${success.length} feedback`);
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
    };


  });
