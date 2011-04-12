describe("sha1", function(){
    var sha1 = require('echo/sha1.js');
    describe("HMACSHA1 function test 1", function(){
        var sigBase = 'POST&http%3A%2F%2Fapi.js-kit.com%2Fv1%2Fsubmit&content%3D%26oauth_consumer_key%3Ddev.butter%26oauth_nonce%3D0d71356110f68f63de72ee3643ab54cb%26oauth_signature_method%3DHMAC-SHA1%26oauth_timestamp%3D1296368939%26oauth_version%3D1.0';
        var key = 'du9i3hep129incy12&';
        var expectedResult = 'yBOOwR0XftIe6p85YOddsjEnAZw=';
        var actualResult;

        beforeEach(function(){
            actualResult = sha1.getDigest(key,sigBase);
        });

        it("should encode", function(){
            expect(actualResult).toEqual(expectedResult);
        });
    });

    describe("sortIntoString", function(){
        var result;

        beforeEach(function(){
            result = sha1.sortIntoString({e: 'e&ee', a: 'aa=a', c: "ccc%"});
        });

        it("should output the objects in a urlencoded string alphabetically", function(){
            expect(result).toEqual("a=aa%3Da&c=ccc%25&e=e%26ee");
        });
    });

    describe("signRequest function", function(){
        var data,
                result;

        beforeEach(function(){
            data = {content:"I am content"};
            spyOn(sha1,'getDigest').andReturn('digest');
            spyOn(sha1,'sortIntoString').andReturn('returnString ');
            spyOn(sha1,'getNonce').andReturn('nonce');
            spyOn(sha1,'getTimestamp').andReturn('time');
            result = sha1.signRequest("method","http://someurl.com/url","key","secret",data);
        });

        it("should call the getNonce function",function(){
            expect(sha1.getNonce).toHaveBeenCalled();
        });

        it("should call the getTimestamp function",function(){
            expect(sha1.getNonce).toHaveBeenCalled();
        });

        it("should call the sortIntoString function",function(){
            expect(sha1.sortIntoString).toHaveBeenCalledWith({content:"I am content", oauth_consumer_key: "key", oauth_nonce: "nonce", oauth_signature_method: "HMAC-SHA1", oauth_timestamp: "time", oauth_version: '1.0' });
        });

        it("should call the getDigest function", function(){
            expect(sha1.getDigest).toHaveBeenCalledWith("secret&","method&http%3A%2F%2Fsomeurl.com%2Furl&returnString%20");
        });

        it("should not modify the original data object", function(){
            expect(data).toEqual({content:"I am content"});
        });

        it("should return a new request object with the oauthsignature",function(){
            expect(result).toEqual({content:"I am content", oauth_consumer_key: "key", oauth_nonce: "nonce", oauth_signature_method: "HMAC-SHA1", oauth_timestamp: "time", oauth_version: '1.0', oauth_signature: 'digest' });
        });
    });

});
