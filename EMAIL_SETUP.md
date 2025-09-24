# 📧 EmailJS Setup Guide

## 🚀 How to Make Your Contact Form Work

Your contact form is now ready to send real emails! Here's how to set it up:

### 1. **Sign Up for EmailJS**
- Go to [EmailJS.com](https://www.emailjs.com/)
- Create a free account
- Verify your email

### 2. **Create an Email Service**
- In EmailJS dashboard, go to "Email Services"
- Click "Add New Service"
- Choose your email provider (Gmail, Outlook, etc.)
- Follow the setup instructions
- **Save your Service ID** (you'll need this)

### 3. **Create an Email Template**
- Go to "Email Templates"
- Click "Create New Template"
- Use this template:

```html
Subject: New Contact Form Message from {{from_name}}

Name: {{from_name}}
Email: {{from_email}}
Message: {{message}}

This message was sent from your portfolio contact form.
```

- **Save your Template ID** (you'll need this)

### 4. **Get Your Public Key**
- Go to "Account" → "API Keys"
- Copy your "Public Key"

### 5. **Update Your Code**
Replace these placeholders in `script.js`:

```javascript
// Line ~1015: Replace YOUR_PUBLIC_KEY
emailjs.init("YOUR_PUBLIC_KEY");

// Line ~1050: Replace YOUR_SERVICE_ID
'YOUR_SERVICE_ID'

// Line ~1051: Replace YOUR_TEMPLATE_ID  
'YOUR_TEMPLATE_ID'

// Line ~1056: Replace 'Your Name' with your actual name
to_name: 'Your Name'
```

### 6. **Test Your Form**
- Fill out the contact form
- Click "Send Message"
- Check your email inbox!

## 🎯 What You'll Get

When someone fills out your contact form, you'll receive an email with:
- ✅ **Their name**
- ✅ **Their email address** 
- ✅ **Their message**
- ✅ **Reply-to set to their email** (so you can reply directly)

## 🔧 Troubleshooting

- **Form not sending?** Check your browser console for errors
- **No emails received?** Check your spam folder
- **Service ID issues?** Make sure your email service is properly connected
- **Template errors?** Verify your template variables match the code

## 💡 Pro Tips

- **Free Plan**: 200 emails/month
- **Custom Domain**: Use your own domain for professional emails
- **Auto-Reply**: Set up automatic thank you emails
- **Spam Protection**: EmailJS includes built-in spam filtering

## 🎉 You're All Set!

Once configured, your contact form will:
- ✅ Send real emails to your inbox
- ✅ Show success/error messages
- ✅ Play sound effects
- ✅ Reset after sending
- ✅ Work on any device/browser

Need help? Check the [EmailJS documentation](https://www.emailjs.com/docs/) or their support!
