import { format, parseISO } from "date-fns";
import localFont from "next/font/local";
import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
  pdf,
} from "@react-pdf/renderer";
import { Order } from "@/models/Order";
import { User } from "@/models/User";

const OpenSansLight = localFont({ src: "@/public/fonts/OpenSans-Light.ttf" });
const OpenSansMedium = localFont({
  src: "@/public/fonts/OpenSans-SemiBold.ttf",
});

Font.register({
  family: "OpenSansv2",
  fonts: [
    {
      src: "@/public/fonts/OpenSans-Light.ttf",
      fontWeight: 400,
    },
    {
      src: "@/public/fonts/OpenSans-SemiBold.ttf",
      fontWeight: 700,
    },
  ],
});

const pdfStyleSheet = StyleSheet.create({
  page: {
    padding: 20,
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#E4E4E4",
    fontFamily: "OpenSansv2",
  },
  invoiceTitle: {
    fontSize: 24,
    textTransform: "uppercase",
    fontWeight: 700,
  },
  description: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
  },
  firstDescription: {
    display: "flex",
    flexDirection: "column",
    flex: "100 1 1",
  },
  secondDescription: {
    display: "flex",
    flexDirection: "column",
    flex: "100 1 1",
  },
  descriptionTitle: {
    fontWeight: 700,
  },
  flexJustifyBetween: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
});

const createBillPdf = async (user: User) => {
  const InvoiceView = () => (
    <Document>
      <Page size="A4" style={pdfStyleSheet.page}>
        {/* header */}
        <View>
          {/* left of header */}
          <View>
            <Text>INVOICE</Text>
            <Text>{user.name}</Text>
            <Text>{user.address}</Text>
          </View>

          {/* right of header */}
          <img src="/logo.png" alt="logo" />
        </View>

        {/* <Text style={pdfStyleSheet.invoiceTitle}>Return Invoice</Text>
        <View style={pdfStyleSheet.description}>
          <View style={pdfStyleSheet.firstDescription}>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text style={pdfStyleSheet.descriptionTitle}>
                Invoice&apos;s id:{" "}
              </Text>
              <Text>{invoice.id}</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text style={pdfStyleSheet.descriptionTitle}>Staff: </Text>
              <Text>{staff.name}</Text>
            </View>
          </View>
          <View style={pdfStyleSheet.secondDescription}>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text style={pdfStyleSheet.descriptionTitle}>Issued date: </Text>
              <Text>{format(parseISO(invoice.createdAt), "MM/dd/yyyy")}</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text style={pdfStyleSheet.descriptionTitle}>Issued time: </Text>
              <Text>{format(parseISO(invoice.createdAt), "hh:mm:ss")}</Text>
            </View>
          </View>
        </View>
        <Text style={{ width: "100%", fontWeight: 700 }}>Description</Text>
        <View
          style={{
            width: "100%",
            height: 0,
            borderBottom: "1 dashed #aaaaaa",
          }}
        />
        {invoice.returnDetails
          .filter((v) => v.quantity > 0)
          .map((detail, idx) => {
            const detailProduct = products.find(
              (product) => product.id === detail.productId
            )!;
            return (
              <View key={idx} style={{ width: "100%" }}>
                <Text>
                  {detailProduct.name}{" "}
                  {detailProduct.propertiesString
                    ? `(${detailProduct.propertiesString})`
                    : ""}
                </Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingLeft: 20,
                    width: "100%",
                  }}
                >
                  <View
                    style={{ display: "flex", flexDirection: "row", gap: 20 }}
                  >
                    <Text>{detail.quantity}</Text>
                    <Text>{detailProduct.salesUnits.name}</Text>
                    <Text>x</Text>
                    <Text>{detail.price}</Text>
                  </View>
                  <Text>{detail.price * detail.quantity}</Text>
                </View>
              </View>
            );
          })}
        <View
          style={{
            width: "100%",
            height: 0,
            borderBottom: "1 dashed #aaaaaa",
          }}
        />
        <View style={pdfStyleSheet.flexJustifyBetween}>
          <Text style={{ fontWeight: 700 }}>Sub total:</Text>
          <Text style={{ fontWeight: 400 }}>{invoice.subTotal}</Text>
        </View>
        {invoice.discountValue ? (
          <View style={{ ...pdfStyleSheet.flexJustifyBetween }}>
            <Text style={{ fontWeight: 700 }}>Discount value:</Text>
            <Text style={{ fontWeight: 400 }}>{invoice.discountValue}</Text>
          </View>
        ) : null}
        <View style={pdfStyleSheet.flexJustifyBetween}>
          <Text style={{ fontWeight: 700 }}>Return fee:</Text>
          <Text style={{ fontWeight: 400 }}>{invoice.returnFee}</Text>
        </View>
        <View style={pdfStyleSheet.flexJustifyBetween}>
          <Text style={{ fontWeight: 700 }}>
            Total &#40;Pay by {invoice.paymentMethod}&#41;:
          </Text>
          <Text style={{ fontWeight: 400 }}>{invoice.total}</Text>
        </View>
        <Text>
          {storeInfo.name ?? "Limited Liability Company 4 Members@Inc"}
        </Text>
        <Text>Thank you customer!</Text>
        <Text>See you soon!</Text> */}
      </Page>
    </Document>
  );

  const blob = await pdf(InvoiceView()).toBlob();
  const objectURL = URL.createObjectURL(blob);

  const pdfWindow = window.open();
  if (pdfWindow) {
    pdfWindow.location.href = objectURL;
    pdfWindow.print();
  }
};
const CreatePdf = {
  createBillPdf,
};

export default CreatePdf;
