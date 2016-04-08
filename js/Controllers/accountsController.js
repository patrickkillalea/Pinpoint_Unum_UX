var app = angular.module('myapp', []);

    app.controller('accountsCtrl', function($scope, $http) {
        $http.get("http://127.0.0.1:8080/getStuff")
            .then(function(response) {
                $scope.accounts = response.data.result;
                console.log($scope.accounts);
            });
    });

    app.controller('procCtrl', function($scope, $http) {
        $http.get("http://127.0.0.1:8080/callProcedure?storedProc=V13_L_Harmony.dbo.usp_UDT_GetHarmonyAccounts")
            .then(function(response) {
                $scope.proc = response.data.result[0];
                console.log($scope.proc);
            });
    });