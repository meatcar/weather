Forecasts = new Mongo.Collection("forecasts");

if (Meteor.isClient) {
  Meteor.subscribe("forecast");

  Template.body.helpers({
    forecasts: function () {
      return Forecasts.find({}, {limit: 1});
    }
  })
}

if (Meteor.isServer) {
  Meteor.publish("forecast", function () {
    return Forecasts.find({}, {limit: 1})
  })

  Meteor.startup(function () {
    if (Forecasts.find({}).count() != 0) {
      return;
    }

    weatherjs.find({search: 'Toronto, ON, Canada', degreeType: 'C'},
      Meteor.bindEnvironment(function (err, result) {
        if (err) {
          throw err;
        }

        var data = result[0].current;
        data.formattedDate = moment(data.date, 'YYYY-MM-DD').format('dddd MMMM Do YYYY');

        console.log(data);
        Forecasts.insert(data);
      }));
  });
}
