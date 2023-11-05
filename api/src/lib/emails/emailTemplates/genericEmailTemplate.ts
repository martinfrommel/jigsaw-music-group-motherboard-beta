// api/src/lib/emailTemplates/genericEmailTemplate.ts

import { emailStyles } from './emailStyles'

interface EmailTemplateOptions {
  title: string
  heading: string
  paragraph: string
  link?: string
  linkText?: string
  disclaimer?: string
}

export const genericEmailTemplate = ({
  title,
  heading,
  paragraph,
  link,
  linkText,
  disclaimer = '',
}: EmailTemplateOptions): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style type="text/css">
        ${emailStyles}
      </style>
    </head>
    <body>
      <div class="card">
        <h1>${heading}</h1>
        <p>${paragraph}</p>
        ${
          link && linkText
            ? `<a href="${link}" target="_blank" style="background-color: #f9cd8a; color: #000; padding: 10px 20px; border-radius: 4px; display: inline-block; text-transform: uppercase; margin-top: 20px;">${linkText}</a>`
            : ''
        }
        ${disclaimer ? `<p style="font-size: xs;">${disclaimer}</p>` : ''}
      </div>
    </body>
    </html>
  `
}
