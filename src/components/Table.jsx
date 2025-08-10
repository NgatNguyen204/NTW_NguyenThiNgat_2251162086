// src/components/Table.jsx
import React from 'react';

// MODIFIED: Nhận thêm props
function Table({ students, onEdit, onDelete, selectedStudentIds, onSelectStudent, onSelectAll }) {

  // Kiểm tra xem tất cả các sinh viên trên trang hiện tại đã được chọn chưa
  const areAllSelected = students.length > 0 && students.every(s => selectedStudentIds.includes(s.id));

  return (
    <table className="table table-striped table-hover">
      <thead>
        <tr>
          <th>
            <span className="custom-checkbox">
              {/* MODIFIED: Thêm logic cho checkbox "chọn tất cả" */}
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
          // MODIFIED: Thêm class 'active' nếu hàng được chọn
          <tr key={student.id} className={selectedStudentIds.includes(student.id) ? 'active' : ''}>
            <td>
              <span className="custom-checkbox">
                {/* MODIFIED: Thêm logic cho checkbox của từng hàng */}
                <input 
                  type="checkbox" 
                  id={`checkbox${student.id}`} 
                  checked={selectedStudentIds.includes(student.id)}
                  onChange={(e) => onSelectStudent(student.id, e.target.checked)}
                />
                <label htmlFor={`checkbox${student.id}`}></label>
              </span>
            </td>
            <td>{student.name}</td>
            <td>{student.email}</td>
            <td>{student.address}</td>
            <td>{student.phone}</td>
            <td>
              <button onClick={() => onEdit(student)} className="btn btn-sm btn-primary me-2 ">
                <i className="fas fa-pen-to-square" title="Edit"></i>
              </button>
              <button onClick={() => onDelete(student.id)} className="btn btn-sm btn-danger">
                <i className="fas fa-trash" title="Delete"></i>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;