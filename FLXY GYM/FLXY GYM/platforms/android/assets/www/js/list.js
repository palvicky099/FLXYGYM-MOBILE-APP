app.controller('listCtrl', function ($scope, $ionicPlatform, $state, $ionicModal, $ionicLoading, $rootScope, $cordovaSQLite, $ionicPopup, dataService, $cordovaDialogs) {
    //------------- One week data -----------
    $ionicPlatform.onHardwareBackButton(function () {
        $state.go('app.dashboard');
    });
    $scope.locatiosArray = [];
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
                var query = "select * from gymCenter where cat_id like '%" + $scope.item.cat_name + "%' and  center_id in (" + datearrayColls + ")"
                loadGymCenter(query);
            }
            else {
                var abc = '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,29,30'
                var query = "select * from gymCenter where cat_id like '%" + $scope.item.cat_name + "%' and  center_id in (" + abc + ")"
                loadGymCenter(query)
            }
        }, function (err) {
        });
    }



    function loadGymCenter(d) {
        $ionicLoading.show({
            noBackdrop: false,
            template: '<p class="item"><ion-spinner icon="lines"/></p><p class="item flxy-button">Please Wait...</p>'
        });
        // var listViewQuery = "select * from gymCenter where cat_id like '%" + $scope.item.cat_name + "%' and  center_id in (" + d + ")";
        var listViewQuery = d;
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
                }, 2000)
            } else {
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                    title: 'Alert',
                    template: '<div style="text-align:center; font-size:22px">No gym center available.</div>'
                });
                alertPopup.then(function (res) {
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
        loadymDetails(l.center_id);
        window.localStorage.setItem("itemDetails", JSON.stringify(l));
        $state.go('detail')
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

    $scope.showFilter = function () {
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
                window.localStorage.setItem("backFromBookDate", "list");
                $state.go('bookDate');
            }
            if (result == "1") {
                $rootScope.plan = result;
                window.localStorage.setItem("backFromBookDate", "list");
                $state.go('bookDate');
            }
            if (result == "2") {
                $rootScope.plan = result;
                window.localStorage.setItem("backFromBookDate", "list");
                $state.go('bookDate');
            }
        });
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

    //**************Location Filter Popup*****************
    dataService.get_location().then(function (result) {
        if (result.data.message == "details found!") {
            $scope.locationData = [];
            for (var i = 0; i < result.data.response.length; i++) {
                var db = {
                    "id": result.data.response[i].location_id,
                    "name": result.data.response[i].location_name
                }
                $scope.locationData.push(db);
            }
        }
        else {
            $scope.locationData = [];
        }
    })

    //$scope.locationData = [
    //{
    //    "id": "1",
    //    "name": "Kandivali"
    //}
    //,
    //{
    //    "id": "2",
    //    "name": "Malad"
    //}
    //, {
    //    "id": "3",
    //    "name": "Jogeshwari"
    //},
    // {
    //     "id": "4",
    //     "name": "Andheri West"
    // },
    // {
    //     "id": "5",
    //     "name": "Andheri East"
    // },
    // {
    //     "id": "6",
    //     "name": "Dahisar"
    // },
    // {
    //     "id": "7",
    //     "name": "Kurla"
    // }
    //]
    $scope.locationArray = [];
    $scope.callme = function (item, a) {
        var listToDelete = [item.id];
        if (a == true) {
            items = {
                "id": item.id,
                "name": item.name,
                "itemChecked": a
            }
            $scope.locationArray.push(items)
        }
        else {
            if (a == undefined) {
                a = false;
            }
            for (var i = 0; i < $scope.locationArray.length; i++) {
                var obj = $scope.locationArray[i];

                if (listToDelete.indexOf(obj.id) !== -1) {
                    $scope.locationArray.splice(i, 1);
                }
            }
        }
        console.log($scope.locationArray);
    }

    function checkSpecific() {
        $scope.selectionLocation = window.localStorage.getItem("selectedLocation");
        $scope.selectionCategory = window.localStorage.getItem("selectedCategory");

    }
    $scope.locationPopup = function () {
        checkSpecific();
        var popup = $ionicPopup.show({
            'templateUrl': 'locationPopup.html',
            'title': 'Select Location',
            'scope': $scope,
            'buttons': [
                        {
                            'text': 'Cancel'
                        },
                        {
                            'text': 'Save',
                            'onTap': function (event) {
                                return $scope.locationArray;
                            }
                        }
            ]
        });
        popup.then(function (result) {
            if (result) {
                $scope.locatiosArray = result;
                // console.log(result) var meetingDatas = [];
                var meetingDatas = [];
                for (var i = 0; i < $scope.locationArray.length; i++) {
                    if (i == 0) {
                        meetingDatas = "'" + $scope.locationArray[i].name + "'";
                    }
                    else {
                        meetingDatas += "," + "'" + $scope.locationArray[i].name + "'"
                    }
                }
                window.localStorage.setItem("selectedLocation", "[" + meetingDatas + "]")

                //Local storage array for advanced search by Location
                var advancedSearchLocation = [];
                for (var i = 0; i < $scope.locatiosArray.length; i++) {
                    if (i == 0) {
                        advancedSearchLocation = "'" + $scope.locatiosArray[i].name + "'";
                    }
                    else {
                        advancedSearchLocation += "," + "'" + $scope.locatiosArray[i].name + "'" + " ";
                    }
                }
                window.localStorage.setItem("LocationSearch", advancedSearchLocation);
            }
        });
    }
    //**************Location Filter Popup*****************

    //*************Category Popup**********************
    $scope.categoryData = JSON.parse(window.localStorage.getItem("Category"));
    $scope.categoryArray = [];
    $scope.categoryPopup = function () {
        checkSpecific();
        var popup = $ionicPopup.show({
            'templateUrl': 'categoryPopup.html',
            'title': 'Select Category',
            'scope': $scope,
            'buttons': [
                        {
                            'text': 'Cancel'
                        },
                        {
                            'text': 'Save',
                            'onTap': function (event) {
                                return $scope.categoryArray;
                            }
                        }
            ]
        });
        popup.then(function (result) {
            $scope.categoryArray = result;
            if (result) {
                //Loca; Storage array to selected Popop checkbox
                var categoryDatas = [];
                for (var i = 0; i < $scope.categoryArray.length; i++) {
                    if (i == 0) {
                        categoryDatas = "'" + $scope.categoryArray[i].cat_name + "'";
                    }
                    else {
                        categoryDatas += "," + "'" + $scope.categoryArray[i].cat_name + "'"
                    }
                }
                window.localStorage.setItem("selectedCategory", "[" + categoryDatas + "]")

                //Local storage array for advanced search by Category
                var advancedSearchCategory = [];
                for (var i = 0; i < $scope.categoryArray.length; i++) {
                    if (i == 0) {
                        advancedSearchCategory = "cat_id like" + " " + "'%" + $scope.categoryArray[i].cat_name + "%'" + " ";
                    }
                    else {
                        advancedSearchCategory += "or" + " " + "cat_id like" + " " + "'%" + $scope.categoryArray[i].cat_name + "%'" + " ";
                    }
                }
                window.localStorage.setItem("categotySearch", advancedSearchCategory)
            }
        });
    }
    $scope.categoyCall = function (item, a) {
        var listToDelete = [item.cat_id];
        if (a == true) {
            items = {
                "cat_id": item.cat_id,
                "cat_name": item.cat_name,
                "categoryItemChecked": a
            }
            $scope.categoryArray.push(items)
        }
        else {
            if (a == undefined) {
                a = false;
            }
            for (var i = 0; i < $scope.categoryArray.length; i++) {
                var obj = $scope.categoryArray[i];

                if (listToDelete.indexOf(obj.cat_id) !== -1) {
                    $scope.categoryArray.splice(i, 1);
                }
            }
        }
        console.log($scope.categoryArray);
    }

    //Sort Order function 
    $scope.statusData = [
               {
                   id: '1',
                   text: "Low to high"
               },
               {
                   id: '2',
                   text: "High to low"
               }
    ];
    $scope.selected = $scope.statusData[1];
    $scope.sortPrice = function (a) {
        if (a.id == '1') {
            window.localStorage.setItem("sortOrder", "ASC");
        }
        else {
            window.localStorage.setItem("sortOrder", "DESC");
        }
    }




    // slot type filter dropdown
    $scope.statusDataSlot = [
                {
                    id: '0',
                    text: 'All'
                },
                {
                    id: '1',
                    text: "Morning"
                },
               {
                   id: '2',
                   text: "Afternoon"
               }
               ,
               {
                   id: '3',
                   text: "Evening"
               }
    ];
    $scope.selectedSlot = $scope.statusDataSlot[0];
    $scope.slotType = function (a) {
        window.localStorage.setItem("slotType", a.text);
    }


    //******************Advanced Search Bar*************************
    $scope.filterAdvanced = function () {
        var category = window.localStorage.getItem("categotySearch");
        var location = window.localStorage.getItem("LocationSearch");

        if (window.localStorage.getItem("sortOrder")) {
            var sortOrder = window.localStorage.getItem("sortOrder");
        }
        else {
            var sortOrder = 'ASC'
        }
        if (window.localStorage.getItem("slotType")) {
            var slotType = window.localStorage.getItem("slotType");
        }
        else {
            var slotType = 'Morning'
        }

        if (slotType == 'All') {
            var query = "select * from gymCenter where  (" + category + ")  and " + " (location in (" + location + ")) order by price " + sortOrder + " "
        }
        else {
            var query = "select * from gymCenter where" + " (" + category + ")  and " + " (location in (" + location + ")) and s_name = '" + slotType + "' order by price " + sortOrder + " "
        }
        loadGymCenter(query);
        $scope.selectMember.hide();
    }
})


