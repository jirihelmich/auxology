function birthDate($filter) {
    return function (birthNumber) {

        var date = dateFromBirthNumber(birthNumber);
        if (date) {
            return $filter('date')(new Date(date.year, date.month - 1, date.day));
        }

        return '';
    };
}

angular
    .module('auxology')
    .filter('birthDate', birthDate);