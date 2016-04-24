function ProfileController($scope, personModel, toaster) {

    personModel.getCurrentDoctor().then(function (persons) {
        safeApply($scope, function () {
            var p = persons[0];
            $scope.doctor = p;
        });
    });

    $scope.updateProfile = function () {
        personModel.update($scope.doctor).then(function () {
            notify(toaster, 'Profil upraven', 'Úpravy profilu byly uloženy.', 'info');
        }, function (error) {
            notify(toaster, 'Chyba', 'Nečekaná chyba programu.', 'error');
        });
    };

}