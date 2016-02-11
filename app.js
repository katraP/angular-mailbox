var app = angular.module('mail', ['ui.router']);

app
    .directive('mail', function() {
        return {
            restrict: 'E',
            templateUrl: 'templates/mail.html'
        }
    })
    .directive('contacts', function() {
        return {
            restrict: 'E',
            templateUrl: 'templates/contactsWrap.html'
        }
    })
    .directive('sidebar', sidebar)
    .directive('mailContainer', mailContainer)
    .directive('mailWrap', mailWrap)
    .directive('contactsWrap', contactsWrap)
    .directive('contactModal', contactModal);

app.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('Mail', {
            abstract: true,
            url: '/mail',
            template: '<mail></mail>'
        })
        .state('Mail.inbox', {
            url: '/inbox',
            template: '<mail-container></mail-container>'
        })
        .state('Mail.sent', {
            url: '/sent',
            template: '<mail-container></mail-container>'
        })
        .state('Mail.spam', {
            url: '/spam',
            template: '<mail-container></mail-container>'
        })
        .state('Contacts', {
            url: '/contacts',
            template: '<contacts-wrap></contacts-wrap>'
        });

    $urlRouterProvider.otherwise('/mail/inbox');
});



app.factory('LS', function() {
    this.writeData = function(data) {
        localStorage.contacts =JSON.stringify(data);
    };
    this.readData = function() {
        return JSON.parse(localStorage.contacts);
    };
    return this;
})
    .factory('getData', function($http) {
        return {
            get: function() {
                return $http.get('data.json');
            }
        }
    })
    .factory('state', function($state, $timeout) {
        return {
            getCurrentState: function() {
                return $timeout(function () {
                    return $state.current.url
                }, 100);
            }
        }
    });