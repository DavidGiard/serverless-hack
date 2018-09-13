let azure = require('azure-storage');

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    var ratingId = req.query.ratingId;
    // Retrieve row from Table storage or CosmosDB
    var rating = null;
    let connectionString = "DefaultEndpointsProtocol=https;AccountName=dgserverless;AccountKey=kNiLoQ+Qsu2KNDWj0RshMYBteN5ZnZJYsly/QOxL/eoMMInEzBAnJFtTvXil3w9cjqq0MXKrgSOo6VmFeQb7tQ==;EndpointSuffix=core.windows.net";
    let tableService = azure.createTableService(connectionString);
    tableService.retrieveEntity('ratings', "RATING", ratingId, function (error, result, response) {
        if (!error) {
            rating = formatJson(result);
            context.res = {
                // status: 200, /* Defaults to 200 */
                headers: { "Content-Type": "application/json" },
                body: rating
            }
            context.done();
        }
        else{
            var errorMsg = "There was a problem connecting to the database";
            if (error.statusCode === 404){
                errorMsg = "Rating ID does not exist"
            }
            context.res = {
                // status: 200, /* Defaults to 200 */
                status: error.statusCode,
                headers: { "Content-Type": "application/json" },
                body: {"errorMsg": errorMsg}
            }
            context.done();
        }
    });

};

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function formatJson(result) {
    var ratingJson = JSON.parse("{}");
    ratingJson.id = result.id._;
    ratingJson.userId = result.userId._;
    ratingJson.productId = result.productId._;
    ratingJson.timestamp = result.timeStamp._;
    ratingJson.locationName = result.locationName._;
    ratingJson.rating = result.rating._;
    ratingJson.userNotes = result.userNotes._;

    return ratingJson;
}
