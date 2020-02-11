const axios = require('axios');
const Dev = require('../models/Dev')
const parseStringAsArray = require('../utils/parseStringAsArray')
const { findConnections, sendMessage } = require('../websocket')

// Métodos de um controller: index, show, store, update, destroy

module.exports = {

    async index(request, response)
    {
        const devs = await Dev.find();

        return response.json(devs);
    },

    async store(request, response)
    {
        const { github_username, techs, latitude, longitude } = request.body;

        let dev = await Dev.findOne({ github_username })

        if (!dev)
        {
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
        
            const { name = login, avatar_url, bio } = apiResponse.data;
        
            const techArray = parseStringAsArray(techs);
        
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude]
            };
        
            dev = await Dev.create({
                name,
                github_username,
                bio,
                avatar_url,
                techs: techArray,
                location
            });

            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techArray
            );

            sendMessage(sendSocketMessageTo, 'new-dev', dev);
            
            return response.json(dev);
        }

        else
        {
            return response.json({message: "Dev não encontrado"});
        }
    
        // return response.json({name: name, github_username: github_username, bio: bio, avatar_url: avatar_url, techs: techArray, location: location});
    },

    async update(request, response)
    {
        const { github_username } = request.params;

        const { name, bio, avatar_url, techs, latitude, longitude} = request.body;

        const dev = await Dev.findOne({ github_username });

        if (dev)
        {
            if (name) dev.name = name;

            if (bio) dev.bio = bio;

            if (avatar_url) dev.avatar_url = avatar_url;

            if (techs) dev.techs = parseStringAsArray(techs);

            if (latitude && longitude)
            {
                dev.location.coordinates[0] = longitude;
                dev.location.coordinates[1] = latitude;
            }
            
            await dev.save();
        }

        return response.json(dev);
    },

    async delete(request, response)
    {
        const {github_username} = request.params;

        let dev = await Dev.findOne({github_username});

        if (dev)
        {
            await dev.deleteOne({github_username});
        }

        return response.json(request.params);
    }
}