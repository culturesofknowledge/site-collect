// Userlist data array for filling in info box
var userListData = [];
var work_editor; // use a global for the submit and return data rendering in the examples

// DOM Ready =============================================================
$(document).ready(function() {
  console.log("readying work.js");
  
    // Populate the user table on initial page load
    // populateTable();
    
    // Username link click
    //$('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

    // Add User button click
    //$('#btnAddUser').on('click', addUser);
    
    // Edit User button click
    //$('#userList table tbody').on('click', 'td a.linkedituser', editUser);
    
    // Delete User link click
    //$('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

    //readyDataTable();
    
//});
// DataTable Editor ======================================================
//$(document).ready(function() {

  work_editor = new $.fn.dataTable.Editor( {
    ajax: {
      create: {
        type: 'POST',
        url:  '/work/work'
      },
      edit: {
        type: 'PUT',
        url:  '/work/work/edit/_id_'
      },
      remove: {
        type: 'DELETE',
        url:  '/work/work/_id_'
      }
    },
    "table": "#workTable",
    idSrc: "_id",
    "fields": [ 
      { "label":"iwork_id:", "name": "iwork_id" },
      { "label":"date_of_work_as_marked:", "name": "date_of_work_as_marked" },
      { "label":"original_calendar:", "name": "original_calendar", type : "hidden", "def" : ""   },
      { "label":"date_of_work:", "name": "date_of_work", type : "hidden", "def" : ""   },
      { "label":"std_year:", "name": "date_of_work_std_year", type : "hidden", "def" : ""  },
      { "label":"std_month:", "name": "date_of_work_std_month", type : "hidden", "def" : ""  },
      { "label":"std_day:", "name": "date_of_work_std_day", type : "hidden", "def" : ""  },
      { "label":"end_year:", "name": "date_of_work2_std_year", type : "hidden", "def" : ""  },
      { "label":"end_month:", "name": "date_of_work2_std_month", type : "hidden", "def" : ""   },
      { "label":"end_day:", "name": "date_of_work2_std_day", type : "hidden", "def" : ""   },
      { "label":"std_is_range:", "name": "std_is_range", type : "hidden", "def" : ""   },
      { "label":"date_of_work_inferred:", "name": "date_of_work_inferred", type : "hidden", "def" : ""   },
      { "label":"date_of_work_uncertain:", "name": "date_of_work_uncertain", type : "hidden", "def" : ""   },
      { "label":"date_of_work_approx:", "name": "date_of_work_approx", type : "hidden", "def" : ""   },
      { "label":"notes_on_date_of_work:", "name": "notes_on_date_of_work" },
/*
      { "label":"authors:", "name": "authors" },
      { "label":"authors_as_marked:", "name": "authors_as_marked" },
      { "label":"authors_inferred:", "name": "authors_inferred" },
      { "label":"authors_uncertain:", "name": "authors_uncertain" },
      { "label":"notes_on_authors:", "name": "notes_on_authors" },
      { "label":"addressees:", "name": "addressees" },
      { "label":"addressees_as_marked:", "name": "addressees_as_marked" },
      { "label":"addressees_inferred:", "name": "addressees_inferred" },
      { "label":"addressees_uncertain:", "name": "addressees_uncertain" },
      { "label":"notes_on_addressees:", "name": "notes_on_addressees" },
      { "label":"origin_id:", "name": "origin_id" },
      { "label":"origin_as_marked:", "name": "origin_as_marked" },
      { "label":"origin_inferred:", "name": "origin_inferred" },
      { "label":"origin_uncertain:", "name": "origin_uncertain" },
      { "label":"destination_id:", "name": "destination_id" },
      { "label":"destination_as_marked:", "name": "destination_as_marked" },
      { "label":"destination_inferred:", "name": "destination_inferred" },
      { "label":"destination_uncertain:", "name": "destination_uncertain" },
      { "label":"place_mentioned:", "name": "place_mentioned" },
      { "label":"place_mentioned_as_marked:", "name": "place_mentioned_as_marked" },
      { "label":"place_mentioned_inferred:", "name": "place_mentioned_inferred" },
      { "label":"place_mentioned_uncertain:", "name": "place_mentioned_uncertain" },
      { "label":"notes_on_place_mentioned:", "name": "notes_on_place_mentioned" },
      { "label":"abstract:", "name": "abstract" },
      { "label":"keywords:", "name": "keywords" },
      { "label":"language_of_work:", "name": "language_of_work" },
      { "label":"incipit:", "name": "incipit" },
      { "label":"explicit:", "name": "explicit" },
      { "label":"notes_on_letter:", "name": "notes_on_letter" },
      { "label":"people_mentioned:", "name": "people_mentioned" },
      { "label":"mentioned_as_marked:", "name": "mentioned_as_marked" },
      { "label":"mentioned_inferred:", "name": "mentioned_inferred" },
      { "label":"mentioned_uncertain:", "name": "mentioned_uncertain" },
      { "label":"notes_on_people_mentioned:", "name": "notes_on_people_mentioned" },
 */
      { "label":"editors_notes:", "name": "editors_notes" },
      { "label":"upload_uuid:", "name": "upload_uuid" , "def" : uploadUuid },
      { "label":"editor:", "name": "editor", "def" : userID },
      //{ "label":"contributors:", "name": "contributors", "def": undefined },
      //{ "label":"manifestations:", "name": "manifestations", def:null },
   ]
  } );

  // New record
  $('a.editor_create').on('click', function (e) {
    e.preventDefault();
    work_editor
      .create(false)
//      .set('editors_notes', 'upload['+ uploadUuid + '] user[' + username + ']' )
      .set("date_of_work_std_year", "")
      .set("date_of_work_std_month","")
      .set("date_of_work_std_day","")
      .set("date_of_work2_std_year", "")
      .set("date_of_work2_std_month","")
      .set("date_of_work2_std_day",  "" )
      .set('editor'   , userID)
      .set('upload_uuid' , uploadUuid)
      .submit();
  } );
  
  work_editor.on( 'create', function ( e, json, data ) {
    console.log("event",e);
    console.log("json",json);
    console.log("data",data);
    //console.log( 'New work added '+ json.data._id  );
    window.location.href = "/work/work/edit/" + json.data._id ;
  } );
/*
  // Edit record
  $('#workTable').on('click', 'a.editor_edit', function (e) {
    e.preventDefault();

    work_editor
      .title( 'Edit record' )
      .buttons( { "label": "Update", "fn": function () { editor.submit() } } )
      .edit( $(this).closest('tr') );
  } );
*/

  // Delete a record (without asking a user for confirmation for this example)
  $('#workTable').on('click', 'a.editor_remove', function (e) {
    e.preventDefault();

    work_editor
      .message( 'Are you sure you wish to remove this record?' )
      .buttons( { "label": "Delete", "fn": function () { editor.submit() } } )
      .remove( $(this).closest('tr') );
  } );

  $('#workTable').DataTable( {
    dom        : "T<clear>lfrtip",
    processing : true,
    serverSide : false,
    ordering : true,
    order : [], // no initial order
    ajax: {
      "url" : "/work/forupload/" + uploadUuid,
      "data" : {
          "sSearch_1" : ""
      }
    },
    columns: [
    {
      data: null, 
      className: "center",
      render: function ( data, type, row ) {
        // If upload has no works permit delete
        //var editfield = '<a href="/work/work/' + data.upload_name + '/' + data.iwork_id ;
        var editfield = '<a href="/work/work/edit/' + data._id  ;
        editfield += '" class="editor_edit">Edit</a>';
        //if ( data.manifestations == null ) {
        //  editfield +='/ <a href="" class="editor_remove">Delete</a>';
        //}
        return editfield;
      } 
    },
    { data: "iwork_id",className: "center", "defaultContent": ""  },
      //{ data: "date_of_work_as_marked", "defaultContent": ""  },
      //{ data: "original_calendar", "defaultContent": ""  },
      //{ data: "date_of_work", "defaultContent": ""  },
    { data: "date_of_work_std_year",className: "center", "defaultContent": ""  },
    { data: "date_of_work_std_month",className: "center", "defaultContent": ""  },
    { data: "date_of_work_std_day",className: "center", "defaultContent": ""  },
      //{ data: "end_year", "defaultContent": ""  },
      //{ data: "end_month", "defaultContent": ""  },
      //{ data: "end_day", "defaultContent": ""  },
      //{ data: "std_is_range", "defaultContent": ""  },
      //{ data: "date_of_work_inferred", "defaultContent": ""  },
      //{ data: "date_of_work_uncertain", "defaultContent": ""  },
      //{ data: "date_of_work_approx", "defaultContent": ""  },
      //{ data: "notes_on_date_of_work", "defaultContent": ""  },
      { data: function (row, type, set, meta) {
                        var newVal = "";
			$.each(row.authors, function(key, obj){ newVal += obj.primary_name + "<br/>";	});
			return newVal; }},


      //{ data: "authors_as_marked", "defaultContent": ""  },
      //{ data: "authors_inferred", "defaultContent": ""  },
      //{ data: "authors_uncertain", "defaultContent": ""  },
      //{ data: "notes_on_authors", "defaultContent": ""  },
	{ data: function (row, type, set, meta) {
                        var newVal = "";
                        $.each(row.addressees, function(key, obj){ newVal += obj.primary_name + "<br/>";   });
                        return newVal; }},
 
      //{ data: "addressees_as_marked", "defaultContent": ""  },
      //{ data: "addressees_inferred", "defaultContent": ""  },
      //{ data: "addressees_uncertain", "defaultContent": ""  },
      //{ data: "notes_on_addressees", "defaultContent": ""  },
      //{ data: "origin_id", "defaultContent": ""  },
      //{ data: "origin_as_marked", "defaultContent": ""  },
      //{ data: "origin_inferred", "defaultContent": ""  },
      //{ data: "origin_uncertain", "defaultContent": ""  },
      //{ data: "destination_id", "defaultContent": ""  },
      //{ data: "destination_as_marked", "defaultContent": ""  },
      //{ data: "destination_inferred", "defaultContent": ""  },
      //{ data: "destination_uncertain", "defaultContent": ""  },
      //{ data: "place_mentioned", "defaultContent": ""  },
      //{ data: "place_mentioned_as_marked", "defaultContent": ""  },
      //{ data: "place_mentioned_inferred", "defaultContent": ""  },
      //{ data: "place_mentioned_uncertain", "defaultContent": ""  },
      //{ data: "notes_on_place_mentioned", "defaultContent": ""  },
      //{ data: "abstract", "defaultContent": ""  },
      //{ data: "keywords", "defaultContent": ""  },
      //{ data: "language_of_work", "defaultContent": ""  },
      //{ data: "incipit", "defaultContent": ""  },
      //{ data: "explicit", "defaultContent": ""  },
      { data: "notes_on_letter", "defaultContent": ""  },
      //{ data: "people_mentioned", "defaultContent": ""  },
      //{ data: "mentioned_as_marked", "defaultContent": ""  },
      //{ data: "mentioned_inferred", "defaultContent": ""  },
      //{ data: "mentioned_uncertain", "defaultContent": ""  },
      //{ data: "notes_on_people_mentioned", "defaultContent": ""  },
      { data: "editors_notes", "defaultContent": ""  },
      //{ data: "upload_name", "defaultContent": ""  },
      //{ data: "editor", "defaultContent": ""  },
      //{ data: "contributors", "defaultContent": ""  },
      //{ data: "manifestations", "defaultContent": ""  },
    ],
    tableTools: {
      sRowSelect: "os",
      aButtons: [
        { sExtends: "text",
          sButtonText: "Flush" ,
          sFilename: uploadName ,
          fnClick: function( nButton, oConfig ) {
            console.log("nButton", nButton);
            console.log("oConfig:", oConfig);
            this.fnInfo( "My information button!"+ uploadName  );
            $.ajax({
              url:    "/emloload/flush/" + uploadUuid, 
              type:   'POST', 
              data:   {
                "uploadName":uploadName,
                "_id" :  uploadUuid
              },
              success:fnRenhart
            });            
          },
          "fnComplete": function ( nButton, oConfig, oFlash, sFlash ) {
            console.log( 'Flush Button action complete'+ uploadName  );
          },
          "fnRenhart": function ( nButton, oConfig, oFlash, sFlash ) {
            console.log( 'Flush Button action Renhart worked'+ uploadName  );
          },
          "fnInit": function ( nButton, oConfig ) {
            console.log( 'Flush Button initialised'+ uploadName  );
          }
        },
/*
        { sExtends: "ajax",
          sAjaxUrl: "/emloload/flush/" + uploadUuid,
          //sAjaxUrl: "/emloload/flush/"+ uploadName,
          sButtonText: "New Work",
          fnClick: function( nButton, oConfig ) {
            console.log("nButton", nButton);
            console.log("oConfig:", oConfig);
            this.fnInfo( "My ajax button!"+ uploadName  );
          },
          fnAjaxComplete: function ( XMLHttpRequest, textStatus ) {
            console.log( 'Ajax complete for'+ uploadName  );
          },
          editor: work_editor
        },
        { sExtends: "text",
        sButtonText: "New2" ,
        sFilename: uploadName ,
        fnClick: 
          work_editor
          .create(false)
          .set('editors_notes', 'upload['+ uploadUuid + '] user[' + username + ']' )
          .set("std_year", "")
          .set("std_month","")
          .set("std_day","")
          .set("end_year", "")
          .set("end_month","")
          .set("end_day",  "" )
          .set('editor'   , userID)
          
        },
*/
        { sExtends: 'select_single',
          sButtonText: 'New Work',
          fnClick: function () {
            work_editor
              .create(false)
              .set("date_of_work_std_year", "")
              .set("date_of_work_std_month","")
              .set("date_of_work_std_day","")
              .set("date_of_work2_std_year", "")
              .set("date_of_work2_std_month","")
              .set("date_of_work2_std_day",  "" )
              .set('editor'   , userID)
              .set('upload_uuid' , uploadUuid)
              .submit();
            }
        },
        // { sExtends: "editor_edit",   editor: work_editor },
        { sExtends: "editor_remove", editor: work_editor }
      ]
    }
  } );
} );

// Functions =============================================================

var fnRenhart = function ( nButton, oConfig, oFlash, sFlash ) {
  console.log( 'Flush Button action Renhart worked'+ uploadName  );
};

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
            'password'  : $('#inputUserpassword').val()
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

function workback(data,status) {
  console.log(data);
  console.log(status);
}
