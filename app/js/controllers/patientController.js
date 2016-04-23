function PatientController($scope, $state, patientModel) {

    $scope.patient = {address: {}};
    $scope.father = {address: {}, gender: 'male'};
    $scope.mother = {address: {}, gender: 'female'};

    if ($state.params.id) {
        patientModel.getDetail($state.params.id).then(function (patients) {
            safeApply($scope, function () {

                var p = patients[0];

                $scope.currentPatient = p;

                $scope.patient.birthNumber = birthNumber()($scope.currentPatient.Person.birthNumber);
                $scope.patient.expectedBirthDate = formatDate()($scope.currentPatient.Patient.expectedBirthDate);
                $scope.patient.gender = $scope.currentPatient.Person.gender;
                $scope.patient.birthWeight = $scope.currentPatient.Patient.birthWeight;
                $scope.patient.birthWeek = $scope.currentPatient.Patient.birthWeek;
                $scope.patient.firstname = $scope.currentPatient.Person.firstName;
                $scope.patient.lastname = $scope.currentPatient.Person.lastName;
                $scope.patient.description = $scope.currentPatient.Person.description;
                $scope.patient.birthLength = mmToCm($scope.currentPatient.Patient.birthLength);
                $scope.patient.birthHeadCircumference = mmToCm($scope.currentPatient.Patient.birthHeadCircumference);

                $scope.patient.id = p.Patient.id;
                $scope.patient.personId = p.Person.id;
                $scope.patient.fatherId = p.Father.id;
                $scope.patient.motherId = p.Mother.id;

                $scope.mother.address = p.MotherAddress;
                $scope.father.address = p.FatherAddress;

                $scope.mother.birthNumber = p.Mother.birthNumber;
                $scope.mother.length = mmToCm(p.Mother.length);
                $scope.mother.weight = p.Mother.weight;
                $scope.mother.headCircumference = mmToCm(p.Mother.headCircumference);
                $scope.mother.firstname = p.Mother.firstName;
                $scope.mother.lastname = p.Mother.lastName;
                $scope.mother.description = p.Mother.description;
                $scope.mother.phone = p.Mother.phone;
                $scope.mother.email = p.Mother.email;
                $scope.mother.gender = 'female';

                $scope.father.birthNumber = p.Father.birthNumber;
                $scope.father.length = mmToCm(p.Father.length);
                $scope.father.weight = p.Father.weight;
                $scope.father.headCircumference = mmToCm(p.Father.headCircumference);
                $scope.father.firstname = p.Father.firstName;
                $scope.father.lastname = p.Father.lastName;
                $scope.father.description = p.Father.description;
                $scope.father.phone = p.Father.phone;
                $scope.father.email = p.Father.email;
                $scope.father.gender = 'male';
            });
        });
    }

    $scope.hasDecimal = hasDecimal;

    $scope.createPatient = function () {
        patientModel.createOrUpdate($scope.patient, $scope.mother, $scope.father).then(function (result) {

            $state.go('patients.detail', {id: result[0].id});

        }, function (error) {

            console.log(error);

        });
    };

}