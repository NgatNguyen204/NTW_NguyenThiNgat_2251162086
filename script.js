const tbody = document.querySelector("#employeeTable tbody");
const form = document.querySelector("#addEmployeeForm");
const alertBox = document.getElementById("alertBox");

function createRow(emp) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input type="checkbox" /></td>
    <td>${emp.name}</td>
    <td>${emp.email}</td>
    <td>${emp.address}</td>
    <td>${emp.phone}</td>
    <td>
      <button class="btn btn-sm btn-primary me-1"><i class="bi bi-pencil-square"></i></button>
      <button class="btn btn-sm btn-danger"><i class="bi bi-trash"></i></button>
    </td>
  `;
  return tr;
}

function renderTable() {
  tbody.innerHTML = "";
  employees.forEach(emp => {
    const row = createRow(emp);
    tbody.appendChild(row);
  });
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const address = document.getElementById("address").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (!name || !email || !address || !phone) {
    alert("Please fill in all fields.");
    return;
  }

  const newEmployee = { name, email, address, phone };
  employees.push(newEmployee);

  renderTable();
  form.reset();

  const modal = bootstrap.Modal.getInstance(document.getElementById("addEmployeeModal"));
  modal.hide();

  alertBox.classList.remove("d-none");
  setTimeout(() => {
    alertBox.classList.add("d-none");
  }, 2000);
});

renderTable();
