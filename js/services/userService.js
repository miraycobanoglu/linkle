// Tüm kullanıcıları getiren servis
export async function getUsers() {
  const savedUsers = localStorage.getItem('my_users');

  if (savedUsers) {
    return JSON.parse(savedUsers);
  }

  // Hafızada yoksa JSON dosyasından çek
  const response = await fetch('./data/users.json');
  const data = await response.json();
  
  // İlk defa çekildiği için hafızaya kaydet
  localStorage.setItem('my_users', JSON.stringify(data));
  return data;
}

// URL'den gelen ID'ye göre tek bir kullanıcıyı getiren servis
export async function getUserById(userId) {
  const users = await getUsers();
  return users.find(u => u.userId === userId);
}

// Güncellenmiş Listeyi Hafızaya Kaydet
export function saveUsersToStorage(users) {
  localStorage.setItem('my_users', JSON.stringify(users));
}