function formatDate() {
    return function (date) {
        return moment(date).format("D. M. Y");
    };
}

function formatDateTime() {
    return function (dateTime) {
        return moment(dateTime).format("D. M. Y H:m");
    }
}

function birthDateObjectToDate(date) {
    return new Date(date.year, date.month - 1, date.day);
}

function birthDate() {
    return function (birthNumber) {
        var date = dateFromBirthNumber(birthNumber);
        if (date) {
            return formatDate()(birthDateObjectToDate(date));
        }

        return '';
    };
}

function getAgeDiff(patient, asOf) {
    var now = asOf ? moment(asOf) : moment();
    var birthDate = moment(birthDateObjectToDate(dateFromBirthNumber(patient.Person.birthNumber)));
    var diffDays = now.diff(birthDate, 'days');
    var diffWeeks = now.diff(birthDate, 'weeks');
    var diffMonths = now.diff(birthDate, 'months');

    return {
        days: diffDays,
        weeks: diffWeeks,
        months: diffMonths
    };
}

function gestationalAge() {
    return function (patient) {
        if (!patient) {
            return;
        }
        var diff = getAgeDiff(patient);
        return (diff.weeks + patient.Patient.birthWeek) + ' t. + ' + diff.days % 7 + ' d.';
    };
}

function expectedBirth() {
    return function (patient) {
        if (!patient) {
            return;
        }
        var birthDate = moment(birthDateObjectToDate(dateFromBirthNumber(patient.Person.birthNumber)));
        var expected = birthDate.add(40 - patient.Patient.birthWeek, 'weeks');
        return formatDate()(expected.toDate());
    };
}

function correctedAge() {
    return function (patient, asOf) {
        if (!patient) {
            return;
        }
        var diff = getAgeDiff(patient, asOf);

        var weekDiff = ((diff.weeks + patient.Patient.birthWeek) - 40);
        var dayDiff = weekDiff > 0 ? diff.days % 7 : (7 - (diff.days % 7));
        var plusMinus = weekDiff > 0 ? '+' : '-';

        return weekDiff + ' t. ' + plusMinus + dayDiff + ' d.';
    };
}

function age() {
    return function (patient) {
        if (!patient) {
            return;
        }
        var diff = getAgeDiff(patient);
        if (diff.months > 3) {
            return diff.months + 'm.';
        }
        return (diff.weeks) + ' t. + ' + diff.days % 7 + ' d.';
    };
}

angular
    .module('auxology')
    .filter('formatDate', formatDate)
    .filter('expectedBirth', expectedBirth)
    .filter('formatDateTime', formatDateTime)
    .filter('birthDate', birthDate)
    .filter('correctedAge', correctedAge)
    .filter('age', age)
    .filter('gestationalAge', gestationalAge);