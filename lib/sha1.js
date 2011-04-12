var querystring = require('querystring');

module.exports = (function(){
    var my = {};

    var NONCE_CHARS = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n',
        'o','p','q','r','s','t','u','v','w','x','y','z','A','B',
        'C','D','E','F','G','H','I','J','K','L','M','N','O','P',
        'Q','R','S','T','U','V','W','X','Y','Z','0','1','2','3',
        '4','5','6','7','8','9'];

    my.getNonce = function(){
        var result = [];
        var char_pos;
        var nonce_chars_length = NONCE_CHARS.length;

        for (var i = 0; i < 32; i++) {
            char_pos= Math.floor(Math.random() * nonce_chars_length);
            result[i]=  NONCE_CHARS[char_pos];
        }
        return result.join('');
    };

    my.getTimestamp = function(){
        return Math.floor( (new Date()).getTime() / 1000 );
    };

    my.getDigest = function(key, data) {
        var hmac = require('crypto').createHmac('sha1',key);
        hmac.update(data);
        return hmac.digest('base64');
    };

    my.signRequest = function(method,url,key,secret,data){
        var signObject = {};
        var secretWithAmpersand = secret + "&";

        for(var dataKey in data){
            if(data.hasOwnProperty(dataKey)){
                signObject[dataKey] = data[dataKey];
            }
        }

        signObject['oauth_nonce'] = my.getNonce();
        signObject['oauth_timestamp'] = my.getTimestamp();
        signObject['oauth_consumer_key'] = key;
        signObject['oauth_version'] = '1.0';
        signObject['oauth_signature_method'] = 'HMAC-SHA1';
        var stringToSign = method + "&" + encodeURIComponent(url) + "&" + encodeURIComponent(my.sortIntoString(signObject));



        require('fs').writeFile('sign.xml', stringToSign, function (err) {
            if(err)callback(err,"");
            console.log('It\'s saved!');
        });

        var digest = my.getDigest(secretWithAmpersand, stringToSign);

        //Create object to post
        var postObject = {};
        for(var dataKey2 in signObject){
            if(signObject.hasOwnProperty(dataKey2)){
                postObject[dataKey2] = signObject[dataKey2];
            }
        }
        postObject['oauth_signature'] = digest;

        return postObject;
    };

    my.sortIntoString = function(objectToSort){
        //Collect the property names in the array
        var sortArray = [];
        for(var key in objectToSort){
            if(objectToSort.hasOwnProperty(key)){
                sortArray.push(key);
            }
        }

        //Sort the array
        sortArray = sortArray.sort();

        var outputString = "";
        for(var i = 0, len = sortArray.length; i < len; i++){
            outputString += sortArray[i] + "=" + encodeURIComponent(objectToSort[sortArray[i]])
                    .replace(/~/gm,'%7E')
                    .replace(/!/gm,'%21')
                    .replace(/\*/gm,'%2A')
                    .replace(/\(/gm,'%28')
                    .replace(/\)/gm,'%29');
            if(i < (len - 1))outputString += "&";
        }
        return outputString;
    };

    return my;
})();