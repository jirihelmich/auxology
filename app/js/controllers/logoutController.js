function LogoutController(sessionModel, $state) {

    sessionModel.signOut();
    $state.go('login');

}