"use-strict";

const request = "http://archimed-gestion.com/";

class RequestSESS {
    async sess(){
        try{
            const req = new Request(`${request}get-session`);
            console.log(req);

            //get request
            const response = await fetch(req);
            const data = await response.json();

            console.log(data);
            return data;
        }
        catch(error){
            console.log(error.message);
            return false;
        }
    }
}   


export { RequestSESS };