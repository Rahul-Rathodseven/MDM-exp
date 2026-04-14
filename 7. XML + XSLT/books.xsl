<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    
    <xsl:output method="html" encoding="UTF-8" doctype-public="-//W3C//DTD HTML 4.01//EN" doctype-system="http://www.w3.org/TR/html4/strict.dtd" indent="yes"/>
    
    <xsl:template match="/">
        <html>
            <head>
                <meta charset="UTF-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <title>Book Catalog</title>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        min-height: 100vh;
                        padding: 30px 20px;
                    }
                    
                    .container {
                        max-width: 1000px;
                        margin: 0 auto;
                    }
                    
                    .header {
                        background: white;
                        padding: 30px;
                        border-radius: 15px;
                        margin-bottom: 30px;
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                        text-align: center;
                    }
                    
                    .header h1 {
                        color: #333;
                        font-size: 32px;
                        margin-bottom: 10px;
                    }
                    
                    .header p {
                        color: #666;
                        font-size: 14px;
                    }
                    
                    .book-count {
                        background: #f0f4ff;
                        border-left: 4px solid #667eea;
                        padding: 12px;
                        border-radius: 4px;
                        margin-top: 15px;
                        font-size: 14px;
                        color: #667eea;
                        font-weight: 600;
                    }
                    
                    .table-responsive {
                        background: white;
                        border-radius: 15px;
                        overflow: hidden;
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                    }
                    
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    
                    thead {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                    }
                    
                    th {
                        padding: 18px;
                        text-align: left;
                        font-weight: 600;
                        font-size: 14px;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    
                    td {
                        padding: 15px 18px;
                        border-bottom: 1px solid #f0f0f0;
                        font-size: 14px;
                    }
                    
                    tbody tr:hover {
                        background: #f7f7f7;
                        transition: background 0.2s ease;
                    }
                    
                    tbody tr:last-child td {
                        border-bottom: none;
                    }
                    
                    .book-title {
                        font-weight: 600;
                        color: #333;
                    }
                    
                    .book-author {
                        color: #667eea;
                        font-weight: 500;
                    }
                    
                    .price {
                        color: #48bb78;
                        font-weight: 700;
                        font-size: 16px;
                    }
                    
                    .genre {
                        background: #f0f4ff;
                        color: #667eea;
                        padding: 4px 10px;
                        border-radius: 12px;
                        font-size: 12px;
                        font-weight: 600;
                        display: inline-block;
                    }
                    
                    .year {
                        color: #999;
                        font-size: 13px;
                    }
                    
                    .pages {
                        color: #666;
                        font-size: 13px;
                    }
                    
                    .id {
                        color: #999;
                        font-weight: 600;
                        font-size: 13px;
                    }
                    
                    .footer {
                        background: white;
                        padding: 20px;
                        border-radius: 15px;
                        margin-top: 30px;
                        text-align: center;
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                        font-size: 13px;
                        color: #666;
                    }
                    
                    .footer strong {
                        color: #667eea;
                    }
                    
                    @media (max-width: 768px) {
                        .header h1 {
                            font-size: 24px;
                        }
                        
                        table {
                            font-size: 12px;
                        }
                        
                        th, td {
                            padding: 10px;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>📚 Book Catalog</h1>
                        <p>Complete collection of classic literature</p>
                        <div class="book-count">
                            Total Books: <strong><xsl:value-of select="count(//book)"/></strong>
                        </div>
                    </div>
                    
                    <div class="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Author</th>
                                    <th>Price</th>
                                    <th>Year</th>
                                    <th>Genre</th>
                                    <th>Pages</th>
                                </tr>
                            </thead>
                            <tbody>
                                <xsl:for-each select="//book">
                                    <xsl:sort select="title" order="ascending"/>
                                    <tr>
                                        <td>
                                            <span class="id">#<xsl:value-of select="@id"/></span>
                                        </td>
                                        <td>
                                            <span class="book-title">
                                                <xsl:value-of select="title"/>
                                            </span>
                                        </td>
                                        <td>
                                            <span class="book-author">
                                                <xsl:value-of select="author"/>
                                            </span>
                                        </td>
                                        <td>
                                            <span class="price">
                                                <xsl:value-of select="price/@currency"/>
                                                <xsl:text> </xsl:text>
                                                <xsl:value-of select="price"/>
                                            </span>
                                        </td>
                                        <td>
                                            <span class="year">
                                                <xsl:value-of select="year"/>
                                            </span>
                                        </td>
                                        <td>
                                            <span class="genre">
                                                <xsl:value-of select="genre"/>
                                            </span>
                                        </td>
                                        <td>
                                            <span class="pages">
                                                <xsl:value-of select="pages"/> pages
                                            </span>
                                        </td>
                                    </tr>
                                </xsl:for-each>
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="footer">
                        <p>✨ Displaying <strong><xsl:value-of select="count(//book)"/></strong> books | Transformed by XSLT</p>
                    </div>
                </div>
            </body>
        </html>
    </xsl:template>
    
</xsl:stylesheet>
