function mailWrap() {
    return {
        restrict: 'E',
        controllerAs: 'main',
        controller: ['$timeout', 'LS', 'getData', 'state', function($timeout, LS, getData, state) {

            this.loaderIsVisible = true;
            this.categories = [{// list of categories in header block
                url: 'Mail.inbox',
                title: 'Mail'
                },
                {
                    url: 'Contacts',
                    title: 'Contacts'
                }];
            this.showMailboxCategory = false; // flag which trigger show/hide action

            this.successHttpCall = function(response) {
                this.loaderIsVisible = true;
                this.mail = response.data;
                this.category = [{id: 0, name: 'inbox', title: 'Inbox'},
                    {id: 1, name: 'sent', title: 'Sent mail'},
                    {id: 2, name: 'spam', title: 'Spam'}];
                this.changeCategory();
                this.activeMailCategory();
            }.bind(this);

            this.errorHttpCall = function(response) {
                console.log(response.status + ", unexpectable error: " + response.statusText)
            };

            this.changeCategory = function() { // change mail/contacts ccategories
                state.getCurrentState().then(function(data){

                    if(data !== '/contacts') {
                        this.currentMailboxCategory = 'Mail';
                        this.activeMailCategory();
                    }
                    else {
                        this.currentMailboxCategory = 'Contacts'
                    }
                }.bind(this));

                this.showMailboxCategory = false;
            };

            this.activeMailCategory = function() { // change inbox/sent/spam categories
                state.getCurrentState().then(function(data) {
                    console.log(data);
                    this.category.forEach(function(el) {
                        if('/'+el.name == data) {
                            this.activeMailBox = el.name;
                        }
                        this.loaderIsVisible = false;
                    }.bind(this));
                }.bind(this));
            };
            $timeout(function() {
                getData.get().then(this.successHttpCall, this.errorHttpCall);
            }.bind(this), 500);



            //contacts operations

            this.contactList = (localStorage.contacts) ? LS.readData() : [];

            this.editUser = function(data) {
                this.editMode = true;
                this.userData = data;
            };

            this.createFirstContact = function() {
                storageObj = {
                    id: 0,
                    name: this.userData.username,
                    email: this.userData.email
                }
                LS.writeData([storageObj]);
            }

            this.updateContacts = function() {
                this.editMode = false;
                this.contactList = LS.readData();
            };

            this.resetContactSettings = function() {
                for(var key in this.userData) {
                    this.userData.key = '';
                }
            };

            this.editExistenceContact = function() {
                var currentStorage = LS.readData();
                var presenceFlag = true;

                if(this.userData.id == undefined) {
                    this.userData.id = currentStorage.length;
                    presenceFlag = false;
                }
                storageObj = {
                    id: this.userData.id,
                    name: this.userData.username,
                    email: this.userData.email
                };

                if(presenceFlag) {
                    currentStorage[this.userData.id] = storageObj
                }
                else {
                    currentStorage.push(storageObj);
                }

                LS.writeData(currentStorage);
            }

            this.saveContactInfo = function() {
                var storageObj = null;
                if(!localStorage.contacts) {
                    this.createFirstContact();
                }
                else {
                    this.editExistenceContact();
                }

                this.updateContacts();
                this.resetContactSettings();
            }

        }]


    }
};