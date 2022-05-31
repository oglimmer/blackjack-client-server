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


import ApiClient from './ApiClient';
import BetGetResponse from './model/BetGetResponse';
import BetRequest from './model/BetRequest';
import BetResponse from './model/BetResponse';
import CreateDeckResponse from './model/CreateDeckResponse';
import CreateGameRequest from './model/CreateGameRequest';
import CreateGameResponse from './model/CreateGameResponse';
import CreatePlayerRequest from './model/CreatePlayerRequest';
import CreatePlayerResponse from './model/CreatePlayerResponse';
import GetPlayerResponse from './model/GetPlayerResponse';
import HighscoreElementResponse from './model/HighscoreElementResponse';
import HighscoreResponse from './model/HighscoreResponse';
import HitResponse from './model/HitResponse';
import InsuranceRequest from './model/InsuranceRequest';
import SplitResponse from './model/SplitResponse';
import StandResponse from './model/StandResponse';
import DefaultApi from './api/DefaultApi';


/**
* A_REST_API_to_play_Blackjack__Written_in_C_with_oat_.<br>
* The <code>index</code> module provides access to constructors for all the classes which comprise the public API.
* <p>
* An AMD (recommended!) or CommonJS application will generally do something equivalent to the following:
* <pre>
* var BlackjackGamingService = require('index'); // See note below*.
* var xxxSvc = new BlackjackGamingService.XxxApi(); // Allocate the API class we're going to use.
* var yyyModel = new BlackjackGamingService.Yyy(); // Construct a model instance.
* yyyModel.someProperty = 'someValue';
* ...
* var zzz = xxxSvc.doSomething(yyyModel); // Invoke the service.
* ...
* </pre>
* <em>*NOTE: For a top-level AMD script, use require(['index'], function(){...})
* and put the application logic within the callback function.</em>
* </p>
* <p>
* A non-AMD browser application (discouraged) might do something like this:
* <pre>
* var xxxSvc = new BlackjackGamingService.XxxApi(); // Allocate the API class we're going to use.
* var yyy = new BlackjackGamingService.Yyy(); // Construct a model instance.
* yyyModel.someProperty = 'someValue';
* ...
* var zzz = xxxSvc.doSomething(yyyModel); // Invoke the service.
* ...
* </pre>
* </p>
* @module index
* @version 1.0
*/
export {
    /**
     * The ApiClient constructor.
     * @property {module:ApiClient}
     */
    ApiClient,

    /**
     * The BetGetResponse model constructor.
     * @property {module:model/BetGetResponse}
     */
    BetGetResponse,

    /**
     * The BetRequest model constructor.
     * @property {module:model/BetRequest}
     */
    BetRequest,

    /**
     * The BetResponse model constructor.
     * @property {module:model/BetResponse}
     */
    BetResponse,

    /**
     * The CreateDeckResponse model constructor.
     * @property {module:model/CreateDeckResponse}
     */
    CreateDeckResponse,

    /**
     * The CreateGameRequest model constructor.
     * @property {module:model/CreateGameRequest}
     */
    CreateGameRequest,

    /**
     * The CreateGameResponse model constructor.
     * @property {module:model/CreateGameResponse}
     */
    CreateGameResponse,

    /**
     * The CreatePlayerRequest model constructor.
     * @property {module:model/CreatePlayerRequest}
     */
    CreatePlayerRequest,

    /**
     * The CreatePlayerResponse model constructor.
     * @property {module:model/CreatePlayerResponse}
     */
    CreatePlayerResponse,

    /**
     * The GetPlayerResponse model constructor.
     * @property {module:model/GetPlayerResponse}
     */
    GetPlayerResponse,

    /**
     * The HighscoreElementResponse model constructor.
     * @property {module:model/HighscoreElementResponse}
     */
    HighscoreElementResponse,

    /**
     * The HighscoreResponse model constructor.
     * @property {module:model/HighscoreResponse}
     */
    HighscoreResponse,

    /**
     * The HitResponse model constructor.
     * @property {module:model/HitResponse}
     */
    HitResponse,

    /**
     * The InsuranceRequest model constructor.
     * @property {module:model/InsuranceRequest}
     */
    InsuranceRequest,

    /**
     * The SplitResponse model constructor.
     * @property {module:model/SplitResponse}
     */
    SplitResponse,

    /**
     * The StandResponse model constructor.
     * @property {module:model/StandResponse}
     */
    StandResponse,

    /**
    * The DefaultApi service constructor.
    * @property {module:api/DefaultApi}
    */
    DefaultApi
};
