//Cookie object that takes the document object that helds the cookie data
function Cookie(document){

    //Save document as a variable and make a getter for it
    this.document = document;
    this.getDocument = () => { return this.document; };

    //Check if a specific cookie is set
    this.checkCookie = function(cname){
        let cookie = this.getCookie(cname);
        return cookie !== "";
    };

    //Gets all cookies and returns them in an array
    this.getCookies = function(){

        let cookiesRaw = document.cookie;
        let cookiesRawArr = cookiesRaw.split(";");

        let cookies = [];

        for(let i = 0; i < cookiesRawArr.length; i++){
            let cookieData = cookiesRawArr[i];

            //We don't want to touch the expiration or path
            if(cookieData.replace(" ", "").startsWith("expires") || cookieData.replace(" ", "").startsWith("path")){
                continue;
            }

            //Getting the actual data of the cookie, remove whitespace
            let data = cookieData.split("=");
            let name = data[0].trim();
            let value = data[1].trim();

            //Adds the cookies to the array
            cookies.push({name: name, value: value});

        }

        return cookies;

    };

    //With this you can set a cookie's value
    //It takes the cookie name, value, and days until expiration
    this.setCookie = function(cname, cvalue, exdays){
        let expires = "";
        if(exdays != null){
            let d = new Date();
            d.setTime(d.getTime() + (exdays*24*60*60*1000));
            expires = "expires=" + d.toUTCString();
        } else {
			//If expiration date hasn't been set, set it to two months from today
			let d = new Date();
			d.setTime(d.getTime() + (61*24*60*60*1000));
			expires = "expires=" + d.toUTCString();
		}

        document.cookie = `${cname}=${cvalue};${expires};path=/`;
        //Return to the just updated cookie
        return document.cookie;
    };

    //With this you can get a cookie's data
    this.getCookie = function(cname){
        let document = this.document;
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(";");

        for(let i = 0; i < ca.length; i++){
            let c = ca[i];

            while(c.charAt(0) === " "){
                c = c.substring(1);
            }

            if(c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }

        }
        return "";
    };
}
