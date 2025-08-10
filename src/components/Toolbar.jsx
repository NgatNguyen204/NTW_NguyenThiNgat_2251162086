// src/components/Toolbar.jsx
import React from 'react';

// MODIFIED: Nhận thêm props
function Toolbar({ onAddNew, onDeleteSelected, hasSelectedItems }) {
  return (
    <div className="toolbar w100">
        <nav className="navbar navbar-expand-lg navbar-light bg-light px-3 container-fluid">
            {/* ... phần nav không đổi ... */}
            <a className="navbar-brand fw-bold" href="#">TLU</a>
            <div className="collapse navbar-collapse">
                <ul className="navbar-nav me-auto">
                <li className="nav-item"><a className="nav-link" href="#">Home</a></li>
                <li className="nav-item"><a className="nav-link" href="#">Thông tin</a></li>
                </ul>
                <form className="d-flex" >
                <input 
                    className="form-control me-2 border" 
                    type="search" 
                    placeholder="Search" 
                />
                <button className="btn btn-outline-success" type="submit">Search</button>
                </form>
            </div>
        </nav>
        <div className="d-flex justify-content-between align-items-center mb-3 padding header">
            <h4>Quản lý <strong>Sinh Viên</strong></h4>
            <div>
                {/* MODIFIED: Kích hoạt nút xóa và thêm sự kiện onClick */}
                <button 
                  className="btn btn-danger me-2" 
                  onClick={onDeleteSelected} 
                  disabled={!hasSelectedItems}
                >
                  <i className="fa fa-trash"></i> Xóa
                </button>
            
                <button className="btn btn-success" onClick={onAddNew} >
                  <i className="fa fa-plus-circle"></i> Thêm mới
                </button>
            </div>
        </div>
    </div>
  );
}

export default Toolbar;