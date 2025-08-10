// src/components/Table.jsx
import React from 'react';

// Đảm bảo bạn nhận đủ các props này từ App.jsx
function Table({ students, onEdit, onDelete, selectedStudentIds, onSelectStudent, onSelectAll }) {

  // Kiểm tra xem tất cả các sinh viên trên trang hiện tại đã được chọn chưa
  // Điều kiện students.length > 0 để tránh lỗi khi không có sinh viên nào
  const areAllSelected = students.length > 0 && students.every(s => selectedStudentIds.includes(s.id));

  return (
    <table className="table table-striped table-hover">
      <thead>
        <tr>
          <th>
            <span className="custom-checkbox">
              <input
                type="checkbox"
                id="selectAll"
                checked={areAllSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
              />
              <label htmlFor="selectAll"></label>
            </span>
          </th>
          <th>Name</th>
          <th>Email</th>
          <th>Address</th>
          <th>Phone</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          // Thêm class 'table-active' của Bootstrap khi hàng được chọn
          <tr key={student.id} className={selectedStudentIds.includes(student.id) ? 'table-active' : ''}>
            <td>
              <span className="custom-checkbox">
                <input
                  type="checkbox"
                  id={`checkbox${student.id}`} // ID duy nhất cho mỗi checkbox
                  checked={selectedStudentIds.includes(student.id)}
                  onChange={(e) => onSelectStudent(student.id, e.target.checked)}
                />
                <label htmlFor={`checkbox${student.id}`}></label> {/* htmlFor phải khớp với ID */}
              </span>
            </td>
            <td>{student.name}</td>
            <td>{student.email}</td>
            <td>{student.address}</td>
            <td>{student.phone}</td>
            <td>
              <button onClick={() => onEdit(student)} className="action-button edit">
                <i className="material-icons" title="Edit">&#xE254;</i>
              </button>
              <button onClick={() => onDelete(student.id)} className="action-button delete">
                <i className="material-icons" title="Delete">&#xE872;</i>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;