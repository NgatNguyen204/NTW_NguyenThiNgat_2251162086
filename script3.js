$(document).ready(function () {
    let currentPage = 1;
    const rowsPerPage = 5;

    function showNotification(message, isSuccess) {
        const notification = $('#notification');
        notification.removeClass('alert-success alert-danger')
            .addClass(isSuccess ? 'alert alert-success' : 'alert alert-danger')
            .text(message)
            .fadeIn();

        setTimeout(() => {
            notification.fadeOut();
        }, 3000);
    }

    function refreshData() {
        renderTable();
        renderPagination();
    }

    function renderTable() {
        const tableBody = $('table tbody');
        tableBody.empty();

        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const paginatedData = nhanVienData.slice(startIndex, endIndex);

        if (paginatedData.length === 0 && currentPage > 1) {
            currentPage--;
            refreshData();
            return;
        }

        paginatedData.forEach(nv => {
            const hoatDongIcon = nv.hoatDong
                ? `<i class="bi bi-check-circle-fill text-success" title="Đang hoạt động - Nhấn để thay đổi"></i>`
                : `<i class="bi bi-x-circle-fill text-danger" title="Đã tạm dừng - Nhấn để thay đổi"></i>`;

            const row = `
                <tr>
                    <td class="text-center"><input type="checkbox" class="form-check-input" data-id="${nv.id}"></td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-primary btn-view" data-id="${nv.id}" title="Xem"><i class="bi bi-eye-fill"></i></button>
                        <button class="btn btn-sm btn-warning btn-edit" data-id="${nv.id}" title="Sửa"><i class="bi bi-pencil-fill"></i></button>
                        <button class="btn btn-sm btn-danger btn-delete" data-id="${nv.id}" title="Xóa"><i class="bi bi-trash-fill"></i></button>
                    </td>
                    <td class="text-center">${nv.id}</td>
                    <td class="text-center">${nv.ten}</td>
                    <td class="text-center">${nv.hoDem}</td>
                    <td class="text-center">${nv.diaChi}</td>
                    <td class="text-center toggle-status" data-id="${nv.id}">
                        ${hoatDongIcon}
                    </td>
                </tr>
            `;
            tableBody.append(row);
        });
    }

    function renderPagination() {
        const totalRows = nhanVienData.length;
        const totalPages = Math.ceil(totalRows / rowsPerPage);
        const paginationContainer = $('#pagination-container');
        paginationContainer.empty();

        $('#transactionCount').text(totalRows);

        const startItem = totalRows > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0;
        const endItem = Math.min(currentPage * rowsPerPage, totalRows);
        $('#pagination-info').text(`Hiển thị ${startItem} đến ${endItem} của ${totalRows} kết quả`);

        if (totalPages <= 1) return;

        paginationContainer.append(`<li class="page-item ${currentPage === 1 ? 'disabled' : ''}"><a class="page-link" href="#" data-page="${currentPage - 1}">Trang trước</a></li>`);
        for (let i = 1; i <= totalPages; i++) {
            paginationContainer.append(`<li class="page-item ${i === currentPage ? 'active' : ''}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`);
        }
        paginationContainer.append(`<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}"><a class="page-link" href="#" data-page="${currentPage + 1}">Trang sau</a></li>`);
    }

    $('#formAddTransaction').on('submit', function (event) {
        event.preventDefault();
        const ten = $('#inputTen').val().trim();
        const hoDem = $('#inputHo').val().trim();
        const diaChi = $('#inputDC').val().trim();
        const editId = $('#editEmployeeId').val();
        let isValid = true;

        $('.text-danger').text('');

        if (ten === '') { $('#errorTen').text('Tên không được bỏ trống.'); isValid = false; }
        else if (ten.length > 15) { $('#errorTen').text('Tên không được quá 15 ký tự.'); isValid = false; }

        if (hoDem === '') { $('#errorHo').text('Họ đệm không được bỏ trống.'); isValid = false; }
        else if (hoDem.length > 20) { $('#errorHo').text('Họ đệm không được quá 20 ký tự.'); isValid = false; }

        if (diaChi === '') { $('#errorDC').text('Địa chỉ không được bỏ trống.'); isValid = false; }
        else if (diaChi.length > 50) { $('#errorDC').text('Địa chỉ không được quá 50 ký tự.'); isValid = false; }

        if (isValid) {
            if (editId) {
                const employee = nhanVienData.find(nv => nv.id == editId);
                if (employee) {
                    employee.ten = ten;
                    employee.hoDem = hoDem;
                    employee.diaChi = diaChi;
                    showNotification('Cập nhật nhân viên thành công!', true);
                }
            } else {
                const newId = nhanVienData.length > 0 ? Math.max(...nhanVienData.map(nv => nv.id)) + 1 : 1;
                nhanVienData.push({ id: newId, ten, hoDem, diaChi, hoatDong: true });
                showNotification('Thêm nhân viên thành công!', true);
            }
            $('#addTransactionModal').modal('hide');
            refreshData();
        }
    });

    $('tbody').on('click', '.toggle-status', function () {
        const id = $(this).data('id');
        const employee = nhanVienData.find(nv => nv.id == id);

        if (employee) {
            employee.hoatDong = !employee.hoatDong;
            showNotification(`Đã cập nhật trạng thái cho nhân viên "${employee.hoDem} ${employee.ten}".`, true);
            refreshData();
        }
    });

    $('tbody').on('click', '.btn-view', function () {
        const id = $(this).data('id');
        const employee = nhanVienData.find(nv => nv.id == id);
        if (employee) {
            $('#viewId').text(employee.id);
            $('#viewTen').text(employee.ten);
            $('#viewHo').text(employee.hoDem);
            $('#viewDC').text(employee.diaChi);
            $('#viewStatus').html(employee.hoatDong ? '<span class="badge bg-success">Hoạt động</span>' : '<span class="badge bg-danger">Tạm dừng</span>');
            $('#viewTransactionModal').modal('show');
        }
    });

    $('tbody').on('click', '.btn-edit', function () {
        const id = $(this).data('id');
        const employee = nhanVienData.find(nv => nv.id == id);
        if (employee) {
            $('#addTransactionModalLabel').text('Sửa thông tin Nhân viên');
            $('#submitButton').text('Cập nhật');
            $('#editEmployeeId').val(employee.id);
            $('#inputTen').val(employee.ten);
            $('#inputHo').val(employee.hoDem);
            $('#inputDC').val(employee.diaChi);
            $('#addTransactionModal').modal('show');
        }
    });

    $('tbody').on('click', '.btn-delete', function () {
        const id = $(this).data('id');
        if (confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
            const index = nhanVienData.findIndex(nv => nv.id == id);
            if (index !== -1) {
                nhanVienData.splice(index, 1);
                showNotification('Đã xóa nhân viên thành công!', true);
                refreshData();
            }
        }
    });

    $('#pagination-container').on('click', '.page-link', function (e) {
        e.preventDefault();
        const page = $(this).data('page');
        if (page) {
            currentPage = page;
            refreshData();
        }
    });

    $('#addTransactionModal').on('hidden.bs.modal', function () {
        $(this).find('form')[0].reset();
        $('.text-danger').text('');
        $('#addTransactionModalLabel').text('Thêm Nhân viên');
        $('#submitButton').text('Thêm');
        $('#editEmployeeId').val('');
    });

    refreshData();
});
