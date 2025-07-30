document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.querySelector("table tbody");
  const formAdd = document.getElementById("formAddTransaction");
  const displayCount = document.getElementById("transactionCount");
  const modal = new bootstrap.Modal(document.getElementById("addTransactionModal"));
  const modalTitle = document.getElementById("addTransactionModalLabel");
  const submitBtn = formAdd.querySelector("button[type='submit']");
  const viewModal = new bootstrap.Modal(document.getElementById("viewTransactionModal"));

  let editIndex = -1;

  function renderTable() {
    tbody.innerHTML = "";

    transactions.forEach((item, index) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td class="text-center">
          <input type="checkbox" class="select-row" data-index="${index}" />
        </td>
        <td class="text-center">
          <i class="bi bi-eye text-primary me-2 view-btn" data-index="${index}" role="button" title="Xem"></i>
          <i class="bi bi-pencil-square text-warning me-2 edit-btn" data-index="${index}" role="button" title="Sửa"></i>
          <i class="bi bi-trash3 text-danger delete-btn" data-index="${index}" role="button" title="Xóa"></i>
        </td>
        <td>${item.id}</td>
        <td class="text-start">${item.khachHang}</td>
        <td class="text-start">${item.nhanVien}</td>
        <td>${item.soTien.toLocaleString()} đ</td>
        <td>${formatDate(item.ngayMua)}</td>
      `;

      tbody.appendChild(tr);
    });

    updateCount();
    attachRowEvents();
  }

  function updateCount() {
    if (displayCount) {
      displayCount.textContent = `${transactions.length}`;
    }
  }

  function attachRowEvents() {
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        if (confirm("Bạn có chắc muốn xóa giao dịch này?")) {
          transactions.splice(index, 1);
          renderTable();
        }
      });
    });

    document.querySelectorAll(".edit-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        const item = transactions[index];
        editIndex = index;

        document.getElementById("inputID").value = item.id;
        document.getElementById("inputKH").value = item.khachHang;
        document.getElementById("inputNV").value = item.nhanVien;
        document.getElementById("inputSoTien").value = item.soTien;
        document.getElementById("inputNgay").value = item.ngayMua;

        modalTitle.textContent = "Sửa Giao Dịch";
        submitBtn.textContent = "Cập nhật";
        submitBtn.classList.remove("btn-primary");
        submitBtn.classList.add("btn-warning");

        modal.show();
      });
    });

    document.querySelectorAll(".view-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        const item = transactions[index];

        document.getElementById("viewID").textContent = item.id;
        document.getElementById("viewKH").textContent = item.khachHang;
        document.getElementById("viewNV").textContent = item.nhanVien;
        document.getElementById("viewSoTien").textContent = item.soTien.toLocaleString() + " đ";
        document.getElementById("viewNgay").textContent = formatDate(item.ngayMua);

        viewModal.show();
      });
    });
  }
  // Select all checkboxes functionality
  document.getElementById("selectAllCheckbox").addEventListener("change", function () {
    const isChecked = this.checked;
    document.querySelectorAll(".select-row").forEach(cb => {
      cb.checked = isChecked;
    });
  });

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleString("vi-VN");
  }

  formAdd.addEventListener("submit", function (e) {
    e.preventDefault();

    const id = document.getElementById("inputID").value.trim();
    const kh = document.getElementById("inputKH").value.trim();
    const nv = document.getElementById("inputNV").value.trim();
    const soTien = parseFloat(document.getElementById("inputSoTien").value);
    const ngay = document.getElementById("inputNgay").value;

    if (id && kh && nv && !isNaN(soTien) && ngay) {
      const data = {
        id: id,
        khachHang: kh,
        nhanVien: nv,
        soTien: soTien,
        ngayMua: ngay
      };

      if (editIndex !== -1) {
        transactions[editIndex] = data;
        editIndex = -1;
      } else {
        transactions.push(data);
      }

      formAdd.reset();
      modal.hide();
      modalTitle.textContent = "Thêm Giao Dịch";
      submitBtn.textContent = "Thêm";
      submitBtn.classList.remove("btn-warning");
      submitBtn.classList.add("btn-primary");

      renderTable();
    } else {
      alert("Vui lòng nhập đầy đủ thông tin hợp lệ.");
    }
  });

  document.getElementById("btnDeleteSelected").addEventListener("click", () => {
    const selected = document.querySelectorAll(".select-row:checked");
    if (selected.length === 0) {
      alert("Bạn chưa chọn giao dịch nào để xóa.");
      return;
    }

    if (confirm(`Bạn có chắc muốn xóa ${selected.length} giao dịch đã chọn?`)) {
      const indices = Array.from(selected).map(cb => parseInt(cb.dataset.index));
      indices.sort((a, b) => b - a).forEach(i => transactions.splice(i, 1));
      renderTable();
    }
  });

  renderTable();
});
