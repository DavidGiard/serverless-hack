let azure = require('azure-storage');

// GetRatings
module.exports = function (context, req) {
  context.log('JavaScript HTTP trigger GetRatings function processed a request.');

  var ratingId = req.query.ratingId;
  // Retrieve rows from Table storage or CosmosDB
  let connectionString = "DefaultEndpointsProtocol=https;AccountName=dgserverless;AccountKey=kNiLoQ+Qsu2KNDWj0RshMYBteN5ZnZJYsly/QOxL/eoMMInEzBAnJFtTvXil3w9cjqq0MXKrgSOo6VmFeQb7tQ==;EndpointSuffix=core.windows.net";
  let tableService = azure.createTableService(connectionString);
  var query = new azure.TableQuery();
  // var query = new azure.TableQuery().where('PartitionKey eq ?', 'RATING');

  tableService.queryEntities('ratings', query, null, function (error, result, response) {
    if (!error) {
      var ratings = [];
      result.entries.forEach(function(entry) {
        let rating =  formatJson (entry);
        ratings.push(rating);
    });

      context.res = {
        // status: 200, /* Defaults to 200 */
        headers: { "Content-Type": "application/json" },
        body: ratings
      }
      context.done();
    }
  });
};

function formatJson (result){
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
