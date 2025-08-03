$(document).ready(function () {
  // ===================================================================
  // PHẦN 1: KHỞI TẠO BIẾN
  // ===================================================================
  const $form = $("#addEmployeeForm");
  const $alertBox = $("#alertBox");
  const $tbody = $("#employeeTable tbody");
  const $modal = new bootstrap.Modal("#addEmployeeModal");

  // Biến cho phân trang
  let currentPage = 1;
  const rowsPerPage = 5; // Hiển thị 5 nhân viên mỗi trang

  // Thêm hidden input để lưu index khi sửa (nếu chưa có)
  if (!$('#employee-index').length) {
    $form.append('<input type="hidden" id="employee-index" />');
  }

  // ===================================================================
  // PHẦN 2: CÁC HÀM XỬ LÝ
  // ===================================================================

  // Hàm tạo một hàng (<tr>) cho bảng
  function createRow(emp, originalIndex) {
    // Thêm class="employee-checkbox" và data-index vào checkbox
    return $(`
      <tr>
        <td><input type="checkbox" class="employee-checkbox" data-index="${originalIndex}"></td>
        <td>${emp.name}</td>
        <td>${emp.email}</td>
        <td>${emp.address}</td>
        <td>${emp.phone}</td>
        <td>
          <button class="btn btn-sm btn-primary me-1 btn-edit" data-index="${originalIndex}">
            <i class="bi bi-pencil-square"></i>
          </button>
          <button class="btn btn-sm btn-danger btn-delete" data-index="${originalIndex}">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    `);
  }

  // Hàm vẽ lại bảng dựa trên trang hiện tại
  function renderTable() {
    $tbody.empty();
    
    // Cắt mảng dữ liệu lớn ra để lấy đúng phần cho trang hiện tại
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedEmployees = employees.slice(startIndex, endIndex);

    // Vẽ từng hàng cho mảng đã cắt
    paginatedEmployees.forEach((emp, index) => {
      const originalIndex = startIndex + index; // Lấy chỉ số gốc
      $tbody.append(createRow(emp, originalIndex));
    });
    
    $("#selectAll").prop("checked", false); // Bỏ chọn checkbox chính mỗi khi render lại
    renderPagination(); // Vẽ lại các nút phân trang
  }

  // Hàm vẽ các nút phân trang
  function renderPagination() {
    const $paginationUl = $("#paginationUl");
    const $paginationInfo = $("#paginationInfo");
    $paginationUl.empty();

    const totalEmployees = employees.length;
    const totalPages = Math.ceil(totalEmployees / rowsPerPage);

    if (totalPages <= 1) {
      $("#paginationNav").hide(); // Ẩn phân trang nếu không cần
      return;
    }
    $("#paginationNav").show();

    // Cập nhật dòng chữ "Showing..."
    const startEntry = (currentPage - 1) * rowsPerPage + 1;
    const endEntry = Math.min(startEntry + rowsPerPage - 1, totalEmployees);
    $paginationInfo.text(`Showing ${startEntry} to ${endEntry} of ${totalEmployees} entries`);

    // Nút "Previous"
    const prevLi = $(`<li class="page-item ${currentPage === 1 ? 'disabled' : ''}"><a class="page-link" href="#" data-page="prev">Previous</a></li>`);
    $paginationUl.append(prevLi);

    // Các nút số trang
    for (let i = 1; i <= totalPages; i++) {
      const pageLi = $(`<li class="page-item ${i === currentPage ? 'active' : ''}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`);
      $paginationUl.append(pageLi);
    }
    
    // Nút "Next"
    const nextLi = $(`<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}"><a class="page-link" href="#" data-page="next">Next</a></li>`);
    $paginationUl.append(nextLi);
  }

  // Hàm reset form modal
  function resetForm() {
    $("#employee-index").val("");
    $form[0].reset();
    $(".text-danger").text("");
    $("#modalTitle").text("Add Employee");
    $("#submitButton").text("Add").removeClass('btn-primary').addClass('btn-success');
  }

  // ===================================================================
  // PHẦN 3: BỘ LẮNG NGHE SỰ KIỆN (EVENT LISTENERS)
  // ===================================================================

  // Sự kiện cho nút "Add" hoặc "Save Changes" trong form
  $form.on("submit", function (e) {
    e.preventDefault();

    const index = $("#employee-index").val();
    const name = $("#name").val().trim();
    const email = $("#email").val().trim();
    const address = $("#address").val().trim();
    const phone = $("#phone").val().trim();

    // Validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    const phoneRegex = /^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$/;
    $(".text-danger").text("");
    let isValid = true;
    if (!name) { $("#error-name").text("Name is required."); isValid = false; }
    if (!email) { $("#error-email").text("Email is required."); isValid = false; }
    else if (!emailRegex.test(email)) { $("#error-email").text("Invalid Gmail address."); isValid = false; }
    if (!address) { $("#error-address").text("Address is required."); isValid = false; }
    if (!phone) { $("#error-phone").text("Phone is required."); isValid = false; }
    else if (!phoneRegex.test(phone)) { $("#error-phone").text("Invalid Vietnamese phone."); isValid = false; }
    if (!isValid) return;

    const newEmp = { name, email, address, phone };

    if (index === "") { // Chế độ Thêm mới
      employees.push(newEmp);
      $alertBox.removeClass("d-none").text("Employee added successfully!");
      currentPage = Math.ceil(employees.length / rowsPerPage); // Chuyển đến trang cuối
    } else { // Chế độ Sửa
      employees[parseInt(index)] = newEmp;
      $alertBox.removeClass("d-none").text("Employee updated successfully!");
    }

    renderTable();
    $modal.hide();

    setTimeout(() => $alertBox.addClass("d-none"), 2000);
  });

  // Sự kiện khi bấm nút Edit hoặc Delete trên một hàng
  $tbody.on("click", ".btn-edit", function () {
    const index = $(this).data("index");
    const emp = employees[index];

    $("#employee-index").val(index);
    $("#name").val(emp.name);
    $("#email").val(emp.email);
    $("#address").val(emp.address);
    $("#phone").val(emp.phone);

    $("#modalTitle").text("Edit Employee");
    $("#submitButton").text("Save Changes").removeClass('btn-success').addClass('btn-primary');
    $modal.show();
  });

  $tbody.on("click", ".btn-delete", function () {
    const index = $(this).data("index");
    if (confirm("Are you sure you want to delete this employee?")) {
      employees.splice(index, 1);
      // Kiểm tra nếu trang hiện tại bị rỗng thì lùi về 1 trang
      if ($tbody.find('tr').length === 0 && currentPage > 1) {
        currentPage--;
      }
      renderTable();
    }
  });
  
  // Sự kiện khi bấm vào nút phân trang
  $("#paginationNav").on("click", ".page-link", function(e) {
    e.preventDefault();
    const targetPage = $(this).data("page");
    if ($(this).parent().hasClass('disabled')) return;

    if (targetPage === 'prev') {
      if (currentPage > 1) currentPage--;
    } else if (targetPage === 'next') {
      const totalPages = Math.ceil(employees.length / rowsPerPage);
      if (currentPage < totalPages) currentPage++;
    } else {
      currentPage = parseInt(targetPage);
    }
    renderTable();
  });

  // *** SỰ KIỆN CHO CHECKBOX "CHỌN TẤT CẢ" ***
  $("#selectAll").on("click", function () {
    const isChecked = $(this).is(":checked");
    // Chỉ chọn các checkbox đang được hiển thị trên trang hiện tại
    $tbody.find(".employee-checkbox").prop("checked", isChecked);
  });

  // *** SỰ KIỆN CHO NÚT "DELETE SELECTED" ***
  $("#deleteSelected").on("click", function() {
    const $checkedBoxes = $tbody.find(".employee-checkbox:checked");

    if ($checkedBoxes.length === 0) {
      alert("Please select at least one employee to delete.");
      return;
    }

    if (confirm(`Are you sure you want to delete ${$checkedBoxes.length} selected employees?`)) {
      const indicesToDelete = [];
      $checkedBoxes.each(function() {
        indicesToDelete.push(parseInt($(this).data("index")));
      });

      // Sắp xếp giảm dần để xóa từ cuối lên đầu, tránh lỗi chỉ số
      indicesToDelete.sort((a, b) => b - a);

      indicesToDelete.forEach(index => {
        employees.splice(index, 1);
      });

      // Kiểm tra lại trang hiện tại sau khi xóa
      const totalPages = Math.ceil(employees.length / rowsPerPage);
      if (currentPage > totalPages && currentPage > 1) {
          currentPage = totalPages;
      }
      
      renderTable();
    }
  });

  // Reset form khi modal đóng
  document.getElementById('addEmployeeModal').addEventListener('hidden.bs.modal', resetForm);

  // ===================================================================
  // PHẦN 4: KHỞI CHẠY LẦN ĐẦU
  // ===================================================================
  renderTable();
});