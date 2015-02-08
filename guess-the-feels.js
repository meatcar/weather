Forecasts = new Mongo.Collection("forecasts");

if (Meteor.isClient) {
  Session.setDefault('degreeType', 'C');
  Session.setDefault('location', '');

  var getCurPosition = Session.get('location') === '';
  window.navigator.geolocation.watchPosition(function (position) {
    if (getCurPosition) {
      Session.set('location', position.coords.latitude + ', ' + position.coords.longitude);
      getCurPosition = !getCurPosition;
    }
  });

  Meteor.subscribe("forecast", [Session.get('location'), Session.get('degreeType')]);

  Template.body.helpers({
    forecasts: function () {
      return Forecasts.find({}, {limit: 1});
    }
  });

  Template.forecast.helpers({
    degreeType: function () {return Session.get('degreeType');}
  });

  Template.forecast.events({
    "keydown .location": function (e) {
      if (e.key != 'Enter') {
        return;
      }

      Session.set('location', e.target.value);
    },
    "click .degree-type": function (e) {
      var flip = {'C': 'F', 'F': 'C'};
      Session.set('degreeType', flip[Session.get('degreeType')]);
    }
  });
}

if (Meteor.isServer) {
  Meteor.publish("forecast", function (location, degreeType) {
    if (!location) {
      return;
    }

    console.log(arguments);
    return Forecasts.find({}, {limit: 1});
  });

  Meteor.startup(function () {
    if (Forecasts.find().count() !== 0) {
      return;
    }

    var data = Meteor.wrapAsync(weatherjs.find, weatherjs)
                               ({search: 'Toronto, ON, Canada', degreeType: 'C'});

    data = data[0];
    data.current.formattedDate = moment(data.date, 'YYYY-MM-DD').format('dddd MMMM Do YYYY');

    Forecasts.insert(data);
  });
}
