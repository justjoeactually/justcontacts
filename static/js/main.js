Vue.use(VeeValidate);

var STORAGE_KEY = 'contacts-vuejs-2.0'
var contactStorage = {
  fetch: function () {
    var contacts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    contacts.forEach(function (contact, index) {
      contact.id = index
    })
    contactStorage.uid = contacts.length
    contacts.sort(compare)
    return contacts
  },
  save: function (contacts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts))
  }
}

var materialPalette = ["#e51c23", "#3f51b5", "#5677fc", "#03a9f4", "#00bcd4"]

var pickColor = function() {
  var index = Math.floor(Math.random()*materialPalette.length)
  return materialPalette[index]
}

var app = new Vue({
  data: {
    search: '',
    contacts: contactStorage.fetch(),
    newFirstName: '',
    newLastName: '',
    newPhone: '',
    newZip: '',
    newDob: '',
    editingContact: null,
    editFirstName: '',
    editLastName: '',
    editPhone: '',
    editZip: '',
    editDob: '',
    visibility: 'all'
  },

  filters: {
    pluralize: function(n) {
      return n == 1 ? 'contact' : 'contacts'
    }
  },

  watch: {
    contacts: {
      handler: function (contacts) {
        contactStorage.save(contacts)
      },
      deep: true
    }
  },

  computed: {
    filteredContacts: function () {
      return this.contacts.filter(c => {
        return c.fullName.toLowerCase().includes(this.search.toLowerCase())
      })
    },
    newFullName: {
      get: function() {
        return (this.newFirstName + ' ' + this.newLastName).trim()
      },
      set: function(newValue) {
        var names = newValue.split(' ')
        this.newFirstName = names[0]
        this.newLastName = names.slice(1).join(' ')
      }
    },
    editFullName: {
      get: function() {
        return (this.editFirstName + ' ' + this.editLastName).trim()
      },
      set: function(newValue) {
        var names = newValue.split(' ')
        this.editFirstName = names[0]
        this.editLastName = names.slice(1).join(' ')
      }
    }
  },

  methods: {
    addContact: function () {
      var value = this.newFirstName && this.newFirstName.trim()
      if (!value) {
        return
      }
      this.contacts.push({
        id: contactStorage.uid++,
        firstName: this.newFirstName,
        lastName: this.newLastName,
        phone: this.newPhone,
        zip: this.newZip,
        dob: this.newDob,
        fullName: (this.newFirstName + ' ' + this.newLastName).trim(),
        background: pickColor()
      })
      this.contacts.sort(compare)
      this.newFirstName = ''
      this.newLastName = ''
      this.newPhone = ''
      this.newZip = ''
      this.newDob = ''
      $('#createContact').modal('hide')
    },

    insertALot: function() {
      var i = 0
      while(i < 100) {
        const fn = Math.random().toString(36).substring(7)
        const ln = Math.random().toString(36).substring(7)
        this.contacts.push({
          firstName: fn,
          lastName: ln,
          fullName: fn + ' ' + ln,
          phone: Math.random().toString().substring(10),
          zip: Math.random().toString().substring(5),
          dob: Math.random().toString().substring(8),
          background: pickColor()
        })
        i++
      }
    },

		clearContacts: function() {
			this.contacts = []
		},

    removeContact: function (contact) {
      //this.contacts.splice(this.contacts.indexOf(contact), 1)
      this.contacts = this.contacts.filter(c => {return c.id != contact.id})
    },

    editContact: function (contact) {
      this.editingContact = contact;
      this.editFirstName = contact.firstName
      this.editLastName = contact.lastName
      this.editPhone = contact.phone
      this.editZip = contact.zip
      this.editDob = contact.dob
      $('#editContact').modal('show')
    },

    doneEdit: function () {
      if (!this.editingContact) {
        return
      }
      this.editingContact.firstName = this.editFirstName.trim()
      this.editingContact.lastName = this.editLastName.trim()
      this.editingContact.fullName = (this.editingContact.firstName + ' ' + this.editingContact.lastName).trim()
      this.editingContact.phone = this.editPhone.trim()
      this.editingContact.zip = this.editZip.trim()
      this.editingContact.dob = this.editDob.trim()
      if (!this.editingContact.fullName) {
        this.removeContact(this.editingContact)
      }
      Vue.set(this.contacts, this.editingContact.id, this.editingContact)
      this.editingContact = null
      $('#editContact').modal('hide')
    },

    cancelEdit: function (contact) {
      this.editingContact = null
      $('#editContact').modal('hide')
    }
  }
})

function onHashChange () {
  var search = window.location.hash.replace(/#\/?/, '')
  this.search = search
}

function compare(a,b) {
  if (a.firstName.toLowerCase() < b.firstName.toLowerCase())
    return -1;
  if (a.firstName.toLowerCase() > b.firstName.toLowerCase())
    return 1;
  return 0;
}

window.addEventListener('hashchange', onHashChange)
onHashChange()

// mount
app.$mount('.contactApp')
$('#createContact').on('shown.bs.modal', function() { $('#fullName').focus() })

