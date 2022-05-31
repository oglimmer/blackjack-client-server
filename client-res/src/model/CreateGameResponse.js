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

import ApiClient from '../ApiClient';

/**
 * The CreateGameResponse model module.
 * @module model/CreateGameResponse
 * @version 1.0
 */
class CreateGameResponse {
    /**
     * Constructs a new <code>CreateGameResponse</code>.
     * @alias module:model/CreateGameResponse
     */
    constructor() { 
        
        CreateGameResponse.initialize(this);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj) { 
    }

    /**
     * Constructs a <code>CreateGameResponse</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/CreateGameResponse} obj Optional instance to populate.
     * @return {module:model/CreateGameResponse} The populated <code>CreateGameResponse</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new CreateGameResponse();

            if (data.hasOwnProperty('gameId')) {
                obj['gameId'] = ApiClient.convertToType(data['gameId'], 'Number');
            }
        }
        return obj;
    }


}

/**
 * @member {Number} gameId
 */
CreateGameResponse.prototype['gameId'] = undefined;






export default CreateGameResponse;

