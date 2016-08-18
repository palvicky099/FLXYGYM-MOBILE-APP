app.controller('forgotPasswordCtrl', function ($scope, $ionicLoading, $state, $ionicPopup, dataService) {
    $scope.forgotPassword = function (mobile) {
        if (mobile)
        {
            $ionicLoading.show({
                noBackdrop: false,
                template: '<p class="item"><ion-spinner icon="lines"/></p><p class="item flxy-button">Please Wait...</p>'
            });
            dataService.forgotPassword(mobile).then(function (result) {
                $ionicLoading.hide();
                window.localStorage.setItem("registerSuccess", JSON.stringify(result.data.response));
            $scope.data = {};
            var myPopup = $ionicPopup.show({
                template: '<input type="text" style="border:1px solid #ddd; text-align:center"  ng-model="data.otp">',
                title: 'Enter OTP',
                subTitle: 'OTP has been send to your mobile number',
                scope: $scope,
                buttons: [
                  { text: 'Cancel' },
                  {
                      text: '<b>Done</b>',
                      type: 'button-positive',
                      onTap: function (e) {
                          if (!$scope.data.otp) {
                              e.preventDefault();
                          } else {
                              return $scope.data.otp;
                          }
                      }
                  }
                ]
            });
            myPopup.then(function (res) {
                if (res) {
                    var modelOTP = JSON.parse(window.localStorage.getItem("registerSuccess"));
                    if (modelOTP[0].otp == res) {
                        $state.go('newPassword');
                    }
                }
            });
        })
        }
        else {
            $ionicLoading.show({
                noBackdrop: false,
                template: 'Please enter mobile number',
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                duration: 3000,
                maxWidth: 200,
                showDelay: 0
            });
        }
    }
    $scope.createNewPassword = function (user) {
        if (user.password == undefined || user.password == '' || user.confirm == undefined || user.confirm == '') {
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
                    template: '<p class="item"><ion-spinner icon="lines"/></p><p class="item flxy-button">Please Wait...</p>'
                });
                var modelOTP = JSON.parse(window.localStorage.getItem("registerSuccess"));
                var model = {
                    "mobile": modelOTP[0].mobile,
                    "password": user.password,
                }
                dataService.forgot_Success(model).then(function (result) {
                    $ionicLoading.hide();
                    if (result.data.message == "success") {
                        $state.go('login');
                        $ionicLoading.show({
                            template: 'Password updated successfully',
                            animation: 'fade-in',
                            showBackdrop: true,
                            noBackdrop: true,
                            duration: 2000,
                            maxWidth: 200,
                            showDelay: 0
                        });
                        user.password = '';
                        user.confirm = '';
                    }
                    });
            }
        }
    }
})
