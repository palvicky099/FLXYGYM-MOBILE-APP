app.controller('placenearbyCtrl', function ($scope, $state, $ionicPopup, $cordovaSQLite,$rootScope, dataService, $ionicLoading) {
    $scope.$on('$ionicView.enter', function () {
        $scope.dropDownClick = function (c) {
            $ionicLoading.show({
                noBackdrop: false,
                template: '<p class="item"><ion-spinner icon="lines"/></p><p class="item flxy-button">Please Wait...</p>'
            });
         //   $scope.listArray = [];
            if (c.loc_id == '0')
            {
                var queryS = "select * from gymCenter";
            }
            else {
                var queryS = "select * from gymCenter where loc_id = '" + c.loc_id + "'";
            }
            loadGymCenter(queryS);
        }
      $scope.options = ['Load', 'Sync', 'Settings'];
      loadGymCenter("select * from gymCenter");
  function loadGymCenter(query) {
      var listViewQuery = query;
      $cordovaSQLite.execute(db, listViewQuery, []).then(function (result) {
          if (result.rows.length > 0) {
              var itemsColl = [];
              for (var i = 0; i < result.rows.length; i++) {
                  itemsColl[i] = result.rows.item(i);
              };
              $scope.items = JSON.stringify(itemsColl);
              var jsonData = JSON.parse($scope.items);
              $scope.listArray = jsonData;
              setTimeout(function () {
                  $ionicLoading.hide();
              }, 2000);
             
          } else {
              setTimeout(function () {
                  $ionicLoading.hide();
              }, 2000);
              var alertPopup = $ionicPopup.alert({
                  title: 'Alert',
                  template: '<div style="text-align:center; font-size:22px">No gym center available.</div>'
              });
              alertPopup.then(function (res) {
              });
          }
      }, function (err) {
      });
  }

  var placeDropDownQuery = "select distinct loc_id, location from gymCenter";
  $cordovaSQLite.execute(db, placeDropDownQuery, []).then(function (result) {
      if (result.rows.length > 0) {
          var itemsColl = [];
          itemsColl[0] = { loc_id: "0", location: "All" };
          for (var i = 0; i < result.rows.length; i++) {
              itemsColl[i + 1] = result.rows.item(i);
          };
          $scope.items = JSON.stringify(itemsColl);
          var jsonData = JSON.parse($scope.items);
          $scope.Locations = jsonData;
          $scope.locationDetails = {
              location: $scope.Locations,
              SelectedLocation: { loc_id: "0", location: "All" }
          };
      }
      else {
          $scope.Locations = [{ loc_id: "0", location: "All" }];
          $scope.locationDetails = {
              location: $scope.Locations,
              SelectedLocation: { loc_id: "0", location: "All" }
          };
      }
  }, function (err) {
  });


  $scope.goDetail = function (l) {
      dataService.getCenterDetails(l.center_id).then(function (result) {
          console.log(result)
          $ionicLoading.show({
              noBackdrop: false,
              template: '<p class="item"><ion-spinner icon="lines"/></p><p class="item flxy-button">Please Wait...</p>',
              content: 'Loading',
              animation: 'fade-in',
              showBackdrop: true,
              duration: 3000,
              maxWidth: 200,
              showDelay: 0
          });
          window.localStorage.setItem("GYMDetails", JSON.stringify(result.data.response));
          window.localStorage.setItem("goDetailsFrom", "placenearby");
          $state.go('detail');
      }, function (err) {
          $ionicLoading.show({
              noBackdrop: false,
              template: '<p class="item"><ion-spinner icon="lines"/></p><p class="item flxy-button">No Details Available</p>',
              content: 'Loading',
              animation: 'fade-in',
              showBackdrop: true,
              duration: 3000,
              maxWidth: 200,
              showDelay: 0
          });
      });
      window.localStorage.setItem("itemDetails", JSON.stringify(l));

  }
    })
    $scope.visible = {};
    $scope.reserve = function (l) {
        var popup = $ionicPopup.show({
            'templateUrl': 'selectBookingType.html',
            'title': 'Select Plan',
            'scope': $scope,
            'buttons': [
                        {
                            'text': 'Cancel'
                        },
                        {
                            'text': 'Save',
                            'onTap': function (event) {
                                return $scope.visible.status;
                            }
                        }
            ]
        });
        popup.then(function (result) {
            loadymDetails(l.center_id)
            if (result == "0") {
                $rootScope.plan = result;
                $state.go('bookDate');
            }
            if (result == "1") {
                $rootScope.plan = result;
                $state.go('bookDate');
            }
            if (result == "2") {
                $rootScope.plan = result;
                $state.go('bookDate');
            }
        });
    }
    $scope.goDetail = function (l) {
        loadymDetails(l.center_id);
        window.localStorage.setItem("itemDetails", JSON.stringify(l));
        $state.go('detail')
    }
    function loadymDetails(centerId) {
        dataService.getCenterDetails(centerId).then(function (result) {
            $ionicLoading.show({
                noBackdrop: false,
                template: '<p class="item"><ion-spinner icon="lines"/></p><p class="item flxy-button">Please Wait...</p>',
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                duration: 3000,
                maxWidth: 200,
                showDelay: 0
            });
            window.localStorage.setItem("GYMDetails", JSON.stringify(result.data.response));
            window.localStorage.setItem("goDetailsFrom", "list");
        }, function (err) {
            $ionicLoading.show({
                noBackdrop: false,
                template: '<p class="item"><ion-spinner icon="lines"/></p><p class="item flxy-button">No Details Available</p>',
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                duration: 3000,
                maxWidth: 200,
                showDelay: 0
            });
        });
    }

})
