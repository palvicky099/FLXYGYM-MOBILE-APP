angular.module('starter.services', [])
.factory('dataService', function ($http, $rootScope) {
    var factory = [];
    var url = 'http://www.flxygym.com/home/api/';
    factory.login = function (model) {
         //return $http.post(url + 'flxy_login.php?Mobile=' + model.Mobile + '&Password=' + model.Password);
       // return $http.post(url + 'flxy_login.php', model);
        return $http.post(url + 'flxy_login.php?data=' + JSON.stringify(model));

    };
    factory.getCategory = function () {
        return $http.get(url + 'get_category.php');
    };
    factory.getCenter = function (model) {
        return $http.get(url + 'get_center.php?Cat_id=' + model);
    };
    factory.getDateCenter = function (model) {
        return $http.get(url + 'get_center.php?Cat_id=' + model.cat_id + '&date=' + model.date);
    };
    factory.getCenterDetails = function (model) {
        return $http.get(url + 'get_center_details.php?c_id=' + model);
    };
    factory.getAllGymCenter = function () {
        return $http.get(url + 'get_center.php');
    };
     factory.getGymMemberDetails = function () {
        return $http.get(url + 'get_gym_member_details.php');
     };
     factory.getAvailableGymCenter = function (model) {
         return $http.get(url + 'get_available_center.php?c_id='+model);
     };
     factory.getProfile = function (model) {
         return $http.get(url + 'user_profile.php?data=' + JSON.stringify(model));
     };
     factory.updateProfile = function (model) {
         
         return $http.post(url + 'update_user_profile.php' , 'data=' + JSON.stringify(model));
     };
     factory.register = function (data) {
         return $http.post('http://www.flxygym.com/home/api/register.php?data=' + JSON.stringify(data));
     };
     factory.registerSuccess = function (OTPData) {
         return $http.post('http://www.flxygym.com/home/api/registration_success.php?data=' + JSON.stringify(OTPData));
     };
     factory.forgotPassword = function (modelMobile) {
         return $http.post(' http://www.flxygym.com/home/api/forgot_password.php?mobile=' + modelMobile);
     };
     factory.forgot_Success = function (data) {
         return $http.post(' http://www.flxygym.com/home/api/forgot_success.php?data=' + JSON.stringify(data));
     };
     factory.gym_membership = function (model) {
         return $http.post(' http://www.flxygym.com/home/api/gym_membership.php?c_id=' + model);
     };
     factory.Feedback = function (model) {
         return $http.post(url + 'feedback.php?data=' + JSON.stringify(model));
     };
     factory.events = function (model) {
         return $http.get(url + 'get_events.php');
     };
     factory.offers = function (model) {
         return $http.get(url + 'get_offers.php');
     };
     factory.membership = function (model) {
         return $http.get(url + 'membership_image.php');
     };
    return factory;
});
