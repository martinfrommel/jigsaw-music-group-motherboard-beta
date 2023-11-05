// api/src/lib/emailTemplates/emailStyles.ts

import { emailBackground } from './emailBackground'

export const emailStyles = `
body {
  background-color: #2c234c;
  background-image: url('${emailBackground}');
  font-family: 'Tahoma', sans-serif;
  color: #ececed;
  padding: 20px;
  text-align: center;

}
.card {
  background-color: RGBA(0, 0, 0, 0.64);
  border-radius: 8px;
  padding: 40px;
  margin: 0 auto;
  max-width: 600px;
}
a {
  color: #b195ee;
  text-decoration: none;
  font-weight: bold;
}
a:hover {
  text-decoration: underline;
}`
