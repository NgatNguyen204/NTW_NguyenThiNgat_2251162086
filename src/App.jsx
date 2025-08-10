// src/App.jsx
import React, { useState, useEffect } from 'react';
import { studentsData } from './data.js';

import Toolbar from './components/Toolbar';
import Table from './components/Table';
import Form from './components/Form';
import Pagination from './components/Pagination';
import './App.css';

function App() {
  const [students, setStudents] = useState(studentsData);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]); // NEW: State để lưu ID các sinh viên được chọn

  const itemsPerPage = 5;
  const totalPages = Math.ceil(students.length / itemsPerPage);
  const indexOfLastStudent = currentPage * itemsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - itemsPerPage;
  const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [students.length, totalPages, currentPage]);

  const handleAddNew = () => {
    setEditingStudent(null);
    setIsFormVisible(true);
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setIsFormVisible(true);
  };

  // MODIFIED: Cập nhật hàm xóa
  const handleDelete = (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setStudents(students.filter(s => s.id !== studentId));
      setSelectedStudentIds(prev => prev.filter(id => id !== studentId)); // Xóa khỏi danh sách chọn nếu đang được chọn
    }
  };
  
  // NEW: Hàm xử lý xóa các sinh viên đã chọn
  const handleDeleteSelected = () => {
    if (window.confirm(`Are you sure you want to delete these ${selectedStudentIds.length} students?`)) {
      setStudents(students.filter(s => !selectedStudentIds.includes(s.id)));
      setSelectedStudentIds([]); // Dọn dẹp danh sách đã chọn
    }
  };

  const handleSave = (studentData) => {
    if (editingStudent) {
      setStudents(students.map(s => (s.id === editingStudent.id ? { ...s, ...studentData } : s)));
    } else {
      const newStudent = { id: Date.now(), ...studentData };
      setStudents([newStudent, ...students]); // Thêm vào đầu danh sách
    }
    setIsFormVisible(false);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setSelectedStudentIds([]); // Bỏ chọn tất cả khi chuyển trang
  };
  
  // NEW: Hàm xử lý khi chọn một sinh viên
  const handleSelectStudent = (studentId, isSelected) => {
    if (isSelected) {
      setSelectedStudentIds(prev => [...prev, studentId]);
    } else {
      setSelectedStudentIds(prev => prev.filter(id => id !== studentId));
    }
  };
  
  // NEW: Hàm xử lý khi chọn tất cả
  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      const currentStudentIds = currentStudents.map(s => s.id);
      setSelectedStudentIds(currentStudentIds);
    } else {
      setSelectedStudentIds([]);
    }
  };


  return (
    <div className="container-xl">
      <div className="table-responsive">
        <div className="table-wrapper">
          {/* MODIFIED: Truyền thêm props cho Toolbar */}
          <Toolbar 
            onAddNew={handleAddNew} 
            onDeleteSelected={handleDeleteSelected}
            hasSelectedItems={selectedStudentIds.length > 0}
          />
          {/* MODIFIED: Truyền thêm props cho Table */}
          <Table
            students={currentStudents}
            onEdit={handleEdit}
            onDelete={handleDelete}
            selectedStudentIds={selectedStudentIds}
            onSelectStudent={handleSelectStudent}
            onSelectAll={handleSelectAll}
          />
          <Pagination
            totalItems={students.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {isFormVisible && (
        <Form
          onSave={handleSave}
          onCancel={handleCancel}
          editingStudent={editingStudent}
        />
      )}
    </div>
  );
}

export default App;