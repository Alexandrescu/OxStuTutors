'use strict';

angular.module('oxstututors')
  .factory('Inbox', ['Message', '$rootScope', function (Message, $rootScope) {
    // After this I should have the user in currentUser
    var Inbox = {};

    Inbox.sortByDate = function(messages) {
      function compare(a, b) {
        var momentA = moment(a.date);
        var momentB = moment(b.date);

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
              unread: 0,
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
              unread: 0,
              receiver: inbox[i].from._id,
              messages: [inbox[i]]
            };
          }
          if(!inbox[i].read) {
            result[inbox[i].from.username].unread += 1;
          }
        }
      }

      return result;
    };

    Inbox.readMessages = function(fromId, toId, callback) {
      var cb = callback || angular.noop;
      Message.read({fromId: fromId, toId: toId}, function(res) {
        $rootScope.unread -= res.read;
        cb(res.read);
      });
    };

    Inbox.updateUnread = function() {
      Message.unread({to: $rootScope.currentUser._id}, function(counter) {
        $rootScope.unread = counter.unread;
      });
    };

    return Inbox;
  }]);
