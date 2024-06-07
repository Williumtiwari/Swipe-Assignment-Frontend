import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import { BiPaperPlane, BiCloudDownload } from "react-icons/bi";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useSelector } from "react-redux";
import { selectItemsList } from "../redux/itemSlice";

const GenerateInvoice = () => {
  html2canvas(document.querySelector("#invoiceCapture")).then((canvas) => {
    const imgData = canvas.toDataURL("image/png", 1.0);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: [612, 792],
    });
    pdf.internal.scaleFactor = 1;
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("invoice-001.pdf");
  });
};

const InvoiceModal = (props) => {
  const [taxAmount, setTaxAmount] = useState("0.00");
  const [discountAmount, setDiscountAmount] = useState("0.00");
  const [total, setTotal] = useState("0.00");
  console.log(props);

  // console.log(props);
  const globalItems = useSelector(selectItemsList);

  // Filter items based on itemGroup
  const filteredItems = globalItems.filter((item) =>
    props.items.some((gitem) => gitem === item.itemId)
  );

  useEffect(() => {
    handleCalculateTotal();
  }, [filteredItems]);

  const handleCalculateTotal = () => {
    let subTotal = 0;
    // Calculate subtotal based on filtered items
    filteredItems.forEach((item) => {
      // Convert itemPrice and itemQuantity to numbers, handle empty fields by defaulting to 0
      const price = parseFloat(item?.itemPrice || 0);
      const quantity = parseInt(item?.itemQuantity || 0);
      subTotal += price * quantity;
    });

    // Convert taxRate and discountRate to numbers, handle empty fields by defaulting to 0
    const taxRate = parseFloat(props?.info?.taxRate || 0);
    const discountRate = parseFloat(props?.info?.discountRate || 0);

    // Calculate tax amount
    const calculatedTaxAmount = parseFloat(subTotal * (taxRate / 100)).toFixed(
      2
    );

    // Calculate discount amount
    const calculatedDiscountAmount = parseFloat(
      subTotal * (discountRate / 100)
    ).toFixed(2);

    // Calculate total
    const calculatedTotal = (
      subTotal -
      parseFloat(calculatedDiscountAmount) +
      parseFloat(calculatedTaxAmount)
    ).toFixed(2);
    setTaxAmount(calculatedTaxAmount);
    setDiscountAmount(calculatedDiscountAmount);
    setTotal(calculatedTotal);
    console.log(calculatedTaxAmount, calculatedTotal, calculatedDiscountAmount);
  };

  // console.log("filtered items",filteredItems);
  const groupedItems = filteredItems.reduce((acc, item) => {
    const group = item.itemGroup || "Ungrouped";
    // console.log(group);
    acc[group] = acc[group] || [];
    acc[group].push(item);
    return acc;
  }, {});
  // console.log("grouped",groupedItems);
  return (
    <div>
      <Modal
        show={props.showModal}
        onHide={props.closeModal}
        size="lg"
        centered>
        <div id="invoiceCapture">
          <div className="d-flex flex-row justify-content-between align-items-start bg-light w-100 p-4">
            <div className="w-100">
              <h6 className="fw-bold text-secondary mb-1">
                Invoice ID: {props.info.id || ""}
              </h6>
              <h4 className="fw-bold my-2">
                {props.info.billFrom || "John Uberbacher"}
              </h4>
              <h7 className="fw-bold text-secondary mb-1">
                Invoice No.: {props.info.invoiceNumber || ""}
              </h7>
            </div>
            <div className="text-end ms-4">
              <h6 className="fw-bold mt-1 mb-2">Amount&nbsp;Due:</h6>
              <h5 className="fw-bold text-secondary">
                {" "}
                {props.info.currency} {total}
              </h5>
            </div>
          </div>
          <div className="p-4">
            <Row className="mb-4">
              <Col md={4}>
                <div className="fw-bold">Billed to:</div>
                <div>{props.info.billTo || ""}</div>
                <div>{props.info.billToAddress || ""}</div>
                <div>{props.info.billToEmail || ""}</div>
              </Col>
              <Col md={4}>
                <div className="fw-bold">Billed From:</div>
                <div>{props.info.billFrom || ""}</div>
                <div>{props.info.billFromAddress || ""}</div>
                <div>{props.info.billFromEmail || ""}</div>
              </Col>
              <Col md={4}>
                <div className="fw-bold mt-2">Date Of Issue:</div>
                <div>{props.info.dateOfIssue || ""}</div>
              </Col>
            </Row>
            {/* <Table className="mb-0">
              <thead>
                <tr>
                  <th>QTY</th>
                  <th>DESCRIPTION</th>
                  <th className="text-end">PRICE</th>
                  <th className="text-end">AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {props.items?.map((item, i) => {
                  const modalItem = globalItems.find((gitem) => gitem.itemId === item)
                 
                  return (
                    <tr id={i} key={i}>
                      <td style={{ width: "70px" }}>{modalItem?.itemQuantity}</td>
                      <td>
                        {item.itemName} - {modalItem?.itemDescription}
                      </td>
                      <td className="text-end" style={{ width: "100px" }}>
                        {props.currency} {modalItem?.itemPrice}
                      </td>
                      <td className="text-end" style={{ width: "100px" }}>
                        {props.currency} {modalItem?.itemPrice * modalItem?.itemQuantity}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table> */}
            <Table className="mb-0">
              <thead>
                <tr>
                  <th>QTY</th>
                  <th>DESCRIPTION</th>
                  <th className="text-end">PRICE</th>
                  <th className="text-end">AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {/* Loop through grouped items */}
                {Object.entries(groupedItems).map(([groupName, groupItems]) => (
                  <React.Fragment key={groupName}>
                    {groupName !== "Ungrouped" && ( // Show header for non-Ungrouped groups
                      <tr className="fw-bold text-secondary">
                        <td colSpan="4" className="text-center">
                          {groupName}
                        </td>
                      </tr>
                    )}
                    {/* Loop through items in the current group */}
                    {groupItems.map((item, i) => (
                      <>
                        <tr id={i} key={i}>
                          <td style={{ width: "70px" }}>
                            {item?.itemQuantity}
                          </td>
                          <td
                            style={{
                              fontStyle:
                                item.itemGroup == "" ? "normal" : "italic",
                            }}>
                            {item.itemName} - {item?.itemDescription}
                          </td>
                          <td className="text-end" style={{ width: "100px" }}>
                            {props.currency} {item?.itemPrice}
                          </td>
                          <td className="text-end" style={{ width: "100px" }}>
                            {props.currency}{" "}
                            {item?.itemPrice * item?.itemQuantity}
                          </td>
                        </tr>
                      </>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </Table>
            <Table>
              <tbody>
                <tr>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                </tr>
                <tr className="text-end">
                  <td></td>
                  <td className="fw-bold" style={{ width: "100px" }}>
                    TAX
                  </td>
                  <td className="text-end" style={{ width: "100px" }}>
                    {props.info.currency} {taxAmount}
                  </td>
                </tr>
                {props.discountAmmount !== 0.0 && (
                  <tr className="text-end">
                    <td></td>
                    <td className="fw-bold" style={{ width: "100px" }}>
                      DISCOUNT
                    </td>
                    <td className="text-end" style={{ width: "100px" }}>
                      {props.info.currency} {discountAmount}
                    </td>
                  </tr>
                )}
                <tr className="text-end">
                  <td></td>
                  <td className="fw-bold" style={{ width: "100px" }}>
                    TOTAL
                  </td>
                  <td className="text-end" style={{ width: "100px" }}>
                    {props.info.currency} {total}
                  </td>
                </tr>
              </tbody>
            </Table>
            {props.info.notes && (
              <div className="bg-light py-3 px-4 rounded">
                {props.info.notes}
              </div>
            )}
          </div>
        </div>
        <div className="pb-4 px-4">
          <Row>
            <Col md={6}>
              <Button
                variant="primary"
                className="d-block w-100"
                onClick={GenerateInvoice}>
                <BiPaperPlane
                  style={{ width: "15px", height: "15px", marginTop: "-3px" }}
                  className="me-2"
                />
                Send Invoice
              </Button>
            </Col>
            <Col md={6}>
              <Button
                variant="outline-primary"
                className="d-block w-100 mt-3 mt-md-0"
                onClick={GenerateInvoice}>
                <BiCloudDownload
                  style={{ width: "16px", height: "16px", marginTop: "-3px" }}
                  className="me-2"
                />
                Download Copy
              </Button>
            </Col>
          </Row>
        </div>
      </Modal>
      <hr className="mt-4 mb-3" />
    </div>
  );
};

export default InvoiceModal;
