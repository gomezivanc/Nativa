export const TruncatedHTML = ({ html, maxLength = 40 }) => {
    const truncateText = (text, length) => {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = text;
      const plainText = tempDiv.textContent || tempDiv.innerText || "";
      return plainText.length > length ? plainText.slice(0, length) + "..." : plainText;
    };
  
    return <div dangerouslySetInnerHTML={{ __html: truncateText(html, maxLength) }} />;
  };
  