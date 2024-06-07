import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addItem,
  updateItem,
  deleteItem,
  selectItemsList,
} from "../redux/itemSlice";
import { selectInvoiceList } from "../redux/invoicesSlice";
import { Table, Button } from "react-bootstrap";
import { BiTrash } from "react-icons/bi";
const ProductTab = () => {
  const [items, setItems] = useState([]);
  const dispatch = useDispatch();
  const allItems = useSelector(selectItemsList);
  const allInvoices = useSelector(selectInvoiceList);

  useEffect(() => {
    setItems(allItems);
  }, [allItems]);

  const handleItemChange = (event, itemid) => {
    const updatedItems = items.map((item) => {
      if (item.itemId === itemid) {
        return { ...item, [event.target.name]: event.target.value };
      }
      return item;
    });
    // console.log("handle item chage",updatedItems);
    setItems(updatedItems);

    dispatch(
      updateItem({
        id: itemid,
        updatedItem: updatedItems.find((item) => item.itemId === itemid),
      })
    );
  };

  const handleAddItem = () => {
    const newItemId = (
      +new Date() + Math.floor(Math.random() * 999999)
    ).toString(36);
    const newItem = {
      itemId: newItemId,
      itemName: "",
      itemDescription: "",
      itemPrice: 1.0,
      itemQuantity: 1,
      itemGroup: "",
    };
    setItems([...items, newItem]);
    dispatch(addItem(newItem));
  };

  const handleDeleteItem = async (itemId) => {
    dispatch(deleteItem(itemId));
  };

  return (
    <div className="products-table">
      <Table bordered hover responsive className="rounded">
        {" "}
        {/* Added rounded class */}
        <thead>
          <tr>
            <th style={{ width: "20%" }} className="text-center">
              ITEM
            </th>{" "}
            {/* Centered "ITEM" */}
            <th style={{ width: "50%" }} className="text-center">
              DESCRIPTION
            </th>{" "}
            {/* Centered "DESCRIPTION" */}
            <th className="text-center" style={{ width: "30%" }}>
              ACTION
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.itemId}>
              <td>
                <input
                  type="text"
                  className="form-control"
                  name="itemName"
                  value={item.itemName}
                  onChange={(e) => handleItemChange(e, item.itemId)}
                />
              </td>
              <td>
                <input
                  type="text"
                  className="form-control"
                  name="itemDescription"
                  value={item.itemDescription}
                  onChange={(e) => handleItemChange(e, item.itemId)}
                />
              </td>
              <td className="text-center">
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteItem(item.itemId)}>
                  <BiTrash /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button variant="primary" className="fw-bold" onClick={handleAddItem}>
        Add Item
      </Button>
    </div>
  );
};

export default ProductTab;
