document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("studentForm");
  const tableBody = document.querySelector("#studentTable tbody");
  const thongBao = document.createElement("p");
  thongBao.className = "text-center fw-bold mt-2";
  // document.querySelector(".col-md-8").appendChild(thongBao); // Thêm vào dưới bảng

  let stt = 1;
  let selectedRow = null;

  function showMessage(msg, isSuccess = true) {
    thongBao.innerText = msg;
    thongBao.className = isSuccess ? "text-success text-center fw-bold mt-2" : "text-danger text-center fw-bold mt-2";
    setTimeout(() => (thongBao.innerText = ""), 3000);
  }

  function validateForm(msv, hoTen, email, ngaySinh, gioiTinh) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!msv || !hoTen || !email || !ngaySinh || !gioiTinh) {
      showMessage("❌ Vui lòng nhập đầy đủ thông tin!", false);
      return false;
    }

    if (!emailRegex.test(email)) {
      showMessage("❌ Email không hợp lệ!", false);
      return false;
    }

    return true;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const msv = document.getElementById("msv").value.trim();
    const hoTen = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const ngaySinh = document.getElementById("ngaysinh").value;
    const gioiTinhInput = form.querySelector("input[name='gioitinh']:checked");
    const gioiTinh = gioiTinhInput ? gioiTinhInput.value : "";

    if (!validateForm(msv, hoTen, email, ngaySinh, gioiTinh)) return;

    if (selectedRow === null) {
      // Thêm mới
      const newRow = tableBody.insertRow();
      newRow.insertCell(0).innerText = stt++;
      newRow.insertCell(1).innerText = msv;
      newRow.insertCell(2).innerText = hoTen;
      newRow.insertCell(3).innerText = email;
      newRow.insertCell(4).innerText = ngaySinh;
      newRow.insertCell(5).innerText = gioiTinh;
      newRow.insertCell(6).innerHTML = `
        <button class="btn btn-warning btn-sm me-1 btn-edit"><i class="fa-solid fa-pen-to-square"></i></button>
        <button class="btn btn-danger btn-sm btn-delete"><i class="fa-solid fa-trash"></i></button>
      `;

      showMessage("✅ Thêm sinh viên thành công!");
    } else {
      // Cập nhật
      selectedRow.cells[1].innerText = msv;
      selectedRow.cells[2].innerText = hoTen;
      selectedRow.cells[3].innerText = email;
      selectedRow.cells[4].innerText = ngaySinh;
      selectedRow.cells[5].innerText = gioiTinh;

      showMessage("✅ Cập nhật thành công!");
      selectedRow = null;
    }

    form.reset();
  });

  tableBody.addEventListener("click", function (e) {
    const target = e.target;
    const btn = target.closest("button");
    const row = target.closest("tr");

    if (!btn || !row) return;

    if (btn.classList.contains("btn-delete")) {
      if (confirm("Bạn có chắc chắn muốn xoá?")) {
        row.remove();
        showMessage("🗑️ Xoá thành công!");
        updateSTT();
      }
    }

    if (btn.classList.contains("btn-edit")) {
      selectedRow = row;
      document.getElementById("msv").value = row.cells[1].innerText;
      document.getElementById("fullname").value = row.cells[2].innerText;
      document.getElementById("email").value = row.cells[3].innerText;
      document.getElementById("ngaysinh").value = row.cells[4].innerText;
      const gioiTinh = row.cells[5].innerText;

      const genderInput = form.querySelector(`input[name='gioitinh'][value='${gioiTinh}']`);
      if (genderInput) genderInput.checked = true;

      showMessage("✏️ Đã tải dữ liệu để cập nhật.");
    }
  });

  function updateSTT() {
    const rows = tableBody.querySelectorAll("tr");
    stt = 1;
    rows.forEach(row => {
      row.cells[0].innerText = stt++;
    });
  }
});
