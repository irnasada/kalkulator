import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  'https://gyuluzssmtzlrnypwnjv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5dWx1enNzbXR6bHJueXB3bmp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5ODE0NDEsImV4cCI6MjA2NTU1NzQ0MX0.hThik8_kb7c9hAPOpgPgDbBbnL50DKU_LuL9nki7mj8'
);

function Solve(val) {
  const res = document.getElementById("res");
  res.value += val;
}

function Clear() {
  document.getElementById("res").value = "";
}

function Back() {
  const res = document.getElementById("res");
  res.value = res.value.slice(0, -1);
}

async function Result() {
  const input = document.getElementById("res").value;
  try {
    const result = eval(input);
    document.getElementById("res").value = result;
    await simpanHistory(`${input} = ${result}`);
  } catch (error) {
    document.getElementById("res").value = "Error";
  }
}

async function simpanHistory(teks) {
  const { error } = await supabase.from("kalkulator").insert([{ history: teks }]);
  if (error) {
    console.error("Gagal menyimpan riwayat:", error.message);
  } else {
    muatHistory();
  }
}

async function hapusHistory(id) {
  const { error } = await supabase.from("kalkulator").delete().eq("id", id);
  if (error) {
    console.error("Gagal menghapus:", error.message);
  } else {
    muatHistory();
  }
}

async function hapusSemua() {
  const { error } = await supabase.from("kalkulator").delete().neq("id", 0); // hapus semua id
  if (error) {
    console.error("Gagal menghapus semua:", error.message);
  } else {
    muatHistory();
  }
}
async function muatHistory() {
    const { data, error } = await supabase.from("kalkulator").select("*").order("id", { ascending: false });
    const list = document.getElementById("historyList");
    list.innerHTML = "";
  
    if (error) {
      console.error("Gagal memuat:", error.message);
      return;
    }
  
    if (data.length === 0) {
      list.innerHTML = `<div class="text-gray-500 text-center py-4">Belum ada history.</div>`;
      return;
    }
  
    data.forEach((item) => {
  const div = document.createElement("div");
  div.className = "d-flex justify-content-between align-items-center py-2 border-bottom border-secondary";

  div.innerHTML = `
    <span class="text-light">${item.history}</span>
    <button class="btn btn-sm btn-outline-danger" onclick="hapusHistory(${item.id})">Hapus</button>
  `;

  list.appendChild(div);
});

  }

window.Solve = Solve;
window.Clear = Clear;
window.Back = Back;
window.Result = Result;
window.hapusHistory = hapusHistory;
window.hapusSemua = hapusSemua;

muatHistory();
