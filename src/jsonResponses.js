const users = {};

// Helper method sending JSON response with a body
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

// Helper method sending JSON response without a body
const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

// Returns the users object as a response
const getUsers = (request, response, isHead = false) => {
  // Check if a HEAD request was made, if so just send the status code
  if (isHead === true) {
    return respondJSONMeta(request, response, 200);
  }
  // Else, return the users object
  const responseJSON = {
    users,
  };

  return respondJSON(request, response, 200, responseJSON);
};

// Returns response based on new or updated user
const addUser = (request, response, body) => {
  const responseJSON = {
    message: 'Name and age are both required',
  };

  // Check if a name and age were sent
  if (!body.name || !body.age) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 201;

  // Check if the user already exists
  if (users[body.name]) {
    responseCode = 204;
  } else {
    users[body.name] = {};
  }

  users[body.name].name = body.name;
  users[body.name].age = body.age;

  // Created a new user
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSONMeta(request, response, responseCode);
};

// Returns response for if the requested page does not exist
const notFound = (request, response, isHead = false) => {
  if (isHead === true) {
    return respondJSONMeta(request, response, 404);
  }
  const responseJSON = {
    message: 'The page you are looking for was not found.',
  };

  return respondJSON(request, response, 404, responseJSON);
};

module.exports = {
  getUsers,
  addUser,
  notFound,
};
