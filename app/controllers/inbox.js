// This should be linked to the model in models/User
// TODO add typescript to angular

var ox = angular.module('oxstututors');

ox.controller('InboxCtrl', ['$scope', 'Message', 'Inbox', 'User', '$routeParams',
  function($scope, Message, Inbox, User, $routeParams) {
  var reloadReceiver;
  $scope.newMessageFlag = false;
  $scope.userBase = User.allUsers();

  $scope.filterUserBase = function() {
    return $scope.userBase.filter(function(user) {
      var lowercaseUserName = angular.lowercase(user.username);
      var lowercaseSearchText = angular.lowercase($scope.searchText);
      return (lowercaseUserName && lowercaseUserName.indexOf(lowercaseSearchText) == 0);
    })
  };

  $scope.sendMessage = function() {
    $scope.sendingMessage = true;
    if(!$scope.currentUser || !$scope.receiver || !$scope.message) {
      $scope.messageRequired = true;
      $scope.messageError = true;
      $scope.sendingMessage = false;
      return;
    }
    $scope.messageRequired = false;
    $scope.buttonDisable = true;
    $scope.messageDisable = true;

    var message = {
      from: $scope.currentUser,
      to: $scope.receiver,
      message: $scope.message
    };
    Message.save({}, message, function(){
      loadMessages();
      if($scope.newMessageFlag) {
        $scope.newMessageFlag = false;
        reloadReceiver = $scope.receiver.username;
      }
      $scope.message = "";
      $scope.sendingMessage = false;
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
    $scope.messageRequired = false;
    $scope.buttonDisable = false;
    $scope.messageDisable = false;
    reloadReceiver = receiver;

    Inbox.readMessages(receiverId, $scope.currentUser._id);

    $scope.newMessageFlag = false;
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
      delete $routeParams.receiver;
      delete $routeParams.receiverId;
    }
    else {
      $scope.receiver = {};
    }
    $scope.displayMessages = [];
    $scope.disableReceiver = false;
    $scope.newMessageFlag = true;
  };

  $scope.newMessage();
}]);
