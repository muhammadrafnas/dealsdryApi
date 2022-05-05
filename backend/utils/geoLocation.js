const fetch = require('node-fetch');
    async function getGeoLocation(lat, long){
        console.log(lat,long);
        if(lat ==undefined && !long ==undefined )
            return String();
        const geoRes = await fetch(process.env.GEO_LOCATION_API.replace('LAT', lat).replace('LNG', long));
        const { results } = await geoRes.json();
        return results[0].formatted_address;
    }

module.exports={
    geoLocation:getGeoLocation
}