'use strict';

const axios = require('axios');
var generateError = require('./generateError');
const Profile = require('./Profile')

function ProfilesManager() {

    /**
     * Profiles data structure
     * Organized as a dictionary in the form (character_id -> profile )
     * 
     */
    this.profiles = {
    };
}

/**
 * Add a new profile to the dictionary
 * 
 * @param {string} code The code given by the character's owner
 * @param {string} encodedClientIdSecret Base 64 encoded version of {client_id}:{client_secret} 
 * 
 * @return {Object} An accounts object that be used to make requests
 */
ProfilesManager.prototype.generateProfileFromCode = function generateProfileFromCode(code, encodedClientIdSecret) {

    const url = "https://login.eveonline.com/oauth/token"

    const tokenRequestData = {
        "grant_type": "authorization_code",
        "code": code
    }

    const tokenRequestHeaders = {
        "Content-Type": "application/json",
        "Authorization": "Basic " + encodedClientIdSecret
    }

    return new Promise((resolve, reject) => {

        var profile = {}

        const SSOAxiosPromise = axios
            .post(url, tokenRequestData, { headers: tokenRequestHeaders })

        SSOAxiosPromise
            .then((res) => {
                // On success, write in access_token and refresh_token for character.
                profile['access_token'] = res.data['access_token'];
                profile['refresh_token'] = res.data['refresh_token'];
                profile['token_type'] = res.data['token_type'];

                // Get character name and ID for next verification step
                const characterIDRequestUrl = "https://login.eveonline.com/oauth/verify";
                const characterIDRequestHeaders = {
                    Authorization: "Bearer " + profile['access_token']
                }

                const CharacterIDRequestPromise = axios
                    .get(characterIDRequestUrl, { headers: characterIDRequestHeaders });
                
                CharacterIDRequestPromise
                    .then((res) => {
                        profile['character_id'] = res.data['CharacterID'];
                        profile['character_name'] = res.data['CharacterName'];
                        profile['token_expires'] = res.data['ExpiresOn']
                        // profile creation complete
                        // push profile to object properties
                        var profileObject = new Profile(profile)
                        this.profiles[profile['character_id']] = profileObject;
                        resolve(profileObject)
                    })
                    .catch((err) => {
                        reject(generateError(err, err.name))
                    })


            })
            .catch((err) => {
                reject(err)
            })




    })
}

ProfilesManager.prototype.toString = function toString() {
    console.log(this.profiles)
    return JSON.stringify(this.profiles)
}

module.exports = ProfilesManager;