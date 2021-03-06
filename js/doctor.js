//################################################################################
//################################################################################
//--------------------------------------------------------------------------------
//Patient in navbar stuff --------------------------------------------------------
var patientsInNavBar = [];

//Take patient names out of the navbar - UI
var assignNavbarXClickListener = function() {
	$('a.navIconButton').click(function (e) {
		var id = this.id;
		var name = id.substring(1);
		$('#'+name).remove();
		removePatientFromNavbar(name);
    });
};

//Remove patient from Data Structure
var removePatientFromNavbar = function(fullName) {
	var i = patientsInNavBar.indexOf(fullName);
	if(i != -1) {
		patientsInNavBar.splice(i, 1);
	}
};

var patientIsInNavbar = function(fullName) {
	var i = patientsInNavBar.indexOf(fullName);
	if (i != -1) {
		return true;
	} else {
		return false;
	}
};

var removePatientThatIsNot = function(firstName, lastName) {
	for (var i = 0; i < patientsInNavBar.length; i++) {
		if (patientsInNavBar[i] != firstName+lastName) {
			$('#'+patientsInNavBar[i]).remove();
			patientsInNavBar.splice(i, 1);
			return;
		}
	}
};

var removePatientFromNavUI = function(fullName) {
	$('#'+fullName).remove();
};

//Add person to top navbar
var addPatientToNav = function(firstName, lastName) {
	if (patientIsInNavbar(firstName+lastName)) {
		return;
	}
	else {
		if (patientsInNavBar.length > 3) {
			removePatientThatIsNot(firstName, lastName);
		}
		$('#patientNavList').append(
			'<li class="patientNavbar" id="'+firstName+lastName+'"> \
    	      <a href="#" class="patientInNav" style="float: left;">'+firstName+' '+lastName+'</a> \
    	      <a href="#" style="float:right;" class="navIconButton" id="x'+firstName+lastName+'"> \
    	        <span class="glyphicon glyphicon-remove-circle"></span> \
    	      </a> \
    	    </li>'
		);
		patientsInNavBar.push(firstName+lastName);
		reassignListeners();
	}
};

var unbindListeners = function() {
	$('a.navIconButton').unbind('click');
	$('a.patient').unbind('click');
	$('.patientInNav').unbind('click');
	$('li.patient').unbind('click');
};
var reassignListeners = function() {
	unbindListeners();
	assignNavbarXClickListener();
	addPatientSideNavListener();
	addPatientTopNavListener();
};

//End patients in navbar stuff ---------------------------------------------------
//--------------------------------------------------------------------------------
//################################################################################
//################################################################################



//################################################################################
//################################################################################
//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
//Panel Loading

var currentPatient = "";


//Loading HTML into panels
var loadLeftPanel = function(fullName) {
	var previousPatient = $("#patientName").text();
	console.log('here');
	var previousPatientArray = previousPatient.split(" ");
	previousPatient = previousPatientArray[0] + previousPatientArray[1];
	$.ajax({
		url: 'templates/patientBio.html',
		context: document.body,
		success: function(response) {
			$("#leftPanel").html(response);
			populateBio(fullName);
			currentPatient = fullName;
			loadRightPanel(currentPatient, previousPatient);
		}
	});
	var firstName = Patients[fullName]['firstName'];
	var lastName = Patients[fullName]['lastName'];
	$('#patientName').html(firstName+" "+lastName);
	//If they're in the navbar, take them out
	if (patientIsInNavbar(fullName)) {
		removePatientFromNavbar(fullName);
		removePatientFromNavUI(fullName);
	}
	//Put the old patient in the nav
	if (previousPatient != "undefined") {
		var previousFirst = Patients[previousPatient]['firstName'];
		var previousLast = Patients[previousPatient]['lastName'];
		if (previousPatient != fullName) {
			addPatientToNav(previousFirst, previousLast);
		}
	}
};

var loadRightPanel = function(currentPatient, previousPatient) {
	//$.ajax({
	//	url: file+'.html',
	//	context: document.body,
	//	success: function(response) {
	//		$("#rightPanel").html(response);
	//	}
	//});
	if (previousPatient != 'undefined') {
		deleteAllGraphs(previousPatient);
	}
	for (var i = 0; i < Patients[currentPatient]["forms"].length; i++){
      makeGraph(currentPatient, Patients[currentPatient]["forms"][i], "20141201", "20141221", MIN_DATE, MAX_DATE);
    }
};

var loadPatient = function(fullName) {
	loadLeftPanel(fullName);
	//loadRightPanel(fullName);
};

var populateBio = function(fullName) {
	var bio = Patients[fullName]['bio'];
	$('#patientPicture').attr('src', bio['photo']);
	$('#height').html('<span class="text-primary">Height:</span> '+bio['height']);
	$('#weight').html('<span class="text-primary">Weight:</span> '+bio['weight']+ ' lbs');
	$('#bloodPressure').html('<span class="text-primary">Blood Pressure:</span> '+bio['systolicBloodPressure'] + '/' + bio['diastolicBloodPressure']);
	$('#heartRate').html('<span class="text-primary">Heart Rate: </span> '+bio['heartRate']+' bpm');
	$('#recentUpdates').html('<h6>Recent Updates:</h6>'+bio['recentUpdates']);
	$('#overview').html('<h6>Overview:</h6>'+bio['overview']);
};


//Load form into right panel
var assignNewForm = function() {
	loadRightPanel('assignNewForm');
};

//Add click listener for when we click on a patient in the side nav
var addPatientSideNavListener = function() {
	$('a.patient').click(function (e) {
		var name = e.target.text;
		var nameArray = name.split(" ");
		var fullName = nameArray[0]+nameArray[1];
		if (currentPatient != fullName) {
			loadPatient(fullName);	
		}
		//$('#theSideNav').offcanvas('hide');
	});
};
//Add click listener for when we click on a patient in the top nav
var addPatientTopNavListener = function() {
	$('a.patientInNav').click(function (e) {
		var name = e.target.text;
		var nameArray = name.split(" ");
		var fullName = nameArray[0]+nameArray[1];
		if (currentPatient != fullName) {
			loadPatient(fullName);	
		}
	});
};

//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
//################################################################################
//################################################################################
//Editing Bio code
var editBio = function(height, weight, systolicBloodPressure, diastolicBloodPressure, heartRate, newUpdate, newOverview, newPicture) {
	var bioFieldStrings = ['height', 'weight', 'systolicBloodPressure', 'diastolicBloodPressure', 'heartRate', 'recentUpdates', 'overview', 'photo'];
	var bioFields = [height, weight, systolicBloodPressure, diastolicBloodPressure, heartRate, newUpdate, newOverview, newPicture];
	for (var i = 0; i < bioFields.length; i ++){
		if (bioFields[i] != ""){
			Patients[currentPatient]['bio'][bioFieldStrings[i]] = bioFields[i];
		}
	};
	populateBio(currentPatient);
};

//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
//################################################################################
//################################################################################
//Editing Password code
var editPassword = function(fullName, isDoctor, oldPassword, newPassword) {
	fullName = fullName.replace(/\s/g, '');
	if (isDoctor) {
		if (Doctors[fullName]['password'] == oldPassword) {
			Doctors[fullName]['password'] == newPassword;
		} else {
			alert("INCORRECT PASSWORD");
		}
	} else {
		if (Patients[fullName]['password'] == oldPassword) {
			Patients[fullName]['password'] == newPassword;
		} else {
			alert("INCORRECT PASSWORD");
		}
	}
};	


//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
//################################################################################
//################################################################################
//Adding new patient code
var addNewPatient = function(firstName, lastName) {
	firstName = firstName.replace(/\s/g, '');
	lastName = lastName.replace(/\s/g, '');
	firstName = capitalizeFirstLetter(firstName);
	lastName = capitalizeFirstLetter(lastName);
	var fullName = firstName+lastName;
	patientJSON = {
					'firstName': firstName,
					'lastName': lastName,
					'bio': basicBio,
					'forms': [],
					'annotations': []};
	Patients[fullName]= patientJSON;
	addPatientToSideNav(firstName, lastName);
	reassignListeners();
};

var addFormToPatient = function(fullName, formType) {
	if (Patients[fullName]['forms'].indexOf(formType) == -1) {
		Patients[fullName]['forms'].push(formType);
		Patients[fullName]['annotations'][formType] = [];
	} else {
		alert(firstName+" "+lastName+" already has the form: "+formType);
	}
};

var removeFormFromPatient = function(fullName, formType) {
	if (Patients[fullName]['forms'].indexOf(formType) != -1) {
		Patients[fullName]['forms'].splice(Patients[fullName]['forms'].indexOf(formType), 1);
		Patients[fullName]['annotations'][formType] = [];
	} else {
		alert(firstName+" "+lastName+" does not have the form: "+formType);
	}
};

var assignForms = function(){
	deleteAllGraphs(currentPatient);
	var applySleepForm = $('#applySleepForm').is(':checked');
	var applyAnxietyForm = $('#applyAnxietyForm').is(':checked');
	var applyMoodForm = $('#applyMoodForm').is(':checked');
	var deleteSleepForm = $('#deleteSleepForm').is(':checked');
	var deleteAnxietyForm = $('#deleteAnxietyForm').is(':checked');
	var deleteMoodForm = $('#deleteMoodForm').is(':checked');
	var formsToApply = [applySleepForm, applyAnxietyForm, applyMoodForm];
	var formsToDelete = [deleteSleepForm, deleteAnxietyForm, deleteMoodForm];
	console.log(formsToApply, formsToDelete)
	var formTypes = ['sleep', 'anxiety', 'mood'];
	for (var i = 0; i < formsToApply.length; i ++){
		if (formsToApply[i]){
			addFormToPatient(currentPatient, formTypes[i])
		};
	};
	for (var i = 0; i < formsToDelete.length; i ++){
		if (formsToDelete[i]){
			removeFormFromPatient(currentPatient, formTypes[i])
		};
	};
	for (var i = 0; i < Patients[currentPatient]["forms"].length; i++){
      makeGraph(currentPatient, Patients[currentPatient]["forms"][i], "20141201", "20141221", MIN_DATE, MAX_DATE);
    };
};

var addPatientToSideNav = function(firstName, lastName) {
	$('#sideNavPatientList').append('<li class="patient"><a href="#" class="patient">'+firstName+' '+lastName+'</a></li>')
};

var populateFormAssignModal = function(){
	$('#assignSleepForm').show();
	$('#assignMoodForm').show();
	$('#assignAnxietyForm').show();
	$('#removeSleepForm').show();
	$('#removeMoodForm').show();
	$('#removeAnxietyForm').show();
	var assignedForms = Patients[currentPatient]["forms"];
	var formTypes = ['sleep', 'anxiety', 'mood'];
	for (var i = 0; i < assignedForms.length; i ++){
		var currentFormType = assignedForms[i];
		var indexType = formTypes.indexOf(currentFormType);
		formTypes.splice(indexType, 1);
		currentFormType = currentFormType.charAt(0).toUpperCase() + currentFormType.slice(1);
		var idString = 'assign' + currentFormType + 'Form';
		$('#' + idString).hide();
	};
	for (var i = 0; i < formTypes.length; i ++){
		var currentFormType = formTypes[i];
		currentFormType = currentFormType.charAt(0).toUpperCase() + currentFormType.slice(1);
		var idString = 'remove' + currentFormType + 'Form';
		$('#' + idString).hide();
	}

}

//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
//################################################################################
//################################################################################
//log in code

var drLogIn = function(username, password){
	if((Doctors["Dr.Dre"]["username"] != username) || (Doctors["Dr.Dre"]["password"] != password)){
		return false;
	}
};

//Add Annotation
var addAnnotation = function(firstName, lastName, formType, annotation) {
	var fullName = firstName+lastName;
	alert(fullName);
	Patients[fullName]['annotations'][formType].push(annotation);
};

//Annotation Editing
var editAnnotation = function(firstName, lastName, formType, date, newAnnotation) {
	var fullName = firstName+lastName;
	var annotations = Patients[fullName]['annotations'][formType];
	var found = false;
	for (var i = 0; i < annotations.length; i ++) {
		if (annotations[i]["date"] == date) {
			annotations[i] = newAnnotation;
			found = true;
		}
	}
	if (!found) {
		alert("That annotation doesn't exist");
	}
};	

//Delete Annotation
var deleteAnnotation = function(firstName, lastName, formType, date) {
	var fullName = firstName+lastName;
	var annotations = Patients[fullName]['annotations'][formType];
	var found = false;
	for (var i = 0; i < annotations.length; i ++) {
		var theDate = new Date(date);
		console.log(theDate.toString());
		if (annotations[i]["date"].toString() == theDate.toString()) {
			annotations.splice(i, 1);
			found = true;
		}
	}
	if (!found) {
		alert("That annotation doesn't exist");
	}
};


//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
//################################################################################
//################################################################################
//Log In
var drLogIn = function(username, password){
	if((Doctors["Dr.Dre"]["username"] != username) || (Doctors["Dr.Dre"]["password"] != password)){
		alert("That User does not exist")
		return false;
	}
};


//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
//################################################################################
//################################################################################

$( document ).ready(function() {
	currentPatient = 'JaneGoodall';
	loadPatient("JaneGoodall");
    reassignListeners();
});
