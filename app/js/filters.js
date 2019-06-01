function formatDate() {
    return function (date) {
        if (!date || !isValidDate(date)) {
            return '';
        }
        return moment(date).format("D. M. Y");
    };
}

function isValidDate(d) {
    if ( Object.prototype.toString.call(d) !== "[object Date]" )
        return false;
    return !isNaN(d.getTime());
}

function formatDateTime() {
    return function (dateTime) {
        if (!dateTime) {
            return '';
        }
        return moment(dateTime).format("D. M. Y H:mm");
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

function printDiff(diff) {
    if (Math.abs(diff.months) > 2) {
        return diff.months + ' ' + monthsSuffix(diff.months);
    }

    var dayDiff = diff.days % 7;
    var week = diff.weeks;
    return (week) + ' ' + weeksSuffix(week) + ' ' + dayDiff + ' ' + daysSuffix(dayDiff);
}

function gestationalAge() {
    return function (patient) {
        if (!patient) {
            return;
        }
        var diff = getAgeDiff(patient, moment(new Date()).add(patient.Patient.birthWeek, 'weeks'));
        return printDiff(diff);
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

function correctedWeek(patient, asOf) {
    if (!patient) {
        return;
    }
    var diff = getAgeDiff(patient, asOf);
    return ((diff.weeks + patient.Patient.birthWeek) - 40);
}

function correctedAge() {
    return function (patient, asOf) {
        if (!patient) {
            return;
        }
        var diff = getAgeDiff(patient, moment(asOf).add(patient.Patient.birthWeek - 40, 'weeks'));
        return printDiff(diff);
    };
}

function weeksSuffix(weeksCount) {
    switch (Math.abs(weeksCount)) {
        case 0:
            return 'týdnů';
        case 1:
            return 'týden';
        case 2:
            return 'týdny';
        case 3:
            return 'týdny';
        case 4:
            return 'týdny';
        default:
            return 'týdnů';
    }
}

function daysSuffix(daysCount) {
    switch (Math.abs(daysCount)) {
        case 0:
            return 'dnů';
        case 1:
            return 'den';
        case 2:
            return 'dny';
        case 3:
            return 'dny';
        case 4:
            return 'dny';
        case 5:
            return 'dnů';
        case 6:
            return 'dnů';
    }
}

function monthsSuffix(monthsCount) {
    switch (Math.abs(monthsCount)) {
        case 0:
            return 'měsíců';
        case 1:
            return 'měsíc';
        case 2:
            return 'měsíce';
        case 3:
            return 'měsíce';
        case 4:
            return 'měsíce';
        default:
            return 'měsíců';
    }
}

function age() {
    return function (patient) {
        if (!patient) {
            return;
        }
        var diff = getAgeDiff(patient);
        return printDiff(diff);
    };
}

function birthNumber() {
    return function (number) {
        if (!number) {
            return '';
        }
        if (number.length < 6) {
            return number;
        }
        return number.substring(0, 6) + "/" + number.substring(6);
    };
}

function mmToCm() {
    return function (mm) {
        if (!mm) {
            return '-';
        }

        var cm = mm / 10;
        if (!hasDecimal(cm)) {
            return cm + ".0";
        }
        return "" + cm;
    }
}

angular
    .module('auxology')
    .filter('formatDate', formatDate)
    .filter('expectedBirth', expectedBirth)
    .filter('formatDateTime', formatDateTime)
    .filter('birthDate', birthDate)
    .filter('birthNumber', birthNumber)
    .filter('correctedAge', correctedAge)
    .filter('age', age)
    .filter('mmToCm', mmToCm)
    .filter('gestationalAge', gestationalAge);