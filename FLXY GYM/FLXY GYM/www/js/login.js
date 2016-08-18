app.controller('loginCtrl', function ($scope, $ionicHistory, dataService, $ionicLoading, $state, $ionicPopup, $cordovaSQLite, $q, $rootScope) {
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
            template: '<p class="item"><ion-spinner icon="lines"/></p><p class="item flxy-button">Please Wait...</p>'
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
                    template: '<div style="text-align:center; font-size:22px">No internet connectivity detected. Please reconnect and try again.</div>'
                });
                alertPopup.then(function (res) {
                });
            }
            else {
                $scope.show = true;
                dataService.login(model).then(function (data) {
                    //$ionicLoading.hide();
                    if (data.data.message == "Success") {
                        window.localStorage.setItem("UserProfile", JSON.stringify(data.data));
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
            window.localStorage.setItem("UserProfile", JSON.stringify(result.data.response));
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
            var j = 100, k = 0, m = 0, interval = 100;
            if (j > $scope.gymCenterDatalength) {
                j = $scope.gymCenterDatalength;
                interval = interval;
            }
            if ($scope.gymCenterDatalength == 0) {
                resolve('Success');
            }
            else {
                while (j <= $scope.gymCenterDatalength) {
                    //  var gymCenterQuery = "INSERT INTO gymCenter (cat_id, center_id, center_name, center_imgpath, price, price_id ," +
                    //   " address , branch_addr, center_slot_data, grade, grade_id , landmark, latitude, longitude, margin, s_id , s_name, seats_perday) VALUES ";

                    var gymCenterQuery = "INSERT INTO gymCenter (cat_id , center_id , " +
                    " center_name , center_imgpath , price , price_id , address  , branch_addr ," +
                    " center_slot_data , grade , grade_id , landmark , latitude , longitude , " +
                    " margin , s_id , s_name , seats_perday, distance, location, loc_id) VALUES ";
                    var gymCenterArgs = [];
                    var gymCenterDatas = [];
                    for (var i = k; i < j; i++) {
                        var arrayGymCenter = $scope.gymCenterData[i];
                        gymCenterArgs.push("(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
                        gymCenterDatas.push(arrayGymCenter.cat_id);
                        // gymCenterDatas.push("SPORTS");

                        gymCenterDatas.push(arrayGymCenter.center_id);
                        gymCenterDatas.push(arrayGymCenter.center_name);

                        gymCenterDatas.push(arrayGymCenter.center_imgpath);
                        //  gymCenterDatas.push("http://www.bodybuilding.com/images/2015/december2/how-to-deal-with-a-busy-gym-graphics-3.jpg");

                        gymCenterDatas.push(arrayGymCenter.price);
                        gymCenterDatas.push(arrayGymCenter.price_id);
                        gymCenterDatas.push(arrayGymCenter.branch_addr);
                        gymCenterDatas.push(arrayGymCenter.branch_addr);
                        gymCenterDatas.push(arrayGymCenter.center_slot_data);
                        gymCenterDatas.push(arrayGymCenter.grade);
                        gymCenterDatas.push(arrayGymCenter.grade_id);
                        gymCenterDatas.push(arrayGymCenter.landmark);
                        gymCenterDatas.push(arrayGymCenter.latitude);
                        gymCenterDatas.push(arrayGymCenter.longitude);
                        gymCenterDatas.push(arrayGymCenter.margin);
                        gymCenterDatas.push(arrayGymCenter.s_id);
                        gymCenterDatas.push(arrayGymCenter.s_name);
                        gymCenterDatas.push(arrayGymCenter.seats_perday);

                        var lat = localStorage.getItem("lat");
                        var long = localStorage.getItem("long");
                        var latitude1 = arrayGymCenter.latitude;
                        var longitude1 = arrayGymCenter.longitude;
                        var latitude2 = lat;
                        var longitude2 = long;
                        var distance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(latitude1, longitude1), new google.maps.LatLng(latitude2, longitude2));
                        gymCenterDatas.push(distance / 1000);
                        gymCenterDatas.push(arrayGymCenter.location);
                        gymCenterDatas.push(arrayGymCenter.loc_id);
                    }
                    gymCenterQuery += gymCenterArgs.join(", ");
                    $cordovaSQLite.execute(db, gymCenterQuery, gymCenterDatas).then(function (res) {
                    }, function (err) {

                    });
                    k = j;
                    j = j + interval;
                    if (m == 1) {
                        resolve('Success');
                        break;
                    }
                    if ($scope.gymCenterDatalength < j) {
                        j = $scope.gymCenterDatalength;
                        m = 1;
                    }
                }
            }
        });
    }
})