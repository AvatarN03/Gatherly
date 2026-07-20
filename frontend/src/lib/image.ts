export const resizeImage = (file: File, maxDim = 4000): Promise<File> => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      let { width, height } = img
      if (width > maxDim || height > maxDim) {
        const scale = maxDim / Math.max(width, height)
        width *= scale
        height *= scale
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => resolve(new File([blob!], file.name, { type: file.type })),
        file.type,
        0.9
      )
    }
    img.src = URL.createObjectURL(file)
  })
}