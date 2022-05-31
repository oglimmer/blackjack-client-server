/**
 * Blackjack Gaming Service
 * A REST API to play Blackjack. Written in C++ with oat++.
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD.
    define(['expect.js', process.cwd()+'/src/index'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    factory(require('expect.js'), require(process.cwd()+'/src/index'));
  } else {
    // Browser globals (root is window)
    factory(root.expect, root.BlackjackGamingService);
  }
}(this, function(expect, BlackjackGamingService) {
  'use strict';

  var instance;

  beforeEach(function() {
    instance = new BlackjackGamingService.HitResponse();
  });

  var getProperty = function(object, getter, property) {
    // Use getter method if present; otherwise, get the property directly.
    if (typeof object[getter] === 'function')
      return object[getter]();
    else
      return object[property];
  }

  var setProperty = function(object, setter, property, value) {
    // Use setter method if present; otherwise, set the property directly.
    if (typeof object[setter] === 'function')
      object[setter](value);
    else
      object[property] = value;
  }

  describe('HitResponse', function() {
    it('should create an instance of HitResponse', function() {
      // uncomment below and update the code to test HitResponse
      //var instance = new BlackjackGamingService.HitResponse();
      //expect(instance).to.be.a(BlackjackGamingService.HitResponse);
    });

    it('should have the property drawnCard (base name: "drawnCard")', function() {
      // uncomment below and update the code to test the property drawnCard
      //var instance = new BlackjackGamingService.HitResponse();
      //expect(instance).to.be();
    });

    it('should have the property yourTotal (base name: "yourTotal")', function() {
      // uncomment below and update the code to test the property yourTotal
      //var instance = new BlackjackGamingService.HitResponse();
      //expect(instance).to.be();
    });

    it('should have the property followActions (base name: "followActions")', function() {
      // uncomment below and update the code to test the property followActions
      //var instance = new BlackjackGamingService.HitResponse();
      //expect(instance).to.be();
    });

  });

}));
