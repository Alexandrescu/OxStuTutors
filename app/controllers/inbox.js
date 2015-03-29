// This should be linked to the model in models/User
// TODO add typescript to angular

var ox = angular.module('oxstututors');

ox.controller('InboxCtrl', ['$scope', 'Message', 'Inbox', 'User', function($scope, Message, Inbox, User) {
  $scope.userBase = User.allUsers();

  $scope.filterUserBase = function() {
    return $scope.userBase.filter(function(user) {
      var lowercaseUserName = angular.lowercase(user.username);
      var lowercaseSearchText = angular.lowercase($scope.searchText);
      return (lowercaseUserName && lowercaseUserName.indexOf(lowercaseSearchText) == 0);
    })
  };

  $scope.sendMessage = function() {
    console.log($scope.receiver);
    var message = {
      from: $scope.currentUser,
      to: $scope.receiver,
      message: $scope.message
    };
    Message.save(message);
  };

  Message.all(function(inbox) {
    $scope.inbox = Inbox.groupInbox(inbox, $scope.currentUser._id);
  });

  $scope.showMessages = function(receiver, receiverId, msgs) {
    $scope.displayMessages = Inbox.sortByDate(msgs);
    $scope.disableReceiver = true;
    $scope.receiver = {
      userId: receiverId,
      username: receiver
    };
  }
}]);
