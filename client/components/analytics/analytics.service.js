'use strict';

angular.module('bbqApp')
  .service('analyticsService', function ($window, $log, $analytics, $timeout) {

    var CATERGORY = 'Leads';
    var queueThrottleLength = 10;
    var throttleDuration = 1050;

    var queue = [];

    return {
      trackEvent: trackEvent
    };

    /**
     *
     * @param analyticsEvent
     * @param analyticsLabel
     */
    function trackEvent(analyticsEvent, analyticsLabel){

      var analyticsData = { category: CATERGORY };

      //We have to ensure that our labels are strings - if we pass a number off to Google then it cries.
      analyticsData.label = (analyticsLabel && analyticsLabel.toString()) || undefined;

      return addToEventQueue(analyticsEvent, analyticsData);
    }


    function addToEventQueue(event, data){

      var eventObject = {
        event: event,
        data: data
      };

      queue.push(eventObject);

      var queueLength = queue.length;

      if(queueLength < queueThrottleLength){
        sendAndCleanEventFromQueue(eventObject);
      }
      else {
        $timeout(function(){
          sendAndCleanEventFromQueue(eventObject);
        }, getEventQueueDelay(queueLength));
      }
    }

    function sendAndCleanEventFromQueue(eventObject){

      //Need to log this @ warning level so selenium can pick it up
      $log.debug('AnalyticsEvent: ' + eventObject.event + ' AnalyticsData: ' + JSON.stringify(eventObject.data));

      $analytics.eventTrack(eventObject.event, eventObject.data);

      $timeout(function(){
        var analyticsIndex = queue.indexOf(eventObject);
        if(analyticsIndex >= 0){
          queue.splice(analyticsIndex, 1);
        }
      }, throttleDuration);
    }

    function getEventQueueDelay(queueLength){
      return (queueLength - queueThrottleLength + 1) * throttleDuration;
    }


  });



