function dateFromBirthNumber(birthNumber) {
    var regex = /^\s*(\d\d)(\d\d)(\d\d)[ /]*(\d\d\d)(\d?)\s*$/;
    var match = regex.exec(birthNumber);

    if (match) {
        var year = parseInt(match[1]);
        var month = parseInt(match[2]);
        var day = parseInt(match[3]);
        var ext = parseInt(match[4]);
        var c = match[5];

        var mod;

        if (c === '') {
            year += year < 54 ? 1900 : 1800;
        } else {
            mod = ('' + year + month + day + ext) % 11;
            if (mod === 10) {
                mod = 0;
            }
            if (mod !== parseInt(c)) {
                return false;
            }

            year += year < 54 ? 2000 : 1900;
        }

        if (month > 70 && year > 2003) {
            month -= 70;
        } else if (month > 50) {
            month -= 50;
        } else if (month > 20 && year > 2003) {
            month -= 20;
        }

        return {
            year: year,
            month: month,
            day: day
        };
    }

    return null;
}