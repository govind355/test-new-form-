const SHEET_URL = "https://script.google.com/macros/s/AKfycbyGSkfDfkhtluqeHaN-CpZ68z-RU_OhNzz_XD5UTTjlymX3YTkiYvfBoYmeIterQMIU/exec";

document.addEventListener("DOMContentLoaded", () => {
  fetchUsers();

  const form = document.getElementById("userForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const role = form.role.value;

    if (!name || !email || !role) return alert("Fill all fields");

    const user = { sheet: "Users", name, email, role };

    try {
      const res = await fetch(SHEET_URL, {
        method: "POST",
        body: JSON.stringify(user),
        headers: { "Content-Type": "application/json" }
      });

      if (!res.ok) throw new Error("Failed to add user");
      alert("User added!");
      form.reset();
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Error adding user");
    }
  });
});

async function fetchUsers() {
  try {
    const res = await fetch(`${SHEET_URL}?sheet=Users`);
    const data = await res.json();
    const table = document.getElementById("userTableBody");
    table.innerHTML = "";

    if (Array.isArray(data) && data.length > 0) {
      data.forEach((row) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td class="px-4 py-2">${row.name}</td>
          <td class="px-4 py-2">${row.email}</td>
          <td class="px-4 py-2">${row.role}</td>
        `;
        table.appendChild(tr);
      });
    } else {
      table.innerHTML = `<tr><td colspan="3" class="px-4 py-2 text-gray-500">No users found</td></tr>`;
    }
  } catch (err) {
    console.error("Error fetching users:", err);
  }
}
