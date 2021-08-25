
///<summary>
/// Function to reset the form fields
///</summary>
function resetForm() {
  document.querySelector("label#def_id").textContent = "";
  document.getElementById("name").value = "";
  document.getElementById("address").value = "";
  document.getElementById("qualification").value = "";
  document.getElementById("age").value = null;
  document.getElementById('gender').selectedIndex = 0;
  document.getElementById("custID").value = null;
}
//---------------------- Reset function end -------------------------------

///<summary>
/// Function to create an item in a SharePoint Online List
///</summary>
function createListItem() {
  var title = document.getElementById("name").value;
  var address = document.getElementById("address").value;
  var qualification = document.getElementById("qualification").value;
  var age = document.getElementById("age").value;
  var gender = document.getElementById("gender").value;
  var custID = document.getElementById("custID").value;

  var clientContext = new SP.ClientContext.get_current();
  var oList = clientContext.get_web().get_lists().getByTitle('Student');

  // Create an item in a list
  var itemCreateInfo = new SP.ListItemCreationInformation();
  this.oListItem = oList.addItem(itemCreateInfo);
  oListItem.set_item('Title', title);
  oListItem.set_item('Address', address);
  oListItem.set_item('Qualification', qualification);
  oListItem.set_item('Age', age);
  oListItem.set_item('Gender', gender);
  oListItem.set_item('CustomID', custID);

  // Input validation
  if (title == "" || address == "" || qualification == "" || age == "" || gender == "default") {
    alert("Please fill all the fields!");
  } else if (isNaN(age)) {
    alert("Please enter correct age!");
  } else {
    console.log(title);
    console.log(address);
    console.log(qualification);
    console.log(age);
    console.log(gender);

    oListItem.update();
    clientContext.load(oListItem);
    clientContext.executeQueryAsync(
      Function.createDelegate(this, this.onCreateQuerySucceeded),
      Function.createDelegate(this, this.onUpdateQueryFailed)
    );
  }
}

function onCreateQuerySucceeded() {
  alert('Item created: ' + oListItem.get_id());
  resetForm();
}

function onUpdateQueryFailed(sender, args) {
  alert('Request failed. ' + args.get_message() +
    '\n' + args.get_stackTrace());
}
//---------------------- Create function end -------------------------------

///<summary>
/// Function to get a list item from a SharePoint Online List using custom ID column
///</summary>
function getListItem() {
  var cID = document.getElementById("custID").value;
  var clientContext = new SP.ClientContext.get_current();
  var olist = clientContext.get_web().get_lists().getByTitle('Student');
  var camlQuery = new SP.CamlQuery();
  camlQuery.set_viewXml('<View><Query><Where><Eq><FieldRef Name=\'CustomID\'/><Value Type=\'Number\'>' + cID + '</Value></Eq></Where></Query></View>');
  this.collListItem = olist.getItems(camlQuery);
  if (cID == "") {
    alert("Please enter Id");
  } else if (isNaN(cID)) {
    alert("Only integer input is allowed");
    resetForm();
  } else {
    clientContext.load(collListItem);
    clientContext.executeQueryAsync(Function.createDelegate(this, this.onGetQuerySucceeded), Function.createDelegate(this, this.onGetQueryFailed));
  }
}
function onGetQuerySucceeded(sender, args) {
  var listItemEnumerator = collListItem.getEnumerator();
  while (listItemEnumerator.moveNext()) {
    var listItem = listItemEnumerator.get_current();

    document.querySelector("label#def_id").textContent = listItem.get_id();
    document.getElementById("name").value = listItem.get_item('Title');
    document.getElementById("address").value = listItem.get_item('Address');
    document.getElementById("qualification").value = listItem.get_item('Qualification');
    document.getElementById("gender").value = listItem.get_item('Gender');
    document.getElementById("age").value = listItem.get_item('Age');

  }
}
function onGetQueryFailed(sender, args) {
  alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
}
//---------------------- Get function end -------------------------------

///<summary>
/// Function to update a list item in a SharePoint Online List using custom ID column
///</summary>
function updateListItem() {
  var c_ID = document.getElementById("custID").value;

  var clientContext = new SP.ClientContext.get_current();
  var oList = clientContext.get_web().get_lists().getByTitle('Student');

  var camlQuery = new SP.CamlQuery();
  camlQuery.set_viewXml('<View><Query><Where><Eq><FieldRef Name=\'CustomID\'/><Value Type=\'Number\'>' + c_ID + '</Value></Eq></Where></Query></View>');
  this.oListItems = oList.getItems(camlQuery);
  console.log(oListItems);

  clientContext.load(oListItems);
  clientContext.executeQueryAsync(
    Function.createDelegate(this, this.onUpdateQuerySucceeded),
    Function.createDelegate(this, this.onUpdateQueryFailed)
  );
}

function onUpdateQuerySucceeded() {
  var name = document.getElementById("name").value;
  var address = document.getElementById("address").value;
  var qualification = document.getElementById("qualification").value;
  var age = document.getElementById("age").value;
  var gender = document.getElementById("gender").value;

  var listItemEnumerator = oListItems.getEnumerator();
  var listItem;
  while (listItemEnumerator.moveNext()) {
    listItem = listItemEnumerator.get_current();
    console.log(listItem);
  }
  listItem.set_item('Title', name);
  listItem.set_item('Address', address);
  listItem.set_item('Qualification', qualification);
  listItem.set_item('Age', age);
  listItem.set_item('Gender', gender);
  listItem.update();

  alert('Item updated!');
  resetForm();
}

function onUpdateQueryFailed(sender, args) {
  alert('Request failed. ' + args.get_message() +
    '\n' + args.get_stackTrace());
}
//---------------------- Update function end -------------------------------

///<summary>
/// Function to delete a list item in a SharePoint Online List using custom ID column
///</summary>
function deleteListItem() {
  var c_ID = document.getElementById("custID").value;

  var clientContext = new SP.ClientContext.get_current();
  var oList = clientContext.get_web().get_lists().getByTitle('Student');

  var camlQuery = new SP.CamlQuery();
  camlQuery.set_viewXml('<View><Query><Where><Eq><FieldRef Name=\'CustomID\'/><Value Type=\'Number\'>' + c_ID + '</Value></Eq></Where></Query></View>');
  this.oListItems = oList.getItems(camlQuery);

  clientContext.load(oListItems);
  clientContext.executeQueryAsync(
    Function.createDelegate(this, this.onDeleteQuerySucceeded),
    Function.createDelegate(this, this.onDeleteQueryFailed)
  );
}

function onDeleteQuerySucceeded() {
  var listItemEnumerator = oListItems.getEnumerator();
  var listItem;
  while (listItemEnumerator.moveNext()) {
    listItem = listItemEnumerator.get_current();
  }
  listItem.deleteObject();

  alert('Item deleted');
  resetForm();
}

function onDeleteQueryFailed(sender, args) {
  alert('Request failed. ' + args.get_message() +
    '\n' + args.get_stackTrace());
}
//---------------------- Delete function end -------------------------------
