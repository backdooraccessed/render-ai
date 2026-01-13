import { jsPDF } from 'jspdf'

interface ExportImage {
  url: string
  title?: string
  description?: string
}

interface PDFExportOptions {
  title?: string
  subtitle?: string
  images: ExportImage[]
  layout?: 'single' | 'grid' // single = one image per page, grid = multiple per page
  pageSize?: 'a4' | 'letter'
  includeWatermark?: boolean
}

export async function exportToPDF(options: PDFExportOptions): Promise<void> {
  const {
    title = 'RenderAI Export',
    subtitle = 'Generated Interior Renders',
    images,
    layout = 'single',
    pageSize = 'a4',
    includeWatermark = true,
  } = options

  if (images.length === 0) {
    throw new Error('No images to export')
  }

  // Create PDF
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: pageSize,
  })

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 15
  const contentWidth = pageWidth - 2 * margin

  // Helper to load image as base64
  const loadImage = async (url: string): Promise<string> => {
    const response = await fetch(url)
    const blob = await response.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  // Add title page
  pdf.setFontSize(24)
  pdf.setTextColor(33, 33, 33)
  pdf.text(title, pageWidth / 2, 40, { align: 'center' })

  pdf.setFontSize(14)
  pdf.setTextColor(100, 100, 100)
  pdf.text(subtitle, pageWidth / 2, 52, { align: 'center' })

  pdf.setFontSize(10)
  pdf.text(`${images.length} image${images.length !== 1 ? 's' : ''}`, pageWidth / 2, 62, { align: 'center' })
  pdf.text(new Date().toLocaleDateString(), pageWidth / 2, 70, { align: 'center' })

  if (includeWatermark) {
    pdf.setFontSize(8)
    pdf.setTextColor(150, 150, 150)
    pdf.text('Generated with RenderAI', pageWidth / 2, pageHeight - 10, { align: 'center' })
  }

  if (layout === 'single') {
    // Single image per page
    for (let i = 0; i < images.length; i++) {
      pdf.addPage()

      try {
        const imgData = await loadImage(images[i].url)

        // Calculate image dimensions to fit page while maintaining aspect ratio
        const maxImgWidth = contentWidth
        const maxImgHeight = pageHeight - 60 // Leave space for title and footer

        // Assuming 4:3 aspect ratio
        let imgWidth = maxImgWidth
        let imgHeight = (imgWidth * 3) / 4

        if (imgHeight > maxImgHeight) {
          imgHeight = maxImgHeight
          imgWidth = (imgHeight * 4) / 3
        }

        const x = (pageWidth - imgWidth) / 2
        const y = 25

        pdf.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight)

        // Image number
        pdf.setFontSize(10)
        pdf.setTextColor(100, 100, 100)
        pdf.text(`Image ${i + 1} of ${images.length}`, pageWidth / 2, y + imgHeight + 10, { align: 'center' })

        // Title if provided
        if (images[i].title) {
          pdf.setFontSize(12)
          pdf.setTextColor(33, 33, 33)
          pdf.text(images[i].title!, pageWidth / 2, y + imgHeight + 18, { align: 'center' })
        }

        // Watermark
        if (includeWatermark) {
          pdf.setFontSize(8)
          pdf.setTextColor(150, 150, 150)
          pdf.text('Generated with RenderAI', pageWidth / 2, pageHeight - 10, { align: 'center' })
        }
      } catch (error) {
        console.error(`Failed to add image ${i + 1}:`, error)
        pdf.setFontSize(12)
        pdf.setTextColor(200, 100, 100)
        pdf.text(`Failed to load image ${i + 1}`, pageWidth / 2, pageHeight / 2, { align: 'center' })
      }
    }
  } else {
    // Grid layout - 2x2 per page
    const imagesPerPage = 4
    const gridCols = 2
    const gridRows = 2
    const cellWidth = (contentWidth - margin) / gridCols
    const cellHeight = (pageHeight - 80) / gridRows

    for (let pageIndex = 0; pageIndex < Math.ceil(images.length / imagesPerPage); pageIndex++) {
      pdf.addPage()

      const startIndex = pageIndex * imagesPerPage
      const endIndex = Math.min(startIndex + imagesPerPage, images.length)

      for (let i = startIndex; i < endIndex; i++) {
        const gridIndex = i - startIndex
        const col = gridIndex % gridCols
        const row = Math.floor(gridIndex / gridCols)

        const x = margin + col * (cellWidth + margin / 2)
        const y = 20 + row * (cellHeight + margin / 2)

        try {
          const imgData = await loadImage(images[i].url)

          // Calculate image size within cell
          const imgMaxWidth = cellWidth - 10
          const imgMaxHeight = cellHeight - 20
          let imgWidth = imgMaxWidth
          let imgHeight = (imgWidth * 3) / 4

          if (imgHeight > imgMaxHeight) {
            imgHeight = imgMaxHeight
            imgWidth = (imgHeight * 4) / 3
          }

          const imgX = x + (cellWidth - imgWidth) / 2
          const imgY = y + 5

          pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth, imgHeight)

          // Image number
          pdf.setFontSize(8)
          pdf.setTextColor(100, 100, 100)
          pdf.text(`#${i + 1}`, imgX + imgWidth / 2, imgY + imgHeight + 5, { align: 'center' })
        } catch (error) {
          console.error(`Failed to add image ${i + 1}:`, error)
          pdf.setFontSize(10)
          pdf.setTextColor(200, 100, 100)
          pdf.text(`Error`, x + cellWidth / 2, y + cellHeight / 2, { align: 'center' })
        }
      }

      // Page number
      pdf.setFontSize(8)
      pdf.setTextColor(150, 150, 150)
      pdf.text(
        `Page ${pageIndex + 2} of ${Math.ceil(images.length / imagesPerPage) + 1}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      )
    }
  }

  // Save PDF
  pdf.save(`${title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.pdf`)
}
