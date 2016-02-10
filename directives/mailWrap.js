function mailWrap() {
    return {
        restrict: 'E',
        controllerAs: 'main',
        controller: ['$http', '$timeout', 'LS', function($http, $timeout, LS) {

            this.loaderIsVisible = true;
            this.currentMailboxCategory = 'Mail'; // title for category block
            this.categories = [{
                url: 'Mail.inbox',
                title: 'Mail'
                },
                {
                    url: 'Contacts',
                    title: 'Contacts'
                }]; // list of categories in header block
            this.showMailboxCategory = false; // flag which trigger show/hide action
            this.activeId = 0;
            this.activeMailBox = 'inbox';

            this.successHttpCall = function(response) {
                this.mail = response.data;
                this.category = [{id: 0, name: 'inbox', title: 'Inbox'},
                    {id: 1, name: 'sent', title: 'Sent mail'},
                    {id: 2, name: 'spam', title: 'Spam'}];
                this.loaderIsVisible = false;
            }.bind(this);

            this.errorHttpCall = function(response) {
                console.log(response.status + ", unexpectable error: " + response.statusText)
            };

            this.changeCategory = function(data) {
                this.currentMailboxCategory = data;
                this.showMailboxCategory = false;
            };

            this.activeCategory = function(index) {
                this.loaderIsVisible = true;
                $timeout(function() {
                    this.activeId = index;
                    this.category.forEach(function(el) {
                        if(el.id == this.activeId) {
                            this.activeMailBox = el.name;
                        }
                        this.loaderIsVisible = false;
                    }.bind(this))
                }.bind(this), 1000);
            };


            $timeout(function() {
                $http.get('data.json').then(this.successHttpCall, this.errorHttpCall);
            }.bind(this), 500);


            //contacts operations

            this.list = (localStorage.contacts) ? LS.readData() : [];

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
                this.list = LS.readData();
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