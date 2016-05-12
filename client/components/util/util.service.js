'use strict';

(function() {

/**
 * The Util service is for thin, globally reusable, utility functions
 */
function UtilService($window, appConfig) {
  var Util = {
    /**
     * Return a callback or noop function
     *
     * @param  {Function|*} cb - a 'potential' function
     * @return {Function}
     */
    safeCb(cb) {
      return (angular.isFunction(cb)) ? cb : angular.noop;
    },


    getBaseApiUrl(){
      let hostname = $window.location.hostname;
      return hostname !== '' || hostname === 'localhost' ?
          '/' : appConfig.baseApiUrl;
    },

    /**
     * Parse a given url with the use of an anchor element
     *
     * @param  {String} url - the url to parse
     * @return {Object}     - the parsed url, anchor element
     */
    urlParse(url) {
      var a = document.createElement('a');
      a.href = url;

      // Special treatment for IE, see http://stackoverflow.com/a/13405933 for details
      if (a.host === '') {
        a.href = a.href;
      }

      return a;
    },

    isHerokuOrigin(url){

      let herokuHost = appConfig.baseApiUrl.replace('https://', '').replace('http://', '');

      return url.indexOf(herokuHost) !== -1;
    },

    uuid(){

      let id = '', i;

      for(i = 0; i < 36; i++)
      {
        if (i === 14) {
          id += '4';
        }
        else if (i === 19) {
          id += '89ab'.charAt(getRandom(4));
        }
        else if(i === 8 || i === 13 || i === 18 || i === 23) {
          id += '-';
        }
        else
        {
          id += '0123456789abcdef'.charAt(getRandom(16));
        }
      }
      return id;

    },

    /**
     * Test whether or not a given url is same origin
     *
     * @param  {String}           url       - url to test
     * @param  {String|String[]}  [origins] - additional origins to test against
     * @return {Boolean}                    - true if url is same origin
     */
    isSameOrigin(url, origins) {
      url = Util.urlParse(url);
      origins = (origins && [].concat(origins)) || [];
      origins = origins.map(Util.urlParse);
      origins.push($window.location);
      origins = origins.filter(function(o) {
        return url.hostname === o.hostname &&
          url.port === o.port &&
          url.protocol === o.protocol;
      });
      return (origins.length >= 1);
    }
  };

  function getRandom(max) {
    return Math.random() * max;
  }

  return Util;
}

angular.module('bbqApp.util')
  .factory('Util', UtilService);

})();
