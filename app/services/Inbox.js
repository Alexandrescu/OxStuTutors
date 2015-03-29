'use strict';

angular.module('oxstututors')
  .factory('Inbox', ['Message', '$rootScope', function (Message, $rootScope) {
    // After this I should have the user in currentUser
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

    Inbox.readMessages = function(fromId, toId) {
      Message.read({fromId: fromId, toId: toId}, function(res) {
        $rootScope.unread -= res.read;
      });

    };

    Inbox.updateUnread = function() {
      console.log('doing this');
      Message.unread({to: $rootScope.currentUser._id}, function(counter) {
        console.log(counter);
        $rootScope.unread = counter.unread;
      });
    };

    return Inbox;
  }]);
