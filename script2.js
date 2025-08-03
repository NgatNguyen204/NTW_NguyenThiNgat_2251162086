$(document).ready(function () {
  // ===================================================================
  // PHẦN 1: KHỞI TẠO DỮ LIỆU VÀ CÁC BIẾN
  // ===================================================================

  let currentPage = 1;
  const rowsPerPage = 5; // Hiển thị 5 dòng mỗi trang
  let transactions = (typeof initialTransactions !== 'undefined') ? [...initialTransactions] : [];
  let currentMaxId = 0;

  for (const item of transactions) {
    const num = parseInt(item.id.replace('GD', ''), 10);
    if (!isNaN(num) && num > currentMaxId) {
      currentMaxId = num;
    }
  }

  // ===================================================================
  // PHẦN 2: CÁC BIẾN VÀ HÀM CỦA ỨNG DỤNG
  // ===================================================================
  
  const $tbody = $("table tbody");
  const $formAdd = $("#formAddTransaction");
  const $displayCount = $("#transactionCount");
  const $paginationContainer = $("#pagination-container");
  const $paginationInfo = $("#pagination-info"); // <<<--- Biến mới cho text "Kết quả..."
  const modal = new bootstrap.Modal($('#addTransactionModal')[0]);
  const $modalTitle = $("#addTransactionModalLabel");
  const $submitBtn = $formAdd.find("button[type='submit']");
  const viewModal = new bootstrap.Modal($('#viewTransactionModal')[0]);
  let editIndex = -1;

  function generateAutoID() {
    currentMaxId++;
    return 'GD' + String(currentMaxId).padStart(3, '0');
  }
  
  function formatDateForInput(dateValue) {
    const date = dateValue ? new Date(dateValue) : new Date();
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    const localTime = new Date(date.getTime() - timezoneOffset);
    return localTime.toISOString().slice(0, 16);
  }

  // === HÀM renderTable() GỌI CẢ HAI HÀM CON ===
  function renderTable() {
    $tbody.empty();
    
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedItems = transactions.slice(startIndex, endIndex);

    paginatedItems.forEach(function (item, index) {
      const originalIndex = startIndex + index;
      const id = item.id || 'N/A';
      const khachHang = item.khachHang || 'N/A';
      const nhanVien = item.nhanVien || 'N/A';
      const soTien = (item.soTien && !isNaN(item.soTien)) ? item.soTien.toLocaleString() + ' đ' : '0 đ';
      const ngayMua = item.ngayMua ? new Date(item.ngayMua).toLocaleString("vi-VN") : 'N/A';
      const $tr = $(`
        <tr>
          <td class="text-center"><input type="checkbox" class="select-row" data-index="${originalIndex}" /></td>
          <td class="text-center">
            <i class="bi bi-eye text-primary me-2 view-btn" data-index="${originalIndex}" role="button" title="Xem"></i>
            <i class="bi bi-pencil-square text-warning me-2 edit-btn" data-index="${originalIndex}" role="button" title="Sửa"></i>
            <i class="bi bi-trash3 text-danger delete-btn" data-index="${originalIndex}" role="button" title="Xóa"></i>
          </td>
          <td>${id}</td>
          <td class="text-start">${khachHang}</td>
          <td class="text-start">${nhanVien}</td>
          <td>${soTien}</td>
          <td>${ngayMua}</td>
        </tr>`);
      $tbody.append($tr);
    });

    updateCount();
    renderPaginationButtons(); // <<<--- Vẽ các nút bấm
    renderPaginationInfo();    // <<<--- Vẽ dòng chữ kết quả
    attachRowEvents();
  }

  // === HÀM CHỈ VẼ CÁC NÚT BẤM PHÂN TRANG ĐƠN GIẢN ===
  function renderPaginationButtons() {
    $paginationContainer.empty();
    const totalPages = Math.ceil(transactions.length / rowsPerPage);

    if (totalPages <= 1) {
      $("#pagination-wrapper").hide(); // Ẩn cả khu vực nếu không cần phân trang
      return;
    }
    $("#pagination-wrapper").show(); // Hiện lại nếu cần
    
    const prevClass = (currentPage === 1) ? 'disabled' : '';
    $paginationContainer.append(`<li class="page-item ${prevClass}"><a class="page-link" href="#" data-page="prev">Trước</a></li>`);

    for (let i = 1; i <= totalPages; i++) {
      const activeClass = (i === currentPage) ? 'active' : '';
      $paginationContainer.append(`<li class="page-item ${activeClass}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`);
    }
    
    const nextClass = (currentPage === totalPages) ? 'disabled' : '';
    $paginationContainer.append(`<li class="page-item ${nextClass}"><a class="page-link" href="#" data-page="next">Sau</a></li>`);
  }
  
  // === HÀM CHỈ HIỂN THỊ DÒNG CHỮ KẾT QUẢ ===
  function renderPaginationInfo() {
    const totalItems = transactions.length;
    if (totalItems === 0) {
        $paginationInfo.text("");
        return;
    }
    const startItem = (currentPage - 1) * rowsPerPage + 1;
    const endItem = Math.min(startItem + rowsPerPage - 1, totalItems);
    $paginationInfo.text(`Hiển thị ${startItem} - ${endItem} trong tổng số ${totalItems} kết quả`);
  }

  function updateCount() { $displayCount.text(transactions.length); }
  function clearValidation() { $(".text-danger").text(""); }

  function validateForm(kh, nv, soTien, ngay) {
    let isValid = true;
    clearValidation();
    if (!kh || kh.length < 3) { $("#errorKH").text("Tên KH phải có ít nhất 3 ký tự."); isValid = false; }
    if (!nv || nv.length < 3) { $("#errorNV").text("Tên NV phải có ít nhất 3 ký tự."); isValid = false; }
    if (isNaN(soTien) || soTien <= 0) { $("#errorSoTien").text("Số tiền phải lớn hơn 0."); isValid = false; }
    if (!ngay) { $("#errorNgay").text("Ngày mua không được để trống."); isValid = false; }
    return isValid;
  }
  
  // ===================================================================
  // PHẦN 3: CÁC BỘ LẮNG NGHE SỰ KIỆN
  // ===================================================================
  
  $("#addTransactionBtn").on("click", function () {
    editIndex = -1;
    $formAdd[0].reset();
    clearValidation();
    $modalTitle.text("Thêm Giao Dịch");
    $submitBtn.text("Thêm").removeClass("btn-warning").addClass("btn-primary");
    $("#inputID").val(generateAutoID());
    $("#inputNgay").val(formatDateForInput());
  });
  
  $formAdd.on("submit", function (e) {
    e.preventDefault();
    const kh = $("#inputKH").val().trim();
    const nv = $("#inputNV").val().trim();
    const soTien = parseFloat($("#inputSoTien").val());
    const ngay = $("#inputNgay").val();
    if (!validateForm(kh, nv, soTien, ngay)) return;

    if (editIndex !== -1) {
      transactions[editIndex].khachHang = kh;
      transactions[editIndex].nhanVien = nv;
      transactions[editIndex].soTien = soTien;
      transactions[editIndex].ngayMua = ngay;
    } else {
      const newId = generateAutoID();
      transactions.push({ id: newId, khachHang: kh, nhanVien: nv, soTien: soTien, ngayMua: ngay });
      currentPage = Math.ceil(transactions.length / rowsPerPage);
    }
    modal.hide();
    renderTable();
  });

  // === SỰ KIỆN KHI BẤM NÚT PHÂN TRANG ĐƠN GIẢN ===
  $paginationContainer.on("click", ".page-link", function(e) {
    e.preventDefault();
    const targetPage = $(this).data("page");
    if ($(this).parent().hasClass('disabled')) return;

    if (targetPage === "prev") {
      if (currentPage > 1) currentPage--;
    } else if (targetPage === "next") {
      const totalPages = Math.ceil(transactions.length / rowsPerPage);
      if (currentPage < totalPages) currentPage++;
    } else {
      currentPage = parseInt(targetPage);
    }
    renderTable();
  });

  function attachRowEvents() {
    $(".delete-btn").off("click").on("click", function() {
      const index = $(this).data("index");
      if (confirm("Bạn có chắc muốn xóa giao dịch này?")) {
        transactions.splice(index, 1);
        const totalPages = Math.ceil(transactions.length / rowsPerPage);
        if (currentPage > totalPages && totalPages > 0) {
          currentPage = totalPages;
        }
        renderTable();
      }
    });

    $(".edit-btn").off("click").on("click", function() {
      editIndex = $(this).data("index");
      const item = transactions[editIndex];
      clearValidation();
      $modalTitle.text("Sửa Giao Dịch");
      $submitBtn.text("Cập nhật").removeClass("btn-primary").addClass("btn-warning");
      $("#inputID").val(item.id);
      $("#inputKH").val(item.khachHang);
      $("#inputNV").val(item.nhanVien);
      $("#inputSoTien").val(item.soTien);
      $("#inputNgay").val(formatDateForInput(item.ngayMua));
      modal.show();
    });

    $(".view-btn").off("click").on("click", function() {
      const index = $(this).data("index");
      const item = transactions[index];
      $("#viewID").text(item.id);
      $("#viewKH").text(item.khachHang);
      $("#viewNV").text(item.nhanVien);
      $("#viewSoTien").text(item.soTien.toLocaleString() + " đ");
      $("#viewNgay").text(new Date(item.ngayMua).toLocaleString("vi-VN"));
      viewModal.show();
    });
  }

  $("#selectAllCheckbox").on("change", function () {
    $(".select-row").prop("checked", $(this).is(":checked"));
  });

  $("#btnDeleteSelected").on("click", function () {
    const selected = $(".select-row:checked");
    if (selected.length === 0) {
      alert("Bạn chưa chọn giao dịch nào để xóa.");
      return;
    }
    if (confirm(`Bạn có chắc muốn xóa ${selected.length} giao dịch đã chọn?`)) {
      const indices = selected.map(function () { return parseInt($(this).data("index")); }).get().sort((a, b) => b - a);
      indices.forEach(i => transactions.splice(i, 1));
      const totalPages = Math.ceil(transactions.length / rowsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
      }
      renderTable();
      $("#selectAllCheckbox").prop("checked", false);
    }
  });
  
  // ===================================================================
  // PHẦN 4: KHỞI CHẠY ỨNG DỤNG
  // ===================================================================
  renderTable();
});