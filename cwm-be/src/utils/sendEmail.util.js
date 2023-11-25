require("dotenv").config();
const nodemailer = require("nodemailer");
const err = require("../errors/index");
const { v4: uuidv4 } = require("uuid");

const smtpTrans = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  host: process.env.EMAIL_HOST,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

smtpTrans.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Nodemailer connection: OK, user: " + process.env.EMAIL_USER);
    console.log("============================================================");
  }
});
const getEmailTemplate = (url, textButton, content) => {
  return `
  <html>
    <head>
      <style>
        .container {
            background-color: azure; 
            padding: 30px 300px; 
          }
        .content {
            background-color: #FFFFFF; 
            padding: 10px 30px; 
            border-radius: 10px;
          }
        .top {
            padding: 20px 0 30px;
        }
        .top-image {
            width: 80px; 
            height: 70px;
            display: block;
            margin: 0 auto;
        }
        .top-title {
            font-size: 25px; 
            font-weight: bold;
            margin-top: 10px;
            text-align: center;
        }
        .divider {
            height: 2px; 
            background-color: aliceblue;
        }
        .notification {
            font-weight: bold; 
            font-size: 20px;
        }
        .button {
            background-color: #EA4C89; 
            border-radius: 8px; 
            border-style: none; 
            box-sizing: border-box; 
            color: #FFFFFF; 
            cursor: pointer; 
            display: inline-block; 
            font-size: 14px; 
            font-weight: 500; 
            height: 40px; 
            line-height: 20px; 
            list-style: none; 
            margin: 0; 
            outline: none; 
            padding: 10px 16px; 
            text-align: center; 
            text-decoration: none;
        }
        @media screen and (min-width: 320px) and (max-width: 768px) {
          .container {
            background-color: azure; 
            padding: 30px 10px; 
          }
          .content {
            padding: 10px 10px; 
          }
          .top-title {
            font-size: 20px;
          }
          .notification {
            font-size: 18px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="content">
          <div class="top">
            <img src="" alt="Hoa Vu " class="top-image"/>
            <div class="top-title">Xưởng mộc Toàn Hạnh</div>
          </div>
          <div class="divider"></div>
          <p style="font-size: 20px; font-weight: bold;">Chào bạn,</p>
          <p>Hệ thống quản lý trang thiết bị của Xưởng mộc Toàn Hạnh xin gửi tới bạn thông báo sau:
          ${content}
          <p>Vui lòng click vào đường link bên dưới để xem thông tin chi tiết:</p>
          <div style="display: flex; justify-content: center; margin: 30px 0;">
            <p class="button">
              <a style="color: white; text-decoration: none;" href=${url} target="_blank">${textButton}</a>
            </p>
          </div>
          <div style="color: red; font-style: italic;">Lưu ý: Đây là email tự động, vui lòng không phản hồi lại!</div>
          <p>Nếu gặp khó khăn trong quá trình sử dụng hệ thống, hãy liên hệ với <a style="color: blue; text-decoration: none;" href=${process.env.FACEBOOK_URL} target="_blank">đội ngũ trợ giúp của chúng tôi!</a></p>
        </div>
      </div>
    </body>
  </html>
  `;
};

module.exports.sendActiveEmail = async (req, user) => {
  const activeToken = uuidv4();
  const domain = req?.headers?.origin || process.env.URL_REACT;
  if (!domain) throw new Error(err.SEND_MAIL_ERROR.messageCode);
  const url = `${domain}/active/${activeToken}`;
  const content = `
    <p class="notification">Bạn nhận được email này vì bạn đã đăng kí tài khoản trên hệ thống.</p>
    <p class="notification">Click vào đường link bên dưới, hoặc copy và dán váo trình duyệt mà bạn sử dụng để hoàn tất quá trình kích hoạt tài khoản</p>
  `;
  const mailOptions = {
    from: '"Hoa Vu " <hoavm.dev@gmail.com>',
    to: user.email,
    subject: "Kích hoạt tài khoản",
    html: getEmailTemplate(url, "Kích hoạt tài khoản", content),
  };

  const send = await smtpTrans.sendMail(mailOptions);
  if (!send) throw new Error(err.SEND_MAIL_ERROR.messageCode);
  return activeToken;
};

module.exports.sendForgotEmail = async (req, user) => {
  const token = uuidv4();
  const domain = req?.headers?.origin || process.env.URL_REACT;
  if (!domain) throw new Error(err.SEND_MAIL_ERROR.messageCode);
  const url = `${domain}/reset_password/${token}`;
  const content = `
    <p class="notification">Bạn nhận được email này vì hệ thống nhận được yêu cầu thay đổi mật khẩu từ tài khoản của bạn.</p>
    <p class="notification">Click vào đường link bên dưới để hoàn tất quá trình thay đổi mật khẩu của bạn</p>
    <p class="notification">Nếu yêu cầu này không phải của bạn, hãy bỏ qua email này và mật khẩu của bạn sẽ không thay đổi</p>
  `;

  const mailOptions = {
    from: '"Hoa Vu " <hoavm.dev@gmail.com>',
    to: user.email,
    subject: "Thay đổi mật khẩu",
    html: getEmailTemplate(url, "Thay đổi mật khẩu", content),
  };

  const send = await smtpTrans.sendMail(mailOptions);

  if (!send) throw new Error(err.SEND_MAIL_ERROR.messageCode);
  return token;
};

module.exports.sendEmailUpdatePermission = async (users) => {
  const url = process.env.URL_REACT;
  const content = `
    <p class="notification">Hệ thống vừa cập nhật quyền sử dụng phần mềm đối với tài khoản của bạn.</p>
    <p class="notification">Đăng xuất tài khoản để cập nhật đầy đủ quyền sử dụng và các tính năng mới nhất của phần mềm.</p>
  `;
  const mailOptions = {
    from: '"Hoa Vu " <hoavm.dev@gmail.com>',
    subject: "Cập nhật quyền sử dụng",
    html: getEmailTemplate(url, "Chi tiết cập nhật", content),
  };

  await Promise.all(
    users.map(async (user) => {
      const userMailOptions = { ...mailOptions, to: user.email };
      try {
        const send = await smtpTrans.sendMail(userMailOptions);
        if (!send) throw new Error(err.SEND_MAIL_ERROR.messageCode);
      } catch (error) {
        throw new Error(err.SEND_MAIL_ERROR.messageCode);
      }
    })
  );
};
