'use strict';
window.app = angular.module('FullstackGeneratedApp', ['fsaPreBuilt', 'ui.router', 'ui.bootstrap', 'ngAnimate', 'hljs','hc.marked']);

app.config(function ($urlRouterProvider, $locationProvider, hljsServiceProvider) {
    // This turns off hashbang urls (/#about) and changes it to something normal (/about)
    $locationProvider.html5Mode(true);
    // If we go to a URL that ui-router doesn't have registered, go to the "/" url.
    $urlRouterProvider.otherwise('/');

    // angular highlight js
    hljsServiceProvider.setOptions({
    // replace tab with 4 spaces
        tabReplace: '    '
    });

    $urlRouterProvider.when('/auth/:provider', function () {
        window.location.reload();
    });

});

// This app.run is for controlling access to specific states.
app.run(function ($rootScope, AuthService, $state) {

    // The given state requires an authenticated user.
    var destinationStateRequiresAuth = function (state) {
        return state.data && state.data.authenticate;
    };

    // $stateChangeStart is an event fired
    // whenever the process of changing a state begins.
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {

        if (!destinationStateRequiresAuth(toState)) {
            // The destination state does not require authentication
            // Short circuit with return.
            return;
        }

        if (AuthService.isAuthenticated()) {
            // The user is authenticated.
            // Short circuit with return.
            return;
        }

        // Cancel navigating to new state.
        event.preventDefault();

        AuthService.getLoggedInUser().then(function (user) {
            // If a user is retrieved, then renavigate to the destination
            // (the second time, AuthService.isAuthenticated() will work)
            // otherwise, if no user is logged in, go to "login" state.
            if (user) {
                $state.go(toState.name, toParams);
            } else {
                $state.go('login');
            }
        });

    });

});

// Angular Marked config

// app.config(['markedProvider', function (markedProvider) {
//   markedProvider.setOptions({
//     gfm: true,
//     tables: true,
//     highlight: function (code, lang) {
//       if (lang) {
//         return hljs.highlight(lang, code, true).value;
//       } else {
//         return hljs.highlightAuto(code).value;
//       }
//     }
//   });
// }]);

app.config(['markedProvider', function (markedProvider) {
  markedProvider.setOptions({
    gfm: true,
    highlight: function (code, lang) {
        return hljs.highlightAuto(code).value;
      }
  });
}]);