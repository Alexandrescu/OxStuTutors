// This should be linked to the model in models/User
// TODO add typescript to angular

var ox = angular.module('oxstututors');

ox.controller('InboxCtrl', ['$scope', 'Message', 'Inbox', 'User', '$routeParams',
  function($scope, Message, Inbox, User, $routeParams) {
  var reloadReceiver, newMessage = false;
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
    Message.save({}, message, function(){
      loadMessages();
      if(newMessage) {
        newMessage = false;
        reloadReceiver = $scope.receiver.username;
      }
      $scope.message = "";
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

    Inbox.readMessages(receiverId, $scope.currentUser._id);

    $scope.displayMessages = Inbox.sortByDate(msgs);
    $scope.disableReceiver = true;
    $scope.receiver = {
      userId: receiverId,
      username: receiver
    };
  };

  $scope.newMessage = function() {
    console.log($routeParams);
    if($routeParams.receiver && $routeParams.receiverId) {
      $scope.receiver = {
        userId: $routeParams.receiverId,
        username: $routeParams.receiver
      }
    }
    else {
      $scope.receiver = {};
    }
    $scope.displayMessages = [];
    $scope.disableReceiver = false;
    newMessage = true;
  };

  $scope.newMessage();
}]);
