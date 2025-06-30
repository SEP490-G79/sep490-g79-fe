export async function uploadToCloudinary(file) {
  const url = "https://api.cloudinary.com/v1_1/ds79he1wa/image/upload";
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "medical_unsigned"); // Đổi thành preset bạn vừa tạo

  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  return data.secure_url;
}
