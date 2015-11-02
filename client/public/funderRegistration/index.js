

module.exports = function FunderRegistrationController($scope,$state) {
	var vm = this;
	vm.basics = {};
	vm.fundingInformation = {};
	vm.financialInformation = {};
	vm.submit = {};
	vm.funderId = null;
	vm.welcomeModalIsOpen = true;
	
	vm.basicsActive = true;	
	
	vm.clearNav = function() {
		vm.basicsActive = false;
		vm.fundingInformationActive = false;
		vm.financialInformationActive = false;
		vm.submitActive = false;
	}
	
	vm.submitForm = function() {
		return FunderAPI.SaveFunder('B8CB0AAC-B08E-48B8-B2E4-F11586081C1E',{
			id:vm.funderId,
			userFirstName:vm.basics.userFirstName,
			userSurame:vm.basics.userSurame,
			userEmail:vm.basics.userEmail,
			userPosition:vm.basics.userPosition,
			organisationName:vm.basics.organisationName,
			organisationTelelphone:vm.basics.organisationTelelphone,
			organisationUrl:vm.basics.organisationUrl,
		}).then(function(result){
			//result is application id
			vm.funderId = result;
		});		
	};
	
	vm.finalSubmitForm = function() {
		vm.submitForm().then(function() {
			window.location = "/funderDashboard";
		});
	}
	
	vm.continueWelcomeModal = function(){
	vm.welcomeModalIsOpen = false;
	}
	
	vm.cancelWelcomeModal = function(){
	vm.welcomeModalIsOpen = false;
		window.location = "";
	}
}