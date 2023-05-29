import React from 'react';
import { Link } from 'react-router-dom';

export default function RemoveProductModal({
  open,
  onClose,
  onConfirm,
  productName,
  stock,
}) {
  if (!open) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <>
      <div className="product-overlay" />
      <div className="product-modal">
        <div className="modal-header">
          <header>Remove Product</header>
        </div>
        <div className="modal-boday">
          <header>
            Are you sure you want to remove: {productName} from the platform.
          </header>
        </div>

        <div className="modal-footer">
          <Link className="button" onClick={handleConfirm}>
            Confirm
          </Link>
          <Link className="button" onClick={onClose}>
            Cancel
          </Link>
        </div>
      </div>
    </>
  );
}
