const sgMail = require('@sendgrid/mail')

// set API key for SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

async function sendEmail(emailOptions) {
  try {
    // send email using SendGrid API
    await sgMail.send(emailOptions)
    console.log('Email sent successfully.')
  } catch (error) {
    console.error('Error sending email:', error.response.body.errors[0].message)
  }
}

module.exports = sendEmail
