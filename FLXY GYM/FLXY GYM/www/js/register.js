app.controller('registerCtrl', function ($scope, dataService, $ionicHistory, $state, $ionicLoading,$q,$cordovaSQLite, $rootScope) {
    $scope.goBack = function () {
        $ionicHistory.goBack();
    }
    $scope.user = {};
    $scope.register = function (user) {
        if (user.name == undefined || user.name == '' || user.email == undefined || user.email == '' || user.password == undefined || user.password == '' || user.confirm == undefined || user.confirm == '') {
            $ionicLoading.show({
                template: 'All Field Required',
                animation: 'fade-in',
                showBackdrop: true,
                noBackdrop: true,
                duration: 2000,
                maxWidth: 200,
                showDelay: 0
            });
        }
        else {
            if (user.password != user.confirm) {
                $ionicLoading.show({
                    template: 'Password not match',
                    animation: 'fade-in',
                    showBackdrop: true,
                    noBackdrop: true,
                    duration: 2000,
                    maxWidth: 200,
                    showDelay: 0
                });
            } else {
                $ionicLoading.show({
                    noBackdrop: false,
                    template: '<ion-spinner icon="lines"/>'
                });
                var model = {
                    "name":user.name,
                    "email":user.email,
                    "mobile":user.mobile,
                    "password":user.password
                }
                dataService.register(model).then(function (result) {
                    $ionicLoading.hide();
                    if (result.data.message == "Mobile number is already exist") {
                        $ionicLoading.show({
                            template: result.data.message,
                            animation: 'fade-in',
                            showBackdrop: true,
                            noBackdrop: true,
                            duration: 2000,
                            maxWidth: 200,
                            showDelay: 0
                        });
                    }
                    else {
                        window.localStorage.setItem("registerSuccess", JSON.stringify(result.data.response));
                        $state.go('otp');
                        user.name = '';
                        user.password = '';
                        user.email = '';
                        user.confirm = '';
                        user.mobile = '';
                    }
                    });
                
            }
        }
    }
    $scope.otpCheck = function (otp) {
        if (otp) {
            var modelOTP = JSON.parse(window.localStorage.getItem("registerSuccess"));
            if (modelOTP[0].otp == otp)
            {
                var model = {
                    "name": modelOTP[0].name,
                    "email": modelOTP[0].email,
                    "mobile": modelOTP[0].mobile,
                    "password": modelOTP[0].password,

                }
                dataService.registerSuccess(model).then(function (result) {
                    
                    if (result.data.message == "Success")
                    {
                        window.localStorage.setItem("LoginData", JSON.stringify(result.data));
                        window.localStorage.setItem("UserProfile", JSON.stringify(result.data));
                        window.localStorage.setItem("UserId", result.data.UserId);
                        LoadData();
                    }
                    else {
                        $ionicLoading.hide();
                        $ionicLoading.show({
                                    template: 'PLease try again lator there is some problem to authenticate OTP',
                                    animation: 'fade-in',
                                    showBackdrop: true,
                                    noBackdrop: true,
                                    duration: 2000,
                                    maxWidth: 200,
                                    showDelay: 0
                                });
                    }
                })
            }
            //else {
            //    $ionicLoading.show({
            //        template: 'PLease try again lator there is some problem to authenticate OTP',
            //        animation: 'fade-in',
            //        showBackdrop: true,
            //        noBackdrop: true,
            //        duration: 2000,
            //        maxWidth: 200,
            //        showDelay: 0
            //    });
            //}
        }
        else {
            $ionicLoading.show({
                template: 'Please enter OTP',
                animation: 'fade-in',
                showBackdrop: true,
                noBackdrop: true,
                duration: 2000,
                maxWidth: 200,
                showDelay: 0
            });
        }
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
                $ionicLoading.show({
                    noBackdrop: false,
                    template: '<p class="item"><ion-spinner icon="lines"/></p><p class="item flxy-button">Plase wait...</p>'
                });
                console.log(result)
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
                                setTimeout(function () {
                                    $ionicLoading.hide();
                                    $state.go('app.dashboard');
                                    window.localStorage.setItem("isLogin", "yes");
                                }, 2000)
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
})
