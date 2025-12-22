import nodemailer from 'nodemailer';

// ═══════════════════════════════════════════════════════════════════════════
// EMAIL CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@lotusait.com';
const FROM_NAME = process.env.FROM_NAME || 'Lotus AIT';

// ═══════════════════════════════════════════════════════════════════════════
// EMAIL TEMPLATES
// ═══════════════════════════════════════════════════════════════════════════

const templates = {
  passwordReset: (name, resetLink) => ({
    subject: 'إعادة تعيين كلمة المرور - Password Reset',
    html: `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Cairo', Arial, sans-serif; background: #1a1a2e; color: #fff; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #16213e; border-radius: 12px; padding: 30px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { font-size: 24px; color: #8FD3CC; font-weight: bold; }
          .content { line-height: 1.8; }
          .button { display: inline-block; background: linear-gradient(135deg, #8FD3CC, #AF84BA); color: #1a1a2e; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 20px 0; }
          .footer { margin-top: 30px; text-align: center; color: #888; font-size: 12px; }
          .english { direction: ltr; text-align: left; margin-top: 20px; padding-top: 20px; border-top: 1px solid #333; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Lotus × Bérard AIT</div>
          </div>
          <div class="content">
            <p>مرحباً ${name}،</p>
            <p>لقد تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك.</p>
            <p>انقر على الزر أدناه لإعادة تعيين كلمة المرور:</p>
            <center>
              <a href="${resetLink}" class="button">إعادة تعيين كلمة المرور</a>
            </center>
            <p>هذا الرابط صالح لمدة ساعة واحدة فقط.</p>
            <p>إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذا البريد الإلكتروني.</p>

            <div class="english">
              <p>Hello ${name},</p>
              <p>We received a request to reset your password.</p>
              <p>Click the button above to reset your password. This link is valid for 1 hour.</p>
              <p>If you didn't request this, you can safely ignore this email.</p>
            </div>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Lotus × Bérard AIT Sound Lab</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  welcomeEmail: (name) => ({
    subject: 'مرحباً بك في Lotus AIT - Welcome to Lotus AIT',
    html: `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Cairo', Arial, sans-serif; background: #1a1a2e; color: #fff; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #16213e; border-radius: 12px; padding: 30px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { font-size: 24px; color: #8FD3CC; font-weight: bold; }
          .content { line-height: 1.8; }
          .highlight { color: #AF84BA; }
          .footer { margin-top: 30px; text-align: center; color: #888; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Lotus × Bérard AIT</div>
          </div>
          <div class="content">
            <p>مرحباً ${name}! 🌸</p>
            <p>نحن سعداء بانضمامك إلى <span class="highlight">Lotus AIT Sound Lab</span>.</p>
            <p>يمكنك الآن:</p>
            <ul>
              <li>إجراء اختبارات السمع والانتباه</li>
              <li>متابعة تقدمك في العلاج</li>
              <li>الوصول إلى الموارد التعليمية</li>
              <li>التواصل مع الأخصائيين</li>
            </ul>
            <p>نتمنى لك رحلة علاجية ناجحة! 💜</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Lotus × Bérard AIT Sound Lab</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  sessionReminder: (name, sessionDate) => ({
    subject: 'تذكير بموعد الجلسة - Session Reminder',
    html: `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Cairo', Arial, sans-serif; background: #1a1a2e; color: #fff; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #16213e; border-radius: 12px; padding: 30px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { font-size: 24px; color: #8FD3CC; font-weight: bold; }
          .content { line-height: 1.8; }
          .date-box { background: #0f3460; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; }
          .date { font-size: 20px; color: #8FD3CC; }
          .footer { margin-top: 30px; text-align: center; color: #888; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Lotus × Bérard AIT</div>
          </div>
          <div class="content">
            <p>مرحباً ${name}،</p>
            <p>هذا تذكير بموعد جلستك القادمة:</p>
            <div class="date-box">
              <div class="date">${sessionDate}</div>
            </div>
            <p>يرجى الحضور قبل الموعد بـ 10 دقائق.</p>
            <p>لا تنسَ إحضار سماعات الرأس الخاصة بك! 🎧</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Lotus × Bérard AIT Sound Lab</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  progressUpdate: (name, progress) => ({
    subject: 'تحديث التقدم - Progress Update',
    html: `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Cairo', Arial, sans-serif; background: #1a1a2e; color: #fff; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #16213e; border-radius: 12px; padding: 30px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { font-size: 24px; color: #8FD3CC; font-weight: bold; }
          .content { line-height: 1.8; }
          .progress-bar { background: #0f3460; border-radius: 10px; height: 20px; overflow: hidden; margin: 10px 0; }
          .progress-fill { background: linear-gradient(90deg, #8FD3CC, #AF84BA); height: 100%; transition: width 0.5s; }
          .stats { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
          .stat { background: #0f3460; padding: 15px; border-radius: 8px; text-align: center; }
          .stat-value { font-size: 24px; color: #8FD3CC; }
          .stat-label { font-size: 12px; color: #888; }
          .footer { margin-top: 30px; text-align: center; color: #888; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Lotus × Bérard AIT</div>
          </div>
          <div class="content">
            <p>مرحباً ${name}،</p>
            <p>إليك تحديث عن تقدمك هذا الأسبوع:</p>

            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progress.percentage}%"></div>
            </div>
            <p style="text-align: center">${progress.sessionsCompleted} / ${progress.totalSessions} جلسة مكتملة</p>

            <div class="stats">
              <div class="stat">
                <div class="stat-value">${progress.attention}%</div>
                <div class="stat-label">الانتباه</div>
              </div>
              <div class="stat">
                <div class="stat-value">${progress.processing}%</div>
                <div class="stat-label">سرعة المعالجة</div>
              </div>
            </div>

            <p>استمر في العمل الرائع! 🌟</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Lotus × Bérard AIT Sound Lab</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),
};

// ═══════════════════════════════════════════════════════════════════════════
// EMAIL SENDING FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

export async function sendEmail(to, template, data) {
  const emailTemplate = templates[template];

  if (!emailTemplate) {
    throw new Error(`Email template "${template}" not found`);
  }

  const { subject, html } = emailTemplate(...data);

  const mailOptions = {
    from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email send error:', error);
    throw error;
  }
}

export async function sendPasswordResetEmail(email, name, resetToken) {
  const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
  return sendEmail(email, 'passwordReset', [name, resetLink]);
}

export async function sendWelcomeEmail(email, name) {
  return sendEmail(email, 'welcomeEmail', [name]);
}

export async function sendSessionReminder(email, name, sessionDate) {
  return sendEmail(email, 'sessionReminder', [name, sessionDate]);
}

export async function sendProgressUpdate(email, name, progress) {
  return sendEmail(email, 'progressUpdate', [name, progress]);
}

// Verify SMTP connection
export async function verifyEmailConnection() {
  try {
    await transporter.verify();
    console.log('✅ Email server connection verified');
    return true;
  } catch (error) {
    console.warn('⚠️ Email server not configured:', error.message);
    return false;
  }
}

export default {
  sendEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendSessionReminder,
  sendProgressUpdate,
  verifyEmailConnection,
};
