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
 * The CreateDeckResponse model module.
 * @module model/CreateDeckResponse
 * @version 1.0
 */
class CreateDeckResponse {
    /**
     * Constructs a new <code>CreateDeckResponse</code>.
     * @alias module:model/CreateDeckResponse
     */
    constructor() { 
        
        CreateDeckResponse.initialize(this);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj) { 
    }

    /**
     * Constructs a <code>CreateDeckResponse</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/CreateDeckResponse} obj Optional instance to populate.
     * @return {module:model/CreateDeckResponse} The populated <code>CreateDeckResponse</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new CreateDeckResponse();

            if (data.hasOwnProperty('deckId')) {
                obj['deckId'] = ApiClient.convertToType(data['deckId'], 'Number');
            }
        }
        return obj;
    }


}

/**
 * @member {Number} deckId
 */
CreateDeckResponse.prototype['deckId'] = undefined;






export default CreateDeckResponse;

