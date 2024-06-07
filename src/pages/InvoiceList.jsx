import React, { useState } from "react";
import { Button, Card, Col, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BiSolidPencil, BiTrash } from "react-icons/bi";
import { BsEyeFill } from "react-icons/bs";
import InvoiceModal from "../components/InvoiceModal";
import { useNavigate } from "react-router-dom";
import { useInvoiceListData } from "../redux/hooks";
import { useDispatch } from "react-redux";
import { deleteInvoice } from "../redux/invoicesSlice";
import ShowProduct from "../components/ShowProduct";

const InvoiceList = () => {
  const { invoiceList, getOneInvoice } = useInvoiceListData();
  const isListEmpty = invoiceList.length === 0;
  const [copyId, setCopyId] = useState("");
  const navigate = useNavigate();

  const handleCopyClick = () => {
    const invoice = getOneInvoice(copyId);
    if (!invoice) {
      alert("Please enter the valid invoice id.");
    } else {
      navigate(`/create/${copyId}`);
    }
  };

  return (
    <>
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={9}>
          <h3 className="fw-bold pb-4 text-center">Swipe Assignment</h3>
          <Card className="p-4 mb-4">
            {isListEmpty ? (
              <div className="text-center">
                <h3 className="fw-bold mb-4">No invoices present</h3>
                <div className="d-flex flex-row gap-3 align-items-center justify-content-center ">
                  <Link to="/create">
                    <Button variant="primary">Create Invoice</Button>
                  </Link>
                  <ShowProduct />
                </div>
              </div>
            ) : (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="fw-bold">Invoice List</h3>
                  <div className="d-flex gap-2 align-items-center">
                    <input
                      type="text"
                      value={copyId}
                      onChange={(e) => setCopyId(e.target.value)}
                      placeholder="Enter Invoice ID to copy"
                      className="form-control"
                      style={{ height: "50px", width: "200px" }}
                    />
                    <Button variant="dark" onClick={handleCopyClick}>
                      Copy Invoice
                    </Button>
                    <Link to="/create">
                      <Button variant="primary">Create Invoice</Button>
                    </Link>
                    <ShowProduct />
                  </div>
                </div>
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Invoice No.</th>
                      <th>Bill To</th>
                      <th>Due Date</th>

                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceList.map((invoice) => (
                      <InvoiceRow
                        key={invoice.id}
                        invoice={invoice}
                        navigate={navigate}
                      />
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </>
  );
};

const InvoiceRow = ({ invoice, navigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const handleDeleteClick = (invoiceId) => {
    dispatch(deleteInvoice(invoiceId));
  };

  const handleEditClick = () => {
    navigate(`/edit/${invoice.id}`);
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <tr>
      <td>{invoice.invoiceNumber}</td>
      <td className="fw-normal">{invoice.billTo}</td>
      <td className="fw-normal">{invoice.dateOfIssue}</td>

      <td className="d-flex gap-2">
        <Button variant="outline-primary" onClick={handleEditClick}>
          <BiSolidPencil /> Edit
        </Button>
        <Button variant="danger" onClick={() => handleDeleteClick(invoice.id)}>
          <BiTrash /> Delete
        </Button>
        <Button variant="secondary" onClick={openModal}>
          <BsEyeFill /> View
        </Button>
      </td>
      <InvoiceModal
        showModal={isOpen}
        closeModal={closeModal}
        info={invoice}
        items={invoice.items}
      />
    </tr>
  );
};

export default InvoiceList;
