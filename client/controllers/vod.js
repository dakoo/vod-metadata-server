var app = angular.module('vodApp', [])
.config([
    '$compileProvider', function( $compileProvider){
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|rtsp):/);
    }
]);
app.controller('vodCtrl', function($scope, $http) {
	$http.get("http://52.76.7.127/vod")
		.success(function(response) {
			$scope.streams = response;
		});
});
