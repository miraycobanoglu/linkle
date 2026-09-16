// 1. Tüm Kullanıcıları Getir (LocalStorage veya JSON)
export async function getUsers() {
  const savedUsers = localStorage.getItem('my_users');
  if (savedUsers) {
    return JSON.parse(savedUsers);
  }

  try {
    const res = await fetch('./data/users.json');
    if (!res.ok) throw new Error('Kullanıcılar yüklenirken hata oluştu.');
    const data = await res.json();
    localStorage.setItem('my_users', JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('userService Hata:', error);
    return [];
  }
}

// 2. ID Eşleşmesine Göre Tek Kullanıcı Getir (userId veya id kontrolü)
export async function getUserById(userId) {
  const users = await getUsers();
  return users.find(u => String(u.userId || u.id) === String(userId));
}

// 3. EKSİK OLAN FONKSİYON: Kullanıcı Dizisini LocalStorage'a Kaydeder
export function saveUsersToStorage(users) {
  if (users) {
    localStorage.setItem('my_users', JSON.stringify(users));
  }
}