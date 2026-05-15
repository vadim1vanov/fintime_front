const API = "http://localhost:8080";

export const getAccounts = () =>
  fetch(`${API}/api/accounts`, { credentials: "include" }).then(r => r.json());

export const deleteAccount = (id) =>
  fetch(`${API}/api/accounts/${id}`, {
    method: "DELETE",
    credentials: "include"
  });

export const closeAccount = (id) =>
  fetch(`${API}/api/accounts/${id}/close`, {
    method: "PATCH",
    credentials: "include"
  });

export const restoreAccount = (id) =>
  fetch(`${API}/api/accounts/${id}/restore`, {
    method: "PATCH",
    credentials: "include"
  });

export const income = (id, body) =>
  fetch(`${API}/api/transaction/${id}/income`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

export const expense = (id, body) =>
  fetch(`${API}/api/transaction/${id}/expense`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

export const transfer = (from, to, body) =>
  fetch(`${API}/api/transaction/${from}/${to}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

export const getTransactions = (id) =>
  fetch(`${API}/api/transaction/${id}`, { credentials: "include" })
    .then(r => r.json());

// ------------------------
// Новый метод для сохранения порядка
// ------------------------
export const reorderAccounts = (accounts) =>
  fetch(`${API}/api/accounts/reorder`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(accounts)
  });
export const getAccountById = (id) =>
fetch(`${API}/api/accounts/${id}`, { credentials: "include" }).then(r => r.json());


export const createAccount = async (data) => {
  const res = await fetch(`${API}/api/accounts`, {
    method: "POST",
    credentials: "include", 
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });


  if (!res.ok) {
    throw new Error("Ошибка создания счёта");
  }

  return res.json();
};


export const getIncomeCategories = () =>
  fetch(`${API}/api/transationcategory/income`, {
    credentials: "include"
  }).then(r => r.json());


  export const getCredits = () =>
  fetch(`${API}/api/credit`, { credentials: "include" })
    .then(r => r.json());

export const createCredit = (accountId, data) =>
  fetch(`${API}/api/credit/${accountId}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then(r => r.json());

export const getCreditById = (id) =>
  fetch(`${API}/api/credit/${id}`, { credentials: "include" })
    .then(r => r.json());

export const getCurrentUser = () =>
  fetch(`${API}/user`, {
    credentials: "include"
  }).then(r => r.json());

export const updateUser = (id, data) =>
  fetch(`${API}/user/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

export const payCreditDebt = (creditId, body) =>
  fetch(`${API}/api/credit/${creditId}/pay`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

export async function payOffCredit(creditId, transactionDto) {
  const API = "http://localhost:8080";
  return fetch(`${API}/api/credit/${creditId}/payoff`, {
    method: "PATCH", 
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(transactionDto),
  });
}

export const deleteCredit = (creditId) =>
  fetch(`${API}/api/credit/${creditId}`, {
    method: "DELETE",
    credentials: "include"
  });





  export const getDeposits = () =>
  fetch(`${API}/api/deposit`, {
    credentials: "include"
  }).then(r => r.json());

export const createDeposit = (data) =>
  fetch(`${API}/api/deposit`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }).then(r => r.json());

export const deleteDeposit = (depositId) =>
  fetch(`${API}/api/deposit/${depositId}`, {
    method: "DELETE",
    credentials: "include"
  });

  export const getAccountInfo = (id) =>
  fetch(`${API}/api/accounts/${id}/info`, {
    credentials: "include"
  }).then(r => r.json());