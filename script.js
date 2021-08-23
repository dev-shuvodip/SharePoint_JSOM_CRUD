function createListItem() {

  var title = document.getElementById("name").value;
  var address = document.getElementById("address").value;
  var qualification = document.getElementById("qualification").value;
  var age = document.getElementById("age").value;
  var gender = document.getElementById("gender").value;

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

  // Input validation
  if (title == "" || address == "" || qualification == "" || age == "") {
    alert("Please fill all the fields!");
  } else if (isNaN(age)) {
    alert("Please enter correct age!");
  } else if (gender == "default") {
    alert("Please select gender!");
  } else {
    console.log(title);
    console.log(address);
    console.log(qualification);
    console.log(age);
    console.log(gender);

    oListItem.update();
    clientContext.load(oListItem);
    clientContext.executeQueryAsync(
      Function.createDelegate(this, this.onQuerySucceeded),
      Function.createDelegate(this, this.onQueryFailed)
    );
  }
}

function onQuerySucceeded() {
  alert('Item created: ' + oListItem.get_id());
}

function onQueryFailed(sender, args) {
  alert('Request failed. ' + args.get_message() +
    '\n' + args.get_stackTrace());
}

function resetForm() {
  document.getElementById("name").value = "";
  document.getElementById("address").value = "";
  document.getElementById("qualification").value = "";
  document.getElementById("age").value = null;
  document.getElementById('gender').selectedIndex = 0
}