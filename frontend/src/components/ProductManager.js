import React, { useState, useEffect } from "react";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  toggleRecommendProduct,
} from "../services/api";

const ProductManager = ({ categories, onUpdate, loading, setLoading, refreshKey }) => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    weight: "", // เพิ่มฟิลด์น้ำหนัก
    priceType: "per_kg", // เพิ่มประเภทราคา
    category: "",
    images: [],
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);

  // ฟังก์ชันคำนวณราคาต่อหน่วย (ย้ายมาไว้ที่ถูกต้อง)
  const calculatePricePerUnit = () => {
    const price = parseFloat(formData.price);
    const weight = parseFloat(formData.weight);
    if (price && weight && weight > 0) {
      return (price / weight).toFixed(2);
    }
    return "0.00";
  };

  // ฟังก์ชันกำหนดหน่วย
  const getUnitLabel = (priceType) => {
    switch(priceType) {
      case 'per_piece': return 'ลูก';
      case 'per_pack': return 'แพ็ค';
      default: return 'กก.';
    }
  };

  // ฟังก์ชันเรียงลำดับ 0-9, A-Z, ก-ฮ
  const sortCategories = (categories) => {
    return [...categories].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      
      // ตัวเลข (0-9)
      const isNumberA = /^[0-9]/.test(nameA);
      const isNumberB = /^[0-9]/.test(nameB);
      
      // ตัวอักษรภาษาอังกฤษ (A-Z)
      const isEnglishA = /^[a-z]/.test(nameA);
      const isEnglishB = /^[a-z]/.test(nameB);
      
      // ตัวอักษรไทย (ก-ฮ)
      const isThaiA = /^[ก-ฮ]/.test(nameA);
      const isThaiB = /^[ก-ฮ]/.test(nameB);
      
      // เรียงลำดับตามความสำคัญ: ตัวเลข -> อังกฤษ -> ไทย
      if (isNumberA && !isNumberB) return -1;
      if (!isNumberA && isNumberB) return 1;
      
      if (isEnglishA && isThaiB) return -1;
      if (isThaiA && isEnglishB) return 1;
      
      // ถ้าอยู่ในกลุ่มเดียวกัน เรียงตามตัวอักษร
      return nameA.localeCompare(nameB, 'th');
    });
  };

  const fetchProducts = async () => {
    const response = await getProducts();
    setProducts(response.data);
  };

  useEffect(() => {
    fetchProducts();
  }, [refreshKey]);

  useEffect(() => {
    if (categories.length > 0 && !formData.category) {
      const sortedCats = sortCategories(categories);
      setFormData((prev) => ({ ...prev, category: sortedCats[0]._id }));
    }
  }, [categories, formData.category]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    for (let file of files) {
      if (!validTypes.includes(file.type)) {
        setError("Only JPG, JPEG, or PNG files are allowed.");
        setFormData({ ...formData, images: [] });
        e.target.value = null;
        return;
      }
    }
    setError("");
    setFormData({ ...formData, images: files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.category) {
      setError("กรุณาเลือกหมวดหมู่");
      return;
    }
    if (!formData.weight || parseFloat(formData.weight) <= 0) {
      setError("กรุณาใส่น้ำหนัก (กิโลกรัม) ที่มากกว่า 0");
      return;
    }
    setLoading(true);
    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("weight", formData.weight);
    data.append("priceType", formData.priceType);
    data.append("category", formData.category);
    formData.images.forEach((file) => {
      data.append("images", file);
    });
    try {
      if (editingId) {
        await updateProduct(editingId, data);
      } else {
        await addProduct(data);
      }
      resetForm();
      fetchProducts();
      onUpdate();
    } catch (err) {
      if (err.response && (err.response.status === 409 || (err.response.status === 400 && err.response.data && err.response.data.message && err.response.data.message.includes('มีสินค้านี้อยู่แล้ว')))) {
        setError("มีสินค้านี้อยู่แล้ว");
      } else {
        setError("Upload failed. Please try again.");
      }
    }
    setLoading(false);
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      price: product.price,
      weight: product.weight || "",
      priceType: product.priceType || "per_kg",
      category: product.category._id || product.category,
      images: [],
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await deleteProduct(id);
      fetchProducts();
    }
  };

  const resetForm = () => {
    setEditingId(null);
    const sortedCats = sortCategories(categories);
    setFormData({
      name: "",
      price: "",
      weight: "",
      priceType: "per_kg",
      category: sortedCats.length > 0 ? sortedCats[0]._id : "",
      images: [],
    });
    const imageInput = document.getElementById("image-input");
    if (imageInput) imageInput.value = null;
    setError("");
  };

  // filter สินค้าตามหมวดหมู่
  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter(
          (p) => (p.category?._id || p.category) === selectedCategory
        );

  // ฟังก์ชัน toggle เลือก checkbox
  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };
  
  // เลือก/ไม่เลือกทั้งหมด
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(filteredProducts.map((p) => p._id));
    } else {
      setSelectedIds([]);
    }
  };
  
  // ลบสินค้าหลายตัว
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm("ต้องการลบสินค้าที่เลือกทั้งหมดใช่หรือไม่?")) return;
    for (let id of selectedIds) {
      await deleteProduct(id);
    }
    setSelectedIds([]);
    fetchProducts();
  };

  // เรียงลำดับ categories ก่อนใช้งาน
  const sortedCategories = sortCategories(categories);

  return (
    <div className="manager-container">
      <h3>แก้ไขสินค้า</h3>
      <form onSubmit={handleSubmit} className="manager-form product-form">
        <input
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="ชื่อสินค้า"
          required
        />
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="ราคา"
            required
            style={{ flex: 1 }}
          />
          <input
            name="weight"
            type="number"
            step="0.01"
            value={formData.weight}
            onChange={handleInputChange}
            placeholder={
              formData.priceType === 'per_kg' ? "น้ำหนัก (กก.)" : 
              formData.priceType === 'per_piece' ? "จำนวน (ลูก)" : 
              "จำนวน (แพ็ค)"
            }
            required
            style={{ flex: 1 }}
          />
          <select
            name="priceType"
            value={formData.priceType}
            onChange={handleInputChange}
            style={{ flex: 1 }}
          >
            <option value="per_kg">ราคา/กก.</option>
            <option value="per_piece">ราคา/ลูก</option>
            <option value="per_pack">ราคา/แพ็ค</option>
          </select>
          <div style={{ 
            minWidth: '120px', 
            padding: '8px', 
            backgroundColor: '#f0f0f0', 
            borderRadius: '4px',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            ฿{calculatePricePerUnit()}/{getUnitLabel(formData.priceType)}
          </div>
        </div>
        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
        >
          <option value="">เลือกหมวดหมู่</option>
          {sortedCategories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          id="image-input"
          name="images"
          type="file"
          multiple
          onChange={handleFileChange}
        />
        <button type="submit" className="btn" disabled={loading}>
          {editingId ? "แก้ไข" : "เพิ่ม"}
        </button>
        {loading && <div style={{ color: "blue", marginTop: 8 }}>กำลังเพิ่มสินค้า...</div>}
        {editingId && (
          <button type="button" onClick={resetForm} className="btn">
            ยกเลิก
          </button>
        )}
      </form>
      
      <div className="category-filter-select">
        <label htmlFor="category-filter">กรองตามหมวดหมู่: </label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">ทั้งหมด</option>
          {sortedCategories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      
      {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}
      
      {filteredProducts.length > 0 && (
        <div style={{ margin: "10px 0" }}>
          <input
            type="checkbox"
            checked={selectedIds.length === filteredProducts.length}
            onChange={(e) => handleSelectAll(e.target.checked)}
            style={{ marginRight: 8 }}
          />
          <span>เลือกทั้งหมด</span>
          <button
            className="btn-delete"
            style={{ marginLeft: 16, padding: "6px 18px" }}
            disabled={selectedIds.length === 0}
            onClick={handleDeleteSelected}
          >
            ลบที่เลือก
          </button>
        </div>
      )}
      
      {products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          ไม่มีข้อมูลสินค้า
        </div>
      ) : (
        <ul className="manager-list">
          {filteredProducts.map((p, idx) => {
            let firstImage = null;
            if (Array.isArray(p.images) && p.images.length > 0) {
              firstImage = p.images[0];
            } else if (typeof p.images === "string" && p.images) {
              firstImage = p.images;
            } else if (p.image) {
              firstImage = p.image;
            }
            
            // คำนวณราคาต่อกิโลในรายการสินค้า
            const pricePerUnit = p.weight && p.weight > 0 ? (p.price / p.weight).toFixed(2) : "0.00";
            const unitLabel = getUnitLabel(p.priceType);
            
            return (
              <React.Fragment key={p._id}>
                <li style={{ display: "flex", alignItems: "center" }}>
                  {firstImage && (
                    <img
                      src={firstImage}
                      alt={p.name}
                      width="50"
                      style={{ marginRight: 8 }}
                    />
                  )}
                  <span style={{ flex: 1 }}>{p.name}</span>
                  <span style={{ flex: 1 }}>{p.category?.name || "N/A"}</span>
                  <span style={{ flex: 1 }}>
                    ฿{p.price} ({p.weight || 0}{unitLabel})
                    <br />
                    <small style={{ color: '#666' }}>฿{pricePerUnit}/{unitLabel}</small>
                  </span>
                  <div>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(p._id)}
                      onChange={() => handleSelect(p._id)}
                      style={{ marginRight: 8 }}
                    />
                    <button onClick={() => handleEdit(p)} className="btn-edit">
                      แก้ไข
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="btn-delete"
                    >
                      ลบ
                    </button>
                    <button
                      onClick={async () => {
                        await toggleRecommendProduct(p._id);
                        fetchProducts();
                      }}
                      className={p.recommended ? "btn-recommended" : "btn-recommend"}
                      title={p.recommended ? "ยกเลิกการแนะนำ" : "แนะนำสินค้านี้"}
                    >
                      {p.recommended ? "✓ แนะนำ" : "แนะนำ"}
                    </button>
                  </div>
                </li>
                {idx !== filteredProducts.length - 1 && <hr />}
              </React.Fragment>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ProductManager;