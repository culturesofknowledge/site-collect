// Userlist data array for filling in info box
var userListData = [];
var editor; // use a global for the submit and return data rendering in the examples

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    // populateTable();
    
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
        url:  '/admin/upload/uploads'
      },
      edit: {
        type: 'PUT',
        url:  '/admin/upload/uploads/_id_'
      },
      remove: {
        type: 'DELETE',
        url:  '/admin/upload/uploads/_id_'
      }
    },
    "table": "#uploadTable",
    idSrc: "_id",
    "fields": [ 
      { "label": "Name of dataset"       , "name": "upload_name" },
      { "label": "Source of data", "name": "upload_description" },
      { "label": "upload_username:"   , "name": "upload_username", type : "hidden", "def" : username },
      { "label": "upload_status:"     , "name": "upload_status", type : "hidden", "def" : 0 },
      { "label": "total_works:"       , "name": "total_works", type : "hidden", "def" : 0 },
      { "label": "works_accepted:"    , "name": "works_accepted", type : "hidden", "def" : 0 },
      { "label": "works_rejected:"    , "name": "works_rejected", type : "hidden", "def" : 0 },
      { "label": "uploader_email:"    , "name": "uploader_email", type : "hidden", "def" : email  },
      { "label": "upload_timestamp:"  , "name": "upload_timestamp", type : "hidden"  } 
    ]
  } );

  // New record
  $('a.editor_create').on('click', function (e) {
    e.preventDefault();

    editor
      .title( 'Create new dataset' )
      .buttons( { "label": "Add", "fn": function () { editor.submit() } } )
      .create();
  } );
/*
  // Edit record
  $('#uploadTable').on('click', 'a.editor_edit', function (e) {
    e.preventDefault();

    editor
      .title( 'Edit record' )
      .buttons( { "label": "Update", "fn": function () { editor.submit() } } )
      .edit( $(this).closest('tr') );
  } );
*/
  // Delete a record (without asking a user for confirmation for this example)
  $('#uploadTable').on('click', 'a.editor_remove', function (e) {
    e.preventDefault();

    editor
      .message( 'Are you sure you wish to remove this record?' )
      .buttons( { "label": "Delete", "fn": function () { editor.submit() } } )
      .remove( $(this).closest('tr') );
  } );

  $('#uploadTable').DataTable( {
    dom        : "Tfrtip",
    processing : true,
    serverSide : false,
    ordering : true,
    order : [], // no initial order
    ajax: {
      "url" : "/admin/upload/uploads/byuser/" + username,
      "data" : {
          "sSearch_1" : "Brahe1"
      }
    },
    columns: [
      {
        data: null,
        name: "edit-button",
        className: "center",
        render: function ( data, type, row ) {
          // If upload has no works permit delete
          var editfield = '<a href="/work/byupload/' + data._id + '/' +  data.upload_name;
          editfield += '" class="editor_edit">Edit</a>';
          //if ( data.total_works < 1 ) {
          //  editfield +='/ <a href="" class="editor_remove">Delete</a>';
          //}
          return editfield;
        },
        "orderable": false
      },
      { data: "upload_name" },
      { data: "upload_description" },
      { data: "upload_status" },
      { data: "total_works" },
      //{ data: "works_accepted" },
      //{ data: "works_rejected" }
      //{ data: "upload_username" },
      //{ data: "uploader_email" },
      //{ data: "upload_timestamp" }
    ],
    tableTools: {
      sRowSelect: "os",
      aButtons: [
      { sExtends: "editor_create", editor: editor.title( 'Create new dataset' ) },
      { sExtends: "editor_edit",   sButtonText: "Rename dataset" ,editor: editor },
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
    $.getJSON( '/admin/upload', function( data ) {

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
            url: '/admin/upload',
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
      url: '/admin/upload/' + $(this).attr('rel')
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
