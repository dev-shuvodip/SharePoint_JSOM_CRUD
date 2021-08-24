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
}

function onUpdateQueryFailed(sender, args) {
  alert('Request failed. ' + args.get_message() +
    '\n' + args.get_stackTrace());
}


function getListItem() {
  var clientContext = new SP.ClientContext.get_current();
  var olist = clientContext.get_web().get_lists().getByTitle('Student');
  var camlQuery = new SP.CamlQuery();
  camlQuery.set_viewXml('<View><Query><Where><Eq><FieldRef Name=\'CustomID\'/><Value Type=\'Number\'>' + document.getElementById("custID").value + '</Value></Eq></Where></Query></View>');
  this.collListItem = olist.getItems(camlQuery);
  clientContext.load(collListItem);
  clientContext.executeQueryAsync(Function.createDelegate(this, this.onGetQuerySucceeded), Function.createDelegate(this, this.onGetQueryFailed));
  return false;
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

function resetForm() {
  document.querySelector("label#def_id").textContent = "";
  document.getElementById("name").value = "";
  document.getElementById("address").value = "";
  document.getElementById("qualification").value = "";
  document.getElementById("age").value = null;
  document.getElementById('gender').selectedIndex = 0;
  document.getElementById("custID").value = null;
}

function updateListItem() {
  var Id = document.querySelector("label#def_id").textContent;
  var name = document.getElementById("name").value;
  var address = document.getElementById("address").value;
  var qualification = document.getElementById("qualification").value;
  var age = document.getElementById("age").value;
  var gender = document.getElementById("gender").value;

  var itemId = parseInt(Id);

  var clientContext = new SP.ClientContext.get_current();
  var oList = clientContext.get_web().get_lists().getByTitle('Student');

  this.oListItem = oList.getItemById(itemId);
  oListItem.set_item('Title', name);
  oListItem.set_item('Address', address);
  oListItem.set_item('Qualification', qualification);
  oListItem.set_item('Age', age);
  oListItem.set_item('Gender', gender);
  oListItem.update();

  clientContext.executeQueryAsync(
    Function.createDelegate(this, this.onUpdateQuerySucceeded),
    Function.createDelegate(this, this.onUpdateQueryFailed)
  );
}

function onUpdateQuerySucceeded() {
  alert('Item updated!');
}

function onUpdateQueryFailed(sender, args) {
  alert('Request failed. ' + args.get_message() +
    '\n' + args.get_stackTrace());
}

function deleteListItem() {
  var clientContext = new SP.ClientContext.get_current();
  var oList = clientContext.get_web().get_lists().getByTitle('Student');

  var Id2 = document.querySelector("label#def_id").textContent;
  var itemId2 = parseInt(Id2);
  this.oListItem = oList.getItemById(itemId2);
  oListItem.deleteObject();

  clientContext.executeQueryAsync(
    Function.createDelegate(this, this.onDeleteQuerySucceeded),
    Function.createDelegate(this, this.onDeleteQueryFailed)
  );
}

function onDeleteQuerySucceeded() {
  alert('Item deleted: ' + itemId);
}

function onDeleteQueryFailed(sender, args) {
  alert('Request failed. ' + args.get_message() +
    '\n' + args.get_stackTrace());
}

// function showListItems() {
//   var context = new SP.ClientContext.get_current();
//   var targetList = context.get_web().get_lists().getByTitle('Student');
//   var camlQuery = new SP.CamlQuery();
//   camlQuery.set_viewXml("<View><Query><OrderBy><FieldRef Name='ID' Ascending='TRUE' /></OrderBy></Query><RowLimit>10</RowLimit></View>");
//   this.collListItem = targetList.getItems(camlQuery);
//   context.load(collListItem);
//   context.executeQueryAsync(Function.createDelegate(this, this.onShowQuerySucceeded),
//     Function.createDelegate(this, this.onQueryFailed));
// }

// function onShowQuerySucceeded(sender, args) {
//   var listItemEnumerator = collListItem.getEnumerator();
//   var listCount = collListItem.get_count();
//   console.log("list item count -- " + listCount);
//   var mytable = "<div id=\"div4\"><h2 style=\"color:navy;\"><u>All Items will be displayed here</u></h2><table class=\"alternate\" id=\"table2\"><tr>" +
//     "<th>Name</th>" +
//     "<th>Address</th>" +
//     "<th>Qualification</th>" +
//     "<th>Age</th>" +
//     "<th>Gender</th>";
//   var i = 0;
//   while (listItemEnumerator.moveNext()) {
//     var oListItem = listItemEnumerator.get_current();
//     mytable += "<tr><td>" + oListItem.get_item('Title') + "</td><td>" + oListItem.get_item('Address') + "</td><td>" + oListItem.get_item('Qualification') + "</td><td>" + oListItem.get_item('Age') + "</td><td>" + oListItem.get_item('Gender') + "</td><td><button type=\"button\" class=\"button\" id=\"ID" + i.toString() + "onclick=\"getSelectedId()\">" + oListItem.get_item('ID') + "<tr><td>" + oListItem.get_item('CustomID') + "</td><td>" + "</button></td></tr>";
//     ++i;
//   }
//   mytable += "</table></div>";
//   document.getElementById("list").insertAdjacentHTML("afterbegin", mytable);
// }