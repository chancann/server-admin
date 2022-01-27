const nodemailer = require("nodemailer");

async function nodemailerFunc(to, siswaData, subject, link) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "www.facebook.com",
    to: to,
    subject: subject,
    html: `<h2><span style="color: #339966;"><img style="display: block; margin-left: auto; margin-right: auto;" src="https://firebasestorage.googleapis.com/v0/b/test-88de9.appspot.com/o/logo.svg?alt=media&amp;token=97ddcc47-01ca-4a8b-83c1-93e7ca2effff" alt="" width="212" height="43" /><br /></span></h2>
<h3>Data Diri Calon Siswa</h3>
<p>NISN: ${siswaData.nisn}</p>
<p>Nama: ${siswaData.nama}</p>
<p>No Telpon: ${siswaData.no_telpon}</p>
<p>Alamat: ${siswaData.alamat}</p>
<p>Lembaga Tujuan: al inayah</p>
<p>&nbsp;</p>
<p>Terimakasih sudah melakukan pendaftaran oline silahkan mengklik link dibawah ini untuk verifikasi :  <a title="Click Disini" href=${link} target="_blank" rel="noopener">link</a></p>
<p>&nbsp;</p></p>
<p>&nbsp;</p>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

module.exports = nodemailerFunc;
