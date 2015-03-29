// This should be linked to the model in models/User
// TODO add typescript to angular

var ox = angular.module('oxstututors');

ox.controller('InboxCtrl', ['$scope', 'Message', 'Inbox', 'User', function($scope, Message, Inbox, User) {
  var reloadReceiver;
  $scope.userBase = User.allUsers();

  $scope.filterUserBase = function() {
    return $scope.userBase.filter(function(user) {
      var lowercaseUserName = angular.lowercase(user.username);
      var lowercaseSearchText = angular.lowercase($scope.searchText);
      return (lowercaseUserName && lowercaseUserName.indexOf(lowercaseSearchText) == 0);
    })
  };

  $scope.sendMessage = function() {
    var message = {
      from: $scope.currentUser,
      to: $scope.receiver,
      message: $scope.message
    };
    $scope.message = "";
    Message.save({}, message, function(){
      loadMessages();
    });
  };

  function loadMessages() {
    Message.all(function (inbox) {
      $scope.inbox = Inbox.groupInbox(inbox, $scope.currentUser._id);
      if(reloadReceiver) {
        console.log('reloading');
        $scope.showMessages(reloadReceiver, $scope.inbox[reloadReceiver].receiver, $scope.inbox[reloadReceiver].messages);
      }
    });
  }
  loadMessages();

  $scope.showMessages = function(receiver, receiverId, msgs) {
    reloadReceiver = receiver;

    $scope.displayMessages = Inbox.sortByDate(msgs);
    $scope.disableReceiver = true;
    $scope.receiver = {
      userId: receiverId,
      username: receiver
    };
  }
}]);
