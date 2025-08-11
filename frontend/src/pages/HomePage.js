import React, { useState, useEffect, useCallback } from 'react';
import { getProducts, getCategories, getNewArrivals } from '../services/api';
import ProductList from '../components/ProductList';
import SearchFilter from '../components/SearchFilter';
import ImageModal from '../components/ImageModal';
import RecommendedProductsCarousel from '../components/RecommendedProductsCarousel';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Modal states
  const [modalImages, setModalImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalProductName, setModalProductName] = useState('');
  
  // Handle image click to open modal
  const handleImageClick = (images, startIndex, productName = '') => {
    setModalImages(images);
    setCurrentImageIndex(startIndex);
    setModalProductName(productName);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setModalImages([]);
    setCurrentImageIndex(0);
    setModalProductName('');
  };

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

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = { search: searchTerm, category: selectedCategory };
      const [productsRes, newArrivalsRes] = await Promise.all([
        getProducts(params),
        getNewArrivals(),
      ]);
      
      // ทำความสะอาดข้อมูลเพื่อป้องกัน null category
      const cleanProducts = productsRes.data?.map(product => ({
        ...product,
        category: product.category || { name: 'ไม่มีหมวดหมู่' }
      })) || [];
      
      const cleanNewArrivals = newArrivalsRes.data?.map(product => ({
        ...product,
        category: product.category || { name: 'ไม่มีหมวดหมู่' }
      })) || [];
      
      setProducts(cleanProducts);
      setNewArrivals(cleanNewArrivals);
      
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProducts([]);
      setNewArrivals([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    getCategories()
      .then(res => {
        // เรียงลำดับ categories ก่อน set state
        const sortedCategories = sortCategories(res.data || []);
        setCategories(sortedCategories);
      })
      .catch(err => console.error("Failed to fetch categories:", err));
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading && products.length === 0) return <p>Loading...</p>;

  return (
    <div>
      <RecommendedProductsCarousel onImageClick={handleImageClick} />
      
      <SearchFilter 
        categories={categories}
        onCategoryChange={setSelectedCategory}
      />
      
      {/* แสดงสินค้ามาใหม่เฉพาะเมื่อไม่ได้เลือกหมวดหมู่เฉพาะ และไม่ได้ค้นหา */}
      {!selectedCategory && !searchTerm && (
        <>
          <h2>สินค้ามาใหม่</h2>
          <ProductList 
            products={newArrivals} 
            onImageClick={handleImageClick}
          />
        </>
      )}

      <h2>{searchTerm || selectedCategory ? 'สินค้าที่ค้นหา' : 'สินค้าทั้งหมด'}</h2>
      {loading ? (
        <p>กำลังโหลดสินค้า...</p>
      ) : (
        <ProductList 
          products={products} 
          onImageClick={handleImageClick}
        />
      )}

      {/* Image Modal */}
      {isModalOpen && (
        <ImageModal
          images={modalImages}
          currentIndex={currentImageIndex}
          onClose={closeModal}
          onIndexChange={setCurrentImageIndex}
          productName={modalProductName}
        />
      )}
    </div>
  );
};

export default HomePage;