import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

// PDF styles
const styles = StyleSheet.create({
  page: { flexDirection: "column", backgroundColor: "#FFFFFF", padding: 40 },
  section: { margin: 10, padding: 10, flexGrow: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 10,
  },
  title: { fontSize: 24, fontWeight: "bold" },
  companyInfo: { fontSize: 10 },
  meta: { fontSize: 10, textAlign: "right" },
  clientInfo: { marginBottom: 20 },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: { flexDirection: "row" },
  tableColHeader: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#f3f4f6",
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCellHeader: { margin: 5, fontSize: 10, fontWeight: "bold" },
  tableCell: { margin: 5, fontSize: 10 },
  totals: { marginTop: 20, alignSelf: "flex-end", width: "30%" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  totalTitle: { fontSize: 12, fontWeight: "bold" },
  totalValue: { fontSize: 12 },
  grandTotal: {
    borderTopWidth: 1,
    borderTopColor: "#000",
    paddingTop: 5,
    marginTop: 5,
  },
});

// PDF Document Component
const MyDocument = ({ invoice, company }) => {
  const subtotal = invoice.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  const taxAmount = subtotal * (invoice.tax / 100);
  const discountAmount = subtotal * (invoice.discount / 100);
  const total = subtotal + taxAmount - discountAmount;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>INVOICE</Text>
            <Text style={styles.companyInfo}>{company?.name || "Your Company"}</Text>
            <Text style={styles.companyInfo}>{company?.address || ""}</Text>
            <Text style={styles.companyInfo}>{company?.phone || ""}</Text>
          </View>
          <View style={styles.meta}>
            <Text>Invoice #: {invoice.invoiceNumber}</Text>
            <Text>Issue Date: {new Date(invoice.issueDate).toLocaleDateString()}</Text>
            <Text>Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</Text>
            <Text>Status: {invoice.status}</Text>
          </View>
        </View>

        <View style={styles.clientInfo}>
          <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 5 }}>
            Bill To:
          </Text>
          <Text style={{ fontSize: 10 }}>{invoice.clientName}</Text>
          <Text style={{ fontSize: 10 }}>{invoice.clientEmail}</Text>
          <Text style={{ fontSize: 10 }}>{invoice.clientAddress}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Description</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Qty</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Price</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Subtotal</Text>
            </View>
          </View>
          {invoice.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.description}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.quantity}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>${item.price.toFixed(2)}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  ${(item.quantity * item.price).toFixed(2)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalTitle}>Subtotal:</Text>
            <Text style={styles.totalValue}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalTitle}>Tax ({invoice.tax}%):</Text>
            <Text style={styles.totalValue}>${taxAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalTitle}>Discount ({invoice.discount}%):</Text>
            <Text style={styles.totalValue}>${discountAmount.toFixed(2)}</Text>
          </View>
          <View style={[styles.totalRow, styles.grandTotal]}>
            <Text style={[styles.totalTitle, { fontWeight: "bold" }]}>
              Total:
            </Text>
            <Text style={[styles.totalValue, { fontWeight: "bold" }]}>
              ${total.toFixed(2)}
            </Text>
          </View>
        </View>

        {invoice.notes && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 10, fontWeight: "bold" }}>Notes:</Text>
            <Text style={{ fontSize: 10 }}>{invoice.notes}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

// Download Button Wrapper
const InvoicePDF = ({ invoiceId }) => {
  const [invoice, setInvoice] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const { data } = await axios.get(`/api/invoices/${invoiceId}`);
        setInvoice(data.invoice);
        setCompany(data.company);
      } catch (error) {
        console.error("Failed to fetch invoice", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [invoiceId]);

  if (loading)
    return (
      <span className="text-gray-500 text-sm animate-pulse">
        Loading PDF...
      </span>
    );
  if (!invoice || !company)
    return <span className="text-red-500 text-sm">Failed to load invoice</span>;

  return (
    <PDFDownloadLink
      document={<MyDocument invoice={invoice} company={company} />}
      fileName={`invoice-${invoice.invoiceNumber}.pdf`}
    >
      {({ loading }) => (
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-semibold shadow hover:from-purple-700 hover:to-purple-800 transition duration-200 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-4 w-4 text-white"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"
                />
              </svg>
              Download
            </>
          )}
        </button>
      )}
    </PDFDownloadLink>
  );
};

export default InvoicePDF;
