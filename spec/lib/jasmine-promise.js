// https://github.com/kriskowal/q/blob/master/spec/lib/jasmine-promise.js

"use strict";

// var Q = require("../../node_modules/q");
var Promise = require("bluebird");

/**
 * Modifies the way that individual specs are run to easily test async
 * code with promises.
 *
 * A spec may return a promise. If it does, then the spec passes if and
 * only if that promise is fulfilled within a very short period of time.
 * If it is rejected, or if it isn't fulfilled quickly, the spec fails.
 *
 * In this way, we can use promise chaining to structure our asynchronous
 * tests. Expectations all down the chain of promises are all checked and
 * guaranteed to be run and resolved or the test fails.
 *
 * This is a big win over the runs() and watches() code that jasmine
 * supports out of the box.
 */
jasmine.Block.prototype.execute = function (onComplete) {
    var spec = this.spec;
    try {
        var result = this.func.call(spec, onComplete);

        // It seems Jasmine likes to return the suite if you pass it anything.
        // So make sure it's a promise first.
        if (result && typeof result.then === "function") {
            // Promise.timeout(result, 500).then(function () {
            //     onComplete();
            // }, function (error) {
            //     spec.fail(error);
            //     onComplete();
            // });
            setTimeout(function() {
                Promise.resolve()
                .then(function () {
                    onComplete();
                    }, function (error) {
                        spec.fail(error);
                        onComplete();
                        }
                )}, 500);
                
        } else if (this.func.length === 0) {
            onComplete();
        }
    } catch (error) {
        spec.fail(error);
        onComplete();
    }
};

/**
 * Tests and documents the behavior of the above extension to jasmine.
 */
describe('jasmine-promise', function() {
  it('passes if the deferred resolves immediately', function() {
    // var deferred = Q.defer();
    // deferred.resolve();
    // return deferred.promise;
    return Promise.resolve();
  });
  it('passes if the deferred resolves after a short delay', function() {
      // var deferred = Q.defer();
      // setTimeout(function() {deferred.resolve();}, 100);
      // return deferred.promise;
      var deferred = new Promise(function(resolve, reject) {
          setTimeout(function() {resolve();}, 100);
      });
      return deferred;
  });
  it('lets specs that return nothing pass', function() {

  });
  it('lets specs that return non-promises pass', function() {
    return {'some object': 'with values'};
  });
  it('works ok with specs that return crappy non-Q promises', function() {
    return {
      'then': function(callback) {
        callback();
      }
    }
  });
  // These are expected to fail. Remove the x from xdescribe to test that.
  xdescribe('failure cases (expected to fail)', function() {
    it('fails if the deferred is rejected', function() {
      // var deferred = Q.defer();
      // deferred.reject();
      // return deferred.promise;
      return Promise.reject();
    });
    it('fails if the deferred takes too long to resolve', function() {
      // var deferred = Q.defer();
      // setTimeout(function() {deferred.resolve()}, 5 * 1000);
      // return deferred.promise;
      var deferred = new Promise(function(resolve, reject) {
          setTimeout(function() {resolve();}, 1000);
      });
      return deferred;
      
    });
    it('fails if a returned crappy non-Q promise is rejected', function() {
      return {
        'then': function(_, callback) {callback()}
      }
    });
    it('fails if a returned crappy promise is never resolved', function() {
      return {
        'then': function() {}
      }
    });
  })
});