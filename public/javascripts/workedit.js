// Userlist data array for filling in info box
var userListData = [];
var page_editor; // use a global for the submit and return data rendering in the examples

// DOM Ready =============================================================
$(document).ready(function() {
  console.log("readying workedit.js");
  
  page_editor = new $.fn.dataTable.Editor( {
    ajax: {
      url : "/work/work/" + workID, // + "/standalone",
      type: "PUT"
    },
    fields: [ 
      {
        label: "Status:",
        name:  "enable",
        type:  'radio',
        ipOpts: [
          { label: 'Enabled',  value: 'Enabled' },
          { label: 'Disabled', value: 'Disabled' }
        ]
      }, 
      { label: "Server IP address:",  name:  "server-ip"  }, 
      {
        label:     "Polling period:",
        fieldInfo: "Input value is in seconds",
        name:      "poll-period"
      }, 
      {
        name: "protocol", // `label` since `data-editor-label` is defined for this field
        type: "select",
        ipOpts: [
        { label: 'TCP', value: 'TCP' },
        { label: 'UDP', value: 'UDP' }
        ]
      }
    ]
  } );
  
  page_editor
    .on( 'onOpen', function () {
        // Listen for a tab key event
        $(document).on( 'keydown.editor', function ( e ) {
            if ( e.keyCode === 9 ) {
                e.preventDefault();

                // Find the cell that is currently being edited
                var cell = $('div.DTE').parent();

                if ( e.shiftKey && cell.prev().length && cell.prev().index() !== 0 ) {
                    // One cell to the left (skipping the first column)
                    cell.prev().click();
                }
                else if ( e.shiftKey ) {
                    // Up to the previous row
                    cell.parent().prev().children().last(0).click();
                }
                else if ( cell.next().length ) {
                    // One cell to the right
                    cell.next().click();
                }
                else {
                    // Down to the next row
                    cell.parent().next().children().eq(1).click();
                }
            }
        } );
    } )
    .on( 'onClose', function () {
        $(document).off( 'keydown.editor' );
    } );

  $('[data-editor-field]').on( 'click', function (e) {
    page_editor.inline( this, {
      submitOnBlur: true
    } );
  } );
  
  $('#edit').on( 'click', function () {
    page_editor
    .buttons( {
      label: "Save",
      fn: function () { this.submit(); }
    } )
    .edit();
  } );
  
//  $('#frmWork').submit(function(){
//    alert("Submitted");
//  }); 
  
  $('.saveform').on( 'click', function () {
    var data = {};
    data.data = $("#frmWork").serializeObject();
    console.log('.saveform',data);
    var response = $.post(
      "/work/work/" + workID, //  + "/standalone",
      data,
      function(rdata){
        //$("#renhart").text(rdata);
        $('<div data-alert class="alert-box success radius">Work Saved!<a href="#" class="close">&times;</a></div>')
          .insertBefore('#frmWork')
          .delay(1000)
          .fadeOut(function() {
            $(this).remove(); 
          });
        console.log("rdata:",rdata);
      });
    
  } );
  
  //readyDataTable();
  
} );

// Functions =============================================================
function frmsubmit(thied){
  alert("frmWork Submitted1" + thied);
};


function emptynull(selector){
  var that = $('#' + selector);
  var value= that.val()
  alert ("value:",value);
  var newvalue = (value == null ) ? "renhart" : "" ;
  alert ("new value:",newvalue);
  //that.val((value == null ) ? "" : value)
  that.val(newvalue)
};

function readyDataTable(){
  emptynull("date_of_work2_std_year"); 
  emptynull("date_of_work_std_year"); 
  //  = (work.date_of_work_std_year == null ) ? "0" : work.date_of_work_std_year;
//work.date_of_work_std_month = (work.date_of_work_std_month == null ) ? '0' : work.date_of_work_std_month;
//work.date_of_work_std_day = (work.date_of_work_std_day == null ) ? '' : work.date_of_work_std_day;
//work.date_of_work2_std_year = (work.date_of_work2_std_year == null ) ? '' : work.date_of_work2_std_year;
//work.date_of_work2_std_month = (work.date_of_work2_std_month == null ) ? '' : work.date_of_work2_std_month;
//work.date_of_work2_std_day = (work.date_of_work2_std_day == null ) ? '' : work.date_of_work2_std_day;
};

// Edit Row
function editRow(event) {
  
  event.preventDefault();
  
  // Pop up a confirmation dialog
  var confirmation = confirm('Are you sure you want to edit this record?');
  
  // Check and make sure the user confirmed
  if (confirmation === true) {
    console.log('url :' ,$(this).attr('rel'));
    // If they did, do our edit
    var tabSelector = $(this).attr('tabselector');
    var theUrl = $(this).attr('rel');
    var editType = $(this).attr('edittype');
        
    $.ajax({
      type: 'GET',
      url: theUrl       //url: '/admin/upload/' + $(this).attr('rel')
    }).done(function( response ) {
      
      // Check for a successful (blank) response
      console.log('editRow', response);
      //return false;
      
      if (response.status === 'Found') {
        console.log('edit row for type ', editType ,' of table ',tabSelector);
        //return false;
        rowId = response.data._id ;
        delete response.data.__v;
        delete response.data.name;
        console.log('deleted __v -->',response.data);
        if ( editType === "person" ) {
          pers_editor
            .title( 'Edit person' )
            .buttons( { "label": "Update", "fn": function () { pers_editor.submit() } } )
            .edit(rowId)
            .set(response.data);
        } else {
          item_editor
          .title( 'Edit place' )
          .buttons( { "label": "Update", "fn": function () { item_editor.submit() } } )
          .edit(rowId)
          .set(response.data);
        }
      } else {
        alert('Error: ' + response.msg);
      }
    });
  }
  else {    
    // If they said no to the confirm, do nothing
    return false;    
  }
};

// Delete Row
function deleteRow(event) {
  
  event.preventDefault();
  
  // Pop up a confirmation dialog
  var confirmation = confirm('Are you sure you want to delete this record?');
  
  // Check and make sure the user confirmed
  if (confirmation === true) {
    console.log('url :' ,$(this).attr('rel'));
    // If they did, do our delete
      var tabSelector = $(this).attr('tabselector');
      var theUrl = $(this).attr('rel');
      console.log('delete row for table ',tabSelector);
      $(tabSelector).DataTable()
      .row( $(this).parents('tr') )
      .remove()
      .draw();
      
    $.ajax({
      type: 'DELETE',
      url: theUrl
      //url: '/admin/upload/' + $(this).attr('rel')
    }).done(function( response ) {
      
      // Check for a successful (blank) response
      console.log('deleteRow', response)
      if (response.status === 'deleted') {
      }
      else {
        alert('Error: ' + response.status);
      }
            
    });
    
  }
  else {    
    // If they said no to the confirm, do nothing
    return false;    
  }
  
};
