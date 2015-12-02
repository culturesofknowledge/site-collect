console.log("loading manifestation.js",uploadUuid);

var objLI,robjLI,letterType,rletterType;
var manifest_editor; // use a global for the submit and return data rendering in the examples

// Load the repository select array
//  objLI = new Object();
//  robjLI = new Object();
  objLI  = { "" : "" };
  robjLI = { "" : "" };
  repoLoad(uploadUuid,uploadUuid);
  
// DOM Ready =============================================================
$(document).ready(function() {
  console.log("readying manifestation.js");
  letterLoad("initialise");
  
// DataTable Editor ======================================================
  manifest_editor = new $.fn.dataTable.Editor( {
    ajax: {
      create: {
        type: 'POST',
        url:  '/work/work/'+iworkID+'/manifestation/'
      },
      edit: {
        type: 'PUT',
        url:  '/work/work/'+iworkID+'/manifestation/_id_'
      },
      remove: {
        type: 'DELETE',
        url:  '/work/work/'+iworkID+'/manifestation/_id_'
      }
    },
    "table": "#manifestationTable",
    idSrc: "_id",
    "fields": [ 
      //{ "label": "id","name": "id", "type": "text" },
      {
        "label": "upload_uuid",
        "name": "upload_uuid",
        "default": uploadUuid ,
        "type": "text" ,
        "type": "hidden"
      },
      {
        "label": "manifestation_id",
        "name": "manifestation_id",
        "type": "text" ,
        "type": "hidden"
      },
      {
        "label": "iwork_id",
        "name": "iwork_id",
        "default": iworkID ,
        "type": "hidden"
      },
/*      {
        "label": "union_manifestation_id",
        "name": "union_manifestation_id",
        "type": "hidden"
      },
*/      {
        "label": "Type",
        "name": "manifestation_type",
        "type": "select",
        "ipOpts": letterType
      },
      {
        "label" : "Either: Repository",
        "name"  : "repository_id",
        "type"  : "select",
        "ipOpts": objLI
      },
      {
        "label": "and Shelfmark",
        "name": "id_number_or_shelfmark",
        "type": "textarea"
      },
      {
        "label": "Or: Printed edition details",
        "name": "printed_edition_details",
        "type": "textarea"
      },
      {
        "label": "Manifestation notes",
        "name": "manifestation_notes",
        "type": "textarea"
/*      },
      {
        "label": "Image filenames",
        "name": "image_filenames",
        "default": "" ,
        "type": "hidden"
*/      }
    ]
  } );



  // New record
  $('a.editor_create').on('click', function (e) {
    e.preventDefault();

    // Load the repository select arrays
    repoSelect("create");
    
    manifest_editor
      .title( 'Create new record' )
      .buttons( { "label": "Add", "fn": function () { manifest_editor.submit() } } )
      .create();
  } );

  // Edit record
  $('#manifestationTable').on('click', 'a.manifest_editor_edit', function (e) {
    e.preventDefault();

    // Load the repository select arrays
    repoSelect("edit");
    
    manifest_editor
      .title( 'Edit manifestation: Enter either repository and shelfmark or printed edition details.' )
      
      .buttons( { "label": "Update", "fn": function () { manifest_editor.submit() } } )
      .edit( $(this).closest('tr') );

	  $("#DTE_Field_repository_id").attr("data-placeholder","Repository...").chosen({
		  no_results_text: "No repository found.",
		  allow_single_deselect: true,
		  width: "150%"
	  })
		  .trigger("chosen:updated");
  } )

  // Delete a record (without asking a user for confirmation for this example)
  .on('click', 'a.manifest_editor_remove', function (e) {
    e.preventDefault();

    manifest_editor
      .message( 'Are you sure you wish to remove this record?' )
      .buttons( { "label": "Delete", "fn": function () { manifest_editor.submit() } } )
      .remove( $(this).closest('tr') );
  } )

  .DataTable( {
    dom        : "Tfrtip",
    processing : true,
    serverSide : true,
    ajax: {
      "url" : "/work/manifestation/" + uploadUuid+ '/' + iworkID,
      "data" : {
          "sSearch_1" : "Brahe1"
      }
    },
    columns: [
      {
        data: null, 
        className: "center",
        render: function ( data, type, row ) {
          var editfield = '<a href="'  ;
            editfield += '" class="manifest_editor_edit">Edit</a>';
            editfield +='/ <a href="" class="manifest_editor_remove">Delete</a>';
          return editfield;
        }        
      },
      { "bVisible": false, "data": "upload_uuid"  },
      { "bVisible": false, "data": "manifestation_id"      },
      { "bVisible": false, "data": "iwork_id"   },
      //{ "bVisible": false, "data": "union_manifestation_id" },
      { "data": "manifestation_type", 
        render: function ( data, type, row ) {
          console.log("render - mType", data, type, row )
          var editfield = rletterType[ data ] + " : " + data ;
          return editfield;
        }         
      },
      { "data": "repository_id",
        render: function ( data, type, row ) {
          console.log("render - repo_id", data, type, row )
          console.log("editfield = ",robjLI[ data ] , " : " ,data  )
          var editfield = robjLI[ data ] + " : " + data ;
          return editfield;
        } 
      },
      { "data": "id_number_or_shelfmark" },
      { "data": "printed_edition_details" },
      { "data": "manifestation_notes"   }
      //,{ "data": "image_filenames" }
    ],
    tableTools: {
      sRowSelect: "os",
      aButtons: [
        { sExtends: "editor_create",
          "fnClick": function ( nButton, oConfig, oFlash ) {
            console.log("fnclik", nButton, oConfig, oFlash)
            // Load the repository select arrays
            repoSelect("create");
            // Invoke the manifest-editor (new)
            manifest_editor
            .title( 'New manifestation: Enter either repository and shelfmark or printed edition details.' )
            .buttons( { "label": "Add", "fn": function () { manifest_editor.submit() } } )
            .create();

	          $("#DTE_Field_repository_id").attr("data-placeholder","Repository...").chosen({
		          no_results_text: "No repository found.",
		          allow_single_deselect: true,
		          width: "150%"
	          })
	          .trigger("chosen:updated");
          },
          editor: manifest_editor 
        },
        { sExtends: "editor_edit",   editor: manifest_editor },
        { sExtends: "editor_remove", editor: manifest_editor }
      ]
    }
  } );
  
} );// End Document ready

// Functions =============================================================


function repoLoad(upload_uuid,reqterm) {
  console.log("repoLoad");
  var strHTMLOutput = '';
  $.ajax('/autocomplete/' + 'repository/' + upload_uuid + '/' + reqterm, {
    dataType: 'json',
    error: function(){
      console.log("ajax error :(");
    },
    success: function (obj) {
      var data = obj.data;
      console.log("repoload success:");
      //console.log("repoload success2:",data);
      if (data.length > 0) {
        if (data.status && data.status === 'error'){
          strHTMLOutput = "<li>Error: " + data.error + "</li>";
        } else {
          var intItem,label,value
          totalItems = data.length,
          arrLI = [];
          for (intItem = 0 ; intItem < totalItems; intItem++) {
            label = (data[intItem].label||"(No city)")+data[intItem].label2;
            value = data[intItem].value
            objLI[ label ] = value;
            robjLI[ value ] = label;
          }
          console.log("repoByName",objLI);
          console.log("repoById",robjLI);
        }
      }else{
        strHTMLOutput = "<li>You haven't created any works yet</li>";
      }
    }
  });
}

function repoSelect(reqterm) {    
  console.log("reposelect ",reqterm);
  manifest_editor.field('repository_id').update( objLI );
  manifest_editor.field('manifestation_type').update( letterType );
}

function letterLoad(reqterm) {    

  letterType =  {
      "Letter"      : "ALS"
//    , "Digital"     : "Dig"
    , "Draft"       : "D"
    , "Extract"     : "E"
    , "Other"       : "O"
    , "Printed copy": "P"
    , "Scribal copy": "S"
  };
  console.log("letterType: ",letterType);

  rletterType = new Object();  
  for(var key in letterType) {
    var val = letterType[key];
    rletterType[val] = key;
  }
  console.log("rletterType: ",rletterType);
  
}