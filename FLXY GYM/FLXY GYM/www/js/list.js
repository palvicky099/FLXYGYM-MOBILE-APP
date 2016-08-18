app.controller('listCtrl', function ($scope, $state, $ionicModal, $ionicLoading, $rootScope, $cordovaSQLite, $ionicPopup, dataService, $cordovaDialogs) {
    //------------- One week data -----------
    var DataArray = [];
    var myDate = new Date();
    for (var i = 0; i <= 6; i++) {
        var nextDay = new Date();
        nextDay.setDate(myDate.getDate() + i);
        DataArray.push(nextDay.getFullYear() + '-' + ('0' + (nextDay.getMonth() + 1)).slice(-2) + '-' + ('0' + nextDay.getDate()).slice(-2));
          }
    $scope.priceSelection = 100;
    $scope.timeSelection = 6;
    $scope.dateScope = DataArray;
    // ---------------One week date END ------------

    $scope.item = JSON.parse(window.localStorage.getItem("ListItemData"));
    $scope.categoryName = $scope.item.cat_name;
    setTimeout(function () {
        loadFunction($scope.dateScope[0]);
    }, 1000)
    // -----------Date Click-------------
    $scope.dateClick = function (dateSelected) {
        loadFunction(dateSelected);
    }
    //---------- date click End---------



    function loadFunction(d) {
        var model = {
            "cat_id": $scope.item.cat_id,
            "date": d
        }
        dataService.getDateCenter(model).then(function (result) {
            if (result.data.message == "details found!") {
                if (result.data.response.length > 0) {
                    var datearrayColls = [];
                    for (var i = 0; i < result.data.response.length; i++) {
                        datearrayColls.push(result.data.response[i].center_id);
                    };
                } else {
                    $scope.listArray = [];
                    $cordovaDialogs.confirm('No gym center available', 'Alert', ['OK'])
                }
            }
            loadGymCenter(datearrayColls);
        }, function (err) {
        });
    }
   
   
   
    function loadGymCenter(d) {
        $ionicLoading.show({
            noBackdrop: false,
            template: '<p class="item"><ion-spinner icon="lines"/></p><p class="item flxy-button">Please Wait...</p>'
        });
        var listViewQuery = "select * from gymCenter where cat_id like '%" + $scope.item.cat_name + "%' and  center_id in (" + d + ")";
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
                },2000)
            } else {
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                    title: 'Alert',
                    template: '<div style="text-align:center; font-size:22px">No gym center available.</div>'
                });
                alertPopup.then(function (res) {
                    $state.go('app.dashboard')
                });
            }
        }, function (err) {
            $ionicLoading.hide();
        });
    }

	////$scope.listArray = 
	////[
	////{
    ////"gymId":"1",
    ////"gymName":"Shiva Gym",
    ////"gymCategory":"YOGA",
    ////"gymImg":"http://www.bodybuilding.com/images/2015/december2/how-to-deal-with-a-busy-gym-graphics-3.jpg",
    ////"gymTime":"10 am to 11pm",
    ////"gymPrice":"1000 Rs",
    ////"gymDistance":"82828.92 kms",
    //// "gymAddress":"Dahisar West",
    ////"gymRating":3.5
	////},
	////{
    ////"gymId":"2",
    ////"gymName":"Power Gym Borivali",
    ////"gymCategory":"YOGA",
    ////"gymImg":"http://www.yourweightsolutions.com.au/wp-content/uploads/2014/08/Gym-perth.jpg",
    ////"gymTime":"11 am to 2pm",
    ////"gymPrice":"500 Rs",
    ////"gymDistance":"8222.323 kms",
    //// "gymAddress":"Goregon West",
    ////"gymRating":4.5

	////},
	////{
    ////"gymId":"3",
    ////"gymName":"ITC Gym Goregon",
    ////"gymCategory":"YOGA",
    ////"gymImg":"http://www.active.com/Assets/Running/460/7-Cross-Training-Exercises460.jpg",
    ////"gymTime":"9 am to 12pm",
    ////"gymPrice":"800 Rs",
    ////"gymDistance":"72373.0909 kms",
    ////"gymAddress":"Malad West",
    ////"gymRating":3.5
	////},
	////{
    ////"gymId":"4",
    ////"gymName":"Royal GYM PVT LTD",
    ////"gymCategory":"YOGA",
    ////"gymImg":"http://previews.123rf.com/images/andresr/andresr1008/andresr100800367/7508197-Group-of-people-doing-spinning-at-the-gym-and-smiling--Stock-Photo.jpg",
    ////"gymTime":"10 pm to 12pm",
    ////"gymPrice":"1000 Rs",
    ////"gymDistance":"10000.00 kms",
    ////"gymAddress":"Borivali West",
    ////"gymRating":2.5
	////}
	////,
	////{
    ////"gymId":"5",
    ////"gymName":"5Star GYM PVT LTD",
    ////"gymCategory":"YOGA",
    ////"gymImg":"https://i.ytimg.com/vi/MF_nOPEKE2g/maxresdefault.jpg",
    ////"gymTime":"10 pm to 1pm",
    ////"gymPrice":"200 Rs",
    ////"gymDistance":"12323.323 kms",
    ////"gymAddress":"Kandivali West",
    ////"gymRating":3.5
	////}
	////,
	////{
    ////"gymId":"6",
    ////"gymName":"Golden GYM PVT LTD",
    ////"gymCategory":"YOGA",
    ////"gymImg":"http://www.nrgfitness.ie/site/wp-content/uploads/gym-instructor-images-2.jpg",
    ////"gymTime":"10 pm to 3pm",
    ////"gymPrice":"10000 Rs",
    ////"gymDistance":"22213.23 kms",
    ////"gymAddress":"Thane West",
    ////"gymRating":3
	////},
    ////{
    ////"gymId":"1",
    ////"gymName":"Shiva Gym",
    ////"gymCategory":"YOGA",
    ////"gymImg":"http://www.bodybuilding.com/images/2015/december2/how-to-deal-with-a-busy-gym-graphics-3.jpg",
    ////"gymTime":"10 am to 11pm",
    ////"gymPrice":"1000 Rs",
    ////"gymDistance":"82828.92 kms",
    //// "gymAddress":"Dahisar West",
    ////"gymRating":3.5
    ////},
    ////{
    ////"gymId":"2",
    ////"gymName":"Power Gym Borivali",
    ////"gymCategory":"YOGA",
    ////"gymImg":"http://www.yourweightsolutions.com.au/wp-content/uploads/2014/08/Gym-perth.jpg",
    ////"gymTime":"11 am to 2pm",
    ////"gymPrice":"500 Rs",
    ////"gymDistance":"8222.323 kms",
    //// "gymAddress":"Goregon West",
    ////"gymRating":4.5

    ////},
    ////{
    ////"gymId":"3",
    ////"gymName":"ITC Gym Goregon",
    ////"gymCategory":"YOGA",
    ////"gymImg":"http://www.active.com/Assets/Running/460/7-Cross-Training-Exercises460.jpg",
    ////"gymTime":"9 am to 12pm",
    ////"gymPrice":"800 Rs",
    ////"gymDistance":"72373.0909 kms",
    ////"gymAddress":"Malad West",
    ////"gymRating":3.5
    ////},
    ////{
    ////"gymId":"4",
    ////"gymName":"Royal GYM PVT LTD",
    ////"gymCategory":"YOGA",
    ////"gymImg":"http://previews.123rf.com/images/andresr/andresr1008/andresr100800367/7508197-Group-of-people-doing-spinning-at-the-gym-and-smiling--Stock-Photo.jpg",
    ////"gymTime":"10 pm to 12pm",
    ////"gymPrice":"1000 Rs",
    ////"gymDistance":"10000.00 kms",
    ////"gymAddress":"Borivali West",
    ////"gymRating":2.5
    ////}
    ////,
    ////{
    ////"gymId":"5",
    ////"gymName":"5Star GYM PVT LTD",
    ////"gymCategory":"YOGA",
    ////"gymImg":"https://i.ytimg.com/vi/MF_nOPEKE2g/maxresdefault.jpg",
    ////"gymTime":"10 pm to 1pm",
    ////"gymPrice":"200 Rs",
    ////"gymDistance":"12323.323 kms",
    ////"gymAddress":"Kandivali West",
    ////"gymRating":3.5
    ////}
    ////,
    ////{
    ////"gymId":"6",
    ////"gymName":"Golden GYM PVT LTD",
    ////"gymCategory":"YOGA",
    ////"gymImg":"http://www.nrgfitness.ie/site/wp-content/uploads/gym-instructor-images-2.jpg",
    ////"gymTime":"10 pm to 3pm",
    ////"gymPrice":"10000 Rs",
    ////"gymDistance":"22213.23 kms",
    ////"gymAddress":"Thane West",
    ////"gymRating":3
    ////},
    ////{
    ////"gymId":"1",
    ////"gymName":"Shiva Gym",
    ////"gymCategory":"YOGA",
    ////"gymImg":"http://www.bodybuilding.com/images/2015/december2/how-to-deal-with-a-busy-gym-graphics-3.jpg",
    ////"gymTime":"10 am to 11pm",
    ////"gymPrice":"1000 Rs",
    ////"gymDistance":"82828.92 kms",
    //// "gymAddress":"Dahisar West",
    ////"gymRating":3.5
    ////},
    ////{
    ////"gymId":"2",
    ////"gymName":"Power Gym Borivali",
    ////"gymCategory":"YOGA",
    ////"gymImg":"http://www.yourweightsolutions.com.au/wp-content/uploads/2014/08/Gym-perth.jpg",
    ////"gymTime":"11 am to 2pm",
    ////"gymPrice":"500 Rs",
    ////"gymDistance":"8222.323 kms",
    //// "gymAddress":"Goregon West",
    ////"gymRating":4.5

    ////},
    ////{
    ////"gymId":"3",
    ////"gymName":"ITC Gym Goregon",
    ////"gymCategory":"SPIN",
    ////"gymImg":"http://www.active.com/Assets/Running/460/7-Cross-Training-Exercises460.jpg",
    ////"gymTime":"9 am to 12pm",
    ////"gymPrice":"800 Rs",
    ////"gymDistance":"72373.0909 kms",
    ////"gymAddress":"Malad West",
    ////"gymRating":3.5
    ////},
    ////{
    ////"gymId":"4",
    ////"gymName":"Royal GYM PVT LTD",
    ////"gymCategory":"SPIN",
    ////"gymImg":"http://previews.123rf.com/images/andresr/andresr1008/andresr100800367/7508197-Group-of-people-doing-spinning-at-the-gym-and-smiling--Stock-Photo.jpg",
    ////"gymTime":"10 pm to 12pm",
    ////"gymPrice":"1000 Rs",
    ////"gymDistance":"10000.00 kms",
    ////"gymAddress":"Borivali West",
    ////"gymRating":2.5
    ////}
    ////,
    ////{
    ////"gymId":"5",
    ////"gymName":"5Star GYM PVT LTD",
    ////"gymCategory":"SPIN",
    ////"gymImg":"https://i.ytimg.com/vi/MF_nOPEKE2g/maxresdefault.jpg",
    ////"gymTime":"10 pm to 1pm",
    ////"gymPrice":"200 Rs",
    ////"gymDistance":"12323.323 kms",
    ////"gymAddress":"Kandivali West",
    ////"gymRating":3.5
    ////}
    ////,
    ////{
    ////"gymId":"6",
    ////"gymName":"Golden GYM PVT LTD",
    ////"gymCategory":"CARDIO",
    ////"gymImg":"http://www.nrgfitness.ie/site/wp-content/uploads/gym-instructor-images-2.jpg",
    ////"gymTime":"10 pm to 3pm",
    ////"gymPrice":"10000 Rs",
    ////"gymDistance":"22213.23 kms",
    ////"gymAddress":"Thane West",
    ////"gymRating":3
    ////}
    ////,{
    ////"gymId":"1",
    ////"gymName":"Shiva Gym",
    ////"gymCategory":"CARDIO",
    ////"gymImg":"http://www.bodybuilding.com/images/2015/december2/how-to-deal-with-a-busy-gym-graphics-3.jpg",
    ////"gymTime":"10 am to 11pm",
    ////"gymPrice":"1000 Rs",
    ////"gymDistance":"82828.92 kms",
    //// "gymAddress":"Dahisar West",
    ////"gymRating":3.5
    ////},
    ////{
    ////"gymId":"2",
    ////"gymName":"Power Gym Borivali",
    ////"gymCategory":"CARDIO",
    ////"gymImg":"http://www.yourweightsolutions.com.au/wp-content/uploads/2014/08/Gym-perth.jpg",
    ////"gymTime":"11 am to 2pm",
    ////"gymPrice":"500 Rs",
    ////"gymDistance":"8222.323 kms",
    //// "gymAddress":"Goregon West",
    ////"gymRating":4.5

    ////},
    ////{
    ////"gymId":"3",
    ////"gymName":"ITC Gym Goregon",
    ////"gymCategory":"CARDIO",
    ////"gymImg":"http://www.active.com/Assets/Running/460/7-Cross-Training-Exercises460.jpg",
    ////"gymTime":"9 am to 12pm",
    ////"gymPrice":"800 Rs",
    ////"gymDistance":"72373.0909 kms",
    ////"gymAddress":"Malad West",
    ////"gymRating":3.5
    ////},
    ////{
    ////"gymId":"4",
    ////"gymName":"Royal GYM PVT LTD",
    ////"gymCategory":"CARDIO",
    ////"gymImg":"http://previews.123rf.com/images/andresr/andresr1008/andresr100800367/7508197-Group-of-people-doing-spinning-at-the-gym-and-smiling--Stock-Photo.jpg",
    ////"gymTime":"10 pm to 12pm",
    ////"gymPrice":"1000 Rs",
    ////"gymDistance":"10000.00 kms",
    ////"gymAddress":"Borivali West",
    ////"gymRating":2.5
    ////}
    ////,
    ////{
    ////"gymId":"5",
    ////"gymName":"5Star GYM PVT LTD",
    ////"gymCategory":"DANCE",
    ////"gymImg":"https://i.ytimg.com/vi/MF_nOPEKE2g/maxresdefault.jpg",
    ////"gymTime":"10 pm to 1pm",
    ////"gymPrice":"200 Rs",
    ////"gymDistance":"12323.323 kms",
    ////"gymAddress":"Kandivali West",
    ////"gymRating":3.5
    ////}
    ////,
    ////{
    ////"gymId":"6",
    ////"gymName":"Golden GYM PVT LTD",
    ////"gymCategory":"DANCE",
    ////"gymImg":"http://www.nrgfitness.ie/site/wp-content/uploads/gym-instructor-images-2.jpg",
    ////"gymTime":"10 pm to 3pm",
    ////"gymPrice":"10000 Rs",
    ////"gymDistance":"22213.23 kms",
    ////"gymAddress":"Thane West",
    ////"gymRating":3
    ////}
	////]
 $scope.rating = {};
  $scope.rating.rate = 3.5;
  $scope.rating.max = 5;
  $scope.goDetail = function (l) {
      dataService.getCenterDetails(l.center_id).then(function (result) {
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
     $ionicModal.fromTemplateUrl('templates/filterModel.html', {
        scope: $scope,
        backdropClickToClose: true,
        hardwareBackButtonClose: true
    }).then(function (modal) {
        $scope.selectMember = modal;
    });
    $scope.closeMember = function () {
        $scope.selectMember.hide();
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
    };

    $scope.showFilter=function(){
          $scope.selectMember.show();
    }
   
    //Place drop down 

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



 })


