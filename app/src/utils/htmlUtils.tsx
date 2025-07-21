

const stripHtml = (html: string) => {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

const htmlUtils = {
    stripHtml, // Xoa html tag khoi tiptap
}

export default htmlUtils;

