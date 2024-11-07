const data = {
    crypto: globalThis.crypto,

    arrayBufferToBase64: (buffer) => {
        try{
            let binary = '';
            const bytes = new Uint8Array(buffer),
                len = bytes.byteLength;
            for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
            return btoa(binary);
        }catch(err){
            console.log('Conversion Failed. Error:\n', err);
            return false;
        }
    },

    base64ToArrayBuffer: (base64) => {
        try { 
            const binaryString = atob(base64);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
            return bytes.buffer;
        } catch(err) {
            console.log('Conversion Failed. Error:\n', err);
            return false;
        }
    },

    genKeyPair: async () => await data.crypto.subtle.generateKey({ name: "RSA-OAEP", modulusLength: 4096, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" }, true, ["encrypt", "decrypt"]).catch((err) => {
        console.log("RSA Key Pair Generation Failed. Error:\n", err);
        return false;
    }),

    //expType = 1 for JWK
    exportKey: async (key, expType = 0) => {
        const keyExp = await data.crypto.subtle.exportKey((expType === 0)? (key.type === 'private')? 'pkcs8' : 'spki' : 'jwk', key).catch((err) => {
            console.log('Failed To Export. Error:\n', err);
            return false;
        })
        return (expType === 0)? data.arrayBufferToBase64(keyExp) : keyExp;
    },

    // type = 0 for pvK
    importKey: async (key, type) => await data.crypto.subtle.importKey((typeof(key) === 'string')? (type === 0)? 'pkcs8' : 'spki' : 'jwk', (typeof(key) === 'string')? data.base64ToArrayBuffer(key) : key, {name:"RSA-OAEP", hash: "SHA-256"}, true, (type === 0)? ['decrypt'] : ['encrypt']).catch((err) => {
        console.log('Failed To Import. Error:\n', err);
        return false;
    }),

    //type = 0 for private key
    convertToPEM: async (key, type = 0) => {
        try {
            if(typeof(key) === 'object') key = await data.exportKey(await data.importKey(key, type));
            if(type === 0) return `-----BEGIN PRIVATE KEY-----\n${key.match(/.{1,64}/g).join('\n')}\n-----END PRIVATE KEY-----`;
            else return `-----BEGIN PUBLIC KEY-----\n${key.match(/.{1,64}/g).join('\n')}\n-----END PUBLIC KEY-----`;    
        } catch(err) {
            console.log('Failed To Convert To PEM. Error:\n', err);
            return false;
        }
    },

    encodeJSON: (data) => { try { return new TextEncoder().encode(JSON.stringify(data))}catch(err) {
        console.log('Failed To Encode. Error:\n', err);
        return false;
    }},

    encryptData: async (key, encodedData) => await data.crypto.subtle.encrypt({ name: "RSA-OAEP" }, key, encodedData).catch((err) => {
        console.log('Failed To Encrypt Encoded Data. Error:\n', err);
        return false;
    }),    

    encrypt: async (key, rawData) => { try { return data.arrayBufferToBase64(await data.encryptData(await data.importKey(key, 1), data.encodeJSON(rawData)))} catch(err) {
        console.log('Operation Failed. Error\n', err);
        return false;
    }},

    decodeJSON: (encodedData) => { try { return JSON.parse(new TextDecoder().decode(encodedData)) } catch(err) {
        console.log('Failed To Decode. Error:\n', err);
        return false;
    }},

    decryptData: async (key, buffer) => await data.crypto.subtle.decrypt({ name: "RSA-OAEP" }, key, buffer).catch((err) => {
        console.log('Failed To Complete Command. Error:\n', err);
        return false;
    }),

    decrypt: async (key, encryptedData) => { try { return data.decodeJSON(await data.decryptData(await data.importKey(key, 0), data.base64ToArrayBuffer(encryptedData))) } catch(err) {
        console.log('Operation Failed. Error\n', err);
        return false;
    }}

}

export default data

// const data = {
//     crypto: ,

//     decodeJSON: (encodedData) => { try { return JSON.parse(new TextDecoder().decode(encodedData)) } catch(err) {
//         console.log('Failed To Decode Data. Error:\n', err);
//         return false;
//     }},
    
//     base64ToArrayBuffer: (base64) => {
//         try { 
//             const binaryString = atob(base64);
//             const len = binaryString.length;
//             const bytes = new Uint8Array(len);
//             for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
//             return bytes.buffer;
//         } catch(err) {
//             console.log('Conversion Failed. Error:\n', err);
//             return false;
//         }
//     },

//     arrayBufferToBase64: (buffer) => {
//         try{
//             let binary = '';
//             const bytes = new Uint8Array(buffer),
//                 len = bytes.byteLength;
//             for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
//             return btoa(binary);
//         }catch(err){
//             console.log('Conversion Failed. Error:\n', err);
//             return false;
//         }
//     },
    
//     decryptData: async (key, buffer) => { try { return await data.crypto.subtle.decrypt({ name: "RSA-OAEP" }, await data.crypto.subtle.importKey("jwk", key, {name:"RSA-OAEP", hash: "SHA-256"}, true, ["decrypt"]), buffer) } catch(err) {
//         console.log('Conversion Failed. Error:\n', err);
//         return false;
//     }},

//     generateKeyPair_JWK: async () => await data.crypto.subtle.generateKey({ name: "RSA-OAEP", modulusLength: 4096, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" }, true, ["encrypt", "decrypt"]).then(async ({publicKey, privateKey}) => {return {publicKeyJWK: await data.crypto.subtle.exportKey("jwk", publicKey), privateKeyJWK: await data.crypto.subtle.exportKey("jwk", privateKey) }}).catch((err) => {
//         console.log("RSA Key Pair Generation Failed. Error:\n", err);
//         return false;
//     }),

//     importPvtKey_JWK: async (key) => await data.crypto.subtle.importKey("jwk", key, {name:"RSA-OAEP", hash: "SHA-256"}, true, ['decrypt']).catch((err) => {
//         console.log('Failed To Import Private Key (JWK). Error:\n', err);
//         return false;
//     }),

//     importPubKey_JWK: async (key) => await data.crypto.subtle.importKey("jwk", key, {name:"RSA-OAEP", hash: "SHA-256"}, true, ['encrypt']).catch((err) => {
//         console.log('Failed To Import Private Key (JWK). Error:\n', err);
//         return false;
//     }),

//     exportKey_PKCS8: async (key) => await data.crypto.subtle.exportKey("pkcs8", key).catch((err) => {
//         console.log('Failed To Export Key To PKCS8 Format. Error:\n', err);
//         return false;
//     }),

//     exportKey_SPKI: async (key) => await data.crypto.subtle.exportKey("spki", key).catch((err) => {
//         console.log('Failed To Export Key To PKCS8 Format. Error:\n', err);
//         return false;
//     }),

//     convertPvtJWKtoPEM: async (keyJWK) => {
//         const cryptoKey = await data.importPvtKey_JWK(keyJWK);
//         const keyPKSC8 = await data.exportKey_PKCS8(cryptoKey);
//         const bse64 = data.arrayBufferToBase64(keyPKSC8);
//         const keyPEM = `-----BEGIN PRIVATE KEY-----\n${bse64.match(/.{1,64}/g).join('\n')}\n-----END PRIVATE KEY-----`;
//         return keyPEM;
//     },

//     convertPubJWKtoPEM: async (keyJWK) => {
//         const cryptoKey = await data.importPubKey_JWK(keyJWK);
//         const keySPKI = await data.exportKey_SPKI(cryptoKey);
//         const bse64 = data.arrayBufferToBase64(keySPKI);
//         const keyPEM = `-----BEGIN PUBLIC KEY-----\n${bse64.match(/.{1,64}/g).join('\n')}\n-----END PUBLIC KEY-----`;
//         return keyPEM;
//     }
// }

// export default data