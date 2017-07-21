Vue.use(VeeValidate);
Vue.filter('phone', function (phone) {
  return phone.replace(/[^0-9]/g, '')
              .replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
});

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
    newFullName: '',
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
    newFirstName: function() {
      var names = this.newFullName.split(' ')
      return names[0]
    },
    newLastName: function() {
      var names = this.newFullName.split(' ')
      return names.slice(1).join(' ')
    },
    editFullName: function() {
      return (this.editFirstName + ' ' + this.editLastName).trim()
    }
  },

  methods: {
    addContact: function () {
      if (this.errors.first('newFullName') || this.errors.first('newPhone') || this.errors.first('newZip') || this.errors.first('newDob')) {
        alert('fix errors')
        return
      }
      this.contacts.push({
        id: contactStorage.uid++,
        fullName: this.newFullName,
        firstName: this.newFirstName,
        lastName: this.newLastName,
        phone: this.newPhone,
        zip: this.newZip,
        dob: this.newDob,
        background: pickColor()
      })
      this.contacts.sort(compare)
      this.newFullName = ''
      this.newPhone = ''
      this.newZip = ''
      this.newDob = ''
      $('#createContact').modal('hide')
    },

    insertALot: function() {
      var i = 0
      while(i < 100) {
        const fn = (Math.random()+1).toString(36).substring(7)
        const ln = (Math.random()+1).toString(36).substring(7)
        this.contacts.push({
          firstName: fn,
          lastName: ln,
          fullName: fn + ' ' + ln,
          phone: (Math.random()+1).toString().substring(2,12),
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
      if (!this.editingContact || this.errors.first('editFirstName') || this.errors.first('editLastName') || this.errors.first('editPhone') || this.errors.first('editZip') || this.errors.first('editDob')) {
        alert('fix errors')
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
      this.editFirstName = ''
      this.editLastName = ''
      this.editPhone = ''
      this.editZip = ''
      this.editDob = ''
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
$('#createContact').on('shown.bs.modal', function() { $('#newFullName').focus() })
$('#editContact').on('shown.bs.modal', function() { $('#editFirstName').focus() })

