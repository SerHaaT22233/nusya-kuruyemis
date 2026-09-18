import Document, { Html, Head, Main, NextDocumentProps } from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="tr">
        <Head />
        <body>
          <Main />
        </body>
      </Html>
    )
  }
}