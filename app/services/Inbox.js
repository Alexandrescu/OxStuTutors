'use strict';

angular.module('oxstututors')
  .factory('Inbox', ['Auth', 'Message', function (Auth, Message) {
    // After this I should have the user in currentUser
    Auth.currentUser();
    var Inbox = {};

    Inbox.messages = function() {
      return Message.all();
    };

    Inbox.sortByDate = function(messages) {
      function compare(a, b) {
        var momentA = moment(a.date);
        var momentB = moment(b.date);

        console.log(momentA);

        return momentB.diff(momentA);
      }

      return messages.sort(compare);
    };

    Inbox.groupInbox = function(inbox, userId) {
      if(!inbox) return {};

      var result = {};
      for(var i = 0; i < inbox.length; i++) {
        if(inbox[i].from._id == userId) {
          if(result[inbox[i].to.username]) {
            result[inbox[i].to.username].messages.push(inbox[i]);
          }
          else {
            result[inbox[i].to.username] = {
              receiver : inbox[i].to._id,
              messages : [inbox[i]]
            };
          }
        }
        else {
          if(result[inbox[i].from.username]){
            result[inbox[i].from.username].messages.push(inbox[i]);
          }
          else {
            result[inbox[i].from.username] = {
              receiver: inbox[i].from._id,
              messages: [inbox[i]]
            };
          }
        }
      }

      return result;
    };

    return Inbox;
  }]);
