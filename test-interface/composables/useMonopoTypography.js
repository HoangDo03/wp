export const useMonopoTypography = (text) => {
  if (!text) return ""
  
  return text.split(' ').map(word => {
    let chars = word.split('')
    return chars.map((char, i) => {
      const low = char.toLowerCase()
      // Nếu là 'o' hoặc 'i' và ký tự trước không phải 'y'
      if ((low === 'o' || low === 'i') && chars[i-1]?.toLowerCase() !== 'y') {
        return `<i style="font-style: italic; font-family: inherit;">${char}</i>`
      }
      return char
    }).join('')
  }).join(' ')
}