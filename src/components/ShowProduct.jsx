import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ProductTab from "./ProductTab";

const ShowProduct = () => {
  const [showProductModal, setShowProductModal] = useState(false);
  const handleOpenProductModal = () => setShowProductModal(true);
  const handleCloseProductModal = () => setShowProductModal(false);

  return (
    <div>
      <Button variant="primary" onClick={handleOpenProductModal}>
        Products
      </Button>
      <Modal show={showProductModal} onHide={handleCloseProductModal}>
        <Modal.Header closeButton>
          <Modal.Title>Products</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProductTab />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ShowProduct;
