let azure = require('azure-storage');

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    var rating = JSON.parse(req.body);
    rating.timeStamp = new Date();
    rating.id = guid();

    // Insert into Table storage or CosmosDB
    insertRating(rating);

    //var res = JSON.stringify(rating); 
    context.res = {
        // status: 200, /* Defaults to 200 */
        headers: {"Content-Type": "application/json"},
        body: rating
    }

    context.done();
};

function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

function insertRating (rating) {
    rating.PartitionKey = "RATING";
    rating.RowKey = rating.id;

    let connectionString = "DefaultEndpointsProtocol=https;AccountName=dgserverless;AccountKey=kNiLoQ+Qsu2KNDWj0RshMYBteN5ZnZJYsly/QOxL/eoMMInEzBAnJFtTvXil3w9cjqq0MXKrgSOo6VmFeQb7tQ==;EndpointSuffix=core.windows.net";
    let tableService = azure.createTableService(connectionString);
    tableService.insertEntity('ratings', rating, (error, result, response) => {
        let res = {
            statusCode: error ? 400 : 204,
            body: null
        };
    });
};
