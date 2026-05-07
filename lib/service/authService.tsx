const API_URL = "https://devsaas.bankwonosobo.co.id/api";

export async function login(email: string, password: string) {
  return await fetch(`${API_URL}/_login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
}

export async function current(token: string) {
  return await fetch(`${API_URL}/_current`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
  });
}

export async function logout(token: string) {
  return await fetch(`${API_URL}/users/_logout`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
  });
}
