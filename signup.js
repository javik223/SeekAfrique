const Signups = require('./models/signupsModel');

// SendGrid setup
const sgMail = require('@sendgrid/mail');
// sgMail.setSubstitutionWrappers('{{', '}}');

// Email meta constants
const ORGANISATION_EMAIL = process.env.ORGANISATION_EMAIL;
const ORGANISATION_NAME = process.env.ORGANISATION_NAME;
const ORGANISATION_FROM_EMAIL = process.env.ORGANISATION_FROM_EMAIL;
const ORGANISATION_SUBJECT = process.env.ORGANISATION_SUBJECT
const SENDGRID_TEMPLATE_ID = process.env.SENDGRID_TEMPLATE_ID
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY


// SendGrid setup
sgMail.setApiKey(SENDGRID_API_KEY);

class Signup {
  /**
   *Creates an instance of Signup.
   * @param {name String, email: String, Locale: enum['en', 'fr'], Date: Date} detail
   * @memberof Signup
   */
  constructor(detail) {
    this.detail = detail;
    this.signups = new Signups(detail);
  }


  /**
   * Create new user record in the database
   *
   * @memberof Signup
   */
  create() {
    try {
      this.signups.save().then();
      return this;
    } catch (err) {
      console.log(err);
    }

  }

  sendEmail(messageMeta) {
    const message = {
      to: {
        email: messageMeta.to.email,
        name: messageMeta.to.name
      },
      from: {
        name: messageMeta.from.name,
        email: messageMeta.from.email
      },
      subject: messageMeta.subject,
      templateId: messageMeta.templateID,
      dynamic_template_data: messageMeta.dynamic_template_data,
      html: 'Seekafrique'
    }

    sgMail
      .send(message)
      .then(() => {
        console.log("Email sent")
      })
      .catch(err => {
        // Record bug in sdout, if any occurred
        // emailSent = false;
        console.log("Email error: ", err.response.body.errors)
      });

  }

  emailRecipient(__) {
    const message = {
      to: {
        email: this.detail.email,
        name: this.detail.name
      },
      from: {
        name: ORGANISATION_NAME,
        email: ORGANISATION_FROM_EMAIL
      },
      subject: __('email-subject'),
      templateID: SENDGRID_TEMPLATE_ID,
      dynamic_template_data: {
        "subject": __('email-subject'),
        "greeting": `${__('email-greeting')} ${this.detail.name},`,
        "message": __('email-body'),
        "message2": __('email-privacy')
      }
    }

    this.sendEmail(message)
  }

  emailOrganisation() {
    const message = {
      to: {
        email: ORGANISATION_EMAIL,
        name: ORGANISATION_NAME
      },
      from: {
        name: ORGANISATION_NAME,
        email: ORGANISATION_EMAIL
      },
      subject: ORGANISATION_SUBJECT,
      templateID: SENDGRID_TEMPLATE_ID,
      dynamic_template_data: {
        "subject": "New Signup from SeekAfrique",
        "greeting": "Hello,",
        "message": `There's a new signup data from SeekAfrique's website`,
        "message2": `Details: name: ${this.detail.name} | email: ${this.detail.email} | nationality: ${this.detail.nationality} | locale: ${this.detail.locale}`
      }
    }

    this.sendEmail(message)
  }

}

module.exports = Signup