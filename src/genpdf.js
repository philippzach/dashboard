const PDFDocument = require('pdfkit');
const fs = require('fs');
var path = require('path');

var doc = new PDFDocument({
    margins: {
      top: 20,
      bottom: 5,
      left: 10,
      right: 10
    }
  });

doc.pipe(fs.createWriteStream('test.pdf')); // write to PDF
//doc.pipe(res);                                       // HTTP response


var addressText = 'Caroo Mobility GmbH\n+43 660 / 600 2990\noffice@eloop.one\nwww.eloop.one\nSiebenbrunnengasse17 / 7 | 1050 Wien | Austria\nRechnungsdatum: Wien, am ';
var customerAddress = 'FirstName LastName\nAddress\nCity\nZip Code\nCountry';
var footer1 = 'Caroo Mobility GmbH\nSiebenbrunnengasse 17/7\n1050 Wien\nAustria'; ;
var footer2 = '+43 660 / 600 29 90\noffice@eloop.one\nwww.eloop.one';
var footer3 = 'UID: ATU72511178\nBank Austria\nIBAN: AT63 1200 0100 2114 6542\nBIC: BKAUATWW\n\n Seite 1 von 1';


doc.image('assets/images/eloop.png', 10, 15, {width: 200})


doc
  .font('Helvetica', 13)
  .text(addressText, {
    width: 590,
    align: 'right',
  }, 100);


  doc.moveDown().moveDown()
  .font('Helvetica-Bold', 13)
  .text("Rechnungsempfänger");

  doc.moveDown()
  .font('Helvetica', 13)
  .text(customerAddress)

  doc.moveDown().moveDown().moveDown().moveDown()



  .font('Helvetica-Bold', 13)
  .text('Rechnung zum Tokenkauf')
  .moveDown()
  .font('Helvetica', 13)
  .text('Lieferdatum: 10.02.2020')

  .rect(10, 440, 590, 22)
   .fill('lightgray')
   .fill('black')
   .text('Anzahl', 15,445)
   .text('Package', 150,445)
   .text('Gesamtpreis (EUR)',478,445)
   .text('X', 15,475)
   .text('Eloop One Token', 150,475)
   .text('XXX',478,475)


   .text('+ 0% USt.',340,520)
   .text('Gesamtbetrag',340,540)

   .text('XXX',478,520)
   .text('XXX',478,540);

doc.font('Helvetica-Bold', 13)
  .text('Zahlungsmethode (=Paymentmethod)', 10, 600)
  .moveDown()
  .font('Helvetica')
  .text('Credit Card')



  // Footer
  .rect(10, 710, 595, 1)
   .fill('lightgray')
   .fill('black')

  doc
  .font('Helvetica', 13).fontSize(9)
  .text(footer1, {
    width: 300,
    align: 'left',
  }, 720);

  doc
  .font('Helvetica', 13).fontSize(9)
  .text(footer2, {
    width: 600,
    align: 'center',
  }, 720, 500);

    doc
  .font('Helvetica', 13).fontSize(9)
  .text(footer3, {
    width: 590,
    align: 'right',
  }, 720, 500);



doc.end();

