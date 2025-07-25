document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("studentForm");
  const tableBody = document.querySelector("#studentTable tbody");
  const thongBao = document.createElement("div");
  thongBao.id = "thongBao";
  thongBao.className = "text-success text-center fw-bold my-2";
  form.insertAdjacentElement("beforebegin", thongBao); // chèn vào phía trên form

  let stt = 1;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Lấy dữ liệu từ form
    const msv = document.getElementById("msv").value.trim();
    const hoTen = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const ngaySinh = document.getElementById("ngaysinh").value;
    const gioiTinh = form.querySelector("input[name='gioitinh']:checked");
    const gioiTinhText = gioiTinh ? gioiTinh.value : "";

    // Regex kiểm tra email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validation
    if (!msv || !hoTen || !email || !ngaySinh || !gioiTinhText) {
      thongBao.innerText = "❌ Vui lòng nhập đầy đủ thông tin!";
      thongBao.classList.replace("text-success", "text-danger");
      setTimeout(() => (thongBao.innerText = ""), 3000);
      return;
    }

    if (!emailRegex.test(email)) {
      thongBao.innerText = "❌ Email không hợp lệ! Vui lòng nhập đúng định dạng.";
      thongBao.classList.replace("text-success", "text-danger");
      setTimeout(() => (thongBao.innerText = ""), 3000);
      return;
    }

    // Thêm dòng mới vào bảng
    const newRow = tableBody.insertRow();
    newRow.insertCell(0).innerText = stt++;
    newRow.insertCell(1).innerText = msv;
    newRow.insertCell(2).innerText = hoTen;
    newRow.insertCell(3).innerText = email;
    newRow.insertCell(4).innerText = ngaySinh;
    newRow.insertCell(5).innerText = gioiTinhText;

    newRow.insertCell(6).innerHTML = `
      <button class="btn btn-warning btn-sm me-1"><i class="fa-solid fa-pen-to-square"></i></button>
      <button class="btn btn-danger btn-sm"><i class="fa-solid fa-trash"></i></button>
    `;

    // Thông báo thành công
    thongBao.innerText = "✅ Thêm sinh viên thành công!";
    thongBao.classList.replace("text-danger", "text-success");
    setTimeout(() => (thongBao.innerText = ""), 3000);

    form.reset(); // reset form
  });
});
