// Userlist data array for filling in info box
var userListData = [];
var editor; // use a global for the submit and return data rendering in the examples

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();
    
    // Username link click
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

    // Add User button click
    $('#btnAddUser').on('click', addUser);
    
    // Edit User button click
    $('#userList table tbody').on('click', 'td a.linkedituser', editUser);
    
    // Delete User link click
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

    //readyDataTable();
    
//});
// DataTable Editor ======================================================
//$(document).ready(function() {

  editor = new $.fn.dataTable.Editor( {
    ajax: {
      create: {
        type: 'POST',
        url:  '/admin/user/users'
      },
      edit: {
        type: 'PUT',
        url:  '/admin/user/users/_id_'
      },
      remove: {
        type: 'DELETE',
        url:  '/admin/user/users/_id_'
      }
    },
    "table": "#userTable",
    idSrc: "_id",
    "fields": [ {
        "label": "Username:",
        "name": "username"
      }, {
        "label": "Email:",
        "name": "email"
      }, {
        "label": "Full name:",
        "name": "name"
      }, {
        "label": "Password:",
        "name": "password"
      }
    ]
  } );

  // New record
  $('a.editor_create').on('click', function (e) {
    e.preventDefault();

    editor
      .title( 'Create new record' )
      .buttons( { "label": "Add", "fn": function () { editor.submit() } } )
      .create();
  } );

  // Edit record
  $('#userTable').on('click', 'a.editor_edit', function (e) {
    e.preventDefault();

    editor
      .title( 'Edit record' )
      .buttons( { "label": "Update", "fn": function () { editor.submit() } } )
      .edit( $(this).closest('tr') );
  } );

  // Delete a record (without asking a user for confirmation for this example)
  $('#userTable').on('click', 'a.editor_remove', function (e) {
    e.preventDefault();

    editor
      .message( 'Are you sure you wish to remove this record?' )
      .buttons( { "label": "Delete", "fn": function () { editor.submit() } } )
      .remove( $(this).closest('tr') );
  } );

  $('#userTable').DataTable( {
    dom        : "Tfrtip",
    processing : true,
    serverSide : true,
    ajax: {
      "url" : "/admin/user/users",
      "data" : {
          "sSearch_1" : "cofkrenhart"
      }
    },
    columns: [
      { data: "username" },
      { data: "email" },
      { data: "password" },
      { data: "name" },
      {
        data: null, 
        className: "center",
        defaultContent: '<a href="" class="editor_edit">Edit</a> / <a href="" class="editor_remove">Delete</a>'
      },
      { data: null, 
        render: function ( data, type, row ) {
          // Combine the first and last names into a single table field
          return data.name+' '+data._id;
        } 
      }
    ],
    tableTools: {
      sRowSelect: "os",
      aButtons: [
      { sExtends: "editor_create", editor: editor },
      { sExtends: "editor_edit",   editor: editor },
      { sExtends: "editor_remove", editor: editor }
      ]
    }
  } );
} );

// Functions =============================================================

// Fill table with data
function readyDataTable() {
  $('#userTable').dataTable();
};
  // Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/admin/user/users', function( data ) {

        // Stick our user data array into a userlist variable in the global object
        userListData = data.data;
        
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data.data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '" title="Show Details">' + this.username + '</td>';
            tableContent += '<td>' + this.name  + '</td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td>' + this.password + '</td>';
            tableContent += '<td><a href="#" class="linkedituser" rel="' + this._id + '">edit</a></td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
    });

    // Clear the form inputs
    $('#addUser fieldset input').val('');
    
    
};

// Show User Info
function showUserInfo(event) {
  
  // Prevent Link from Firing
  event.preventDefault();
  
  // Retrieve username from link rel attribute
  var thisUserName = $(this).attr('rel');
  
  // Get Index of object based on id value
  var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);
  
  // Get our User Object
  var thisUserObject = userListData[arrayPosition];
  
  //Populate Info Box
  $('#userUserName').text(thisUserObject.username);
  $('#userInfofullname').text(thisUserObject.name);
  $('#userInfopassword').text(thisUserObject.password);
  
};


// Edit User
function editUser(event) {
  
  // Prevent Link from Firing
  event.preventDefault();
  
  // Retrieve username from link rel attribute
  var thisID = $(this).attr('rel');
  
  // Get Index of object based on id value
  var arrayPosition = userListData.map(function(arrayItem) { return arrayItem._id; }).indexOf(thisID);
  
  // Get our User Object
  var thisUserObject = userListData[arrayPosition];
  
  //Populate Info Box
  $('#inputUserName').val(thisUserObject.username);
  $('#inputUserEmail').val(thisUserObject.email);
  $('#inputUserfullname').val(thisUserObject.name);
  $('#inputUserpassword').val(thisUserObject.password);
  $("#inputUserName").focus();
  return false;
};

// Add User
function addUser(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newUser = {
            'username'  : $('#inputUserName').val(),
            'email'     : $('#inputUserEmail').val(),
            'name'      : $('#inputUserfullname').val(),
            'password'  : $('#inputUserpassword').val(),
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/admin/user/users',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.message === 'User created!') {

                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.message);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

// Delete User
function deleteUser(event) {
  
  event.preventDefault();
  
  // Pop up a confirmation dialog
  var confirmation = confirm('Are you sure you want to delete this user?');
  
  // Check and make sure the user confirmed
  if (confirmation === true) {
    
    // If they did, do our delete
    $.ajax({
      type: 'DELETE',
      url: '/admin/user/users/' + $(this).attr('rel')
    }).done(function( response ) {
      
      // Check for a successful (blank) response
      if (response.msg === '') {
      }
      else {
        alert('Error: ' + response.msg);
      }
      
      // Update the table
      populateTable();
      
    });
    
  }
  else {
    
    // If they said no to the confirm, do nothing
    return false;
    
  }
  
};