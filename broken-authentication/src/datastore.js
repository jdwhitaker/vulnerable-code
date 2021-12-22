users = { 
    'Luke': {
		password: 'turtles1',
        admin: true,
        favoriteColor: 'blue',
        favoriteFood: 'pizza'
    },  
    'John': {
		password: 'turtles2',
        admin: false,
        favoriteColor: 'green',
        favoriteFood: 'macaroni'
    }   
}


function getUserData(userId){
	return users[userId];
}

function setUserData(userId, data){
	if(!(userId in users)){
		return false;
	}
	users[userId] = data;
	return true;
}

module.exports = {
	getUserData: getUserData, 
	setUserData: setUserData
}
