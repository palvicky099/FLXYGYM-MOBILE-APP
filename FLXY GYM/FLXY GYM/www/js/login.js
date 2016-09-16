app.controller('loginCtrl', function ($scope, backcallFactory, $ionicHistory, dataService, $ionicLoading, $state, $ionicPopup, $cordovaSQLite, $q, $rootScope, $cordovaLocalNotification) {
    backcallFactory.backcallfun();
    var isIPad = ionic.Platform.isIPad();
    if (isIPad) {
        $scope.showheightTop = true;
    }
    else {
        $scope.showheightTop = false;
    }
    function doOnOrientationChange() {
        switch (window.orientation) {
            case -90:
            case 90:
                $scope.showheightTop = false;
                break;
            default:
                var isIPad = ionic.Platform.isIPad();
                if (isIPad) {
                    $scope.showheightTop = true;
                }
                break;
        }
    }
    $scope.goBack = function () {
        $ionicHistory.goBack();
    }
  
    $scope.btnLogin = function (model) {
        $ionicLoading.show({
            noBackdrop: false,
            template: '<ion-spinner icon="lines"/>'
        });
        if (model == undefined) {
            $ionicLoading.show({
                template: '<i class="ion ion-android-notifications" style="font-size:40px; color:#FFD700"></i><div  style="color:white;  font-size: 15px;margin-top: 10px;">Please enter valid Email Address or Password</div>',
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                noBackdrop: true,
                duration: 3000,
                maxWidth: 200,
                showDelay: 0
            });
            $ionicLoading.hide();
            $scope.show = false;
        }
        else if (model.Mobile == '' || model.Mobile == undefined || model.Password == '' || model.Password == undefined) {
            $ionicLoading.show({
                template: '<i class="ion ion-android-notifications" style="font-size:40px; color:#FFD700"></i><div  style="color:white;  font-size: 15px;margin-top: 10px;">Please enter valid Email Address or Password</div>',
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                noBackdrop: false,
                duration: 3000,
                maxWidth: 200,
                showDelay: 0
            });
            $scope.show = false;
            $ionicLoading.hide();
        }
        else {
            if (navigator.connection.type == Connection.NONE) {
                var alertPopup = $ionicPopup.alert({
                    title: ' No internet connection',
                    template: '<div style="text-align:center;">No internet connectivity detected. Please reconnect and try again.</div>'
                });
                alertPopup.then(function (res) {
                });
            }
            else {
                $scope.show = true;
                dataService.login(model).then(function (data) {
                   // $ionicLoading.hide();
                    if (data.data.message == "Success") {
                        window.localStorage.setItem("UserProfile", JSON.stringify(data.data));
                        window.localStorage.setItem("LoginData", JSON.stringify(data.data));
                        window.localStorage.setItem("UserId", data.data.UserId);
                        LoadData();
                    }
                    else {
                        $ionicLoading.show({
                            template: '<i class="ion ion-close-circled" style="font-size:40px; color:red"></i><div  style="color:white;  font-size: 15px;margin-top: 10px;">Invalid Email Address or Password</div>',
                            content: 'Loading',
                            animation: 'fade-in',
                            showBackdrop: true,
                            noBackdrop: true,
                            duration: 3000,
                            maxWidth: 200,
                            showDelay: 0
                        });
                    }
                }, function (err) {
                    $ionicLoading.hide();
                    if (navigator.connection.type == Connection.NONE) {
                        $ionicLoading.show({ template: "Please check internet connection", noBackdrop: false, duration: 2000 });
                    } else {
                            $ionicLoading.show({
                                template: '<i class="ion ion-close-circled" style="font-size:40px; color:red"></i><div  style="color:white;  font-size: 15px;margin-top: 10px;">Invalid Email Address or Password</div>',
                                content: 'Loading',
                                animation: 'fade-in',
                                showBackdrop: true,
                                noBackdrop: true,
                                duration: 3000,
                                maxWidth: 200,
                                showDelay: 0
                            });
                     //   }
                    }
                });
            }
        }
    }
    $scope.register = function () {
        $state.go('register')
    }
    $scope.forgotPassword = function () {
        $state.go('forgotPassword')
    }



    function LoadData() {
        loadAllGymData();
        dataService.getCategory().then(function (result) {
            console.log(result.data.response);
            window.localStorage.setItem("Category", JSON.stringify(result.data.response));
            $scope.dashList = JSON.parse(window.localStorage.getItem("Category"));
            //  $scope.dashList = result.data.response;
        }, function (err) {
            $scope.dashList = JSON.parse(window.localStorage.getItem("Category"));
        });
        $scope.LoginData = JSON.parse(window.localStorage.getItem("LoginData"));
        var getProfileModel = {
            "mobile": $scope.LoginData.mobile
        }
        dataService.getProfile(getProfileModel).then(function (result) {
            window.localStorage.setItem("UserProfile", JSON.stringify(result.data.response[0]));
        }, function (err) {
            $scope.dashList = JSON.parse(window.localStorage.getItem("Category"));
        });
    }


    function loadAllGymData() {
        dataService.getAllGymCenter().then(function (result) {
            if (result.data.message == "details found!") {
                $scope.gymCenterData = JSON.parse(JSON.stringify(result.data.response));
                if ($scope.gymCenterData == null) { $scope.gymCenterDatalength = 0; }
                else { $scope.gymCenterDatalength = $scope.gymCenterData.length; }
                var promiseReadDataSync = deleteGymCenter();
                promiseReadDataSync.then(function () {
                    var promiseDelete = insertGymCenter();
                    promiseDelete.then(function () {
                        var listViewQuery = "select * from gymCenter";
                        $cordovaSQLite.execute(db, listViewQuery, []).then(function (result) {
                            if (result.rows.length > 0) {
                                    $ionicLoading.hide();
                                    window.localStorage.setItem("isLogin", "yes");
                                    $state.go('app.dashboard');
                                    localNotification('FLXY GYM', 'Welcome to FLXY Gym');
                                }
                            else {
                                $ionicLoading.hide();
                                window.localStorage.setItem("isLogin", "yes");
                                $state.go('app.dashboard');
                                localNotification('Welcome to FlxyGym', 'Now Enjoy Limitless Activities Any Time, Anywhere !!');
                            }
                        }, function (err) {
                        });
                    })
                })
            }
            else {
            }
        });
    }

    function deleteGymCenter() {
        return $q(function (resolve, reject) {
            var delGymCenterQuery = "Delete from gymCenter";
            $cordovaSQLite.execute(db, delGymCenterQuery, []).then(function (res) {
                resolve('Success');
            }, function (err) {

            });
        })
    }

    function insertGymCenter() {
        return $q(function (resolve, reject) {
            if ($scope.gymCenterDatalength == 0) {
                resolve('Success');
            }
            else {
                    var gymCenterQuery = "INSERT INTO gymCenter (cat_id , center_id , " +
                    " center_name , center_imgpath , price , price_id , address  , branch_addr ," +
                    "  grade , grade_id , landmark , latitude , longitude , " +
                    " margin , s_id , s_name , seats_perday, distance, location, loc_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                    var gymCenterArgs = [];
                    var gymCenterDatas = [];
                    for (var i = 0; i < $scope.gymCenterDatalength; i++) {
                        var arrayGymCenter = $scope.gymCenterData[i];
                        var lat = localStorage.getItem("lat");
                        var long = localStorage.getItem("long");
                        var latitude1 = arrayGymCenter.latitude;
                        var longitude1 = arrayGymCenter.longitude;
                        var latitude2 = lat;
                        var longitude2 = long;
                        var distance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(latitude1, longitude1), new google.maps.LatLng(latitude2, longitude2));
                        $cordovaSQLite.execute(db, gymCenterQuery, [arrayGymCenter.cat_id, arrayGymCenter.center_id, arrayGymCenter.center_name, arrayGymCenter.center_imgpath, arrayGymCenter.price, arrayGymCenter.price_id, arrayGymCenter.branch_addr, arrayGymCenter.branch_addr, arrayGymCenter.grade, arrayGymCenter.grade_id, arrayGymCenter.landmark, arrayGymCenter.latitude, arrayGymCenter.longitude, arrayGymCenter.margin, arrayGymCenter.s_id, arrayGymCenter.s_name, arrayGymCenter.seats_perday, distance / 1000, arrayGymCenter.location, arrayGymCenter.loc_id]).then(function (res) {
                            if (i == $scope.gymCenterDatalength) {
                                $ionicLoading.hide();
                                resolve('Success');
                            }
                        }, function (err) {
                        });
                    }
            }
        });
    }
    function localNotification(a, b) {
        $cordovaLocalNotification.schedule({
            id: 1,
            title: a,
            text: b,
            data: {
                customProperty: 'custom value'
            }
        }).then(function (result) {
            // ...
        });
    };
})